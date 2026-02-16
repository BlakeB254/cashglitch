"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, Terminal } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDevMode, setIsDevMode] = useState(false);
  const [devEmail, setDevEmail] = useState("");
  const [isDevLoggingIn, setIsDevLoggingIn] = useState(false);

  // Check if we're in development mode (localhost)
  useEffect(() => {
    const hostname = window.location.hostname;
    setIsDevMode(hostname === "localhost" || hostname === "127.0.0.1");
  }, []);

  const handleDevLogin = async () => {
    const emailToUse = devEmail.trim() || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "cosmodrip88@gmail.com";
    setIsDevLoggingIn(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Dev login failed");
      }

      // Redirect to admin if admin, otherwise home
      router.push(data.isAdmin ? "/admin" : "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Dev login failed");
    } finally {
      setIsDevLoggingIn(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send magic link");
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0a1a] flex flex-col items-center justify-center p-4">
      {/* CRT Overlay */}
      <div className="fixed inset-0 crt-overlay pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary/60 hover:text-primary text-sm font-tech mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl rounded-full opacity-50 animate-pulse" />
            <Image
              src="/images/logo-transparent.png"
              alt="Cash Glitch"
              width={96}
              height={96}
              className="relative drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]"
              priority
            />
          </div>
        </div>

        {!sent ? (
          <>
            {/* Login Form */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-matrix text-primary text-glow mb-2">
                Sign In
              </h1>
              <p className="text-primary/50 text-sm font-tech">
                // ENTER YOUR EMAIL TO ACCESS THE MATRIX
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoFocus
                  className="w-full py-3 pl-12 pr-4 bg-primary/5 border border-primary/30 text-primary font-tech placeholder:text-primary/30 focus:outline-none focus:border-primary/60 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all duration-300"
                />
              </div>

              {error && (
                <p className="text-pink-400 text-sm font-tech">ERROR: {error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-tech text-lg tracking-wider hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 btn-glow flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    SENDING...
                  </>
                ) : (
                  "SEND MAGIC LINK"
                )}
              </button>
            </form>

            <p className="mt-6 text-primary/30 text-xs font-tech text-center">
              We&apos;ll send a magic link to your email to sign you in.
            </p>

            {/* Dev Mode Login - Only visible on localhost */}
            {isDevMode && (
              <div className="mt-8 pt-6 border-t border-primary/20">
                <div className="flex items-center gap-2 text-amber-400/80 text-xs font-tech mb-4">
                  <Terminal className="w-4 h-4" />
                  DEV MODE - DIRECT LOGIN (localhost only)
                </div>
                <div className="space-y-3">
                  <input
                    type="email"
                    value={devEmail}
                    onChange={(e) => setDevEmail(e.target.value)}
                    placeholder="cosmodrip88@gmail.com"
                    className="w-full py-2 px-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-sm placeholder:text-amber-500/40 focus:outline-none focus:border-amber-500/60"
                  />
                  <button
                    type="button"
                    onClick={handleDevLogin}
                    disabled={isDevLoggingIn}
                    className="w-full py-2 px-4 bg-amber-500/20 border border-amber-500/40 text-amber-400 font-tech text-sm hover:bg-amber-500/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isDevLoggingIn ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        LOGGING IN...
                      </>
                    ) : (
                      <>
                        <Terminal className="w-4 h-4" />
                        DEV LOGIN (NO EMAIL)
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-matrix text-primary text-glow mb-2">
                Check Your Email
              </h2>
              <p className="text-primary/60 font-tech mb-4">
                We sent a magic link to:
              </p>
              <p className="text-primary font-tech text-lg mb-6">{email}</p>
              <p className="text-primary/40 text-sm font-tech">
                Click the link in the email to sign in. The link expires in 15
                minutes.
              </p>

              <button
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
                className="mt-8 text-primary/60 hover:text-primary text-sm font-tech transition-colors"
              >
                Use a different email
              </button>
            </div>
          </>
        )}

        {/* Terminal decoration */}
        <div className="mt-12 text-xs text-primary/20 font-mono text-center">
          <p>&gt; SECURE LOGIN PORTAL v2.0</p>
        </div>
      </div>
    </div>
  );
}
