import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
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

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initializeBlogPosts();

    const rows = await sql`
      SELECT * FROM blog_posts ORDER BY created_at DESC
    ` as BlogPostRow[];

    return NextResponse.json(rows.map(transformPost));
  } catch (error) {
    console.error("Blog posts fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, published } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    await initializeBlogPosts();

    const slug = generateSlug(title);

    const result = await sql`
      INSERT INTO blog_posts (slug, title, content, excerpt, published, author_email)
      VALUES (${slug}, ${title}, ${content}, ${excerpt || null}, ${published ?? false}, ${session.email})
      RETURNING *
    ` as BlogPostRow[];

    return NextResponse.json(transformPost(result[0]));
  } catch (error) {
    console.error("Blog post create error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, content, excerpt, published } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Regenerate slug if title changed
    const slug = title ? generateSlug(title) : undefined;

    const result = await sql`
      UPDATE blog_posts SET
        slug = COALESCE(${slug}, slug),
        title = COALESCE(${title}, title),
        content = COALESCE(${content}, content),
        excerpt = COALESCE(${excerpt}, excerpt),
        published = COALESCE(${published}, published),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    ` as BlogPostRow[];

    if (result.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(transformPost(result[0]));
  } catch (error) {
    console.error("Blog post update error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
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

    await sql`DELETE FROM blog_posts WHERE id = ${parseInt(id, 10)}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Blog post delete error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
