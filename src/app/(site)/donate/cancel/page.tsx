"use client";

import Link from "next/link";
import { ArrowLeft, XCircle } from "lucide-react";

export default function DonateCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card-matrix p-8 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <XCircle className="w-12 h-12 text-primary/60" />
          </div>
        </div>

        <h1 className="text-2xl font-tech text-primary mb-4">
          DONATION CANCELLED
        </h1>

        <p className="text-primary/60 font-mono mb-6">
          // NO WORRIES, THE GLITCH CONTINUES
        </p>

        <p className="text-sm text-primary/40 mb-8">
          Your donation was not processed. If you experienced any issues, please
          try again or contact us for assistance.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors font-tech"
          >
            <span>TRY AGAIN</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-primary/30 text-primary rounded-lg hover:bg-primary/10 transition-colors font-tech"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO BASE</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
