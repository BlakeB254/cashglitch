import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getSession } from "@/lib/session";
import { sql, initializeSweepstakes } from "@/lib/db";
import type { SweepstakeRow } from "@/lib/shared";

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 503 }
      );
    }

    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Login required to purchase raffle tickets" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sweepstakeId, ticketCount } = body;

    if (!sweepstakeId || !ticketCount || ticketCount < 1) {
      return NextResponse.json(
        { error: "Valid sweepstakeId and ticketCount required" },
        { status: 400 }
      );
    }

    await initializeSweepstakes();

    // Fetch the sweepstake to get pricing
    const rows = await sql`
      SELECT * FROM sweepstakes WHERE id = ${sweepstakeId} AND status = 'active'
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Sweepstake not found or inactive" },
        { status: 404 }
      );
    }

    const sweepstake = rows[0] as SweepstakeRow;

    // Check ticket availability
    if (
      sweepstake.max_tickets &&
      sweepstake.tickets_sold + ticketCount > sweepstake.max_tickets
    ) {
      return NextResponse.json(
        { error: "Not enough tickets available" },
        { status: 400 }
      );
    }

    const appUrl = (
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      "https://cashglitch.org"
    ).trim();

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: session.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Raffle Ticket: ${sweepstake.title}`,
              description: sweepstake.prize_description || sweepstake.description || "Raffle ticket",
            },
            unit_amount: sweepstake.ticket_price_cents,
          },
          quantity: ticketCount,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/sweepstakes/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/sweepstakes/cancel`,
      metadata: {
        purchase_type: "raffle",
        sweepstake_id: String(sweepstakeId),
        ticket_count: String(ticketCount),
        buyer_email: session.email,
      },
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("Raffle checkout error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create checkout session", detail: message },
      { status: 500 }
    );
  }
}
