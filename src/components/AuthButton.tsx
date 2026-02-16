"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, Shield, User, Loader2 } from "lucide-react";

interface SessionInfo {
  hasAccess: boolean;
  email?: string;
  isAdmin?: boolean;
}

export function AuthButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        setSession(data);
      } catch {
        setSession({ hasAccess: false });
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      sessionStorage.removeItem("cashglitch_session_access");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  if (loading) {
    return (
      <div className={`flex items-center ${className}`}>
        <span className="inline-flex items-center px-3 py-2 text-primary/40">
          <Loader2 className="h-4 w-4 animate-spin" />
        </span>
      </div>
    );
  }

  // Logged in — show admin or dashboard + logout
  if (session?.hasAccess && session?.email) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {session.isAdmin ? (
          <button
            onClick={() => router.push("/admin")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-primary/80 hover:text-primary hover:bg-primary/10 border border-primary/20 hover:border-primary/40 font-tech text-xs transition-all"
          >
            <Shield className="h-4 w-4" />
            <span>Admin</span>
          </button>
        ) : (
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-primary/80 hover:text-primary hover:bg-primary/10 border border-primary/20 hover:border-primary/40 font-tech text-xs transition-all"
          >
            <User className="h-4 w-4" />
            <span>Dashboard</span>
          </button>
        )}
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-primary/80 hover:text-primary hover:bg-primary/10 border border-primary/20 hover:border-primary/40 font-tech text-xs transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    );
  }

  // Not logged in
  return (
    <button
      onClick={handleSignIn}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-primary/80 hover:text-primary hover:bg-primary/10 border border-primary/20 hover:border-primary/40 font-tech text-xs transition-all ${className}`}
    >
      <LogIn className="h-4 w-4" />
      <span>Sign In</span>
    </button>
  );
}
