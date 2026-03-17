import type { BlogPostRow, BlogPost } from "./types";

export function transformPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    published: row.published,
    authorEmail: row.author_email,
    imageUrl: row.image_url,
    videoUrl: row.video_url,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}
