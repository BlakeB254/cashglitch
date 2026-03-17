import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { sql, initializeBlogPosts } from "@/lib/db";
import { transformPost } from "@/lib/shared";
import type { BlogPostRow } from "@/lib/shared";
import { cleanVideoUrl } from "@/lib/video";

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
    const { title, content, excerpt, published, imageUrl, videoUrl } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    await initializeBlogPosts();

    const slug = generateSlug(title);

    const cleanedVideoUrl = videoUrl ? cleanVideoUrl(videoUrl) : null;

    const result = await sql`
      INSERT INTO blog_posts (slug, title, content, excerpt, published, author_email, image_url, video_url)
      VALUES (${slug}, ${title}, ${content}, ${excerpt || null}, ${published ?? false}, ${session.email}, ${imageUrl || null}, ${cleanedVideoUrl || null})
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
    const { id, title, content, published } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Regenerate slug if title changed
    const slug = title ? generateSlug(title) : undefined;

    // For nullable fields, distinguish "not sent" (keep old) from "sent as null" (clear)
    const hasExcerpt = "excerpt" in body;
    const hasImageUrl = "imageUrl" in body;
    const hasVideoUrl = "videoUrl" in body;
    const cleanedVideoUrl = hasVideoUrl && body.videoUrl ? cleanVideoUrl(body.videoUrl) : body.videoUrl ?? null;

    const result = await sql`
      UPDATE blog_posts SET
        slug = COALESCE(${slug}, slug),
        title = COALESCE(${title}, title),
        content = COALESCE(${content}, content),
        excerpt = CASE WHEN ${hasExcerpt} THEN ${body.excerpt ?? null} ELSE excerpt END,
        published = COALESCE(${published}, published),
        image_url = CASE WHEN ${hasImageUrl} THEN ${body.imageUrl ?? null} ELSE image_url END,
        video_url = CASE WHEN ${hasVideoUrl} THEN ${cleanedVideoUrl || null} ELSE video_url END,
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
