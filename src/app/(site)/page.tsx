"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Loader2, Trophy, Ticket, Clock } from "lucide-react";
import { DynamicIcon } from "@/components/DynamicIcon";
import { DonateButton } from "@/components/DonateButton";
import type { Category, SiteSettings, Sweepstake } from "@/lib/shared";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [sweepstakes, setSweepstakes] = useState<Sweepstake[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, settingsRes, sweepRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/site-settings"),
          fetch("/api/sweepstakes"),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(settingsData);
        }

        if (sweepRes.ok) {
          const sweepData = await sweepRes.json();
          setSweepstakes(sweepData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const tagline = settings?.siteTagline || "The only Glitch is how much help you'll find";

  return (
    <div className="min-h-screen text-primary relative overflow-x-hidden">
      {/* CRT Overlay */}
      <div className="fixed inset-0 crt-overlay z-[15] pointer-events-none" />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center pt-20">
        {/* Logo Section */}
        <div className="mb-12 text-center w-full flex flex-col items-center">
          {/* Glitchy Logo */}
          <div className="relative group cursor-pointer w-full max-w-xs mx-auto h-48 md:h-56 flex items-center justify-center mt-8">
            <div className="relative w-full h-full flex items-center justify-center glitch-image-container">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl rounded-full opacity-30 animate-pulse" />
              {/* Main logo */}
              <Image
                alt="Cash Glitch"
                className="w-auto h-full max-h-full object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.6)] glitch-main"
                src="/images/logo-transparent.png"
                width={400}
                height={400}
                priority
              />
              {/* Pink glitch layer */}
              <Image
                alt=""
                className="w-auto h-full max-h-full object-contain absolute inset-0 glitch-red"
                src="/images/logo-transparent.png"
                width={400}
                height={400}
              />
              {/* Cyan glitch layer */}
              <Image
                alt=""
                className="w-auto h-full max-h-full object-contain absolute inset-0 glitch-blue"
                src="/images/logo-transparent.png"
                width={400}
                height={400}
              />
            </div>
          </div>

          {/* Tagline */}
          <p className="mt-8 text-xl md:text-2xl text-primary/80 tracking-widest font-matrix animate-pulse">
            {tagline}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="w-full max-w-4xl mb-12">
          <h2 className="text-center text-lg text-primary/60 mb-6 font-tech tracking-wider">
            // ACCESS POINTS
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={category.href}
                  className="card-matrix p-4 flex flex-col items-center text-center group"
                >
                  <DynamicIcon
                    name={category.icon}
                    className="w-8 h-8 mb-3 text-primary/60 group-hover:text-primary transition-colors"
                  />
                  <h3 className="text-sm font-tech text-primary mb-1">
                    {category.title}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-primary/40 hidden md:block">
                      {category.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sweepstakes Feed */}
        {sweepstakes.length > 0 && (
          <div className="w-full max-w-4xl mb-12">
            <h2 className="text-center text-lg text-primary/60 mb-6 font-tech tracking-wider">
              // ACTIVE SWEEPSTAKES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sweepstakes.map((s) => (
                <Link
                  key={s.id}
                  href="/sweepstakes"
                  className="card-matrix p-0 overflow-hidden group"
                >
                  {s.imageUrl && (
                    <div className="relative w-full h-32 overflow-hidden">
                      <Image
                        src={s.imageUrl}
                        alt={s.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <h3 className="text-sm font-tech text-primary truncate">
                        {s.title}
                      </h3>
                    </div>
                    {s.prizeDescription && (
                      <p className="text-xs text-primary/60 mb-2 truncate">
                        {s.prizeDescription}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-[10px] text-primary/40 font-tech">
                      <span className="flex items-center gap-1">
                        <Ticket className="w-3 h-3" />
                        ${(s.ticketPriceCents / 100).toFixed(2)}/ticket
                      </span>
                      {s.drawDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(s.drawDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Donate Section */}
        <div className="w-full max-w-md mb-12">
          <DonateButton variant="full" />
        </div>

        {/* Terminal Footer */}
        <div className="w-full max-w-4xl text-xs md:text-sm text-primary/40 font-mono">
          <p>&gt; SYSTEM STATUS: OPERATIONAL</p>
          <p>&gt; ABUNDANCE MATRIX: ACTIVE</p>
          <p>&gt; RESOURCE GLITCH DETECTED IN SECTOR 7G</p>
          <div className="mt-6 flex justify-center">
            <a
              href={settings?.twitterUrl || "https://twitter.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="glitch-text-link inline-flex items-center gap-2 text-primary hover:text-white transition-colors text-lg font-matrix tracking-wider"
            >
              <span className="glitch-text" data-text="JOIN THE MOVEMENT">
                JOIN THE MOVEMENT
              </span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-4 text-center border-t border-primary/20 pt-4">
            © 2025 CASH GLITCH. TAKE THE ABUNDANCE PILL.
          </p>
        </div>
      </main>
    </div>
  );
}
