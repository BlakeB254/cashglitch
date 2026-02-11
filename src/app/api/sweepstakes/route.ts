import { NextResponse } from "next/server";
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
    await initializeSweepstakes();

    const rows = await sql`
      SELECT * FROM sweepstakes
      WHERE status = 'active'
      ORDER BY is_featured DESC, created_at DESC
    `;

    const sweepstakes = (rows as SweepstakeRow[]).map(transformSweepstake);
    return NextResponse.json(sweepstakes);
  } catch (error) {
    console.error("Sweepstakes fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sweepstakes" },
      { status: 500 }
    );
  }
}
