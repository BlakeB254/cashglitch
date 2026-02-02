import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-01-28.clover",
  typescript: true,
});

// Predefined donation amounts in cents
export const DONATION_AMOUNTS = [
  { amount: 500, label: "$5" },
  { amount: 1000, label: "$10" },
  { amount: 2500, label: "$25" },
  { amount: 5000, label: "$50" },
  { amount: 10000, label: "$100" },
] as const;

export const DEFAULT_DONATION_AMOUNT = 2500; // $25
