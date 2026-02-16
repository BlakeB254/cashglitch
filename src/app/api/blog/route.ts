import { NextResponse } from "next/server";
import { sql, initializeBlogPosts } from "@/lib/db";
import type { BlogPostRow, BlogPost } from "@/lib/shared";

function transformPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    published: row.published,
    authorEmail: row.author_email,
    imageUrl: row.image_url,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

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
