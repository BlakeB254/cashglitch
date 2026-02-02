"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import DOMPurify from "dompurify";
import type { BlogPost } from "@/lib/shared";

// Simple markdown-to-HTML converter for basic formatting
function renderMarkdown(content: string): string {
  const html = content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-tech text-primary mt-6 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-tech text-primary mt-8 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-matrix text-primary text-glow mt-8 mb-4">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong class="italic">$1</strong>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Links
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/gim,
      '<a href="$2" class="text-primary underline hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    // Code blocks
    .replace(
      /```([\s\S]*?)```/gim,
      '<pre class="bg-primary/10 border border-primary/20 p-4 overflow-x-auto my-4 font-mono text-sm"><code>$1</code></pre>'
    )
    // Inline code
    .replace(/`([^`]+)`/gim, '<code class="bg-primary/10 px-1 py-0.5 font-mono text-sm">$1</code>')
    // Lists
    .replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/(<li.*<\/li>\n)+/gim, '<ul class="list-disc my-4 space-y-1">$&</ul>')
    // Blockquotes
    .replace(
      /^>\s*(.*$)/gim,
      '<blockquote class="border-l-4 border-primary/40 pl-4 my-4 text-primary/80 italic">$1</blockquote>'
    )
    // Line breaks and paragraphs
    .replace(/\n\n/gim, '</p><p class="my-4">')
    .replace(/\n/gim, '<br />');

  // Sanitize the HTML output to prevent XSS
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'br', 'strong', 'em', 'a', 'pre', 'code', 'ul', 'li', 'blockquote'],
    ALLOWED_ATTR: ['href', 'class', 'target', 'rel'],
  });
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Post not found");
          } else {
            setError("Failed to load post");
          }
          return;
        }
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError("Failed to load post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-primary">
        <h1 className="text-2xl font-matrix text-glow mb-4">
          {error || "Post not found"}
        </h1>
        <Link
          href="/blog"
          className="text-primary/60 hover:text-primary font-tech transition-colors"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  const sanitizedContent = renderMarkdown(post.content);

  return (
    <div className="min-h-screen text-primary relative">
      {/* CRT Overlay */}
      <div className="fixed inset-0 crt-overlay z-[15] pointer-events-none" />

      <main className="relative z-10 container mx-auto px-4 py-12 pt-24 max-w-3xl">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary/60 hover:text-primary text-sm font-tech mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Post Header */}
        <article>
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-matrix text-primary text-glow mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-primary/40 font-tech">
              <Calendar className="w-4 h-4" />
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </header>

          {/* Post Content - sanitized with DOMPurify */}
          <div
            className="text-primary/80 font-tech leading-relaxed prose-invert"
            dangerouslySetInnerHTML={{
              __html: `<p class="my-4">${sanitizedContent}</p>`,
            }}
          />
        </article>

        {/* Terminal decoration */}
        <div className="mt-12 pt-8 border-t border-primary/20 text-xs text-primary/20 font-mono">
          <p>&gt; END OF TRANSMISSION...</p>
        </div>
      </main>
    </div>
  );
}
