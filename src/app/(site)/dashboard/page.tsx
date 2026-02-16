"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, Calendar, Loader2 } from "lucide-react";

interface SessionInfo {
  authenticated: boolean;
  hasAccess: boolean;
  email?: string;
  isAdmin?: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        setSession(data);

        // Redirect to login if not authenticated
        if (!data.authenticated && !data.hasAccess) {
          router.push("/login");
          return;
        }

        // Redirect admin users to admin dashboard
        if (data.isAdmin) {
          router.push("/admin");
          return;
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-primary relative">
      <div className="fixed inset-0 crt-overlay z-[15] pointer-events-none" />

      <main className="relative z-10 container mx-auto px-4 py-12 pt-24 max-w-2xl">
        <h1 className="text-3xl font-matrix text-primary text-glow mb-2">
          Dashboard
        </h1>
        <p className="text-primary/50 text-sm font-tech mb-8">
          // YOUR ACCOUNT
        </p>

        {/* Account Info Card */}
        <div className="card-matrix p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-tech text-primary text-sm">Member</p>
              <p className="text-primary/50 text-xs font-tech">Active Account</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-primary/60 flex-shrink-0" />
              <div>
                <p className="text-primary/40 text-xs font-tech">EMAIL</p>
                <p className="text-primary font-tech">{session.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-4 h-4 text-primary/60 flex-shrink-0" />
              <div>
                <p className="text-primary/40 text-xs font-tech">ROLE</p>
                <p className="text-primary font-tech">Member</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-primary/60 flex-shrink-0" />
              <div>
                <p className="text-primary/40 text-xs font-tech">STATUS</p>
                <p className="text-green-400 font-tech">Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card-matrix p-6">
          <h2 className="text-sm font-tech text-primary/60 mb-4 tracking-wider">
            // QUICK LINKS
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Sweepstakes", href: "/sweepstakes" },
              { label: "Blog", href: "/blog" },
              { label: "Free Travel", href: "/free-travel" },
              { label: "Jobs", href: "/jobs" },
            ].map((link) => (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className="p-3 text-left rounded-md border border-primary/20 hover:border-primary/40 hover:bg-primary/5 font-tech text-xs text-primary/80 hover:text-primary transition-all"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="mt-8 text-xs text-primary/20 font-mono">
          <p>&gt; ACCOUNT STATUS: ACTIVE</p>
          <p>&gt; ACCESS LEVEL: MEMBER</p>
        </div>
      </main>
    </div>
  );
}
