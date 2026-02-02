"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Terminal, ShieldAlert } from "lucide-react";

export default function DevLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "logging-in" | "blocked" | "error" | "success">("checking");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hostname = window.location.hostname;
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1";

    if (!isLocal) {
      setStatus("blocked");
      return;
    }

    // Auto-login as admin
    const doLogin = async () => {
      setStatus("logging-in");
      try {
        const res = await fetch("/api/auth/dev-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "cosmodrip88@gmail.com" }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Login failed");
        }

        setStatus("success");
        // Redirect to admin after brief delay
        setTimeout(() => {
          router.push("/admin");
        }, 500);
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Login failed");
      }
    };

    doLogin();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0f0a1a] flex flex-col items-center justify-center p-4">
      <div className="fixed inset-0 crt-overlay pointer-events-none" />

      <div className="relative z-10 text-center">
        {status === "checking" && (
          <>
            <Loader2 className="w-12 h-12 text-amber-400 animate-spin mx-auto mb-4" />
            <p className="text-amber-400 font-tech">CHECKING ENVIRONMENT...</p>
          </>
        )}

        {status === "logging-in" && (
          <>
            <Terminal className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <p className="text-amber-400 font-tech text-xl mb-2">DEV LOGIN</p>
            <Loader2 className="w-6 h-6 text-amber-400 animate-spin mx-auto mb-2" />
            <p className="text-amber-400/60 font-mono text-sm">Logging in as cosmodrip88@gmail.com...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Terminal className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-green-400 font-tech text-xl mb-2">LOGIN SUCCESSFUL</p>
            <p className="text-green-400/60 font-mono text-sm">Redirecting to admin...</p>
          </>
        )}

        {status === "blocked" && (
          <>
            <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 font-tech text-xl mb-2">ACCESS DENIED</p>
            <p className="text-red-400/60 font-mono text-sm">Dev login only available on localhost</p>
          </>
        )}

        {status === "error" && (
          <>
            <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 font-tech text-xl mb-2">LOGIN FAILED</p>
            <p className="text-red-400/60 font-mono text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 border border-amber-500/40 text-amber-400 font-tech text-sm hover:bg-amber-500/20"
            >
              TRY AGAIN
            </button>
          </>
        )}
      </div>
    </div>
  );
}
