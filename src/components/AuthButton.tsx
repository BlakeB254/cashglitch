"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SessionInfo {
  authenticated: boolean;
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
        setSession({ authenticated: false, hasAccess: false });
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // Clear sessionStorage access as well
      sessionStorage.removeItem("cashglitch_session_access");
      // Reload to trigger the access gate
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  if (loading) {
    return null;
  }

  // If user is authenticated (has a valid session)
  if (session?.authenticated && session?.email) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {session.isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin")}
            className="text-primary/80 hover:text-primary hover:bg-primary/10 gap-1.5"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline font-tech text-xs">Admin</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="text-primary/80 hover:text-primary hover:bg-primary/10 gap-1.5"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline font-tech text-xs">Sign Out</span>
        </Button>
      </div>
    );
  }

  // If user has temporary access (skipped email) or no access
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignIn}
      className={`text-primary/80 hover:text-primary hover:bg-primary/10 gap-1.5 ${className}`}
    >
      <LogIn className="h-4 w-4" />
      <span className="hidden sm:inline font-tech text-xs">Sign In</span>
    </Button>
  );
}
