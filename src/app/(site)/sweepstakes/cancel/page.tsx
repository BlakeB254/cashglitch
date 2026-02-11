"use client";

import Link from "next/link";
import { ArrowLeft, XCircle } from "lucide-react";

export default function SweepstakesCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card-matrix p-8 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <XCircle className="w-12 h-12 text-primary/60" />
          </div>
        </div>

        <h1 className="text-2xl font-tech text-primary mb-4">
          PURCHASE CANCELLED
        </h1>

        <p className="text-primary/60 font-mono mb-6">
          // NO WORRIES, NO CHARGE
        </p>

        <p className="text-sm text-primary/40 mb-8">
          Your raffle ticket purchase was cancelled. No charges were made. You
          can try again anytime.
        </p>

        <Link
          href="/sweepstakes"
          className="inline-flex items-center gap-2 px-6 py-3 border border-primary/30 text-primary rounded-lg hover:bg-primary/10 transition-colors font-tech"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO SWEEPSTAKES</span>
        </Link>
      </div>
    </div>
  );
}
