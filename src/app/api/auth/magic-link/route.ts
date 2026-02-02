import { NextRequest, NextResponse } from "next/server";
import { createMagicLinkToken } from "@/lib/auth";
import { sendMagicLinkEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Create magic link token
    const token = await createMagicLinkToken(email);

    // Send email
    const result = await sendMagicLinkEmail(email, token);

    if (!result.success) {
      console.error("Failed to send magic link:", result.error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500 }
      );
    }

    // In dev mode (no Resend API key), return the URL directly for testing
    if (result.devModeUrl) {
      return NextResponse.json({
        success: true,
        message: "Magic link generated (dev mode - check console)",
        devModeUrl: result.devModeUrl
      });
    }

    return NextResponse.json({ success: true, message: "Magic link sent" });
  } catch (error) {
    console.error("Magic link error:", error);
    return NextResponse.json({ error: "Failed to send magic link" }, { status: 500 });
  }
}
