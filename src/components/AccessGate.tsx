"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Step = "question" | "email";

export function AccessGate({ children }: { children: React.ReactNode }) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [step, setStep] = useState<Step>("question");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user already has access
    const access = localStorage.getItem("cashglitch_access");
    setHasAccess(access === "granted");
  }, []);

  const handleQuestionResponse = () => {
    // Regardless of yes or no, proceed to email step
    setStep("email");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);

    // Store email in localStorage (in production, you'd send this to an API)
    localStorage.setItem("cashglitch_email", email);
    localStorage.setItem("cashglitch_access", "granted");

    // Brief delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 500));

    setHasAccess(true);
  };

  // Show nothing while checking access status
  if (hasAccess === null) {
    return (
      <div className="fixed inset-0 bg-[#0f0a1a] z-50 flex items-center justify-center">
        <div className="text-primary/60 font-tech animate-pulse">
          INITIALIZING...
        </div>
      </div>
    );
  }

  // Show gate if no access
  if (!hasAccess) {
    return (
      <div className="fixed inset-0 bg-[#0f0a1a] z-50 flex flex-col items-center justify-center p-4">
        {/* CRT Overlay */}
        <div className="fixed inset-0 crt-overlay pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center max-w-md w-full">
          {/* Logo */}
          <div className="mb-8 relative w-32 h-32">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl rounded-full opacity-50 animate-pulse" />
            <Image
              src="/images/logo-transparent.png"
              alt="Cash Glitch"
              width={128}
              height={128}
              className="relative drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]"
              priority
            />
          </div>

          {step === "question" ? (
            <>
              {/* Question */}
              <h1 className="text-3xl md:text-4xl font-matrix text-primary text-center mb-2 text-glow">
                Are you ok?
              </h1>
              <p className="text-primary/50 text-sm font-tech mb-8 text-center">
                // SYSTEM CHECK REQUIRED
              </p>

              {/* Yes/No Buttons */}
              <div className="flex gap-4 w-full max-w-xs">
                <button
                  onClick={handleQuestionResponse}
                  className="flex-1 py-3 px-6 bg-primary/10 border border-primary/40 text-primary font-tech text-lg tracking-wider hover:bg-primary/20 hover:border-primary/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300"
                >
                  YES
                </button>
                <button
                  onClick={handleQuestionResponse}
                  className="flex-1 py-3 px-6 bg-pink-500/10 border border-pink-500/40 text-pink-400 font-tech text-lg tracking-wider hover:bg-pink-500/20 hover:border-pink-500/60 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all duration-300"
                >
                  NO
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Email Form */}
              <h2 className="text-2xl md:text-3xl font-matrix text-primary text-center mb-2 text-glow">
                Enter the Matrix
              </h2>
              <p className="text-primary/50 text-sm font-tech mb-6 text-center">
                // EMAIL REQUIRED FOR ACCESS
              </p>

              <form onSubmit={handleEmailSubmit} className="w-full max-w-xs">
                <div className="mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoFocus
                    className="w-full py-3 px-4 bg-primary/5 border border-primary/30 text-primary font-tech placeholder:text-primary/30 focus:outline-none focus:border-primary/60 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all duration-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                  className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-tech text-lg tracking-wider hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 btn-glow"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">ACCESSING...</span>
                  ) : (
                    "GRANT ACCESS"
                  )}
                </button>
              </form>

              <p className="mt-6 text-primary/30 text-xs font-tech text-center">
                We&apos;ll send you glitches in the system
              </p>
            </>
          )}

          {/* Terminal decoration */}
          <div className="mt-12 text-xs text-primary/20 font-mono">
            <p>&gt; AWAITING USER INPUT...</p>
          </div>
        </div>
      </div>
    );
  }

  // User has access, show children
  return <>{children}</>;
}
