import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { sql, initializeSweepstakes } from "@/lib/db";
import type { SweepstakeRow, Sweepstake } from "@/lib/shared";

function transformSweepstake(row: SweepstakeRow): Sweepstake {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    prizeDescription: row.prize_description,
    ticketPriceCents: row.ticket_price_cents,
    maxTickets: row.max_tickets,
    ticketsSold: row.tickets_sold,
    drawDate: row.draw_date,
    status: row.status,
    imageUrl: row.image_url,
    isFeatured: row.is_featured,
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

    await initializeSweepstakes();

    const rows = await sql`
      SELECT * FROM sweepstakes ORDER BY created_at DESC
    `;

    const sweepstakes = (rows as SweepstakeRow[]).map(transformSweepstake);
    return NextResponse.json(sweepstakes);
  } catch (error) {
    console.error("Admin sweepstakes fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sweepstakes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initializeSweepstakes();

    const body = await request.json();
    const {
      title,
      description,
      prizeDescription,
      ticketPriceCents,
      maxTickets,
      drawDate,
      imageUrl,
      isFeatured,
    } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const rows = await sql`
      INSERT INTO sweepstakes (
        title, description, prize_description, ticket_price_cents,
        max_tickets, draw_date, image_url, is_featured
      ) VALUES (
        ${title},
        ${description || null},
        ${prizeDescription || null},
        ${ticketPriceCents || 500},
        ${maxTickets || null},
        ${drawDate || null},
        ${imageUrl || null},
        ${isFeatured || false}
      )
      RETURNING *
    `;

    return NextResponse.json(transformSweepstake(rows[0] as SweepstakeRow));
  } catch (error) {
    console.error("Admin sweepstakes create error:", error);
    return NextResponse.json(
      { error: "Failed to create sweepstake" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initializeSweepstakes();

    const body = await request.json();
    const {
      id,
      title,
      description,
      prizeDescription,
      ticketPriceCents,
      maxTickets,
      drawDate,
      status,
      imageUrl,
      isFeatured,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const rows = await sql`
      UPDATE sweepstakes SET
        title = ${title},
        description = ${description || null},
        prize_description = ${prizeDescription || null},
        ticket_price_cents = ${ticketPriceCents || 500},
        max_tickets = ${maxTickets || null},
        draw_date = ${drawDate || null},
        status = ${status || 'active'},
        image_url = ${imageUrl || null},
        is_featured = ${isFeatured || false},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Sweepstake not found" }, { status: 404 });
    }

    return NextResponse.json(transformSweepstake(rows[0] as SweepstakeRow));
  } catch (error) {
    console.error("Admin sweepstakes update error:", error);
    return NextResponse.json(
      { error: "Failed to update sweepstake" },
      { status: 500 }
    );
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

    await sql`DELETE FROM sweepstakes WHERE id = ${parseInt(id, 10)}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin sweepstakes delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete sweepstake" },
      { status: 500 }
    );
  }
}
