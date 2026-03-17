"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Loader2, Trophy, Ticket, Clock, Calendar, Play } from "lucide-react";
import { DynamicIcon } from "@/components/DynamicIcon";
import { DonateButton } from "@/components/DonateButton";
import type { Category, SiteSettings, Sweepstake, BlogPost } from "@/lib/shared";
import { getVideoThumbnail } from "@/lib/video";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [sweepstakes, setSweepstakes] = useState<Sweepstake[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, settingsRes, sweepRes, blogRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/site-settings"),
          fetch("/api/sweepstakes"),
          fetch("/api/blog"),
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

        if (blogRes.ok) {
          const blogData = await blogRes.json();
          setBlogPosts(blogData);
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
                  onClick={() => {
                    fetch("/api/categories/track", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: category.id }),
                    }).catch(() => {});
                  }}
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

        {/* Latest Posts */}
        {blogPosts.length > 0 && (
          <div className="w-full max-w-4xl mb-12">
            <h2 className="text-center text-lg text-primary/60 mb-6 font-tech tracking-wider">
              // LATEST POSTS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {blogPosts.slice(0, 3).map((post) => {
                const thumbnail = post.imageUrl || getVideoThumbnail(post.videoUrl, null);
                return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="card-matrix p-0 overflow-hidden group"
                >
                  {(thumbnail || post.videoUrl) && (
                    <div className="relative w-full h-32 overflow-hidden">
                      {thumbnail ? (
                        <Image
                          src={thumbnail}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <Play className="w-10 h-10 text-primary/40" />
                        </div>
                      )}
                      {post.videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-black/60 border border-primary/40 flex items-center justify-center">
                            <Play className="w-4 h-4 text-primary ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-sm font-tech text-primary mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-xs text-primary/60 mb-2 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-[10px] text-primary/40 font-tech">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
                );
              })}
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
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex items-center gap-6">
              {settings?.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors text-sm font-tech tracking-wider"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  TWITTER
                </a>
              )}
              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors text-sm font-tech tracking-wider"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  INSTAGRAM
                </a>
              )}
            </div>
            <a
              href={settings?.twitterUrl || settings?.instagramUrl || "#"}
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
