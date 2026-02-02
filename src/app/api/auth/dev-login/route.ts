import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie, grantAccess } from "@/lib/session";

// DEV ONLY: Direct login without email verification
// This route is completely disabled in production
export async function POST(request: NextRequest) {
  // Block in production - this is critical for security
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Dev login is disabled in production" },
      { status: 403 }
    );
  }

  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Create session and set cookie directly (no email verification)
    await setSessionCookie(email);
    await grantAccess();

    const isAdmin = email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();

    console.log(`\n[DEV LOGIN] Logged in as: ${email} (admin: ${isAdmin})\n`);

    return NextResponse.json({
      success: true,
      email,
      isAdmin,
      message: "Dev login successful",
    });
  } catch (error) {
    console.error("Dev login error:", error);
    return NextResponse.json({ error: "Dev login failed" }, { status: 500 });
  }
}
