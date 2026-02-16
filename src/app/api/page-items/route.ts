import { NextRequest, NextResponse } from "next/server";
import { sql, initializePageItems, seedDefaultPageItems } from "@/lib/db";
import type { PageItemRow, PageItem } from "@/lib/shared";

function parseTags(tags: unknown): string[] | null {
  if (!tags) return null;
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed : [tags];
    } catch {
      return tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
  }
  return null;
}

function transformPageItem(row: PageItemRow): PageItem {
  return {
    id: row.id,
    pageSlug: row.page_slug,
    title: row.title,
    description: row.description,
    category: row.category,
    location: row.location,
    deadline: row.deadline,
    value: row.value,
    website: row.website,
    imageUrl: row.image_url,
    tags: parseTags(row.tags as unknown),
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export async function GET(request: NextRequest) {
  try {
    await initializePageItems();
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
