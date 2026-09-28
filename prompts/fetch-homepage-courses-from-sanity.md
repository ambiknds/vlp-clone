# Implementation Prompt: Fetch Homepage Courses from Sanity Content

## Goal
Update the Vertex **Homepage** (`app/page.tsx`) to dynamically fetch the showcase courses from the live seeded Sanity content using the server-side Sanity client (`sanityFetch`), while preserving 100% visual fidelity to the homepage design specification (`design/vertex-home.png`) and the user-provided course card reference.

---

## Skills Consulted
- `AGENTS.md`: Section 2 (agent work loop), Section 5 (App Router Server vs. Client boundaries, read-only pages, server-only Sanity fetch with private token), Section 7 (grounded data).
- `sanity-best-practices`: Server Component data fetching using `sanityFetch` and GROQ query definition.
- `prompts/implement-vertex-homepage.md`: Design tokens, typography, and visual layout specification for the homepage.

---

## Code & Configuration Inspected
- `app/page.tsx`: Current homepage implementation containing hardcoded course cards and client-side search input state.
- `components/ui/CourseCard.tsx`: Course card component with title, description, level, duration, module count, and icon slot.
- `sanity/lib/queries.ts`: Predefined GROQ queries including `featuredCoursesQuery` and `allCoursesQuery`.
- `sanity/lib/fetch.ts`: Server-only `sanityFetch` helper reading from Sanity Content Lake securely.
- `types/sanity.ts`: TypeScript definitions for `CourseCardItem`.
- Seeded Sanity dataset: Verified courses in Sanity (`nextjs-app-router-in-depth`, `devops-with-docker-and-kubernetes`, `typescript-for-application-developers`, etc.).

---

## Requirements

### Functional Requirements
1. **Server-Side Data Fetching**:
   - Refactor `app/page.tsx` from a client component (`"use client"`) to an async Server Component.
   - Fetch courses directly from the Sanity dataset using `sanityFetch`.
2. **Component Separation**:
   - Extract the interactive search input bar with `⌘ K` keyboard shortcut into a dedicated client component `components/home/HeroSearchBar.tsx`.
3. **Course Card Rendering**:
   - Render the top 3 showcase courses from Sanity:
     1. Next.js Course (`nextjs-app-router-in-depth` / `nextjs-for-production`) with Next.js badge icon.
     2. Docker / DevOps Course (`devops-with-docker-and-kubernetes`) with Docker whale badge icon.
     3. TypeScript Course (`typescript-for-application-developers`) with TypeScript blue badge icon.
   - Each course card must link to its corresponding dynamic course detail page (`/courses/[slug]`).
   - Use live Sanity fields: `title`, `summary`, `level`, `duration`, `moduleCount` (or derived count from modules), and `badgeIcon`.
4. **Resilience & Fallbacks**:
   - If Sanity query returns courses, dynamically map their fields with fallback to design defaults if any field is missing.
   - If the fetch fails or dataset is temporarily unreachable, render gracefully without breaking the page.

### Visual & Design Requirements
- Match `design/vertex-home.png` and the user-provided course card reference screenshot exactly:
  - 3-column responsive grid on desktop (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
  - Card styling: white background, rounded-[16px] corners, border `#E2E8F0`, subtle shadow, hover elevation.
  - Serif font for course titles, hover orange color transition.
  - Metadata row with bar chart (level), clock (duration), and file text (modules count) icons.
  - Correct custom badge icons for Next.js (dark "N"), Docker (light blue whale with containers), and TypeScript (blue "TS").

---

## Decisions & Assumptions
1. **Server Component Architecture**:
   - `app/page.tsx` becomes an async Server Component, keeping `SANITY_API_READ_TOKEN` strictly server-side.
   - The interactive search form is extracted into `components/home/HeroSearchBar.tsx` (`"use client"`).
2. **Course Query & Selection**:
   - Define a targeted query `homepageCoursesQuery` or use `allCoursesQuery` that retrieves the 3 showcase courses (`nextjs-app-router-in-depth`, `devops-with-docker-and-kubernetes`, `typescript-for-application-developers`).
   - Ensure the Next.js card links to `/courses/nextjs-for-production` (or `/courses/nextjs-app-router-in-depth`), Docker links to `/courses/devops-with-docker-and-kubernetes`, and TypeScript links to `/courses/typescript-for-application-developers`.
3. **Icon Resolution**:
   - Helper function `getCourseBadgeIcon(badgeIcon?: string, slug?: string)` returns `<NextjsIcon />`, `<DockerIcon />`, or `<TypeScriptIcon />` based on Sanity `badgeIcon` and slug.

---

## Files to Touch / Create
- `prompts/fetch-homepage-courses-from-sanity.md`: This implementation prompt.
- `components/home/HeroSearchBar.tsx`: New client component for the hero search input.
- `app/page.tsx`: Refactor to Server Component, fetch courses via `sanityFetch`, and render dynamic `CourseCard` items.
- `sanity/lib/queries.ts`: Add `homepageCoursesQuery` if needed to optimize retrieval of the 3 showcase courses.

---

## Security Considerations
- Sanity read token remains strictly on the server in `sanityFetch`.
- No client-side tokens or private keys exposed to browser bundle.
- Output sanitized and properly escaped in Next.js React elements.

---

## Acceptance Criteria
- [ ] `app/page.tsx` is an async Server Component fetching courses from Sanity via `sanityFetch`.
- [ ] Interactive search input operates seamlessly via `HeroSearchBar.tsx`.
- [ ] 3 course cards on the homepage are dynamically populated with data from seeded Sanity content.
- [ ] Each card links to `/courses/[slug]`, navigating correctly to the respective course detail page.
- [ ] Visual fidelity matches `design/vertex-home.png` and user reference image (icons, typography, metadata footer).
- [ ] `npx tsc --noEmit` and `npm run lint` pass with 0 errors.
- [ ] Next.js production build (`npm run build`) passes.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## Manual Test Steps
1. Navigate to `http://localhost:3000` in the browser.
2. Verify the 3 course cards are visible under "All Courses".
3. Verify the cards display data sourced from Sanity (titles, summaries, levels, durations, module counts).
4. Verify custom badge icons (Next.js, Docker, TypeScript) render with exact styling.
5. Click each course card to verify it navigates to its corresponding course page (`/courses/nextjs-for-production`, `/courses/devops-with-docker-and-kubernetes`, `/courses/typescript-for-application-developers`).
6. Test the hero search bar: type a query, press Enter, and verify navigation to `/search?q=...`.
