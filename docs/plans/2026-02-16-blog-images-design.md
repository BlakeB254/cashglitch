# Blog & Page Item Images Design

## Summary

Add image support to blog posts and page items, display a blog feed on the homepage, and generalize the upload endpoint.

## Scope

- Add `image_url` column to `blog_posts` and `page_items` tables
- Generalize `/api/upload` to support multiple folders
- Update admin UIs with image upload + preview
- Display images on blog listing, blog detail, category pages
- Add "Latest Posts" feed section to homepage

## Database Changes

- `blog_posts`: `ALTER TABLE ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)`
- `page_items`: `ALTER TABLE ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)`

## Type Updates

- `BlogPost` / `BlogPostRow`: add `imageUrl` / `image_url`
- `PageItem` / `PageItemRow`: add `imageUrl` / `image_url`
- Input types: add optional `imageUrl`

## Upload Endpoint

- Accept `folder` field from FormData (default: `"general"`)
- Path: `{folder}/{timestamp}-{filename}`

## API Changes

- Blog routes: include `image_url` in SELECT/INSERT/UPDATE
- Page item routes: include `image_url` in SELECT/INSERT/UPDATE

## Admin UI

- Blog editor: image upload field with preview
- Page items editor: image upload field with preview

## Frontend Display

- `/blog`: cover image on post cards
- `/blog/[slug]`: hero image at top
- `/` homepage: "Latest Posts" section (3 most recent)
- Category pages: show image on cards when available

## Approach

Reuse existing Vercel Blob upload pattern from sweepstakes. Consistent `image_url` nullable column pattern across all entities.
