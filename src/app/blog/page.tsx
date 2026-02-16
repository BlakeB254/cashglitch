"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import type { BlogPost } from "@/lib/shared";

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
                className="block bg-primary/5 border border-primary/20 hover:border-primary/40 transition-all group overflow-hidden"
              >
                {post.imageUrl && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-6">
                <h2 className="text-xl font-tech text-primary group-hover:text-glow mb-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-primary/60 font-tech text-sm mb-4">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-primary/40 font-tech">
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
