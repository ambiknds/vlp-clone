# Implementation Prompt: Implement Vertex Intelligent Search

## Goal
Implement the end-to-end intelligent search experience for Vertex LMS per `AGENTS.md` (Sections 5, 6, 7, 10, 11, 12) and `design/vertex-search.png`. This includes connecting the Sanity Context MCP, building the server-side search API (`app/api/search/route.ts`), implementing grounded multi-stage GROQ matching across courses, lessons, and video intelligence documents (chapters first, transcripts second), and creating the search results page (`app/search/page.tsx`) with pixel-perfect video result cards, lesson result cards, sorting, search bar shortcut handling, and PostHog analytics instrumentation.

---

## Skills Consulted
- `AGENTS.md` (Section 1: Vision; Section 2: Loop; Section 3: UI reference; Section 5: App structure & server-client boundaries; Section 6: Tech stack; Section 7: Key decisions; Section 8: Content model; Section 9: Video pipeline; Section 10: Search config; Section 11: Search behavior; Section 12: Gotchas & boundaries; Section 13: Checks to run)
- `create-agent-with-sanity-context` (`.agents/skills/create-agent-with-sanity-context/SKILL.md` & `references/nextjs-agent.md`)
- `dial-your-context` (`.agents/skills/dial-your-context/SKILL.md`)
- `shape-your-agent` (`.agents/skills/shape-your-agent/SKILL.md`)
- `sanity-best-practices` (`references/groq.md`, `references/schema.md`)

---

## Code & Configuration Inspected
- `design/vertex-search.png`: Visual source of truth for the search results page:
  - Header with `HeaderNav`
  - Centered hero: `SEARCH RESULTS` eyebrow badge, `Results for "<query>"` with highlighted serif query, `Found X results across Y courses` subtitle, and prominent search bar with `⌘ K` keyboard shortcut.
  - Results meta bar: `X results` count and `Most Relevant` sort dropdown.
  - Result cards:
    - **Video Result Card**: 16:9 video thumbnail with dark overlay, centered play icon, timestamp badge (`12:45`), course icon + course title, orange `VIDEO` pill badge, lesson title, description, footer with `Lesson X.Y in <Module Title>` and `Watch from 12:45 >` action linking to `/lessons/[slug]?start=<seconds>`.
    - **Lesson Result Card**: Left container with light gray background displaying lesson `keyPoints` bullets and checkmark circle icon, course icon + course title, indigo `LESSON` pill badge, lesson title, description, footer with `Module X` and `View lesson ↗ >` action linking to `/lessons/[slug]`.
  - Bottom CTA banner: `Can't find what you're looking for?` with `Browse all courses ->` linking to `/courses`.
- Sanity Schema & Content:
  - `studio/schemaTypes/documents/agentContext.ts` & Sanity `agentContext.default` document containing content scope filter (`_type in ["course", "lesson", "instructor", "category"]`) and query guidance.
  - `studio/schemaTypes/documents/video.ts`: Dedicated `video` documents holding `url`, `chapters` (`{ startSeconds, label }`), and `chunks` (`{ startSeconds, text }`).
  - `studio/schemaTypes/documents/lesson.ts`: Standalone `lesson` documents holding `title`, `slug`, `videoUrl`, `duration`, `durationSeconds`, `keyPoints`, `notes` (Portable Text), `resources`.
  - `studio/schemaTypes/documents/course.ts`: Top-level `course` documents with ordered `modules`, embedded `lessons` references, `badgeIcon`, `level`.
  - Verified 10 courses, 120 lessons, and 120 video records already seeded in dataset `zq8k8g90` / `production`.
- Existing Web Infrastructure:
  - `app/lessons/[slug]/page.tsx`: Already parses `?start=`, `?t=`, and `?startSeconds=` from query params and passes `startSeconds` directly to `LessonVideoPlayer`.
  - `components/home/HeroSearchBar.tsx`: Already submits to `/search?q=...`.
  - `components/ui/HeaderNav.tsx`: Clerk user auth and navigation.
  - `sanity/lib/client.ts`: Private dataset client with server-only `SANITY_API_READ_TOKEN`.
- Current Package Status:
  - Root `package.json` needs `@ai-sdk/openai`, `@ai-sdk/mcp`, `ai`, and `react-markdown`.

---

## Decisions & Assumptions
1. **Two-Stage Multi-Engine Grounded Search Architecture**:
   - The search API (`/api/search`) connects to the Sanity Context MCP endpoint (`https://api.sanity.io/v2026-03-03/context/mcp/:projectId/:dataset`) and invokes the LLM via Vercel AI SDK when `OPENAI_API_KEY` is available and Studio application is deployed on Sanity hosting.
   - Built with an infallible, high-performance grounded GROQ engine running server-side against Sanity that executes directly when MCP/LLM is in fallback mode.
   - The GROQ engine queries:
     - **Lessons on Topic**: Matches lesson title, key points, and plain text notes (`pt::text(notes)`) using token wildcards (`*token*`) and OR operators.
     - **Video Moments**: Queries `video` documents, matching `chapters[].label` first (table of contents); if no chapter matches, falls back to `chunks[].text` (transcript). Reverse-resolves the matching lesson via `lesson.videoUrl == video.url`.
     - Derives course title, badge icon, module title/number, and lesson label (e.g. `Lesson 5.1`) from the course's module hierarchy.
     - Merges video moments and lesson matches, ranking by specificity: exact title/key point matches first, chapter video moments second, transcript video moments third, broad note matches fourth.
   - Grounded rule: Never invents courses, lessons, timestamps, or durations. Video documents remain an internal lookup and are never shown standalone.
2. **Search Results Page (`/search`)**:
   - Implemented as a dedicated Next.js App Router page (`app/search/page.tsx`).
   - Reads `?q=` and `?sort=` from search parameters, fetches results from the server search engine, and renders the UI matching `design/vertex-search.png` exactly.
   - Includes client-side interactive search input bar with autofocus, debounce/submission, and global `⌘ K` / `Ctrl K` shortcut handler.
   - Includes sort dropdown (`Most Relevant` default, `Newest`, `Duration`).
   - Renders responsive cards (horizontal desktop layout, clean stacked mobile layout).
   - Empty state when no results match, with helpful suggestions and link to catalog.
   - Bottom CTA card matching `vertex-search.png`.
3. **Playback & Direct Timestamp Navigation**:
   - Video result action "Watch from MM:SS" links directly to `/lessons/[lessonSlug]?start=[startSeconds]`.
   - Lesson result action "View lesson" links directly to `/lessons/[lessonSlug]`.
4. **Analytics**:
   - Captures PostHog events:
     - `learning_search_performed`: `{ query, result_count, course_count, sort }`
     - `search_result_clicked`: `{ query, result_type, lesson_slug, course_title, start_seconds, rank }`

---

## Files to Touch / Create
1. `package.json`: Add `ai`, `@ai-sdk/openai`, `@ai-sdk/mcp`, `react-markdown` dependencies.
2. `types/search.ts`: Define TypeScript types for search results (`SearchResultItem`, `VideoSearchResult`, `LessonSearchResult`, `SearchResponse`, `SortOption`).
3. `lib/search/grounded-search.ts`: Server-side grounded GROQ search implementation querying courses, lessons, and video chapters/transcripts.
4. `app/api/search/route.ts`: API route connecting Sanity Context MCP / LLM / grounded engine, handling query params and returning ranked results.
5. `components/search/SearchBar.tsx`: Client search bar with `⌘ K` keyboard shortcut, icon, and form submission.
6. `components/search/SearchResultCardVideo.tsx`: Video result card reproducing `design/vertex-search.png`.
7. `components/search/SearchResultCardLesson.tsx`: Lesson result card reproducing `design/vertex-search.png`.
8. `components/search/SearchSortSelect.tsx`: Sort control dropdown.
9. `components/search/SearchEmptyState.tsx`: Empty state when query produces 0 results.
10. `components/search/SearchCtaBanner.tsx`: "Can't find what you're looking for?" CTA banner.
11. `app/search/page.tsx`: Complete Search Results Page assembling components, server data fetching, and PostHog analytics.
12. `prompts/implement-vertex-intelligent-search.md`: This implementation prompt document.

---

## Security Considerations
- Sanity read/write tokens and API keys (`OPENAI_API_KEY`, `SANITY_API_READ_TOKEN`) remain strictly server-side.
- The browser never receives private dataset tokens or LLM credentials.
- All search queries execute through server components and server routes.
- Input query strings are sanitized and escaped to prevent GROQ injection or XSS.

---

## Acceptance Criteria
- [ ] Dependencies (`ai`, `@ai-sdk/openai`, `@ai-sdk/mcp`, `react-markdown`) installed.
- [ ] Server search API route (`/api/search`) responds to GET and POST queries with ranked results.
- [ ] Grounded search resolves video chapters first, falling back to transcript chunks.
- [ ] Video moments link to `/lessons/[slug]?start=[seconds]` and start playback at that exact second.
- [ ] Lesson matches link to `/lessons/[slug]`.
- [ ] Results page `/search` reproduces `design/vertex-search.png` layout, typography, colors, and badge styling.
- [ ] `HeroSearchBar` on homepage navigates directly to `/search?q=...`.
- [ ] Global `⌘ K` / `Ctrl K` shortcut focuses search input.
- [ ] Sort control re-orders results (`Most Relevant`, `Newest`, `Duration`).
- [ ] Empty state renders gracefully when no matching results exist.
- [ ] PostHog analytics captures search performance and result click events.
- [ ] TypeScript check (`npx tsc --noEmit`) and ESLint pass cleanly.

---

## Checks to Run
- `npx tsc --noEmit` in root workspace
- `npm run lint` in root workspace
- Verification of `/api/search?q=data+fetching` returning both video moments and lesson results
- Verification of `/search?q=data+fetching` rendering matching `design/vertex-search.png`

---

## Manual Test Steps
1. Start dev server (`npm run dev`) and navigate to `http://localhost:3000`.
2. Type `data fetching` in the hero search bar and press Enter. Verify redirect to `http://localhost:3000/search?q=data+fetching`.
3. Verify the search results page:
   - Eyebrow badge reads `SEARCH RESULTS`.
   - Title displays `Results for "data fetching"` with orange highlighted query text.
   - Subtitle displays count of results and courses.
   - Video result cards show video thumbnail, duration badge, course badge + title, orange `VIDEO` tag, lesson label + module name, and `Watch from MM:SS >` link.
   - Click `Watch from 12:45 >` on a video result card: verify lesson page loads and video starts at the specified timestamp.
   - Lesson result cards show key points bullet box, checkmark icon, indigo `LESSON` tag, module label, and `View lesson ↗ >` link.
   - Click `View lesson ↗ >`: verify lesson page loads.
4. Test sorting dropdown: switch to "Newest" and verify card order updates.
5. Test pressing `⌘ K` (or `Ctrl K` on Windows): verify search input is immediately focused.
6. Test empty state: search for a nonsense query like `xyzqwe999`. Verify the friendly empty state and catalog link appear.
