import { NextResponse } from "next/server";
import { getSession, hasAccess } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    const access = await hasAccess();

    return NextResponse.json({
      authenticated: !!session,
      hasAccess: access,
      email: session?.email ?? null,
      isAdmin: session?.isAdmin ?? false,
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { authenticated: false, hasAccess: false, email: null, isAdmin: false },
      { status: 500 }
    );
  }
}
