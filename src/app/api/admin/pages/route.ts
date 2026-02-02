import { NextRequest, NextResponse } from "next/server";
import { sql, initializePageContent, seedDefaultPageContent } from "@/lib/db";
import { getSession } from "@/lib/session";
import type { PageContentRow, PageContent } from "@/lib/shared";

// Transform database row to PageContent object
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

// GET: Fetch all page content or a single page by slug
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Initialize tables and seed defaults if needed
    await initializePageContent();
    await seedDefaultPageContent();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const rows = await sql`
        SELECT * FROM page_content WHERE page_slug = ${slug}
      ` as PageContentRow[];

      if (rows.length === 0) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
      }

      return NextResponse.json(transformPageContent(rows[0]));
    }

    const rows = await sql`
      SELECT * FROM page_content ORDER BY page_slug ASC
    ` as PageContentRow[];

    return NextResponse.json(rows.map(transformPageContent));
  } catch (error) {
    console.error("Failed to fetch page content:", error);
    return NextResponse.json(
      { error: "Failed to fetch page content" },
      { status: 500 }
    );
  }
}

// PUT: Update page content
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { pageSlug, ...updates } = body;

    if (!pageSlug) {
      return NextResponse.json({ error: "pageSlug is required" }, { status: 400 });
    }

    await sql`
      UPDATE page_content SET
        hero_title = COALESCE(${updates.heroTitle}, hero_title),
        hero_subtitle = COALESCE(${updates.heroSubtitle}, hero_subtitle),
        hero_description = COALESCE(${updates.heroDescription}, hero_description),
        hero_badge_text = COALESCE(${updates.heroBadgeText}, hero_badge_text),
        cta_title = COALESCE(${updates.ctaTitle}, cta_title),
        cta_description = COALESCE(${updates.ctaDescription}, cta_description),
        cta_button_text = COALESCE(${updates.ctaButtonText}, cta_button_text),
        cta_button_link = COALESCE(${updates.ctaButtonLink}, cta_button_link),
        meta_title = COALESCE(${updates.metaTitle}, meta_title),
        meta_description = COALESCE(${updates.metaDescription}, meta_description),
        meta_keywords = COALESCE(${updates.metaKeywords}, meta_keywords),
        is_active = COALESCE(${updates.isActive}, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE page_slug = ${pageSlug}
    `;

    const rows = await sql`
      SELECT * FROM page_content WHERE page_slug = ${pageSlug}
    ` as PageContentRow[];

    return NextResponse.json(transformPageContent(rows[0]));
  } catch (error) {
    console.error("Failed to update page content:", error);
    return NextResponse.json(
      { error: "Failed to update page content" },
      { status: 500 }
    );
  }
}
