import { NextResponse } from "next/server";
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
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export async function GET() {
  try {
    await initializeCategories();
    await seedDefaultCategories();

    // Only return active categories
    const rows = await sql`
      SELECT * FROM categories
      WHERE is_active = true
      ORDER BY sort_order ASC
    ` as CategoryRow[];

    return NextResponse.json(rows.map(transformCategory));
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
