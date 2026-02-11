"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Ticket, ArrowLeft, CheckCircle } from "lucide-react";

function SweepstakesSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <Ticket
                className="text-amber-500"
                style={{
                  width: `${10 + Math.random() * 20}px`,
                  height: `${10 + Math.random() * 20}px`,
                  opacity: 0.6 + Math.random() * 0.4,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="card-matrix p-8 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-tech text-primary mb-4">
          TICKETS PURCHASED
        </h1>

        <p className="text-primary/60 font-mono mb-6">
          // YOUR RAFFLE ENTRIES ARE CONFIRMED
        </p>

        <p className="text-sm text-primary/40 mb-8">
          Your raffle tickets have been purchased successfully. You&apos;ll be
          notified by email if you win. Good luck!
        </p>

        {sessionId && (
          <p className="text-xs text-primary/30 font-mono mb-6 break-all">
            Transaction ID: {sessionId.slice(0, 20)}...
          </p>
        )}

        <Link
          href="/sweepstakes"
          className="inline-flex items-center gap-2 px-6 py-3 border border-primary/30 text-primary rounded-lg hover:bg-primary/10 transition-colors font-tech"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO SWEEPSTAKES</span>
        </Link>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
}

export default function SweepstakesSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-primary/60 font-mono">Loading...</div>
        </div>
      }
    >
      <SweepstakesSuccessContent />
    </Suspense>
  );
}
