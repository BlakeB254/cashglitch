import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
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
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initializeIntroScreens();
    await seedDefaultIntroScreens();

    const rows = await sql`
      SELECT * FROM intro_screens ORDER BY sort_order ASC
    ` as IntroScreenRow[];

    return NextResponse.json(rows.map(transformIntroScreen));
  } catch (error) {
    console.error("Intro screens fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch intro screens" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { screenType, title, subtitle, options, sortOrder, isActive } = body;

    if (!screenType || !title) {
      return NextResponse.json({ error: "Screen type and title are required" }, { status: 400 });
    }

    await initializeIntroScreens();

    const result = await sql`
      INSERT INTO intro_screens (screen_type, title, subtitle, options, sort_order, is_active)
      VALUES (
        ${screenType},
        ${title},
        ${subtitle || null},
        ${options ? JSON.stringify(options) : null},
        ${sortOrder ?? 0},
        ${isActive ?? true}
      )
      RETURNING *
    ` as IntroScreenRow[];

    return NextResponse.json(transformIntroScreen(result[0]));
  } catch (error) {
    console.error("Intro screen create error:", error);
    return NextResponse.json({ error: "Failed to create intro screen" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, screenType, title, subtitle, options, sortOrder, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const result = await sql`
      UPDATE intro_screens SET
        screen_type = COALESCE(${screenType}, screen_type),
        title = COALESCE(${title}, title),
        subtitle = COALESCE(${subtitle}, subtitle),
        options = COALESCE(${options ? JSON.stringify(options) : null}, options),
        sort_order = COALESCE(${sortOrder}, sort_order),
        is_active = COALESCE(${isActive}, is_active),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    ` as IntroScreenRow[];

    if (result.length === 0) {
      return NextResponse.json({ error: "Intro screen not found" }, { status: 404 });
    }

    return NextResponse.json(transformIntroScreen(result[0]));
  } catch (error) {
    console.error("Intro screen update error:", error);
    return NextResponse.json({ error: "Failed to update intro screen" }, { status: 500 });
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

    await sql`DELETE FROM intro_screens WHERE id = ${parseInt(id, 10)}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Intro screen delete error:", error);
    return NextResponse.json({ error: "Failed to delete intro screen" }, { status: 500 });
  }
}
