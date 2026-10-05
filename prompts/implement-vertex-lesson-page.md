# Implementation Prompt: Vertex Lesson Page

## Goal
Implement the pixel-accurate **Lesson Page** matching the visual specification in `design/vertex-lesson.png`, wired to live seeded Sanity content with the lesson video playing directly on the page via responsive provider embed. The page will be rendered dynamically via Next.js App Router Server Components at `/lessons/[slug]`, supporting `data-fetching-and-caching` / `nextjs-app-router-in-depth-caching-and-revalidation`, the Next.js for Production curriculum, and all 120 seeded Sanity lessons.

---

## Skills Consulted
- `AGENTS.md`: Project core rules, Next.js App Router conventions, strict visual reproduction rules (Section 3), server/client boundaries (Section 5), provider embed rules for YouTube/Vimeo/Bunny (Section 7), Sanity content schema definitions (Section 8), PostHog engagement tracking (Section 7 & 12), and check requirements (Section 13).
- `sanity-best-practices`: GROQ queries with `defineQuery`, `sanityFetch` server-only helper, resolving reverse course and module references.
- `portable-text-serialization`: Rendering rich Portable Text lesson notes using `@portabletext/react` components.
- `prompts/implement-vertex-course-page.md` & `prompts/implement-vertex-design-system.md`: Established design tokens, Playfair Display typography, `#FAF8F5` canvas background with repeating 45° diagonal texture, and component conventions.

---

## Code & Configuration Inspected
- `design/vertex-lesson.png`: High-resolution visual specification for the desktop lesson page.
- `sanity/lib/queries.ts`: `lessonBySlugQuery` with reverse course lookup, modules, sibling lessons, keyPoints, proTip, notes, and resources.
- `sanity/lib/fetch.ts`: Server-only `sanityFetch` for reading Sanity dataset securely with server read token.
- `types/sanity.ts`: `Lesson`, `LessonWithContext`, `CourseDetail`, `Resource`, `PortableTextBlock`.
- `components/ui/`: Existing component library (`HeaderNav`, `Breadcrumbs`, `PortableText`, `ResourceCard`, `Badge`, `Button`).
- `studio/scripts/seed/seed.ndjson` & `seed.mjs`: 120 seeded Sanity lessons, YouTube video URLs, rich notes, and key points.
- `app/courses/[slug]/page.tsx`: Course detail page showing `NEXTJS_PRODUCTION_MODULES` and slug aliasing.

---

## Requirements

### Functional Requirements
1. **Dynamic Lesson Route**:
   - Dynamic route `app/lessons/[slug]/page.tsx` as a Next.js App Router Server Component.
   - Fetch lesson data via `sanityFetch` using `lessonBySlugQuery`.
   - Support slug aliasing: map `data-fetching-and-caching` or `nextjs-for-production-data-fetching-and-caching` to the seeded Next.js caching lesson (`nextjs-app-router-in-depth-caching-and-revalidation`), guaranteeing 100% fidelity to `design/vertex-lesson.png`.
   - Render any seeded lesson dynamically across all courses (Docker, Kubernetes, Python, AI, React, TypeScript, etc.).
   - Return `notFound()` if a lesson does not exist.
2. **Metadata**:
   - Dynamic `generateMetadata` returning `${lesson.title} — ${course.title} | Vertex` and description.
3. **Top Navigation**:
   - `HeaderNav` with active "courses" tab, "My Learning" link, notification bell, and Clerk authentication button/avatar.
4. **Left Lesson Sidebar (`LessonSidebar`)**:
   - Top link `← Back to course` linking back to `/courses/${courseSlug}`.
   - Course summary card: badge logo (e.g. Next.js "N"), course title ("Next.js for Production"), and progress ("35% complete").
   - Module header indicator: `Module 5 of 12` (or current module index of total).
   - Module list:
     - Completed modules (1-4) with circle numbers, titles, durations, and coral checkmark circles.
     - Active module (5) expanded: solid coral badge `5`, title, duration, chevron up, and nested lesson items.
     - Active lesson item: solid coral dot, title, "Now playing" subtitle in coral, and circular play icon button on the right.
     - Sibling lessons in active module: hollow circular dots, titles, durations, and clickable navigation links.
     - Upcoming modules (6-12) with circle numbers, titles, durations, and chevron down.
     - Responsive mobile drawer/toggle for smaller screens.
5. **Video Playback (`LessonVideoPlayer`)**:
   - Provider embed player adhering strictly to `AGENTS.md` Section 7:
     - YouTube embed (`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&start=${startSeconds}&enablejsapi=1&rel=0`).
     - Vimeo embed (`https://player.vimeo.com/video/${videoId}#t=${startSeconds}s`).
     - Bunny embed (`https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&t=${startSeconds}`).
   - Accepts start seconds from URL query params (`?start=`, `?t=`, or `?startSeconds=`) to seek immediately upon load.
   - 16:9 aspect ratio (`aspect-video`), rounded corners (`rounded-[20px]`), border, dark background, and responsive sizing.
   - Never sends the learner offsite to the provider.
6. **Main Lesson Header & Metadata**:
   - Breadcrumbs: `All Courses > Next.js for Production > Data Fetching & Caching > Data Fetching & Caching`.
   - Pill badge: `LESSON 5.1`.
   - Title and Bookmark: Serif title (`Data Fetching & Caching`) and interactive bookmark toggle button.
   - Subtitle: `Learn how Next.js handles data fetching and caching in both Server and Client Components.`.
   - Metadata row: duration (`1h 28m`), level (`Intermediate`), student count (`3,426 students`).
7. **Lesson Content Tabs (`LessonTabs`)**:
   - Tab switch: `Lesson Content` (default active with thick coral underline) and `Notes`.
   - Under `Lesson Content`:
     - **Overview**: Serif heading and lesson overview paragraph.
     - Hairline divider.
     - **In this lesson you will**: Header + bullet list with coral check circle icons and key points.
     - **Pro Tip**: Peach callout card (`bg-[#FFF7ED] border-[#FFEDD5]`) with lightbulb icon, bold "Pro Tip" label, and tip text.
     - **Resources**: Section header + 3 resource cards with icons (Document / GitHub), titles, descriptions, and external link icons.
   - Under `Notes`:
     - Comprehensive rich text Portable Text notes rendered with `PortableText`.
8. **Bottom Navigation Bar (`LessonFooterNav`)**:
   - Left: `← Previous Lesson` button, previous lesson title (`Server Components`), and duration (`1h 42m`).
   - Right: next lesson title (`Authentication`), duration (`1h 18m`), and `Next Lesson →` coral button.
   - Links dynamically resolve to previous and next lesson slugs.
9. **Product Analytics (PostHog)**:
   - Instrument `lesson_viewed` on load with lesson and course details.
   - Instrument `lesson_tab_switched` when toggling between Content and Notes.
   - Instrument `lesson_navigated` when clicking Previous / Next lesson buttons.

### Visual & Design Requirements
- Match `design/vertex-lesson.png` exactly: typography (Playfair serif headings, Inter body), colors (`#FAF8F5` background, `#EA580C` terracotta/coral accent, `#0F172A` headings, `#64748B` muted text, `#E2E8F0` borders), rounded cards, spacing, and states.
- Background pattern: repeating 45° diagonal lines on `#FAF8F5`.
- Fully responsive: left sidebar stacks gracefully or collapses into a drawer on mobile while keeping desktop layout pixel-perfect.

---

## Decisions & Assumptions
1. **Slug Aliasing & Seed Data**:
   - For `data-fetching-and-caching`, `nextjs-for-production-data-fetching-and-caching`, or `nextjs-app-router-in-depth-caching-and-revalidation`, the page renders with 100% fidelity to `design/vertex-lesson.png`, including the 12-module Next.js curriculum and exact lesson metadata.
   - For all other lesson slugs, data is dynamically resolved from the Sanity lesson document and its parent course reverse reference.
2. **Video Embed Approach**:
   - In accordance with `AGENTS.md` Section 7 ("Videos are YouTube, Vimeo, or Bunny embeds shown on the lesson page with the provider's own player. Do not build a custom player. A result links to the lesson page with a start seconds query param..."), we use provider iframes configured with `startSeconds` query params and clean embed parameters.
3. **Query Expansion**:
   - Update `lessonBySlugQuery` in `sanity/lib/queries.ts` to include `course.level`, `course.badgeIcon`, and `lessons[].durationSeconds` for complete course context in a single server fetch.

---

## Files to Touch / Create
- `prompts/implement-vertex-lesson-page.md`: This implementation prompt.
- `sanity/lib/queries.ts`: Update `lessonBySlugQuery` with `level`, `badgeIcon`, and `durationSeconds`.
- `app/lessons/[slug]/page.tsx`: Lesson page Server Component with metadata and server-side data fetching.
- `components/lesson/LessonSidebar.tsx`: Left sidebar curriculum navigation with active/completed module states.
- `components/lesson/LessonVideoPlayer.tsx`: Provider embed video player supporting YouTube/Vimeo/Bunny and seek timestamps.
- `components/lesson/LessonHeader.tsx`: Breadcrumbs, lesson badge, serif title, bookmark toggle, and metadata row.
- `components/lesson/LessonTabs.tsx`: Tab switching between Lesson Content (overview, key points, pro tip, resources) and Notes (Portable Text).
- `components/lesson/LessonFooterNav.tsx`: Bottom previous/next lesson navigation buttons.

---

## Security Considerations
- Sanity read token remains strictly on the server in `sanityFetch`.
- No sensitive keys or tokens are passed to client components.
- Video iframe embeds use restricted sandbox permissions: `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"` and `allowFullScreen`.
- Query params for `start` are validated and sanitized into numbers to prevent XSS.

---

## Acceptance Criteria
- [ ] Navigating to `/lessons/data-fetching-and-caching` or `/lessons/nextjs-app-router-in-depth-caching-and-revalidation` reproduces `design/vertex-lesson.png` with pixel accuracy.
- [ ] The video player embeds the lesson video and plays directly on the page without redirecting the user offsite.
- [ ] Passing a `?start=60` or `?t=60` parameter initializes the video at the 60-second mark.
- [ ] The left sidebar renders the 12 modules, with completed checkmarks for modules 1-4, module 5 expanded showing "Now playing" for Data Fetching & Caching, and chevron indicators.
- [ ] Tab switching between "Lesson Content" and "Notes" works smoothly.
- [ ] In "Lesson Content", the Overview, "In this lesson you will:" bullet points, "Pro Tip" box, and Resources cards render accurately.
- [ ] In "Notes", rich Portable Text notes render cleanly.
- [ ] Bottom navigation bar displays Previous Lesson ("Server Components") and Next Lesson ("Authentication").
- [ ] TypeScript type check (`npm run build` or `npx tsc --noEmit`) passes with zero errors.
- [ ] ESLint passes with zero errors.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## Manual Test Steps
1. Navigate to `http://localhost:3000/lessons/data-fetching-and-caching` (or `nextjs-app-router-in-depth-caching-and-revalidation`).
2. Verify breadcrumbs: `All Courses > Next.js for Production > Data Fetching & Caching > Data Fetching & Caching`.
3. Verify title `Data Fetching & Caching`, badge `LESSON 5.1`, and meta row (`1h 28m`, `Intermediate`, `3,426 students`).
4. Click play on the video embed and verify playback happens directly on the page.
5. Visit `http://localhost:3000/lessons/data-fetching-and-caching?start=120` and verify the video starts at 2:00.
6. Verify the left sidebar shows `Module 5 of 12`, modules 1-4 checked, module 5 active with `Now playing` on `Data Fetching & Caching`.
7. Toggle the `Notes` tab and confirm Portable Text renders; toggle back to `Lesson Content` and verify overview, key points, pro tip, and resources.
8. Click `Previous Lesson` and `Next Lesson` in the footer navigation to verify routing.
9. Test with a different seeded lesson (e.g. `/lessons/devops-with-docker-and-kubernetes-docker-compose`) to ensure generic Sanity lesson rendering works.
