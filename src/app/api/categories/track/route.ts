import { NextRequest, NextResponse } from "next/server";
import { sql, initializeCategories } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id || typeof id !== "number") {
      return NextResponse.json({ error: "Valid category ID required" }, { status: 400 });
    }

    await initializeCategories();

    await sql`
      UPDATE categories
      SET click_count = click_count + 1
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Category track error:", error);
    return NextResponse.json({ error: "Failed to track click" }, { status: 500 });
  }
}
