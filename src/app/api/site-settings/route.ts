import { NextResponse } from "next/server";
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
