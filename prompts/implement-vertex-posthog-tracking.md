# Implementation Prompt: Vertex PostHog Analytics Instrumentation

## Goal
Implement end-to-end PostHog product analytics across all features built since basic setup (search, video moments, video playback, watch depth, resume affordance, lesson completion, and course discovery), strictly following PostHog's Next.js App Router best practices, snake_case event/property conventions, server-side capture for server actions/routes with `posthog-node`, and zero PII transmission beyond Clerk user IDs.

---

## Skills & Guidelines Consulted
- `AGENTS.md`:
  - Section 2: Workflow loop (inspect -> prompt -> user approval modal -> implement -> run checks -> short report).
  - Section 5: Structure and boundaries (server-only data access and write tokens, client-side public tokens, no secrets or PII leaked to browser).
  - Section 7: Key decisions: "Product analytics is PostHog. Instrument the moments that show engagement: catalog and lesson views, a search performed, a video play and how far it is watched, and a lesson completed. The browser uses the public PostHog project key. Keep any private PostHog API key on the server."
  - Section 12: Gotchas: Keep project ids and keys in env, expose only client safe values to the browser, Clerk secret key is server only, write tokens server only.
  - Section 13: Checks to run (`npx tsc --noEmit`, `npm run lint`, `npm run build`).
- PostHog Next.js App Router Guides (`.claude/skills/integration-nextjs-app-router/references/next-js.md` & `identify-users.md`):
  - Event naming convention: `<object>_<action>` (e.g. `search_performed`, `video_played`, `lesson_completed`).
  - Property naming convention: snake_case (e.g. `lesson_slug`, `watch_depth`, `start_seconds`).
  - Server-side capture using `posthog-node` with `flushAt: 1, flushInterval: 0` and `await posthog.shutdown()`.
  - Identity management: stable user ID from auth (`user.id`), no emails or names attached when PII is restricted.

---

## Code & Configuration Inspected
1. **Existing PostHog Client Setup**:
   - `instrumentation-client.ts`: Initializes `posthog-js` with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`, `capture_exceptions: true`.
   - `instrumentation.ts`: Server-side OpenTelemetry logging pipeline for Sanity fetch cache telemetry.
   - `components/ui/HeaderNav.tsx`: Clerk user identity listener currently passes `email` and `name` in `posthog.identify()`. Needs sanitization to send ONLY `user.id` to uphold zero-PII requirements.
2. **Search Infrastructure**:
   - `app/search/page.tsx`: Server Component executing grounded search via `executeGroundedSearch`.
   - `app/api/search/route.ts`: Server API endpoint for GET & POST search queries.
   - `components/search/SearchAnalyticsTracker.tsx`: Client tracker currently capturing `learning_search_performed`.
   - `components/search/SearchBar.tsx` & `components/home/HeroSearchBar.tsx`: Client search input bars.
   - `components/search/SearchResultCardVideo.tsx` & `components/search/SearchResultCardLesson.tsx`: Result cards currently capturing `search_result_clicked`.
   - `components/search/SearchEmptyState.tsx`: Empty state when query produces 0 matches.
   - `lib/search/grounded-search.ts`: Multi-stage search resolving lesson topics and video moments (chapters & transcripts).
3. **Lesson & Video Playback Infrastructure**:
   - `app/lessons/[slug]/page.tsx`: Server Component rendering lesson page and parsing `?start=`, `?t=`, `?startSeconds=`.
   - `components/lesson/LessonVideoPlayer.tsx`: Provider embed iframe supporting YouTube (`enablejsapi=1`), Vimeo, and Bunny.
   - `components/lesson/LessonTabs.tsx`: Tab switching ("Lesson Content" vs "Notes"), resources, pro tip.
   - `components/lesson/LessonFooterNav.tsx`: Bottom navigation with "Previous Lesson" and "Next Lesson".
   - `components/lesson/LessonSidebar.tsx`: Left sidebar curriculum with module progression and lesson selection.
4. **Course & Progress Affordance**:
   - `components/course/CourseHeroActions.tsx`: "Continue Learning" button linking to lesson.
   - `components/course/StickyCourseProgress.tsx`: Sticky progress bar with "Continue Learning" button.
   - `studio/schemaTypes/documents/progressRecord.ts`: Sanity learner progress document schema keyed by Clerk `userId`.

---

## Decisions & Assumptions
1. **Event Naming Taxonomy (PostHog Best Practices)**:
   - `search_performed`: Fired when a search query is executed (client `/search` page, search inputs, and server `/api/search`).
   - `search_result_opened`: Fired when a search result card is clicked/opened (with `result_type: "video" | "lesson"`).
   - `video_played`: Fired when video playback begins in `LessonVideoPlayer`.
   - `video_search_performed`: Fired when video intelligence is searched or returns timestamped video moments.
   - `video_watch_depth_reached`: Fired at progress milestones (25%, 50%, 75%, 90%, 100%).
   - `resume_used`: Fired whenever a learner resumes learning (via "Continue Learning" buttons or seeking via `startSeconds > 0`).
   - `lesson_completed`: Fired when a lesson is finished (video reaches 100%, user clicks "Next Lesson", or via server progress API).
   - `course_viewed` & `lesson_viewed`: High-value content discovery tracking for courses and lessons.
   - `lesson_resource_clicked`: Fired when external resource links are opened.
   - `search_empty_state_viewed`: Fired when a query returns zero results.
2. **Server-Side Tracking Architecture**:
   - Install and initialize `posthog-node` via a dedicated utility `lib/analytics/posthog-server.ts`.
   - Connect `captureServerEvent` inside `app/api/search/route.ts` to log server-side search executions.
   - Create a dedicated server route `app/api/progress/route.ts` for recording learner progress and capturing `lesson_completed` server-side, gated by Clerk `auth()`.
3. **Strict Zero-PII Policy**:
   - Sanitize `HeaderNav.tsx` so `posthog.identify(user.id)` is called with only the Clerk user ID without email, name, or metadata.
   - Ensure all event payloads contain strictly non-PII attributes: slugs, titles, timestamps, duration, counts, and rank.
4. **Video Iframe Event Detection**:
   - Use window `message` listener in `LessonVideoPlayer.tsx` for YouTube `onStateChange` and `infoDelivery` events (enabled by `enablejsapi=1`), Vimeo player message events, and interactive play overlays.
   - Deduplicate milestone triggers using `useRef(new Set<number>())` per session/lesson.

---

## Files to Touch / Create
1. `package.json`: Add `posthog-node` to dependencies.
2. `lib/analytics/posthog-server.ts`: New server-side PostHog helper using `posthog-node` with lazy init and flush/shutdown support.
3. `lib/analytics/events.ts`: New strongly-typed PostHog event definitions, property interfaces, and client helper functions.
4. `components/ui/HeaderNav.tsx`: Remove email and name from `posthog.identify()`, retaining only Clerk `user.id`.
5. `components/search/SearchAnalyticsTracker.tsx`: Standardize event to `search_performed` and add `video_search_performed` when video moments are returned.
6. `components/search/SearchBar.tsx` & `components/home/HeroSearchBar.tsx`: Track `search_performed` on form submission.
7. `components/search/SearchResultCardVideo.tsx`: Track `search_result_opened` (`result_type: "video"`) and `search_result_clicked`.
8. `components/search/SearchResultCardLesson.tsx`: Track `search_result_opened` (`result_type: "lesson"`) and `search_result_clicked`.
9. `components/search/SearchEmptyState.tsx`: Track `search_empty_state_viewed`.
10. `app/api/search/route.ts`: Capture `search_performed` server-side via `captureServerEvent` using Clerk `auth().userId`.
11. `components/lesson/LessonVideoPlayer.tsx`: Add YouTube/Vimeo postMessage listening to track `video_played`, `video_watch_depth_reached` (25%, 50%, 75%, 90%, 100%), `resume_used`, and video completion.
12. `components/lesson/LessonAnalyticsTracker.tsx`: New client component to track `lesson_viewed` and query-param `resume_used`.
13. `components/lesson/LessonTabs.tsx`: Add `lesson_resource_clicked` tracking for external guide/docs clicks.
14. `components/lesson/LessonFooterNav.tsx`: Enhance `Next Lesson` click to capture `lesson_completed`.
15. `components/course/CourseHeroActions.tsx` & `components/course/StickyCourseProgress.tsx`: Track `resume_used` on "Continue Learning" clicks.
16. `components/course/CourseAnalyticsTracker.tsx`: New client component to track `course_viewed`.
17. `app/api/progress/route.ts`: New server route capturing server-side `lesson_completed` and updating Sanity `progressRecord`.

---

## Security Considerations
- Zero PII: No learner names, emails, addresses, or IP addresses are tracked; only stable Clerk user IDs are associated with events.
- Client/Server token separation: The browser uses only `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and public endpoints; server-side routes use Clerk server `auth()` and server-side PostHog capture.
- Fallback resilience: PostHog failures are non-blocking and fail safely without breaking page rendering or search results.

---

## Acceptance Criteria
- [ ] `search_performed` is captured with `query`, `result_count`, `course_count`, `sort`, and `source` on `/search`, search bars, and `/api/search`.
- [ ] `search_result_opened` is captured on video and lesson result clicks with `result_type`, `lesson_slug`, `course_title`, `rank`, and `start_seconds`.
- [ ] `video_played` is captured when lesson video begins playback.
- [ ] `video_search_performed` is captured when search queries yield video intelligence moments.
- [ ] `video_watch_depth_reached` is captured at 25%, 50%, 75%, 90%, and 100% video progress milestones.
- [ ] `resume_used` is captured when clicking "Continue Learning" and when seeking via `startSeconds > 0`.
- [ ] `lesson_completed` is captured on video end, "Next Lesson" navigation, and server `/api/progress`.
- [ ] `course_viewed`, `lesson_viewed`, `lesson_resource_clicked`, and `search_empty_state_viewed` are captured.
- [ ] No PII (email, full name) is passed to `posthog.identify()`.
- [ ] Server-side capture is operational in server routes using `posthog-node`.
- [ ] TypeScript check (`npx tsc --noEmit`), ESLint (`npm run lint`), and production build (`npm run build`) pass with zero errors.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## Manual Test Steps
1. Perform a search on `/search?q=caching` and verify in console/PostHog that `search_performed` and `video_search_performed` fire with query and counts.
2. Click a video result card ("Watch from 02:45") and verify `search_result_opened` fires with `result_type: "video"`, `lesson_slug`, and `start_seconds: 165`.
3. Open lesson page `/lessons/data-fetching-and-caching?start=60` and verify `resume_used` and `lesson_viewed` fire.
4. Start video playback and verify `video_played` is dispatched.
5. Play or seek through video milestones and verify `video_watch_depth_reached` fires at 25%, 50%, 75%, 90%, and 100%.
6. At video end or by clicking "Next Lesson", verify `lesson_completed` is captured.
7. Visit a course page `/courses/nextjs-for-production` and click "Continue Learning", verifying `resume_used` fires.
8. Verify inspect network calls / events payload confirms no learner email or name is sent in PostHog identify calls.
