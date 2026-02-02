"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";

const DONATION_AMOUNTS = [
  { amount: 500, label: "$5" },
  { amount: 1000, label: "$10" },
  { amount: 2500, label: "$25" },
  { amount: 5000, label: "$50" },
  { amount: 10000, label: "$100" },
];

interface DonateButtonProps {
  variant?: "button" | "full";
  className?: string;
}

export function DonateButton({ variant = "button", className = "" }: DonateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(2500);
  const [customAmount, setCustomAmount] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const handleDonate = async (amount?: number) => {
    setIsLoading(true);
    try {
      const donationAmount = amount || selectedAmount;
      const isCustom = customAmount && !DONATION_AMOUNTS.find((d) => d.amount === donationAmount);

      const response = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isCustom
            ? { customAmount: parseInt(customAmount) * 100 }
            : { amount: donationAmount }
        ),
      });

      const { url, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Donation error:", error);
      alert("Failed to process donation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "button") {
    return (
      <button
        onClick={() => handleDonate(2500)}
        disabled={isLoading}
        className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-tech rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Heart className="w-5 h-5" />
        )}
        <span>DONATE</span>
      </button>
    );
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-tech rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
      >
        <Heart className="w-5 h-5" />
        <span>SUPPORT THE GLITCH</span>
      </button>

      {showOptions && (
        <div className="mt-4 p-4 bg-black/80 border border-primary/30 rounded-lg space-y-4">
          <p className="text-sm text-primary/60 text-center font-mono">
            // SELECT DONATION AMOUNT
          </p>

          <div className="grid grid-cols-3 gap-2">
            {DONATION_AMOUNTS.map((d) => (
              <button
                key={d.amount}
                onClick={() => {
                  setSelectedAmount(d.amount);
                  setCustomAmount("");
                }}
                className={`py-2 px-3 rounded border font-tech text-sm transition-all ${
                  selectedAmount === d.amount && !customAmount
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-primary/30 text-primary/60 hover:border-primary/60"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-primary/60 font-mono text-sm">$</span>
            <input
              type="number"
              min="1"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(0);
              }}
              className="flex-1 px-3 py-2 bg-transparent border border-primary/30 rounded text-primary font-mono text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <button
            onClick={() => handleDonate()}
            disabled={isLoading || (!selectedAmount && !customAmount)}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-tech rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>PROCESSING...</span>
              </>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                <span>
                  DONATE{" "}
                  {customAmount
                    ? `$${customAmount}`
                    : DONATION_AMOUNTS.find((d) => d.amount === selectedAmount)?.label || "$25"}
                </span>
              </>
            )}
          </button>

          <p className="text-xs text-primary/40 text-center font-mono">
            Secure payment powered by Stripe
          </p>
        </div>
      )}
    </div>
  );
}
