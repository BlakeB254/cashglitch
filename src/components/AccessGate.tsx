"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import type { IntroScreen, QuestionOption, EmailScreenOptions } from "@/lib/shared";

// Routes that bypass the access gate
const BYPASS_ROUTES = [
  "/login",
  "/dev-login",
  "/verify",
  "/admin",
  "/api",
  "/blog",
];

export function AccessGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [screens, setScreens] = useState<IntroScreen[]>([]);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  // Check if current route should bypass the gate
  const shouldBypass = BYPASS_ROUTES.some(route => pathname?.startsWith(route));

  useEffect(() => {
    // If route should bypass, grant access immediately
    if (shouldBypass) {
      setHasAccess(true);
      return;
    }

    const initialize = async () => {
      // Check access status from server (magic link verified session)
      try {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();

        if (sessionData.hasAccess) {
          setHasAccess(true);
          return;
        }
      } catch {
        // Server check failed, continue to show gate
      }

      // Check sessionStorage for users who skipped email (current browser session only)
      // This does NOT persist across browser sessions - only localStorage grants permanent access
      const sessionAccess = sessionStorage.getItem("cashglitch_session_access");
      if (sessionAccess === "granted") {
        setHasAccess(true);
        return;
      }

      // Fetch intro screens
      try {
        const screensRes = await fetch("/api/intro-screens");
        if (screensRes.ok) {
          const screensData = await screensRes.json();
          setScreens(screensData);
        }
      } catch {
        // Use default screens if fetch fails
        setScreens([
          {
            id: 1,
            screenType: "question",
            title: "Are you ok?",
            subtitle: "// SYSTEM CHECK REQUIRED",
            options: [
              { label: "YES", value: "yes", style: "primary" },
              { label: "NO", value: "no", style: "secondary" },
            ],
            sortOrder: 0,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            screenType: "email",
            title: "The only Glitch is how much help you'll find",
            subtitle: "// WE'LL SEND YOU AN ACCESS LINK",
            options: { showSkipButton: true, skipButtonText: "no email" },
            sortOrder: 1,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      }

      setHasAccess(false);
    };

    initialize();
  }, [shouldBypass]);

  const currentScreen = screens[currentScreenIndex];

  const handleQuestionResponse = (value: string) => {
    setResponses((prev) => ({ ...prev, [currentScreen.id]: value }));

    // Move to next screen
    if (currentScreenIndex < screens.length - 1) {
      setCurrentScreenIndex((prev) => prev + 1);
    }
  };

  const handleSkipEmail = () => {
    // Grant access for current browser session only (not permanent)
    // Users who skip will see the gate again when they close/reopen the browser
    // Only magic link verification grants permanent access
    sessionStorage.setItem("cashglitch_session_access", "granted");
    setHasAccess(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Get the first question response (if any)
      const questionScreens = screens.filter((s) => s.screenType === "question");
      const firstResponse = questionScreens.length > 0
        ? responses[questionScreens[0].id]
        : null;

      // Save to emails table
      const subscribeRes = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          response: firstResponse,
        }),
      });

      if (!subscribeRes.ok) {
        const data = await subscribeRes.json();
        throw new Error(data.error || "Failed to subscribe");
      }

      // Send magic link
      const magicLinkRes = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!magicLinkRes.ok) {
        const data = await magicLinkRes.json();
        throw new Error(data.error || "Failed to send access link");
      }

      setEmailSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (hasAccess === null) {
    return (
      <div className="fixed inset-0 bg-[#0f0a1a] z-50 flex items-center justify-center">
        <div className="text-primary/60 font-tech animate-pulse">
          INITIALIZING...
        </div>
      </div>
    );
  }

  // User has access
  if (hasAccess) {
    return <>{children}</>;
  }

  // No screens loaded yet
  if (screens.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#0f0a1a] z-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Render intro sequence
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

        {/* Question Screen */}
        {currentScreen.screenType === "question" && (
          <>
            <h1 className="text-3xl md:text-4xl font-matrix text-primary text-center mb-2 text-glow">
              {currentScreen.title}
            </h1>
            {currentScreen.subtitle && (
              <p className="text-primary/50 text-sm font-tech mb-8 text-center">
                {currentScreen.subtitle}
              </p>
            )}

            <div className="flex gap-4 w-full max-w-xs">
              {(currentScreen.options as QuestionOption[])?.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleQuestionResponse(option.value)}
                  className={`flex-1 py-3 px-6 font-tech text-lg tracking-wider transition-all duration-300 ${
                    option.style === "primary"
                      ? "bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20 hover:border-primary/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                      : option.style === "secondary"
                        ? "bg-pink-500/10 border border-pink-500/40 text-pink-400 hover:bg-pink-500/20 hover:border-pink-500/60 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                        : "bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Email Screen */}
        {currentScreen.screenType === "email" && !emailSent && (
          <>
            <h2 className="text-2xl md:text-3xl font-matrix text-primary text-center mb-2 text-glow">
              {currentScreen.title}
            </h2>
            {currentScreen.subtitle && (
              <p className="text-primary/50 text-sm font-tech mb-6 text-center">
                {currentScreen.subtitle}
              </p>
            )}

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
                {error && (
                  <p className="mt-2 text-pink-400 text-xs font-tech">
                    ERROR: {error}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-tech text-lg tracking-wider hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 btn-glow flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>SENDING...</span>
                  </>
                ) : (
                  "SEND ACCESS LINK"
                )}
              </button>
            </form>

            <p className="mt-6 text-primary/30 text-xs font-tech text-center">
              Check your email for a magic link to access the site
            </p>

            {/* Skip Button */}
            {(currentScreen.options as EmailScreenOptions)?.showSkipButton && (
              <button
                onClick={handleSkipEmail}
                className="mt-4 text-primary/40 hover:text-primary/60 text-xs font-tech transition-colors underline"
              >
                {(currentScreen.options as EmailScreenOptions)?.skipButtonText || "no email"}
              </button>
            )}
          </>
        )}

        {/* Email Sent State */}
        {currentScreen.screenType === "email" && emailSent && (
          <>
            <h2 className="text-2xl md:text-3xl font-matrix text-primary text-center mb-2 text-glow">
              Check Your Email
            </h2>
            <p className="text-primary/60 font-tech mb-4 text-center">
              We sent an access link to:
            </p>
            <p className="text-primary font-tech text-lg mb-6 text-center break-all">
              {email}
            </p>
            <p className="text-primary/40 text-sm font-tech text-center max-w-xs">
              Click the link in the email to unlock the abundance matrix. The
              link expires in 15 minutes.
            </p>

            <button
              onClick={() => {
                setEmailSent(false);
                setEmail("");
              }}
              className="mt-8 text-primary/60 hover:text-primary text-sm font-tech transition-colors"
            >
              Use a different email
            </button>
          </>
        )}

        {/* Info Screen */}
        {currentScreen.screenType === "info" && (
          <>
            <h2 className="text-2xl md:text-3xl font-matrix text-primary text-center mb-2 text-glow">
              {currentScreen.title}
            </h2>
            {currentScreen.subtitle && (
              <p className="text-primary/60 font-tech mb-6 text-center">
                {currentScreen.subtitle}
              </p>
            )}
            <button
              onClick={() => {
                if (currentScreenIndex < screens.length - 1) {
                  setCurrentScreenIndex((prev) => prev + 1);
                }
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-tech tracking-wider hover:from-purple-500 hover:to-pink-500 transition-all btn-glow"
            >
              CONTINUE
            </button>
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
