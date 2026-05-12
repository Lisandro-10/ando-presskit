# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # ESLint via Next.js
```

No test suite is configured.

## Architecture

Single-page Next.js 14 app (App Router) deployed to Vercel. The page is a DJ presskit for the duo **ANDO**.

**Data layer — `lib/data.ts`**
All content (biography text, photo/video paths, event dates, social links, contact info) lives in a single exported `presskitData` object. Edit this file to update any site content without touching components.

**Page — `src/app/page.tsx`**
Renders sections in order: `Hero → Biography → PhotoGallery → VideoGallery → Contact → Footer`. The `Events` component exists but is commented out.

**Components — `src/components/`**
Each section is a standalone component. All use `'use client'` and Framer Motion for animations. Components read from `presskitData` directly.

**Styling**
- Tailwind with custom tokens: `ando-navy` (`#111111`), `ando-cyan` (`#00d9ff`), `ando-text`, `ando-muted`
- Fonts: `font-orbitron` (headings/default) and `font-spaceGrotesk` (body copy) — both Google Fonts loaded via `next/font`
- Grain texture overlay on Hero via `.hero-grain` CSS class in `globals.css`

**Static assets**
Photos live in `public/photos/`, videos in `public/videos/`. Next.js Image component is used for photos with avif/webp optimization enabled.
