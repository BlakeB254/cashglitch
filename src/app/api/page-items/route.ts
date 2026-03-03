import { NextRequest, NextResponse } from "next/server";
import { sql, seedDefaultPageItems } from "@/lib/db";
import type { PageItemRow } from "@/lib/shared";
import { transformPageItem } from "@/lib/pageItems";

export async function GET(request: NextRequest) {
  try {
    await seedDefaultPageItems();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "slug parameter is required" },
        { status: 400 }
      );
    }

    const rows = (await sql`
      SELECT * FROM page_items
      WHERE page_slug = ${slug} AND is_active = true
      ORDER BY is_featured DESC, sort_order ASC
    `) as PageItemRow[];

    return NextResponse.json(rows.map(transformPageItem));
  } catch (error) {
    console.error("Failed to fetch page items:", error);
    return NextResponse.json(
      { error: "Failed to fetch page items" },
      { status: 500 }
    );
  }
}
