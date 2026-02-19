"use client";

import { useState, useEffect } from "react";
import type { PageContent, PageItem } from "@/lib/shared";

interface UsePageDataReturn {
  pageContent: PageContent | null;
  items: PageItem[];
  featuredItems: PageItem[];
  regularItems: PageItem[];
  loading: boolean;
  error: string | null;
}

export function usePageData(slug: string): UsePageDataReturn {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [items, setItems] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [contentRes, itemsRes] = await Promise.all([
          fetch(`/api/page-content?slug=${slug}`),
          fetch(`/api/page-items?slug=${slug}`),
        ]);
        if (contentRes.ok) setPageContent(await contentRes.json());
        if (itemsRes.ok) setItems(await itemsRes.json());
      } catch (err) {
        console.error("Failed to load page data:", err);
        setError("Failed to load page data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  const featuredItems = items.filter((item) => item.isFeatured);
  const regularItems = items.filter((item) => !item.isFeatured);

  return { pageContent, items, featuredItems, regularItems, loading, error };
}
