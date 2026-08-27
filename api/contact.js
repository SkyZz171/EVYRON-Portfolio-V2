import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const ALLOWED_ORIGINS = ['https://evyron.fr', 'https://www.evyron.fr'];
const TO = process.env.CONTACT_EMAIL || 'contact@evyron.fr';
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

// --- Input limits (DoS prevention) ---
const MAX_LENGTHS = { nom: 100, email: 254, entreprise: 150, budget: 20, projet: 5000 };

/** Sanitize user input: strip line breaks & control chars to prevent email header injection */
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\r\n\x00-\x1f\x7f]/g, '').trim();
}

/** Set security headers on every response */
function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

export default async function handler(req, res) {
  setSecurityHeaders(res);

  // --- CORS ---
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // --- Parse body ---
  const raw = req.body || {};

  // --- Sanitize all string inputs ---
  const nom      = sanitize(raw.nom);
  const email    = sanitize(raw.email);
  const entreprise = sanitize(raw.entreprise);
  const budget   = sanitize(raw.budget);
  const projet   = sanitize(raw.projet);
  const website  = sanitize(raw.website);
  const recaptchaToken = sanitize(raw.recaptchaToken);

  // --- Validate required fields ---
  if (!nom || !email || !projet) {
    return res.status(422).json({
      ok: false,
      error: 'Les champs nom, email et description du projet sont requis.',
    });
  }

  // --- Validate email format ---
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(422).json({ ok: false, error: 'Adresse email invalide.' });
  }

  // --- Enforce input length limits ---
  for (const [field, max] of Object.entries(MAX_LENGTHS)) {
    if (raw[field] && raw[field].length > max) {
      return res.status(422).json({
        ok: false,
        error: `Le champ ${field} ne peut pas dépasser ${max} caractères.`,
      });
    }
  }

  // --- Anti-spam: honeypot ---
  if (website) {
    return res.status(200).json({ ok: true });
  }

  // --- Verify reCAPTCHA ---
  let recaptchaPassed = false;
  if (RECAPTCHA_SECRET && recaptchaToken) {
    try {
      const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(RECAPTCHA_SECRET)}&response=${encodeURIComponent(recaptchaToken)}`
      });
      const verifyData = await verifyRes.json();
      if (verifyData.success && verifyData.score >= 0.5) {
        recaptchaPassed = true;
      } else {
        console.warn('reCAPTCHA rejected:', { score: verifyData.score, hostname: verifyData.hostname });
      }
    } catch (err) {
      console.error('reCAPTCHA verification failed:', err.message);
    }
  }

  // Fail closed: if reCAPTCHA is configured but didn't pass, reject
  if (RECAPTCHA_SECRET && !recaptchaPassed) {
    return res.status(403).json({ ok: false, error: 'Validation anti-spam échouée.' });
  }

  // --- Build email content (sanitized inputs) ---
  const lines = [
    'Nouveau message depuis evyron.fr',
    '─'.repeat(40),
    '',
    `Nom complet  : ${nom}`,
    `Email        : ${email}`,
    entreprise ? `Entreprise   : ${entreprise}` : null,
    budget ? `Budget       : ${budget} €` : null,
    '',
    '─'.repeat(40),
    '',
    projet,
    '',
    '─'.repeat(40),
    `Envoyé le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
    `IP: ${req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'}`,
  ].filter(Boolean).join('\n');

  // --- Send email via Resend ---
  try {
    await resend.emails.send({
      from: 'Evyron Contact <contact@evyron.fr>',
      to: TO,
      replyTo: email,
      subject: 'Nouveau message depuis evyron.fr',
      text: lines,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err.message);
    return res.status(500).json({
      ok: false,
      error: "Erreur lors de l'envoi. Réessayez plus tard.",
    });
  }
}
