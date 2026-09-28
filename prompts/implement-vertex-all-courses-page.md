# Implementation Prompt: Vertex All Courses (Catalog) Page

## Goal
Implement a clean, simple, and responsive **All Courses** catalog page at `/courses` (`app/courses/page.tsx`) that dynamically fetches and displays all 10 seeded courses from Sanity using `sanityFetch`. The page will reuse the existing design tokens, typography, header navigation, `CourseCard` components, and atmospheric stepped columns graphic.

---

## Skills Consulted
- `AGENTS.md`: Section 1 (catalog page scope, do not overbuild), Section 2 (loop process), Section 3 (UI patterns reuse), Section 5 (pages are read-only Server Components displaying stored data), Section 7 (grounded data).
- `sanity-best-practices`: GROQ data fetching with `defineQuery` and `sanityFetch`.
- `prompts/implement-vertex-design-system.md` & `prompts/implement-vertex-homepage.md`: Design tokens, color palette, Playfair Display serif typography, and spacing conventions.

---

## Code & Configuration Inspected
- `app/courses/[slug]/page.tsx`: Existing course detail page implementation.
- `app/page.tsx`: Homepage with `HeaderNav`, "View all courses →" link pointing to `/courses`, and `CourseCard` grid.
- `sanity/lib/queries.ts`: `allCoursesQuery` and `allCategoriesQuery`.
- `sanity/lib/fetch.ts`: Server-only `sanityFetch` data fetching utility.
- `components/ui/CourseCard.tsx`: CourseCard component with title, description, level, duration, and moduleCount.
- `components/ui/HeaderNav.tsx`: Navigation header with active tab indicator.
- `components/ui/Breadcrumbs.tsx`: Breadcrumbs component.
- `components/home/SteppedColumnsGraphic.tsx`: Stepped columns atmospheric graphic.
- Live Sanity content: 10 courses across 6 categories (Web Development, AI Engineering, Backend & Infrastructure, Data, Languages, Security).

---

## Requirements

### Functional Requirements
1. **Server Component at `/courses`**:
   - Implement `app/courses/page.tsx` as an async React Server Component.
   - Fetch all courses from Sanity using `sanityFetch(allCoursesQuery)`.
   - Fetch all categories from Sanity using `sanityFetch(allCategoriesQuery)` to power category filter pills.
2. **Metadata**:
   - Export `generateMetadata` (or static `metadata`) setting page title to "All Courses — Vertex" and description.
3. **Navigation & Breadcrumbs**:
   - Top `HeaderNav` with `activeTab="courses"`.
   - Breadcrumbs: `Home > All Courses`.
4. **Header Section**:
   - Pill badge: `COURSE CATALOG`.
   - Headline in Playfair Display serif: `Explore All Courses`.
   - Subtitle: `Comprehensive, production-grade courses designed for modern developers and engineers.`
   - Total course counter (e.g. `Showing 10 courses`).
5. **Category Filter Tabs (Client Component or URL search params)**:
   - Clean category filter pills ("All", "Web Development", "AI Engineering", "Backend & Infrastructure", "Data", "Languages", "Security") allowing learners to quickly filter courses.
6. **Course Cards Grid**:
   - 3-column responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
   - Each card renders:
     - Tailored badge icon (Next.js, Docker, TypeScript, React, Python, Database).
     - Course title in serif font.
     - Summary description.
     - Metadata footer: Level, Duration, Module count.
     - Clickable link navigating to `/courses/[slug]` (or `/courses/nextjs-for-production` for Next.js).
7. **Atmosphere**:
   - Warm background `#FAF8F5` with subtle diagonal hatch pattern.
   - Atmospheric stepped 3D peach/coral columns graphic at the base.

### Visual & Design Requirements
- Follow existing design system: warm ivory background (`#FAF8F5`), Playfair Display serif headlines, terracotta accents (`#EA580C` / `#D96B43`), soft card borders (`#E2E8F0`), and clean micro-interactions.
- Keep the page simple, elegant, and fast without unnecessary complexity.
- Responsive layout down to mobile viewports.

---

## Decisions & Assumptions
1. **Simple Category Filter**:
   - Create a lightweight client component `components/catalog/CourseCatalogClient.tsx` that receives the courses and categories fetched from Sanity server-side and manages the active category tab state.
2. **Next.js Course Alias**:
   - Map `nextjs-app-router-in-depth` to `/courses/nextjs-for-production` so it matches the course detail page URL.
3. **Icon Resolution**:
   - Provide clean custom SVG/badge icons for the primary tech stacks in Sanity: Next.js (`N`), Docker (whale), TypeScript (`TS`), React (atom/`Re`), Python (`Py`), and Database (`DB`).

---

## Files to Touch / Create
- `prompts/implement-vertex-all-courses-page.md`: This implementation prompt.
- `app/courses/page.tsx`: Server Component for the `/courses` route.
- `components/catalog/CourseCatalogClient.tsx`: Client component rendering category filter tabs and course grid.
- `components/catalog/CourseIcons.tsx`: Reusable badge icons for courses.

---

## Security Considerations
- Data is fetched server-side via `sanityFetch` with the private read token. No token exposed to client.
- Standard Next.js server/client component boundaries maintained.

---

## Acceptance Criteria
- [ ] Navigating to `/courses` renders the All Courses catalog page with HTTP 200.
- [ ] Header shows active "Courses" tab and Clerk auth button/avatar.
- [ ] Breadcrumbs show `Home > All Courses`.
- [ ] All 10 courses from Sanity are rendered in the course grid with appropriate titles, summaries, levels, durations, and module counts.
- [ ] Category filter pills filter the visible courses accordingly.
- [ ] Clicking any course card navigates to that course's detail page.
- [ ] Stepped columns graphic is visible at the bottom of the page.
- [ ] `npx tsc --noEmit` and `npm run lint` pass with 0 errors.
- [ ] `npm run build` succeeds.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## Manual Test Steps
1. Navigate to `http://localhost:3000/courses` in your browser.
2. Verify HeaderNav has "Courses" active.
3. Verify page header: "COURSE CATALOG", "Explore All Courses", subtitle, and category pills.
4. Verify all 10 courses appear in the grid with proper icons and metadata.
5. Click a category pill (e.g. "Data" or "Languages") and verify the grid filters to only courses in that category. Click "All" to restore.
6. Click the "Next.js for Production" card and verify it navigates to `/courses/nextjs-for-production`.
7. Click the "TypeScript for Application Developers" card and verify it navigates to `/courses/typescript-for-application-developers`.
8. Verify the page is responsive on mobile viewport widths.
