import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { sql, initializeSiteSettings, seedDefaultSiteSettings } from "@/lib/db";
import type { SiteSettingRow, SiteSettings } from "@/lib/shared";

function transformSettings(rows: SiteSettingRow[]): SiteSettings {
  const settingsMap = new Map(rows.map((r) => [r.key, r.value]));

  return {
    siteTitle: settingsMap.get("site_title") || "CashGlitch",
    siteTagline: settingsMap.get("site_tagline") || "The only Glitch is how much help you'll find",
    siteDescription: settingsMap.get("site_description") || "",
    twitterUrl: settingsMap.get("twitter_url") || "",
    instagramUrl: settingsMap.get("instagram_url") || "",
    featureBlog: settingsMap.get("feature_blog") === "true",
    featureAccessGate: settingsMap.get("feature_access_gate") === "true",
    ogTitle: settingsMap.get("og_title") || "",
    ogDescription: settingsMap.get("og_description") || "",
    metaKeywords: settingsMap.get("meta_keywords") || "",
  };
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initializeSiteSettings();
    await seedDefaultSiteSettings();

    const rows = await sql`
      SELECT * FROM site_settings
    ` as SiteSettingRow[];

    return NextResponse.json(transformSettings(rows));
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    await initializeSiteSettings();

    // Map camelCase to snake_case and update each setting
    const settingsToUpdate: Record<string, string> = {};

    if (body.siteTitle !== undefined) settingsToUpdate.site_title = body.siteTitle;
    if (body.siteTagline !== undefined) settingsToUpdate.site_tagline = body.siteTagline;
    if (body.siteDescription !== undefined) settingsToUpdate.site_description = body.siteDescription;
    if (body.twitterUrl !== undefined) settingsToUpdate.twitter_url = body.twitterUrl;
    if (body.instagramUrl !== undefined) settingsToUpdate.instagram_url = body.instagramUrl;
    if (body.featureBlog !== undefined) settingsToUpdate.feature_blog = String(body.featureBlog);
    if (body.featureAccessGate !== undefined) settingsToUpdate.feature_access_gate = String(body.featureAccessGate);
    if (body.ogTitle !== undefined) settingsToUpdate.og_title = body.ogTitle;
    if (body.ogDescription !== undefined) settingsToUpdate.og_description = body.ogDescription;
    if (body.metaKeywords !== undefined) settingsToUpdate.meta_keywords = body.metaKeywords;

    for (const [key, value] of Object.entries(settingsToUpdate)) {
      await sql`
        INSERT INTO site_settings (key, value, updated_at)
        VALUES (${key}, ${value}, NOW())
        ON CONFLICT (key) DO UPDATE SET
          value = ${value},
          updated_at = NOW()
      `;
    }

    // Fetch and return updated settings
    const rows = await sql`
      SELECT * FROM site_settings
    ` as SiteSettingRow[];

    return NextResponse.json(transformSettings(rows));
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
