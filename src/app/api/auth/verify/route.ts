import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLinkToken, isAdminEmail } from "@/lib/auth";
import { setSessionCookie, grantAccess } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Verify the magic link token
    const result = await verifyMagicLinkToken(token);

    if (!result.valid || !result.email) {
      return NextResponse.json(
        { error: result.error || "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Check if user is admin
    const isAdmin = isAdminEmail(result.email);

    // Create session and set cookie
    await setSessionCookie(result.email);

    // Grant site access
    await grantAccess();

    return NextResponse.json({
      success: true,
      email: result.email,
      isAdmin,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ error: "Failed to verify token" }, { status: 500 });
  }
}
