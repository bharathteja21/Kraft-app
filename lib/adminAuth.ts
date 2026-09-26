// Uses the Web Crypto API (globalThis.crypto.subtle) instead of Node's
// `crypto` module because this file is imported by middleware.ts, which
// runs on the Vercel Edge Runtime — Node's `crypto` isn't available there.

const COOKIE_NAME = "kraft_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

function getSecret() {
  // Falls back to a fixed demo secret ONLY when unset, so local dev doesn't
  // crash. Always set ADMIN_SESSION_SECRET yourself before deploying.
  return process.env.ADMIN_SESSION_SECRET || "dev-only-insecure-secret-change-me";
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Buffer.from(sigBuffer).toString("hex");
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return false;
  return timingSafeEqualStr(email, adminEmail) && timingSafeEqualStr(password, adminPassword);
}

export async function createSessionToken(email: string): Promise<string> {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${email}.${expires}`;
  const sig = await hmac(payload);
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split(".");
    if (parts.length < 3) return false;
    // Email may itself contain dots, so parse from the right: the last part
    // is always the signature, the second-to-last is always the expiry
    // timestamp, and the email is everything before that rejoined with ".".
    const sig = parts[parts.length - 1];
    const expiresStr = parts[parts.length - 2];
    const email = parts.slice(0, parts.length - 2).join(".");
    const expires = Number(expiresStr);
    if (!email || !expires || !sig) return false;
    if (Date.now() > expires) return false;
    const expectedSig = await hmac(`${email}.${expiresStr}`);
    return timingSafeEqualStr(sig, expectedSig);
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
