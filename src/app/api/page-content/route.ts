import { NextRequest, NextResponse } from "next/server";
import { sql, initializePageContent, seedDefaultPageContent } from "@/lib/db";
import type { PageContentRow, PageContent } from "@/lib/shared";

function transformPageContent(row: PageContentRow): PageContent {
  return {
    id: row.id,
    pageSlug: row.page_slug,
    heroTitle: row.hero_title,
    heroSubtitle: row.hero_subtitle,
    heroDescription: row.hero_description,
    heroBadgeText: row.hero_badge_text,
    ctaTitle: row.cta_title,
    ctaDescription: row.cta_description,
    ctaButtonText: row.cta_button_text,
    ctaButtonLink: row.cta_button_link,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    metaKeywords: row.meta_keywords,
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export async function GET(request: NextRequest) {
  try {
    await initializePageContent();
    await seedDefaultPageContent();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "slug parameter is required" },
        { status: 400 }
      );
    }

    const rows = (await sql`
      SELECT * FROM page_content WHERE page_slug = ${slug} AND is_active = true
    `) as PageContentRow[];

    if (rows.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(transformPageContent(rows[0]));
  } catch (error) {
    console.error("Failed to fetch page content:", error);
    return NextResponse.json(
      { error: "Failed to fetch page content" },
      { status: 500 }
    );
  }
}
