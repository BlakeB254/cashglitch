"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Loader2, Play } from "lucide-react";
import type { BlogPost } from "@/lib/shared";
import { getVideoThumbnail } from "@/lib/video";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/blog");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen text-primary relative">
      {/* CRT Overlay */}
      <div className="fixed inset-0 crt-overlay z-[15] pointer-events-none" />

      <main className="relative z-10 container mx-auto px-4 py-12 pt-24 max-w-4xl">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary/60 hover:text-primary text-sm font-tech mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-matrix text-primary text-glow mb-2">
            Blog
          </h1>
          <p className="text-primary/60 font-tech">
            // SYSTEM UPDATES & GLITCH REPORTS
          </p>
        </div>

        {/* Posts */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-primary/40 font-tech">
              No posts published yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block bg-primary/10 border border-primary/25 hover:border-primary/50 transition-all group overflow-hidden hover:shadow-lg hover:shadow-primary/10"
              >
                {(post.imageUrl || post.videoUrl) && (() => {
                  const thumbnailSrc = post.imageUrl || getVideoThumbnail(post.videoUrl, null);
                  return (
                    <div className="relative w-full h-48 overflow-hidden">
                      {thumbnailSrc ? (
                        <Image src={thumbnailSrc} alt={post.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <Play className="w-12 h-12 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a1a] via-transparent to-transparent opacity-60" />
                      {post.videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-black/60 border border-primary/40 flex items-center justify-center">
                            <Play className="w-5 h-5 text-primary ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
                <div className="p-6">
                <h2 className="text-xl font-tech text-primary group-hover:text-glow mb-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-primary/70 font-tech text-sm mb-4">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-primary/50 font-tech">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Terminal decoration */}
        <div className="mt-12 text-xs text-primary/20 font-mono">
          <p>&gt; END OF TRANSMISSION...</p>
        </div>
      </main>
    </div>
  );
}
