# 🤖 Full Website Analysis Blueprint (Ankith Website)

This document is a comprehensive technical guide for recreating this high-performance, premium actor/professional portfolio using AI.

---

## 🛠️ 1. Core Tech Stack
- **Framework**: Next.js (App Router or Pages), React, TypeScript.
- **Styling**: Tailwind CSS (Custom Design Tokens), Framer Motion (Animations).
- **Backend (DB & Storage)**: Supabase (PostgreSQL, Realtime, File Storage).
- **Icons**: Lucide React.
- **Performance**: Custom `OptimizedImage` component using Next.js `Image`.

---

## 🎨 2. Design System & Aesthetics
- **Typography**:
  - `font-editorial`: Serif-style italic for a premium, editorial feel.
  - `font-display`: Sans-serif uppercase for headers and tracking.
  - `font-body`: Clean sans-serif for readability.
- **Visual Styles**:
  - **Glassmorphism**: Backdrop blur effects for navigation and overlays.
  - **Transitions**: Smooth HSL color transitions and entrance animations (30-50px Y-offset).
  - **Color Palette**: Sophisticated dark/light theme balancing.

---

## 🚀 3. Key Feature Architectures

### A. Unified Media & Article Gallery
This is the most critical feature. It allows managing both videos and external press links in one category.
- **Logic**: Use a `getVideoDetails` helper to detect YouTube/Vimeo links.
- **Behavior**: Auto-switch between video lightboxes and external redirects based on the URL.
- **Priority**: Prefer custom uploaded thumbnails over video-service defaults.

### B. Project Manager Dashboard
A clean, authenticated admin panel for CRUD operations.
- **Categories**: Filmography, Showreel, Advertisement, Media (Interview).
- **Direct Image Upload**: Integration with Supabase Storage for instant file handling.
- **Real-time Sync**: Uses custom hooks (`useProjects`) to fetch and update data instantly.

### C. Filmography Scroll & Lightbox
- **UX**: Horizontal snap-scroll for movie galleries.
- **Lightbox**: Immersive video playback using `<iframe>` embeds with autoplay parameters.

---

## 📂 4. Project Directory Structure
- `/src/components/sections`: Home sections (Filmography, Press, About, Contact).
- `/src/components/dashboard`: Admin components (ProjectManager, ProjectForm).
- `/src/hooks`: Custom React hooks for database interaction (`useProjects`).
- `/src/lib`: Database client initialization (Supabase Client).

---

## ⚙️ 5. AI Instructions for Recreation (Prompt Reference)
When recreating this site, provide the following instructions to the AI:
1.  "Build a Next.js/Tailwind portfolio using a 3-font system: Editorial Serif, Display Sans, and Body Sans."
2.  "Implement a Supabase backend for managing project categories (Film, Showreel, Ad, Media)."
3.  "Create a smart Media gallery that can distinguish between video links and press articles automatically."
4.  "Add a secure admin dashboard at `/admin` or `/dashboard` for managing images, videos, and articles."
5.  "Ensure all section transitions are smooth using Framer Motion (30px Y-offset and opacity transitions)."

---

## 📊 6. Database Schema (Supabase)
Ensure your `projects` table includes:
- `id`, `title`, `description`, `role`, `duration`, `technologies`, `category`, `video_url`, `project_url`, `image_url`, `display_order`, `streaming_url`, `streaming_provider`, `note`.

---

*This blueprint ensures the same logic and aesthetics can be consistently applied to future projects.*
