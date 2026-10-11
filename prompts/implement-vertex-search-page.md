# Implementation Prompt: Implement Vertex Search Page Wired with Sanity Content

## Goal
Implement and polish the Vertex Search Results Page (`app/search/page.tsx`) to reproduce `design/vertex-search.png` with pixel-perfect visual fidelity, wired to live Sanity content and video intelligence data per `AGENTS.md` (Sections 1, 3, 5, 7, 8, 9, 10, 11, 12, 13).

---

## Skills Consulted
- `AGENTS.md` (Section 1: What you are building; Section 2: How to work; Section 3: UI work; Section 5: App structure; Section 6: Tech stack; Section 7: Decisions already made; Section 8: Content model; Section 9: Video ingestion; Section 10: Search config; Section 11: Search behavior; Section 12: Gotchas; Section 13: Checks to run)
- `create-agent-with-sanity-context` (`.agents/skills/create-agent-with-sanity-context/SKILL.md`)
- `dial-your-context` (`.agents/skills/dial-your-context/SKILL.md`)
- `shape-your-agent` (`.agents/skills/shape-your-agent/SKILL.md`)
- `sanity-best-practices` (`references/groq.md`, `references/schema.md`)

---

## Code & Configuration Inspected
- `design/vertex-search.png`: Visual source of truth for the search page:
  - Header: Vertex logo, "Courses" active in orange, "My Learning" in neutral dark, notification bell, user avatar.
  - Page Background: Subtle diagonal textured pinstripe on warm cream `#FAF8F5`.
  - Hero Section:
    - Pill eyebrow badge: `SEARCH RESULTS` in orange on light peach background (`#FFF0E8`).
    - Headline: Serif typography `Results for “<query>”` with query highlighted in orange quotes.
    - Subtitle: `Found 28 results across 8 courses` in muted gray `#64748B`.
    - Search bar: Centered rounded container with magnifying glass icon, query text, clear button, and `⌘ K` keyboard shortcut badge.
  - Results meta bar: `28 results` on left, `Most Relevant v` sort dropdown on right, without a separating dividing rule.
  - Result cards:
    - **Video Result Card**:
      - Left: Thumbnail (16:10 / 16:9) with dark preview (e.g. Next.js emblem, React code, API diagram, JS fetch code), centered translucent play circle overlay, duration badge (e.g. `12:45`) in bottom-right.
      - Right header: Course icon (Next.js black N, React atom, Node.js green hexagon, JS yellow square) + Course title (`Next.js for Production`), orange pill badge `VIDEO`.
      - Lesson title: Bold charcoal link (`Data Fetching in Server Components`).
      - Description: Clean lesson summary (`Learn how to fetch data on the server using async/await and Next.js best practices for better performance.`).
      - Footer: `Lesson 5.1` (with document icon) · `Data Fetching & Caching` (with folder icon), and action `Watch from 12:45 >` (with orange play circle) linking to `/lessons/[slug]?start=765`.
    - **Lesson Result Card**:
      - Left: Light card preview box (`bg-[#F8FAFC]`) with top-left icon (document icon or React atom), 3 bullet key points (`• Fetching strategies`, `• Caching techniques`, `• Revalidation methods`), and bottom-right dark circle with checkmark.
      - Right header: Course icon + Course title (`Next.js for Production`), indigo pill badge `LESSON`.
      - Lesson title: Bold charcoal link (`Data Fetching & Caching`).
      - Description: Detailed topic summary (`Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance.`).
      - Footer: `Module 5` on left, and action `View lesson ↗ >` on right linking to `/lessons/[slug]`.
  - Bottom CTA banner: `Can't find what you're looking for?` with `Browse all courses ->` linking to `/courses`.
- Existing Codebase:
  - `app/search/page.tsx`: Current search page structure.
  - `lib/search/grounded-search.ts`: Server-side GROQ query fetching courses, lessons, and video intelligence from Sanity.
  - `app/api/search/route.ts`: API route for search queries.
  - `components/search/SearchResultCardVideo.tsx`: Video card component.
  - `components/search/SearchResultCardLesson.tsx`: Lesson card component.
  - `components/search/SearchBar.tsx`: Search bar with `⌘ K` handler.
  - `components/search/SearchSortSelect.tsx`: Sort dropdown.
  - `components/search/CourseBadgeIcon.tsx`: Course logo badges (Next.js, React, Node.js, JavaScript, Python, Docker, etc.).
  - `components/search/SearchCtaBanner.tsx`: Bottom callout banner.
  - `components/search/SearchAnalyticsTracker.tsx`: PostHog analytics event capture.

---

## Decisions & Assumptions
1. **Design Fidelity**:
   - Replicate `design/vertex-search.png` exactly: layout, typography, badges, thumbnails, action links, and hover states.
   - HeaderNav will receive `activeTab="courses"` on the search page to match the visual mock where "Courses" is highlighted in orange.
   - Remove the horizontal border above the results list in `app/search/page.tsx` so the gap is clean as shown in the reference image.
   - Support rich thumbnail previews in `SearchResultCardVideo`: render Sanity poster if available; otherwise render authentic course-specific visual previews (Next.js emblem, React code editor, API architecture flow diagram, JS fetch code snippet).
   - In `SearchResultCardLesson`, render the top-left icon matching the course topic (React atom for React courses, document icon for others) and styled checkmark circle at bottom-right of the highlights box.
   - Provide clean descriptions for video cards: show the lesson's rich description or summary rather than raw fallback text, with chapter details seamlessly woven into the footer or tooltip.
2. **Sanity Data Grounding**:
   - Query courses, lessons, and dedicated video intelligence documents (`video` type with `chapters` and `chunks`).
   - Two-stage resolution: resolve video moments against `chapters` (table of contents) first, falling back to `chunks` (transcript) second.
   - Match lessons on title, keyPoints, and Portable Text notes projection (`pt::text(notes)`).
   - Never invent courses, lessons, durations, or timestamps.
3. **Playback & Navigation**:
   - Video results link to `/lessons/[slug]?start=[seconds]` so playback starts at the exact matched second.
   - Lesson results link to `/lessons/[slug]`.
4. **Analytics**:
   - Instrument PostHog events: `learning_search_performed` on search execution, and `search_result_clicked` on card interaction.

---

## Files to Touch / Create
1. `prompts/implement-vertex-search-page.md`: This implementation prompt.
2. `components/search/SearchResultCardVideo.tsx`: Update thumbnail visuals, badges, typography, and action layout to match `design/vertex-search.png`.
3. `components/search/SearchResultCardLesson.tsx`: Update highlights box icon, key points bullets, checkmark badge, and action links to match `design/vertex-search.png`.
4. `components/search/CourseBadgeIcon.tsx`: Add Node.js and JavaScript badge presets matching the design mock.
5. `components/search/SearchCtaBanner.tsx`: Fine-tune padding, typography, and styling to match the design mock.
6. `app/search/page.tsx`: Set `activeTab="courses"`, refine spacing, remove extra border line, and polish typography.
7. `lib/search/grounded-search.ts`: Ensure descriptions for video results are rich and informative, and ranking accurately prioritizes specific matches.

---

## Security Considerations
- Sanity read token remains strictly server-side (`SANITY_API_READ_TOKEN` in `.env.local`).
- Browser never executes GROQ directly or holds private dataset tokens.
- User queries are sanitized to prevent injection.

---

## Acceptance Criteria
- [ ] Header navigation highlights "Courses" in orange and renders user avatar.
- [ ] Eyebrow badge displays `SEARCH RESULTS` in orange pill container.
- [ ] Title displays `Results for “<query>”` in serif font with query in orange.
- [ ] Subtitle displays `Found X results across Y courses`.
- [ ] Search input bar supports typing, clearing, and global `⌘ K` / `Ctrl K` shortcut.
- [ ] Results count and `Most Relevant` dropdown render cleanly without dividing border line.
- [ ] Video cards reproduce the design mock with authentic thumbnail previews, centered play button, duration badge, course badge + title, orange `VIDEO` pill, lesson title, description, and `Watch from MM:SS >` action.
- [ ] Lesson cards reproduce the design mock with highlights box, topic icon, bullets, checkmark circle, indigo `LESSON` pill, module number, and `View lesson ↗ >` action.
- [ ] Clicking a video card navigates to `/lessons/[slug]?start=[seconds]` and begins playback at that timestamp.
- [ ] Clicking a lesson card navigates to `/lessons/[slug]`.
- [ ] Bottom CTA banner displays "Can't find what you're looking for?" with "Browse all courses ->" link.
- [ ] PostHog analytics captures `learning_search_performed` and `search_result_clicked`.
- [ ] `npx tsc --noEmit` and `npm run lint` pass with zero errors.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- Browser verification via dev server at `http://localhost:3000/search?q=data+fetching`

---

## Manual Test Steps
1. Start dev server (`npm run dev`) and visit `http://localhost:3000/search?q=data+fetching`.
2. Inspect the search results page against `design/vertex-search.png`:
   - Eyebrow badge reads `SEARCH RESULTS`.
   - Title displays `Results for “data fetching”` with orange serif highlight.
   - Results count displays `28 results` (or matching count) and sort dropdown displays `Most Relevant`.
   - Video result cards show video thumbnail, centered play icon, duration badge, course badge, orange `VIDEO` pill, and `Watch from MM:SS >` action.
   - Lesson result cards show highlights box with bullet points, checkmark icon, indigo `LESSON` pill, module number, and `View lesson ↗ >` action.
3. Click `Watch from 12:45 >`: verify navigation to lesson page with video seeking to that second.
4. Click `View lesson ↗ >`: verify navigation to lesson page.
5. Press `⌘ K` (or `Ctrl K` on Windows): verify search input is focused.
6. Check empty state by searching for a nonsense string: verify friendly empty message and link to catalog.
