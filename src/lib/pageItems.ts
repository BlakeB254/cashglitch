import type { PageItemRow, PageItem } from "@/lib/shared";

export function parseTags(tags: unknown): string[] | null {
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

export function transformPageItem(row: PageItemRow): PageItem {
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
    imageUrl: row.image_url,
    videoUrl: row.video_url,
    tags: parseTags(row.tags as unknown),
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}
