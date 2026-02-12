import { NextRequest, NextResponse } from "next/server";
import { sql, initializePageItems } from "@/lib/db";
import { getSession } from "@/lib/session";
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

// Transform database row to PageItem object
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
    tags: parseTags(row.tags as unknown),
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// GET: Fetch page items, optionally filtered by page slug
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initializePageItems();

    const { searchParams } = new URL(request.url);
    const pageSlug = searchParams.get("pageSlug");

    let rows: PageItemRow[];
    if (pageSlug) {
      rows = await sql`
        SELECT * FROM page_items
        WHERE page_slug = ${pageSlug}
        ORDER BY is_featured DESC, sort_order ASC
      ` as PageItemRow[];
    } else {
      rows = await sql`
        SELECT * FROM page_items
        ORDER BY page_slug ASC, is_featured DESC, sort_order ASC
      ` as PageItemRow[];
    }

    return NextResponse.json(rows.map(transformPageItem));
  } catch (error) {
    console.error("Failed to fetch page items:", error);
    return NextResponse.json(
      { error: "Failed to fetch page items" },
      { status: 500 }
    );
  }
}

// POST: Create a new page item
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initializePageItems();

    const body = await request.json();
    const {
      pageSlug,
      title,
      description,
      category,
      location,
      deadline,
      value,
      website,
      tags,
      isFeatured,
      sortOrder,
      isActive,
    } = body;

    if (!pageSlug || !title) {
      return NextResponse.json(
        { error: "pageSlug and title are required" },
        { status: 400 }
      );
    }

    const tagsJson = tags ? JSON.stringify(tags) : null;

    const rows = await sql`
      INSERT INTO page_items (
        page_slug, title, description, category, location,
        deadline, value, website, tags, is_featured, sort_order, is_active
      ) VALUES (
        ${pageSlug}, ${title}, ${description || null}, ${category || null}, ${location || null},
        ${deadline || null}, ${value || null}, ${website || null}, ${tagsJson},
        ${isFeatured ?? false}, ${sortOrder ?? 0}, ${isActive ?? true}
      )
      RETURNING *
    ` as PageItemRow[];

    return NextResponse.json(transformPageItem(rows[0]));
  } catch (error) {
    console.error("Failed to create page item:", error);
    return NextResponse.json(
      { error: "Failed to create page item" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing page item
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const tagsJson = updates.tags !== undefined ? JSON.stringify(updates.tags) : undefined;

    await sql`
      UPDATE page_items SET
        title = COALESCE(${updates.title}, title),
        description = COALESCE(${updates.description}, description),
        category = COALESCE(${updates.category}, category),
        location = COALESCE(${updates.location}, location),
        deadline = COALESCE(${updates.deadline}, deadline),
        value = COALESCE(${updates.value}, value),
        website = COALESCE(${updates.website}, website),
        tags = COALESCE(${tagsJson}::jsonb, tags),
        is_featured = COALESCE(${updates.isFeatured}, is_featured),
        sort_order = COALESCE(${updates.sortOrder}, sort_order),
        is_active = COALESCE(${updates.isActive}, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;

    const rows = await sql`
      SELECT * FROM page_items WHERE id = ${id}
    ` as PageItemRow[];

    if (rows.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(transformPageItem(rows[0]));
  } catch (error) {
    console.error("Failed to update page item:", error);
    return NextResponse.json(
      { error: "Failed to update page item" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a page item
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await sql`DELETE FROM page_items WHERE id = ${parseInt(id, 10)}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete page item:", error);
    return NextResponse.json(
      { error: "Failed to delete page item" },
      { status: 500 }
    );
  }
}
