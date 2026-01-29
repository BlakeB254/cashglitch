import { NextRequest, NextResponse } from "next/server";
import { sql, initializeDatabase } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, response } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Get client info
    const ip = request.headers.get("x-forwarded-for") ||
               request.headers.get("x-real-ip") ||
               "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Ensure table exists
    await initializeDatabase();

    // Insert email (upsert to handle duplicates gracefully)
    await sql`
      INSERT INTO emails (email, response, ip_address, user_agent)
      VALUES (${email.toLowerCase()}, ${response || null}, ${ip}, ${userAgent})
      ON CONFLICT (email)
      DO UPDATE SET
        response = COALESCE(EXCLUDED.response, emails.response),
        ip_address = EXCLUDED.ip_address,
        user_agent = EXCLUDED.user_agent
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
