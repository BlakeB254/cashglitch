# Video Embed & Card Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add solid card backgrounds, video URL field with auto-thumbnails, and a detail modal with embedded video playback to the CashGlitch listing pages.

**Architecture:** Add a `video_url` column to the existing `page_items` table, wire it through the full stack (types → API → admin form → frontend). A pure-function video utility parses URLs and returns thumbnail/embed info. Cards get a solid background fill and become clickable to open a detail modal with an embedded video player.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS 4, Neon PostgreSQL, Radix UI

---

### Task 1: Database Migration — Add `video_url` column

**Files:**
- Modify: `src/lib/db.ts:582-608` (inside `initializePageItems()`)

**Step 1: Add the ALTER TABLE migration**

In `src/lib/db.ts`, find the `initializePageItems()` function. After the existing `ALTER TABLE page_items ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)` line (line 607), add:

```typescript
await sql`ALTER TABLE page_items ADD COLUMN IF NOT EXISTS video_url VARCHAR(500)`;
```

**Step 2: Verify — run dev server briefly to trigger migration**

```bash
cd /home/codex450/CDX-DEV-PROJECTS/cashglitch && npx next dev --port 7500 &
sleep 5 && curl -s http://localhost:7500/api/page-items?slug=npo | head -c 200
kill %1
```

Expected: JSON response with page items (no errors). The `video_url` column now exists.

**Step 3: Commit**

```bash
git add src/lib/db.ts
git commit -m "feat: add video_url column to page_items table"
```

---

### Task 2: Type Definitions — Add `videoUrl` to all PageItem types

**Files:**
- Modify: `src/lib/shared/types.ts:421-488`

**Step 1: Update PageItem interface (line ~437)**

Add after `imageUrl: string | null;`:

```typescript
videoUrl: string | null;
```

**Step 2: Update PageItemRow interface (line ~449)**

Add after `image_url: string | null;`:

```typescript
video_url: string | null;
```

**Step 3: Update CreatePageItemInput interface (line ~469)**

Add after `imageUrl?: string;`:

```typescript
videoUrl?: string;
```

**Step 4: Update UpdatePageItemInput interface (line ~486)**

Add after `imageUrl?: string;`:

```typescript
videoUrl?: string;
```

**Step 5: Commit**

```bash
git add src/lib/shared/types.ts
git commit -m "feat: add videoUrl to PageItem type definitions"
```

---

### Task 3: Video Utility — URL parser and thumbnail resolver

**Files:**
- Create: `src/lib/video.ts`

**Step 1: Create the video utility**

```typescript
export type VideoPlatform = "youtube" | "vimeo" | "facebook" | "instagram";

export interface VideoInfo {
  platform: VideoPlatform;
  videoId: string;
  thumbnailUrl: string | null;
  embedUrl: string;
}

/**
 * Parse a video URL and return platform info, thumbnail URL, and embed URL.
 * Returns null if the URL is not a recognized video platform.
 */
export function getVideoInfo(url: string): VideoInfo | null {
  if (!url) return null;

  // YouTube: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  if (ytMatch) {
    return {
      platform: "youtube",
      videoId: ytMatch[1],
      thumbnailUrl: `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`,
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
    };
  }

  // Vimeo: vimeo.com/ID, player.vimeo.com/video/ID
  const vimeoMatch = url.match(
    /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/
  );
  if (vimeoMatch) {
    return {
      platform: "vimeo",
      videoId: vimeoMatch[1],
      thumbnailUrl: null, // resolved client-side via oEmbed
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  // Facebook: facebook.com/*/videos/ID, fb.watch/ID
  const fbMatch = url.match(
    /(?:facebook\.com|fb\.watch).*(?:\/videos\/(\d+)|\/(\w+))/
  );
  if (fbMatch || url.includes("facebook.com/") && url.includes("video")) {
    return {
      platform: "facebook",
      videoId: fbMatch?.[1] || fbMatch?.[2] || "",
      thumbnailUrl: null,
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`,
    };
  }

  // Instagram: instagram.com/reel/CODE, instagram.com/p/CODE
  const igMatch = url.match(
    /instagram\.com\/(?:reel|p|tv)\/([\w-]+)/
  );
  if (igMatch) {
    return {
      platform: "instagram",
      videoId: igMatch[1],
      thumbnailUrl: null,
      embedUrl: `https://www.instagram.com/p/${igMatch[1]}/embed`,
    };
  }

  return null;
}

/**
 * Get the thumbnail URL for a video, with fallback to the item's image.
 */
export function getVideoThumbnail(
  videoUrl: string | null,
  fallbackImageUrl: string | null
): string | null {
  if (!videoUrl) return null;
  const info = getVideoInfo(videoUrl);
  if (!info) return null;
  return info.thumbnailUrl || fallbackImageUrl || null;
}
```

**Step 2: Commit**

```bash
git add src/lib/video.ts
git commit -m "feat: add video URL parser utility with platform detection"
```

---

### Task 4: API Routes — Wire videoUrl through CRUD

**Files:**
- Modify: `src/app/api/page-items/route.ts:19-37` (public, transform function)
- Modify: `src/app/api/admin/page-items/route.ts:21-40,80-134,138-188` (admin, transform + CRUD)

**Step 1: Update public API transform (`src/app/api/page-items/route.ts`)**

In the `transformPageItem` function, add after `imageUrl: row.image_url,`:

```typescript
videoUrl: row.video_url,
```

**Step 2: Update admin API transform (`src/app/api/admin/page-items/route.ts`)**

Same change in the `transformPageItem` function — add after `imageUrl: row.image_url,`:

```typescript
videoUrl: row.video_url,
```

**Step 3: Update admin POST handler**

In the destructuring of `body` (around line 90-104), add `videoUrl` to the list.

In the INSERT query, add `video_url` to the column list and `${videoUrl || null}` to the VALUES.

**Step 4: Update admin PUT handler**

In the UPDATE query (around line 154-170), add:

```sql
video_url = COALESCE(${updates.videoUrl}, video_url),
```

**Step 5: Commit**

```bash
git add src/app/api/page-items/route.ts src/app/api/admin/page-items/route.ts
git commit -m "feat: wire videoUrl through public and admin API routes"
```

---

### Task 5: Admin Form — Add Video URL input to ItemModal

**Files:**
- Modify: `src/app/(admin)/admin/pages/page.tsx:504-794` (ItemModal component)

**Step 1: Add Video URL input field**

After the Website URL input (around line 724), add a new field:

```tsx
<div>
  <label className="block text-sm font-tech text-primary/80 mb-1">
    Video URL
  </label>
  <input
    type="url"
    value={form.videoUrl || ""}
    onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
    className="w-full px-3 py-2 bg-primary/5 border border-primary/30 text-primary font-tech focus:outline-none focus:border-primary/60"
  />
  <p className="text-[10px] font-tech text-primary/20 mt-1">
    Supports YouTube, Vimeo, Facebook, Instagram
  </p>
</div>
```

**Step 2: Commit**

```bash
git add src/app/(admin)/admin/pages/page.tsx
git commit -m "feat: add video URL field to admin page item editor"
```

---

### Task 6: ItemDetailModal — New detail overlay component

**Files:**
- Create: `src/components/shared/ItemDetailModal.tsx`
- Modify: `src/components/shared/index.ts`

**Step 1: Create the modal component**

```tsx
"use client";

import { useEffect } from "react";
import { X, ExternalLink, MapPin, Clock, DollarSign, Calendar, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PageItem } from "@/lib/shared";
import { getVideoInfo } from "@/lib/video";
import type { ColorScheme } from "./PageHero";

const badgeColorMap: Record<ColorScheme, string> = {
  rose: "bg-rose-100 text-rose-800",
  emerald: "bg-emerald-100 text-emerald-800",
  sky: "bg-sky-100 text-sky-800",
  amber: "bg-amber-100 text-amber-800",
  purple: "bg-purple-100 text-purple-800",
  blue: "bg-blue-100 text-blue-800",
  orange: "bg-orange-100 text-orange-800",
  teal: "bg-teal-100 text-teal-800",
};

interface ItemDetailModalProps {
  item: PageItem;
  colorScheme?: ColorScheme;
  onClose: () => void;
  websiteLabel?: string;
}

export function ItemDetailModal({
  item,
  colorScheme = "purple",
  onClose,
  websiteLabel = "Visit Website",
}: ItemDetailModalProps) {
  const videoInfo = item.videoUrl ? getVideoInfo(item.videoUrl) : null;

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#0f0a1a] border border-primary/30 w-full max-w-2xl my-8 rounded-lg overflow-hidden">
        {/* Close button */}
        <div className="flex justify-end p-3">
          <button
            onClick={onClose}
            className="p-1 text-primary/60 hover:text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video embed */}
        {videoInfo && (
          <div className="relative w-full aspect-video bg-black">
            {videoInfo.platform === "facebook" ? (
              <iframe
                src={videoInfo.embedUrl}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
              />
            ) : videoInfo.platform === "instagram" ? (
              <iframe
                src={videoInfo.embedUrl}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
              />
            ) : (
              <iframe
                src={videoInfo.embedUrl}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {item.isFeatured && (
              <Badge variant="secondary">Featured</Badge>
            )}
            {item.category && (
              <Badge className={badgeColorMap[colorScheme]}>
                {item.category}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold">{item.title}</h2>

          {/* Description */}
          {item.description && (
            <p className="text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {item.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {item.location}
              </span>
            )}
            {item.deadline && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {item.deadline}
              </span>
            )}
            {item.value && (
              <span className="flex items-center gap-1 font-medium text-primary">
                {item.value.startsWith("$") || item.value.startsWith("Up to") ? (
                  <DollarSign className="h-4 w-4" />
                ) : (
                  <Calendar className="h-4 w-4" />
                )}
                {item.value}
              </span>
            )}
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Website link */}
          {item.website && (
            <Button variant="outline" asChild className="mt-2">
              <a href={item.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                {websiteLabel}
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Export from shared/index.ts**

Add to `src/components/shared/index.ts`:

```typescript
export { ItemDetailModal } from "./ItemDetailModal";
```

**Step 3: Commit**

```bash
git add src/components/shared/ItemDetailModal.tsx src/components/shared/index.ts
git commit -m "feat: add ItemDetailModal component for card detail overlay"
```

---

### Task 7: ContentCard — Solid fill, video thumbnail, click handler

**Files:**
- Modify: `src/components/shared/ContentCard.tsx`

**Step 1: Add imports and video thumbnail logic**

Add to the top imports:

```typescript
import { Play } from "lucide-react";
import { getVideoInfo } from "@/lib/video";
```

Add `onClick` to the `ContentCardProps` interface:

```typescript
onClick?: () => void;
```

**Step 2: Update the Card component**

Replace the opening `<Card` tag (lines 64-69) with:

```tsx
<Card
  className={`overflow-hidden transition-shadow hover:shadow-lg bg-[#0f0a1a] ${
    isFeatured ? `border-2 ${borderColorMap[colorScheme]}` : ""
  } ${onClick ? "cursor-pointer" : ""}`}
  onClick={onClick}
>
```

**Step 3: Update the image section to show video thumbnail**

Replace the image block (lines 70-74) with:

```tsx
{(() => {
  const videoInfo = item.videoUrl ? getVideoInfo(item.videoUrl) : null;
  const thumbnailUrl = videoInfo?.thumbnailUrl || item.imageUrl;
  const hasVideo = !!item.videoUrl;

  if (!thumbnailUrl && !hasVideo) return null;

  return (
    <div className="relative w-full h-40 overflow-hidden">
      {thumbnailUrl ? (
        <Image src={thumbnailUrl} alt={item.title} fill className="object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
      )}
      {hasVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
      )}
    </div>
  );
})()}
```

**Step 4: Commit**

```bash
git add src/components/shared/ContentCard.tsx
git commit -m "feat: add solid card fill, video thumbnail with play overlay, click handler"
```

---

### Task 8: Listing Pages — Add modal state and click handler

**Files:**
- Modify: `src/app/(site)/npo/page.tsx`
- Modify: `src/app/(site)/free-travel/page.tsx`
- Modify: `src/app/(site)/jobs/page.tsx`

Each page gets the same pattern. Here's NPO as the example (apply identically to the other two, changing the `colorScheme` and `websiteLabel` props):

**Step 1: Add imports and state**

Add to existing imports:

```typescript
import { useState } from "react";
import type { PageItem } from "@/lib/shared";
import { ItemDetailModal } from "@/components/shared";
```

Inside the component, after the `usePageData` hook, add:

```typescript
const [selectedItem, setSelectedItem] = useState<PageItem | null>(null);
```

**Step 2: Add `onClick` to each ContentCard**

Add `onClick={() => setSelectedItem(item)}` to every `<ContentCard>` instance.

For NPO (colorScheme="rose"):
```tsx
<ContentCard
  key={org.id}
  item={org}
  variant="featured"
  colorScheme="rose"
  showCategory={false}
  onClick={() => setSelectedItem(org)}
/>
```

**Step 3: Add the modal before the closing `</div>`**

```tsx
{selectedItem && (
  <ItemDetailModal
    item={selectedItem}
    colorScheme="rose"
    onClose={() => setSelectedItem(null)}
  />
)}
```

**Step 4: Repeat for free-travel (colorScheme="sky") and jobs (colorScheme="emerald")**

Use the same pattern, matching each page's colorScheme and websiteLabel props.

**Step 5: Commit**

```bash
git add src/app/(site)/npo/page.tsx src/app/(site)/free-travel/page.tsx src/app/(site)/jobs/page.tsx
git commit -m "feat: add detail modal to NPO, Free Travel, and Jobs listing pages"
```

---

### Task 9: Verify — Manual smoke test

**Step 1: Start the dev server**

```bash
cd /home/codex450/CDX-DEV-PROJECTS/cashglitch && npx next dev --port 7500
```

**Step 2: Verify the following in the browser**

1. Visit `/npo` — cards should have solid dark background (`#0f0a1a`)
2. Click any card — detail modal should appear with full info
3. Press Escape or click outside modal — it should close
4. Visit admin `/admin/pages` — edit an item, verify "Video URL" field exists
5. Add a YouTube URL (e.g. `https://www.youtube.com/watch?v=dQw4w9WgXcQ`) to an item
6. Save, revisit the public page — card should show YouTube thumbnail with play icon
7. Click the card — modal should show embedded YouTube video

**Step 3: Build check**

```bash
npx next build
```

Expected: Build succeeds with no TypeScript errors.

**Step 4: Commit any fixes**

If fixes were needed, commit them as a separate commit.

---

### Task 10: Final commit and deploy

**Step 1: Create final commit if not already done**

Ensure all changes are committed.

**Step 2: Deploy to Vercel**

```bash
git push origin main
```

Or use Vercel CLI if configured:

```bash
npx vercel --prod
```
