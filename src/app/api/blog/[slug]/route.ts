import { NextRequest, NextResponse } from "next/server";
import { sql, initializeBlogPosts } from "@/lib/db";
import { transformPost } from "@/lib/shared";
import type { BlogPostRow } from "@/lib/shared";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    await initializeBlogPosts();

    const rows = await sql`
      SELECT * FROM blog_posts
      WHERE slug = ${slug} AND published = true
      LIMIT 1
    ` as BlogPostRow[];

    if (rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(transformPost(rows[0]));
  } catch (error) {
    console.error("Blog post fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
