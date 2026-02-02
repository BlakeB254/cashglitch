import { cookies } from "next/headers";
import { AUTH_CONFIG } from "./shared";
import { validateSession, createSession, deleteSession } from "./auth";

// Session data returned to components
export interface SessionData {
  email: string;
  isAdmin: boolean;
}

// Get the current session from cookies (server-side)
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(AUTH_CONFIG.SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  const result = await validateSession(sessionToken);

  if (!result.valid || !result.email) {
    return null;
  }

  return {
    email: result.email,
    isAdmin: result.isAdmin ?? false,
  };
}

// Set session cookie after login
export async function setSessionCookie(email: string): Promise<string> {
  const sessionToken = await createSession(email);
  const cookieStore = await cookies();

  cookieStore.set(AUTH_CONFIG.SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: AUTH_CONFIG.SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    path: "/",
  });

  return sessionToken;
}

// Clear session cookie (logout)
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(AUTH_CONFIG.SESSION_COOKIE_NAME)?.value;

  if (sessionToken) {
    await deleteSession(sessionToken);
  }

  cookieStore.delete(AUTH_CONFIG.SESSION_COOKIE_NAME);
}

// Check if user has site access (separate from admin auth)
export async function hasAccess(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_CONFIG.ACCESS_COOKIE_NAME)?.value === "granted";
}

// Grant site access (set after magic link verification)
export async function grantAccess(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_CONFIG.ACCESS_COOKIE_NAME, "granted", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 365 * 24 * 60 * 60, // 1 year
    path: "/",
  });
}

// Check access status from API route (returns session token from cookie)
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_CONFIG.SESSION_COOKIE_NAME)?.value ?? null;
}
