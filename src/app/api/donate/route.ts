import { NextRequest, NextResponse } from "next/server";
import { stripe, DEFAULT_DONATION_AMOUNT, DONATION_AMOUNTS } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured. Please set STRIPE_SECRET_KEY." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { amount, customAmount } = body;

    // Validate the amount
    let donationAmount = DEFAULT_DONATION_AMOUNT;

    if (customAmount && typeof customAmount === "number" && customAmount >= 100) {
      // Custom amount in cents (minimum $1)
      donationAmount = Math.floor(customAmount);
    } else if (amount) {
      // Predefined amount
      const validAmount = DONATION_AMOUNTS.find((d) => d.amount === amount);
      if (validAmount) {
        donationAmount = validAmount.amount;
      }
    }

    // Create Stripe Checkout session
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "https://cashglitch.org").trim();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "CashGlitch Donation",
              description: "Support the CashGlitch mission to connect people with free resources and opportunities",
              images: [`${appUrl}/images/logo-transparent.png`],
            },
            unit_amount: donationAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/donate/cancel`,
      metadata: {
        donation_type: "one_time",
        source: "website",
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Donation checkout error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create checkout session", detail: message },
      { status: 500 }
    );
  }
}
