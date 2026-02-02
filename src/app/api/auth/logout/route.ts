import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearSessionCookie } from "@/lib/session";
import { AUTH_CONFIG } from "@/lib/shared";

export async function POST() {
  try {
    // Clear session cookie
    await clearSessionCookie();

    // Also clear access cookie to retrigger the gate
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_CONFIG.ACCESS_COOKIE_NAME);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
