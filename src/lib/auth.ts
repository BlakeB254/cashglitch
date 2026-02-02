import { nanoid } from "nanoid";
import { sql, initializeAuthTokens, initializeSessions } from "./db";
import { AUTH_CONFIG } from "./shared";
import type { AuthTokenRow, SessionRow } from "./shared";

// Generate a cryptographically secure token
export function generateToken(): string {
  return nanoid(32);
}

// Create a magic link token for email
export async function createMagicLinkToken(email: string): Promise<string> {
  await initializeAuthTokens();

  const token = generateToken();
  const expiresAt = new Date(Date.now() + AUTH_CONFIG.TOKEN_EXPIRY_MINUTES * 60 * 1000);

  await sql`
    INSERT INTO auth_tokens (email, token, expires_at)
    VALUES (${email.toLowerCase()}, ${token}, ${expiresAt.toISOString()})
  `;

  return token;
}

// Verify and consume a magic link token
export async function verifyMagicLinkToken(
  token: string
): Promise<{ valid: boolean; email?: string; error?: string }> {
  await initializeAuthTokens();

  const result = await sql`
    SELECT * FROM auth_tokens
    WHERE token = ${token}
    AND used_at IS NULL
    AND expires_at > NOW()
    LIMIT 1
  ` as AuthTokenRow[];

  if (result.length === 0) {
    return { valid: false, error: "Invalid or expired token" };
  }

  const authToken = result[0];

  // Mark token as used
  await sql`
    UPDATE auth_tokens
    SET used_at = NOW()
    WHERE id = ${authToken.id}
  `;

  return { valid: true, email: authToken.email };
}

// Create a new session for authenticated user
export async function createSession(email: string): Promise<string> {
  await initializeSessions();

  const sessionToken = generateToken();
  const isAdmin = email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();
  const expiresAt = new Date(Date.now() + AUTH_CONFIG.SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  await sql`
    INSERT INTO sessions (email, session_token, is_admin, expires_at)
    VALUES (${email.toLowerCase()}, ${sessionToken}, ${isAdmin}, ${expiresAt.toISOString()})
  `;

  return sessionToken;
}

// Validate a session token
export async function validateSession(
  sessionToken: string
): Promise<{ valid: boolean; email?: string; isAdmin?: boolean }> {
  await initializeSessions();

  const result = await sql`
    SELECT * FROM sessions
    WHERE session_token = ${sessionToken}
    AND expires_at > NOW()
    LIMIT 1
  ` as SessionRow[];

  if (result.length === 0) {
    return { valid: false };
  }

  const session = result[0];
  return {
    valid: true,
    email: session.email,
    isAdmin: session.is_admin,
  };
}

// Delete a session (logout)
export async function deleteSession(sessionToken: string): Promise<void> {
  await sql`
    DELETE FROM sessions
    WHERE session_token = ${sessionToken}
  `;
}

// Delete all sessions for a user
export async function deleteAllUserSessions(email: string): Promise<void> {
  await sql`
    DELETE FROM sessions
    WHERE email = ${email.toLowerCase()}
  `;
}

// Get magic link URL
export function getMagicLinkUrl(token: string): string {
  // Priority: APP_URL > NEXT_PUBLIC_APP_URL > VERCEL_URL > localhost
  let baseUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;

  if (!baseUrl && process.env.VERCEL_URL) {
    // Vercel provides VERCEL_URL automatically (without protocol)
    baseUrl = `https://${process.env.VERCEL_URL}`;
  }

  if (!baseUrl && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    // Vercel also provides the production URL
    baseUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  // Default to localhost for development
  if (!baseUrl) {
    baseUrl = "http://localhost:3000";
  }

  return `${baseUrl}/verify?token=${token}`;
}

// Check if email is the admin email
export function isAdminEmail(email: string): boolean {
  return email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();
}
