import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { sql, initializeCategories, seedDefaultCategories } from "@/lib/db";
import type { CategoryRow, Category } from "@/lib/shared";

function transformCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    href: row.href,
    icon: row.icon,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    clickCount: row.click_count,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initializeCategories();
    await seedDefaultCategories();

    const rows = await sql`
      SELECT * FROM categories ORDER BY sort_order ASC
    ` as CategoryRow[];

    return NextResponse.json(rows.map(transformCategory));
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, href, icon, sortOrder, isActive } = body;

    if (!title || !href) {
      return NextResponse.json({ error: "Title and href are required" }, { status: 400 });
    }

    await initializeCategories();

    const result = await sql`
      INSERT INTO categories (title, description, href, icon, sort_order, is_active)
      VALUES (${title}, ${description || null}, ${href}, ${icon || "Gift"}, ${sortOrder ?? 0}, ${isActive ?? true})
      RETURNING *
    ` as CategoryRow[];

    return NextResponse.json(transformCategory(result[0]));
  } catch (error) {
    console.error("Category create error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, description, href, icon, sortOrder, isActive, clickCount } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const result = await sql`
      UPDATE categories SET
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        href = COALESCE(${href}, href),
        icon = COALESCE(${icon}, icon),
        sort_order = COALESCE(${sortOrder}, sort_order),
        is_active = COALESCE(${isActive}, is_active),
        click_count = COALESCE(${clickCount}, click_count),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    ` as CategoryRow[];

    if (result.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(transformCategory(result[0]));
  } catch (error) {
    console.error("Category update error:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await sql`DELETE FROM categories WHERE id = ${parseInt(id, 10)}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Category delete error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
