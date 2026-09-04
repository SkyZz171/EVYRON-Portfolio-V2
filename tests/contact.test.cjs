// @ts-check
const { test, before } = require('node:test');
const assert = require('node:assert/strict');

process.env.RECAPTCHA_SECRET_KEY = 'test-secret';
let handler;
let sanitize;

function response() {
  const state = { status: 200, headers: {}, body: undefined, ended: false };
  return {
    state,
    setHeader(name, value) { state.headers[name] = value; },
    status(code) { state.status = code; return this; },
    json(body) { state.body = body; return this; },
    end() { state.ended = true; return this; },
  };
}

function request(overrides = {}) {
  return {
    method: 'POST',
    headers: { origin: 'https://www.evyron.fr', 'x-forwarded-for': '198.51.100.10' },
    socket: { remoteAddress: '127.0.0.1' },
    body: {
      prenom: 'Jean',
      nom: 'Dupont',
      email: 'jean@example.com',
      projet: 'Création de site',
    },
    ...overrides,
  };
}

before(async () => {
  ({ default: handler, sanitize } = await import('../api/contact.js'));
  assert.equal(typeof handler, 'function');
  assert.equal(typeof sanitize, 'function');
});

test('removes control characters before values enter messages', () => {
  assert.equal(sanitize('Jean\r\nDupont\u0000'), 'JeanDupont');
  assert.equal(sanitize(null), '');
});

test('rejects unsupported methods without caching the response', async () => {
  const res = response();
  await handler({ method: 'GET', headers: {} }, res);

  assert.equal(res.state.status, 405);
  assert.deepEqual(res.state.body, { ok: false, error: 'Method not allowed' });
  assert.equal(res.state.headers['Cache-Control'], 'no-store');
});

test('returns a validation error for incomplete input', async () => {
  const res = response();
  await handler(request({ headers: { 'x-forwarded-for': '198.51.100.11' }, body: {} }), res);

  assert.equal(res.state.status, 422);
  assert.match(res.state.body.error, /champs prénom/i);
});

test('silently accepts honeypot submissions without sending mail', async () => {
  const res = response();
  await handler(request({ headers: { 'x-forwarded-for': '198.51.100.12' }, body: { ...request().body, website: 'filled-by-bot' } }), res);

  assert.equal(res.state.status, 200);
  assert.deepEqual(res.state.body, { ok: true });
});

test('fails closed when reCAPTCHA is configured but no token is provided', async () => {
  const res = response();
  await handler(request({ headers: { 'x-forwarded-for': '198.51.100.13' } }), res);

  assert.equal(res.state.status, 403);
  assert.deepEqual(res.state.body, { ok: false, error: 'Validation anti-spam échouée.' });
});

test('limits repeated submissions from one client key', async () => {
  const headers = { 'x-forwarded-for': '198.51.100.14' };
  const results = [];
  for (let i = 0; i < 6; i += 1) {
    const res = response();
    await handler(request({ headers, body: { ...request().body, website: 'bot' } }), res);
    results.push(res.state.status);
  }

  assert.deepEqual(results, [200, 200, 200, 200, 200, 429]);
});
