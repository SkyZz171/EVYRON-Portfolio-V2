import { Resend } from 'resend';

const ALLOWED_ORIGINS = ['https://evyron.fr', 'https://www.evyron.fr'];
const TO = process.env.CONTACT_EMAIL || 'contact@evyron.fr';
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 5;
const MAX_TRACKED_CLIENTS = 10_000;
const requestHistory = new Map();

const MAX_LENGTHS = {
  prenom: 50,
  nom: 50,
  email: 254,
  telephone: 20,
  entreprise: 150,
  site_actuel: 200,
  type_projet: 50,
  budget: 50,
  objectif: 200,
  delai: 50,
  projet: 5000,
};

/** Strip line breaks and control characters before values reach email content or logs. */
export function sanitize(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\r\n\x00-\x1f\x7f]/g, '').trim();
}

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cache-Control', 'no-store');
}

function json(res, status, payload) {
  return res.status(status).json(payload);
}

function getClientKey(req) {
  const forwarded = req.headers?.['x-forwarded-for'];
  const address = forwarded || req.headers?.['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
  return String(address).split(',')[0].trim() || 'unknown';
}

function pruneRequestHistory(now) {
  for (const [key, timestamps] of requestHistory) {
    if (!timestamps.some(timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS)) {
      requestHistory.delete(key);
    }
  }

  if (requestHistory.size >= MAX_TRACKED_CLIENTS) {
    const oldestKey = [...requestHistory.entries()]
      .sort(([, first], [, second]) => first[first.length - 1] - second[second.length - 1])[0]?.[0];
    if (oldestKey) requestHistory.delete(oldestKey);
  }
}

function isRateLimited(key, now = Date.now()) {
  pruneRequestHistory(now);
  const recent = (requestHistory.get(key) || []).filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  requestHistory.set(key, recent);
  return recent.length > RATE_LIMIT_MAX;
}

function getBody(req) {
  return req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
}

function getFields(raw) {
  return Object.fromEntries(Object.keys(MAX_LENGTHS).map(field => [field, sanitize(raw[field])]));
}

function validateFields(raw, fields) {
  if (!fields.prenom || !fields.nom || !fields.email || !fields.projet) {
    return 'Les champs prénom, nom, email et description du projet sont requis.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return 'Adresse email invalide.';
  }

  for (const [field, max] of Object.entries(MAX_LENGTHS)) {
    if (typeof raw[field] === 'string' && raw[field].length > max) {
      return `Le champ ${field} ne peut pas dépasser ${max} caractères.`;
    }
  }

  return null;
}

async function verifyRecaptcha(token) {
  if (!RECAPTCHA_SECRET || !token) return !RECAPTCHA_SECRET;

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(RECAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`,
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return false;

    const result = await response.json();
    const passed = result.success && result.action === 'contact' && result.score >= 0.5;
    if (!passed) {
      console.warn('reCAPTCHA rejected:', { score: result.score, action: result.action, hostname: result.hostname });
    }
    return passed;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error.message);
    return false;
  }
}

function buildMessage(fields, req) {
  return [
    'Nouveau message depuis evyron.fr',
    '─'.repeat(40),
    '',
    `Prénom       : ${fields.prenom}`,
    `Nom          : ${fields.nom}`,
    `Email        : ${fields.email}`,
    fields.telephone ? `Téléphone    : ${fields.telephone}` : null,
    fields.entreprise ? `Entreprise   : ${fields.entreprise}` : null,
    fields.site_actuel ? `Site actuel  : ${fields.site_actuel}` : null,
    fields.type_projet ? `Type projet  : ${fields.type_projet}` : null,
    fields.budget ? `Budget       : ${fields.budget}` : null,
    fields.objectif ? `Objectif(s)  : ${fields.objectif}` : null,
    fields.delai ? `Délai        : ${fields.delai}` : null,
    '',
    '─'.repeat(40),
    '',
    fields.projet,
    '',
    '─'.repeat(40),
    `Envoyé le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
    `IP: ${getClientKey(req)}`,
  ].filter(Boolean).join('\n');
}

function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

export default async function handler(req, res) {
  setSecurityHeaders(res);

  const origin = req.headers?.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Method not allowed' });

  const clientKey = getClientKey(req);
  if (isRateLimited(clientKey)) {
    res.setHeader('Retry-After', '60');
    return json(res, 429, { ok: false, error: 'Trop de demandes. Veuillez réessayer dans une minute.' });
  }

  const raw = getBody(req);
  const fields = getFields(raw);
  const validationError = validateFields(raw, fields);
  if (validationError) return json(res, 422, { ok: false, error: validationError });

  if (sanitize(raw.website)) return json(res, 200, { ok: true });

  const recaptchaPassed = await verifyRecaptcha(sanitize(raw.recaptchaToken));
  if (RECAPTCHA_SECRET && !recaptchaPassed) {
    return json(res, 403, { ok: false, error: 'Validation anti-spam échouée.' });
  }

  try {
    await getResendClient().emails.send({
      from: 'Evyron Contact <contact@evyron.fr>',
      to: TO,
      replyTo: fields.email,
      subject: `Nouveau message — ${fields.prenom} ${fields.nom}${fields.entreprise ? ` (${fields.entreprise})` : ''}`,
      text: buildMessage(fields, req),
    });

    return json(res, 200, { ok: true });
  } catch (error) {
    console.error('Resend error:', error.message);
    return json(res, 500, { ok: false, error: "Erreur lors de l'envoi. Réessayez plus tard." });
  }
}
