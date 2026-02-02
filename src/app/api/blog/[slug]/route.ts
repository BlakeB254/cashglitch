import { NextRequest, NextResponse } from "next/server";
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
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

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
