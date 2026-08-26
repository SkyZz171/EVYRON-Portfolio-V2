import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const ALLOWED_ORIGINS = ['https://evyron.fr', 'https://www.evyron.fr'];
const TO = process.env.CONTACT_EMAIL || 'contact@evyron.fr';

export default async function handler(req, res) {
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
  const { nom, email, entreprise, budget, projet, website } = req.body || {};

  if (!nom || !email || !projet) {
    return res.status(422).json({
      ok: false,
      error: 'Les champs nom, email et description du projet sont requis.',
    });
  }

  // --- Validate email ---
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(422).json({ ok: false, error: 'Adresse email invalide.' });
  }

  // --- Anti-spam: honeypot ---
  if (website) {
    return res.status(200).json({ ok: true });
  }

  // --- Build email content ---
  const lines = [
    'Nouveau message depuis evyron.fr',
    '─'.repeat(40),
    '',
    `Nom complet  : ${nom}`,
    `Email        : ${email}`,
    entreprise ? `Entreprise   : ${entreprise}` : null,
    budget ? `Budget       : ${budget}` : null,
    '',
    '─'.repeat(40),
    '',
    projet,
    '',
    '─'.repeat(40),
    `Envoyé le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
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
    console.error('Resend error:', err);
    return res.status(500).json({
      ok: false,
      error: "Erreur lors de l'envoi. Réessayez plus tard.",
    });
  }
}
