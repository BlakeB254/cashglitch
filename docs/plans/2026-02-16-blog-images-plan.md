# Blog & Page Item Images Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add image support to blog posts and page items, add a blog feed to the homepage, and display images on all frontend pages.

**Architecture:** Add nullable `image_url` column to `blog_posts` and `page_items` tables. Generalize upload endpoint to accept folder parameter. Update admin UIs with image upload (reusing sweepstakes pattern). Update frontend pages to render images.

**Tech Stack:** Next.js 16, React 19, Neon Postgres, Vercel Blob, TypeScript, Tailwind CSS

---

### Task 1: Database schema + Types

**Files:**
- Modify: `src/lib/db.ts` (initializeBlogPosts, initializePageItems)
- Modify: `src/lib/shared/types.ts`

**Step 1: Add image_url column migration to db.ts**

In `initializeBlogPosts()`, after the CREATE TABLE, add:
```typescript
await sql`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)`;
```

In `initializePageItems()`, after the CREATE TABLE, add:
```typescript
await sql`ALTER TABLE page_items ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)`;
```

**Step 2: Update types in types.ts**

Add `imageUrl: string | null` to `BlogPost` interface (after `authorEmail`).
Add `image_url: string | null` to `BlogPostRow` interface (after `author_email`).
Add `imageUrl?: string` to `CreateBlogPostInput` and `UpdateBlogPostInput`.

Add `imageUrl: string | null` to `PageItem` interface (after `website`).
Add `image_url: string | null` to `PageItemRow` interface (after `website`).
Add `imageUrl?: string` to `CreatePageItemInput` and `UpdatePageItemInput`.

**Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: No type errors

**Step 4: Commit**

```bash
git add src/lib/db.ts src/lib/shared/types.ts
git commit -m "feat: add image_url column to blog_posts and page_items"
```

---

### Task 2: Generalize upload endpoint

**Files:**
- Modify: `src/app/api/upload/route.ts`

**Step 1: Accept folder parameter**

Change the upload path from hardcoded `sweepstakes/` to use a `folder` field from FormData:
```typescript
const folder = (formData.get("folder") as string) || "general";
// Sanitize folder name
const safeFolder = folder.replace(/[^a-z0-9-]/gi, "").slice(0, 50) || "general";
const blob = await put(`${safeFolder}/${Date.now()}-${file.name}`, file, {
  access: "public",
});
```

**Step 2: Verify**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/app/api/upload/route.ts
git commit -m "feat: generalize upload endpoint with folder parameter"
```

---

### Task 3: Update Blog API routes

**Files:**
- Modify: `src/app/api/blog/route.ts`
- Modify: `src/app/api/blog/[slug]/route.ts`
- Modify: `src/app/api/admin/blog/route.ts`

**Step 1: Update transformPost in all 3 files**

Add to the return object:
```typescript
imageUrl: row.image_url,
```

**Step 2: Update admin blog POST to accept imageUrl**

In `src/app/api/admin/blog/route.ts` POST handler, destructure `imageUrl` from body and include in INSERT:
```sql
INSERT INTO blog_posts (slug, title, content, excerpt, published, author_email, image_url)
VALUES (${slug}, ${title}, ${content}, ${excerpt || null}, ${published ?? false}, ${session.email}, ${imageUrl || null})
```

**Step 3: Update admin blog PUT to accept imageUrl**

Add `imageUrl` to destructured body and include in UPDATE:
```sql
image_url = COALESCE(${imageUrl}, image_url),
```

**Step 4: Verify**

Run: `npx tsc --noEmit`

**Step 5: Commit**

```bash
git add src/app/api/blog/route.ts src/app/api/blog/\[slug\]/route.ts src/app/api/admin/blog/route.ts
git commit -m "feat: include image_url in blog API routes"
```

---

### Task 4: Update Page Items API routes

**Files:**
- Modify: `src/app/api/page-items/route.ts`
- Modify: `src/app/api/admin/page-items/route.ts`

**Step 1: Update transformPageItem in both files**

Add to return object:
```typescript
imageUrl: row.image_url,
```

**Step 2: Update admin page-items POST**

Destructure `imageUrl` from body, include in INSERT:
```sql
INSERT INTO page_items (..., image_url) VALUES (..., ${imageUrl || null})
```

**Step 3: Update admin page-items PUT**

Add to UPDATE SET clause:
```sql
image_url = COALESCE(${updates.imageUrl}, image_url),
```

**Step 4: Verify**

Run: `npx tsc --noEmit`

**Step 5: Commit**

```bash
git add src/app/api/page-items/route.ts src/app/api/admin/page-items/route.ts
git commit -m "feat: include image_url in page items API routes"
```

---

### Task 5: Admin blog editor — image upload UI

**Files:**
- Modify: `src/app/(admin)/admin/blog/page.tsx`

**Step 1: Add image upload to blog editor modal**

Reuse the exact same upload pattern from `src/app/(admin)/admin/sweepstakes/page.tsx` SweepstakeModal:
- Add `formImageUrl` state
- Add `isUploading`, `uploadError` states
- Add `fileInputRef`
- Add `handleImageUpload`, `handleDrop`, `handleFileSelect` functions
- Add image upload section in the editor modal (between Excerpt and Content fields)
- Include `imageUrl` in the save payload

Use folder "blog" for uploads:
```typescript
formData.append("folder", "blog");
```

**Step 2: Verify**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/app/\(admin\)/admin/blog/page.tsx
git commit -m "feat: add image upload to admin blog editor"
```

---

### Task 6: Admin page items — image upload UI

**Files:**
- Modify: `src/app/(admin)/admin/pages/page.tsx`

**Step 1: Add image upload to page items editor**

Check how the admin pages editor works, add the same upload pattern. Use folder "pages" for uploads.

**Step 2: Verify**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/app/\(admin\)/admin/pages/page.tsx
git commit -m "feat: add image upload to admin page items editor"
```

---

### Task 7: Blog listing page — display cover images

**Files:**
- Modify: `src/app/blog/page.tsx`

**Step 1: Add Image import and display on cards**

Add `import Image from "next/image"` and show cover image on each post card when `post.imageUrl` exists:
```tsx
{post.imageUrl && (
  <div className="relative w-full h-48 overflow-hidden mb-4">
    <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
  </div>
)}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/app/blog/page.tsx
git commit -m "feat: display cover images on blog listing"
```

---

### Task 8: Blog detail page — display hero image

**Files:**
- Modify: `src/app/blog/[slug]/page.tsx`

**Step 1: Add hero image above post content**

Add `import Image from "next/image"` and show hero image before the title:
```tsx
{post.imageUrl && (
  <div className="relative w-full h-64 md:h-80 overflow-hidden mb-8 border border-primary/20">
    <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
  </div>
)}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/app/blog/\[slug\]/page.tsx
git commit -m "feat: display hero image on blog detail page"
```

---

### Task 9: Homepage — add blog feed section

**Files:**
- Modify: `src/app/(site)/page.tsx`

**Step 1: Fetch blog posts alongside existing data**

Add `BlogPost` to imports, add `blogPosts` state, fetch from `/api/blog` in the existing Promise.all.

**Step 2: Add blog feed section**

After the sweepstakes feed section and before the donate section, add a "Latest Posts" section:
- Show up to 3 most recent posts
- Each card shows image (if available), title, excerpt, date
- Link each card to `/blog/{slug}`
- Use same card-matrix styling as sweepstakes cards

**Step 3: Verify**

Run: `npx tsc --noEmit`

**Step 4: Commit**

```bash
git add src/app/\(site\)/page.tsx
git commit -m "feat: add blog feed section to homepage"
```

---

### Task 10: Category pages — display images on page item cards

**Files:**
- Modify: `src/app/(site)/npo/page.tsx`
- Modify: `src/app/(site)/free-travel/page.tsx`
- Modify: `src/app/(site)/jobs/page.tsx`
- Modify: `src/app/(site)/partner/page.tsx`
- Modify: `src/app/(site)/donate-computer/page.tsx`
- Modify: `src/app/(site)/get-computer/page.tsx`

**Step 1: Add image display to each category page**

For each page, add `import Image from "next/image"` and show image on cards when `item.imageUrl` exists. Add above CardTitle:
```tsx
{item.imageUrl && (
  <div className="relative w-full h-40 overflow-hidden">
    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
  </div>
)}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/app/\(site\)/npo/page.tsx src/app/\(site\)/free-travel/page.tsx src/app/\(site\)/jobs/page.tsx src/app/\(site\)/partner/page.tsx src/app/\(site\)/donate-computer/page.tsx src/app/\(site\)/get-computer/page.tsx
git commit -m "feat: display images on category page item cards"
```

---

### Task 11: Build verification and deploy

**Step 1: Full build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 2: Commit any remaining changes**

```bash
git add -A && git commit -m "chore: build verification"
```

**Step 3: Deploy to production**

Push to main or use Vercel deploy command.
