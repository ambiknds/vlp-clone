# Implementation Prompt: Vertex Course Detail Page

## Goal
Implement the pixel-accurate **Course Detail Page** according to the visual specification in `design/vertex-course.png`, wired to live seeded Sanity content. The page is rendered dynamically via Next.js App Router Server Components at `/courses/[slug]`, supporting `nextjs-for-production`, `nextjs-app-router-in-depth`, and all other seeded Sanity courses.

---

## Skills Consulted
- `AGENTS.md`: Project core rules, Next.js App Router conventions, strict visual reproduction rules, server/client boundaries, private dataset token server-side only.
- `sanity-best-practices`: GROQ queries with `defineQuery`, `sanityFetch` server-only helper, resolving module and lesson references, image building with `@sanity/image-url`.
- `prompts/implement-vertex-homepage.md` & `prompts/implement-vertex-design-system.md`: Established design tokens, Playfair Display serif typography, warm color palette, and component conventions.

---

## Code & Configuration Inspected
- `design/vertex-course.png`: High-resolution visual specification for the course detail page (desktop view).
- `sanity/lib/queries.ts`: `courseBySlugQuery` with modules, resolved lessons, instructor, category, and learning outcomes.
- `sanity/lib/fetch.ts`: Server-only `sanityFetch` for fetching private Sanity dataset securely.
- `sanity/lib/image.ts`: `urlFor` image URL builder for Sanity image assets.
- `components/ui/`: Existing component library (`HeaderNav`, `Breadcrumbs`, `VertexLogo`).
- `components/home/SteppedColumnsGraphic.tsx`: Reusable bottom graphic for atmospheric warm 3D stepped columns.
- `studio/scripts/seed/seed.ndjson` & `seed.mjs`: Seeded Sanity courses, modules, lessons, and learning outcomes.
- `types/sanity.ts`: TypeScript definitions for courses, modules, lessons, outcomes, and instructors.

---

## Requirements

### Functional Requirements
1. **Dynamic Course Resolution**:
   - Dynamic route `app/courses/[slug]/page.tsx` as a Server Component.
   - Support slug `nextjs-for-production` (matching the design mockup) mapped to the Sanity seeded course `nextjs-app-router-in-depth` (and support `nextjs-app-router-in-depth` directly).
   - Render any other course document in the Sanity dataset (e.g. `typescript-for-application-developers`, `devops-with-docker-and-kubernetes`, `python-for-data-work`, `react-performance-engineering`, `system-design-foundations`, `retrieval-augmented-generation-from-scratch`).
   - Call `notFound()` if a course does not exist in Sanity.
2. **Metadata**:
   - `generateMetadata` exports proper title and description tags dynamically from the resolved course.
3. **Navigation & Breadcrumbs**:
   - Top `HeaderNav` with active "Courses" tab, "My Learning" link, notification bell, and Clerk authentication button/avatar.
   - Breadcrumbs showing `All Courses > [Course Title]`.
4. **Hero Section**:
   - Course cover card (Next.js metallic bevel N logo for Next.js course; Sanity cover image for other courses).
   - `POPULAR` badge for popular courses.
   - Serif course title and summary text.
   - Metadata row: Level, Duration, Module count, Student count.
   - Actions: Primary "Continue Learning →" linking to the first lesson, and Secondary "Bookmark" toggle button.
5. **What You'll Learn**:
   - Contained card with Playfair Display serif heading "What you'll learn".
   - 2x2 grid of learning outcome cards with custom terracotta outline icons (Layers, Database/Cylinder, Speedometer/Gauge, Cloud) and descriptive text.
6. **Course Content Modules Accordion**:
   - Header with module count and total duration (`12 modules • 18h 24m`).
   - List of module cards with circled indices (`1`, `2`, `3`...), module titles, summaries, durations, and chevron expand/collapse icons.
   - Interactive accordion allowing expanding individual modules to view lesson items with durations, free preview badges, and links to `/lessons/[slug]`.
   - "Show all 12 modules ∨" toggle button allowing users to expand beyond the initial 6 modules to reveal all 12 modules.
7. **Sticky Bottom Progress Bar**:
   - Pinned floating card at viewport bottom showing "Your Progress", "35% complete", horizontal progress track, and "Continue Learning →" CTA.
8. **Atmospheric Background**:
   - `#FAF8F5` warm ivory background with repeating 45° diagonal subtle stripe texture.
   - 3D stepped peach/coral columns graphic placed at the bottom.

### Visual & Design Requirements
- Match `design/vertex-course.png` exactly: typography, colors, spacing, card borders, radii (`rounded-[16px]`, `rounded-[18px]`, `rounded-[24px]`), drop shadows, and subtle gradients.
- Responsive design down to mobile viewports (stacking hero columns, responsive breadcrumbs, fluid grids).

---

## Decisions & Assumptions
1. **Slug Aliasing & Seed Content**:
   - In Sanity, the Next.js course was seeded with slug `nextjs-app-router-in-depth`, but the UI mockup explicitly displays "Next.js for Production" with 12 modules and 18h 24m duration.
   - For slug `nextjs-for-production` or `nextjs-app-router-in-depth`, we render with 100% visual fidelity to `design/vertex-course.png`, merging the 12 production modules with the lessons from Sanity.
   - For any other course in the dataset, data is rendered dynamically directly from the Sanity document.
2. **Icons in What You'll Learn**:
   - Use Lucide icons (`Layers`, `Database`, `Gauge`, `Cloud`) styled with terracotta strokes (`#D96B43`) inside rounded peach badges (`#FFF7ED` with `#FFEDD5` border) to match the visual spec.
3. **Module Accordion**:
   - Default state shows the first 6 modules with the "Show all 12 modules ∨" button. Clicking expands the full list of 12 modules. Each module can be independently expanded/collapsed to show lessons.
4. **Server vs. Client Boundaries**:
   - Server Component (`page.tsx`) fetches from Sanity with server-side read token.
   - Interactive components (`CourseModulesList`, `CourseHeroActions`, `StickyCourseProgress`, `HeaderNav`) use `"use client"` directives.

---

## Files to Touch / Create
- `prompts/implement-vertex-course-page.md`: This implementation prompt.
- `app/courses/[slug]/page.tsx`: Course detail page server component.
- `components/course/CourseHero.tsx`: Course hero with cover graphic, metadata, and actions.
- `components/course/CourseHeroActions.tsx`: Interactive CTAs (Continue Learning link and Bookmark button).
- `components/course/WhatYouWillLearn.tsx`: 2x2 Learning outcomes card grid.
- `components/course/CourseModulesList.tsx`: Interactive curriculum accordion and module expand/collapse.
- `components/course/StickyCourseProgress.tsx`: Pinned bottom course progress bar.

---

## Security Considerations
- Read token `SANITY_API_READ_TOKEN` stays strictly server-side in `sanityFetch`. No private token is exposed to the browser.
- Clerk authentication follows `@clerk/nextjs` middleware and client components without exposing secret keys.
- User input via route params is safely sanitized and typed via Next.js standard params.

---

## Acceptance Criteria
- [ ] Navigating to `/courses/nextjs-for-production` displays the exact course detail page matching `design/vertex-course.png`.
- [ ] Navigating to `/courses/nextjs-app-router-in-depth` also renders the course properly.
- [ ] Navigating to another seeded course (e.g. `/courses/typescript-for-application-developers`) dynamically renders its Sanity data.
- [ ] Non-existent course slug triggers Next.js `notFound()`.
- [ ] Hero section features cover card (Next.js metallic bevel N), "POPULAR" badge, serif title, summary, 4 stats row, and CTA buttons.
- [ ] "What you'll learn" displays 2x2 grid with peach icon containers and copper outline icons.
- [ ] "Course Content" displays 12 modules, durations, circled numbers, initial 6 visible, and "Show all 12 modules" toggle.
- [ ] Modules can be expanded to reveal lessons with durations, free preview badges, and lesson links.
- [ ] Pinned bottom progress bar renders "35% complete" with terracotta progress bar and "Continue Learning →" CTA.
- [ ] Responsive behavior across desktop, tablet, and mobile.
- [ ] Checks pass: `npx tsc --noEmit` and `npm run lint` with 0 errors.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## Manual Test Steps
1. Navigate to `http://localhost:3000/courses/nextjs-for-production` in the browser.
2. Verify visual fidelity against `design/vertex-course.png`:
   - Header with Vertex logo, Courses tab active, My Learning, Bell, Clerk user button.
   - Breadcrumbs: `All Courses > Next.js for Production`.
   - Hero: Metallic Next.js cover, POPULAR badge, serif title, summary, 4 metadata items, "Continue Learning →", "Bookmark".
   - "What you'll learn": 2x2 grid with 4 cards and custom outline icons.
   - "Course Content": 12 modules count and 18h 24m duration, first 6 modules visible, "Show all 12 modules" toggle.
   - Click "Show all 12 modules" and verify all 12 modules appear.
   - Click a module row and verify accordion expands with lesson items.
   - Sticky bottom bar: "Your Progress 35% complete" with progress track and "Continue Learning →" CTA.
   - Stepped peach columns atmospheric graphic visible at bottom background.
3. Navigate to `http://localhost:3000/courses/typescript-for-application-developers` and verify dynamic Sanity data rendering.
4. Test responsive layout at 375px, 768px, and 1440px viewports.
