# Security Review — evyron.fr

**Date**: 4 septembre 2026  
**Scope**: Static frontend, Vercel configuration, and `api/contact.js`  
**Method**: High-confidence OWASP-oriented review with data-flow verification.

## Summary

- No high-confidence XSS, injection, SSRF, authentication bypass, or hardcoded-secret vulnerability identified.
- The public contact endpoint now has input bounds, control-character sanitization, strict CORS allowlisting, honeypot handling, fail-closed reCAPTCHA verification, a 5 requests/minute client-key throttle, and non-cacheable responses.
- Third-party analytics and reCAPTCHA scripts are deferred until consent or form submission, reducing the initial critical request path.

## Controls verified

| Area | Control |
|---|---|
| Input handling | Required fields, email format, field length limits, control-character sanitization |
| Abuse prevention | Honeypot, 5 requests/minute in-process throttle, `Retry-After` on 429 |
| Anti-spam | reCAPTCHA v3, 5-second timeout, `success`, `action=contact`, and score checks; fail closed |
| Browser policy | Strict origin allowlist, `Vary: Origin`, security headers, `Cache-Control: no-store` for API responses |
| Data flow | Email body and subject receive sanitized values; no HTML email interpolation |
| Frontend privacy/performance | Analytics loads after consent; reCAPTCHA loads on form submission |
| Contract coverage | Six focused Node API tests cover method, validation, sanitization, honeypot, reCAPTCHA fail-closed behavior, and throttling |
| Dependencies | `npm audit --omit=dev` reports zero vulnerabilities in production dependencies |

## Remaining tradeoffs

- The throttle is process-local. On a multi-instance/serverless deployment, use an external store or provider-level rate limit for a global quota.
- The client key prefers platform-provided forwarding headers. Deployment infrastructure must overwrite these headers rather than allowing arbitrary client values through.
- `script-src` still contains `'unsafe-inline'` because the static site currently embeds its scripts inline. Moving scripts to external, versioned files would allow a stricter CSP, but is a larger refactor.

## Verification commands

```text
node --check api/contact.js
node --check tests/contact.test.cjs
npm run test:api
npm audit --omit=dev
npm test
```
