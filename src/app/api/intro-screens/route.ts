import { NextResponse } from "next/server";
import { sql, initializeIntroScreens, seedDefaultIntroScreens } from "@/lib/db";
import type { IntroScreenRow, IntroScreen, IntroScreenType } from "@/lib/shared";

function transformIntroScreen(row: IntroScreenRow): IntroScreen {
  let parsedOptions = null;
  if (row.options) {
    try {
      parsedOptions = typeof row.options === "string" ? JSON.parse(row.options) : row.options;
    } catch {
      parsedOptions = null;
    }
  }

  return {
    id: row.id,
    screenType: row.screen_type as IntroScreenType,
    title: row.title,
    subtitle: row.subtitle,
    options: parsedOptions,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export async function GET() {
  try {
    await initializeIntroScreens();
    await seedDefaultIntroScreens();

    // Only return active screens
    const rows = await sql`
      SELECT * FROM intro_screens
      WHERE is_active = true
      ORDER BY sort_order ASC
    ` as IntroScreenRow[];

    return NextResponse.json(rows.map(transformIntroScreen));
  } catch (error) {
    console.error("Intro screens fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch intro screens" }, { status: 500 });
  }
}
