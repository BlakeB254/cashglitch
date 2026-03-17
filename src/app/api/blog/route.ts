import { NextResponse } from "next/server";
import { sql, initializeBlogPosts } from "@/lib/db";
import { transformPost } from "@/lib/shared";
import type { BlogPostRow } from "@/lib/shared";

export async function GET() {
  try {
    await initializeBlogPosts();

    // Only return published posts
    const rows = await sql`
      SELECT * FROM blog_posts
      WHERE published = true
      ORDER BY created_at DESC
    ` as BlogPostRow[];

    return NextResponse.json(rows.map(transformPost));
  } catch (error) {
    console.error("Blog posts fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
