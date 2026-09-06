/**
 * Lightweight admin authentication.
 *
 * Credentials must be supplied via the ADMIN_USERNAME / ADMIN_PASSWORD
 * environment variables. There are intentionally no hardcoded fallback
 * values so that credentials cannot leak into the source or build output.
 * If either variable is missing, authentication is disabled.
 */
import crypto from "crypto";

export interface AdminCredentials {
  username: string;
  password: string;
}

export function getAdminCredentials(): AdminCredentials | null {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return null;
  return { username, password };
}

export function createSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// An in-memory set of valid session tokens (cleared on server restart).
const sessions = new Set<string>();

export function registerSession(token: string): void {
  sessions.add(token);
}

export function isValidToken(token: string | undefined): boolean {
  return !!token && sessions.has(token);
}

export function revokeSession(token: string): void {
  sessions.delete(token);
}

export function verifyCredentials(username: string, password: string): boolean {
  const creds = getAdminCredentials();
  if (!creds) return false;
  const a = Buffer.from(username);
  const b = Buffer.from(creds.username);
  const c = Buffer.from(password);
  const d = Buffer.from(creds.password);
  return (
    a.length === b.length && c.length === d.length &&
    crypto.timingSafeEqual(a, b) && crypto.timingSafeEqual(c, d)
  );
}

export const AUTH_COOKIE = "komisi_xiii_admin_token";
