import { DonateButton } from "@/components/DonateButton";

export const metadata = {
  title: "Donate | CashGlitch",
  description: "Support the CashGlitch mission to connect people with free resources and opportunities.",
};

export default function DonatePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-matrix text-primary text-glow">
          SUPPORT THE GLITCH
        </h1>
        <p className="text-primary/60 font-mono text-sm">
          // YOUR GENEROSITY HELPS US CONNECT PEOPLE WITH FREE RESOURCES, GRANTS,
          SCHOLARSHIPS, AND OPPORTUNITIES
        </p>

        <DonateButton variant="full" />

        <p className="text-xs text-primary/30 font-mono">
          All donations are processed securely through Stripe.
        </p>
      </div>
    </div>
  );
}
