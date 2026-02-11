import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { sql, initializeDonations } from "@/lib/db";

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.metadata?.donation_type === "one_time") {
          await initializeDonations();

          await sql`
            INSERT INTO donations (
              stripe_session_id,
              stripe_payment_intent,
              amount_cents,
              currency,
              donor_email,
              donor_name,
              status,
              donation_type,
              metadata
            ) VALUES (
              ${session.id},
              ${typeof session.payment_intent === "string" ? session.payment_intent : null},
              ${session.amount_total ?? 0},
              ${session.currency ?? "usd"},
              ${session.customer_details?.email ?? null},
              ${session.customer_details?.name ?? null},
              ${"completed"},
              ${session.metadata?.donation_type ?? "one_time"},
              ${JSON.stringify(session.metadata ?? {})}
            )
            ON CONFLICT (stripe_session_id) DO NOTHING
          `;
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.metadata?.donation_type === "one_time") {
          await initializeDonations();
          await sql`
            INSERT INTO donations (
              stripe_session_id,
              amount_cents,
              currency,
              status,
              donation_type,
              metadata
            ) VALUES (
              ${session.id},
              ${session.amount_total ?? 0},
              ${session.currency ?? "usd"},
              ${"expired"},
              ${session.metadata?.donation_type ?? "one_time"},
              ${JSON.stringify(session.metadata ?? {})}
            )
            ON CONFLICT (stripe_session_id) DO NOTHING
          `;
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
