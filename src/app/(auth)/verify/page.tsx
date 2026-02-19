"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("No token provided");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Verification failed");
        }

        setStatus("success");
        setIsAdmin(data.isAdmin);

        // Redirect after short delay - admin goes to /admin, others to home
        // Use window.location.href to force a full page reload so the
        // AuthButton re-fetches session state and updates from Sign In → Logout
        setRedirecting(true);
        setTimeout(() => {
          window.location.href = data.isAdmin ? "/admin" : "/";
        }, 2000);
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Verification failed");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0f0a1a] flex flex-col items-center justify-center p-4">
      {/* CRT Overlay */}
      <div className="fixed inset-0 crt-overlay pointer-events-none" />

      <div className="relative z-10 w-full max-w-md text-center">
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

        {status === "verifying" && (
          <>
            <Loader2 className="w-12 h-12 text-primary mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-matrix text-primary text-glow mb-2">
              Verifying Access
            </h1>
            <p className="text-primary/50 text-sm font-tech">
              // AUTHENTICATING TOKEN...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h1 className="text-2xl font-matrix text-green-400 text-glow mb-2">
              {isAdmin ? "Admin Access Granted" : "Access Granted"}
            </h1>
            <p className="text-primary/60 font-tech mb-4">
              You have been successfully authenticated.
            </p>
            {redirecting && (
              <p className="text-primary/40 text-sm font-tech animate-pulse">
                {isAdmin ? "Redirecting to admin dashboard..." : "Redirecting to the site..."}
              </p>
            )}
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-pink-500 mx-auto mb-6" />
            <h1 className="text-2xl font-matrix text-pink-500 text-glow mb-2">
              Access Denied
            </h1>
            <p className="text-primary/60 font-tech mb-6">
              {error || "The link is invalid or has expired."}
            </p>
            <Link
              href="/login"
              className="inline-block py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-tech tracking-wider hover:from-purple-500 hover:to-pink-500 transition-all duration-300 btn-glow"
            >
              REQUEST NEW LINK
            </Link>
          </>
        )}

        {/* Terminal decoration */}
        <div className="mt-12 text-xs text-primary/20 font-mono">
          <p>&gt; TOKEN VERIFICATION PROTOCOL</p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0f0a1a] flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
