# Implementation Prompt: Commit and Push PostHog Tracking Changes

## Goal
Stage, commit, and push all PostHog product analytics tracking additions—including the typed event taxonomy, server-side `posthog-node` capture, Clerk identity PII sanitization, search/video search analytics, video play & milestone watch depth detection, resume affordance tracking, lesson completion handlers, and the server-side learner progress API route—to `origin/main`.

---

## Skills & Guidelines Consulted
- `AGENTS.md`:
  - Section 2: Loop (write prompt -> user confirmation modal -> execute -> checks -> report).
  - Section 5: Security boundaries (server tokens private, public project token on client, zero PII).
  - Section 7: Key decisions (PostHog product analytics).
  - Section 12: Secrets handling and env variables.
  - Section 13: Verification checks (`npx tsc --noEmit`, `npm run lint`, `npm run build`).

---

## Code & Configuration Inspected
- **Git Branch Status**:
  - Current branch: `main` (tracking `origin/main`).
- **Environment & Secrets Safety**:
  - Verified `.env.local` is ignored by Git and will not be staged.
  - Verified no private keys or tokens are in tracked files.
- **Verification Checks Already Passed**:
  - TypeScript compiler check (`npx tsc --noEmit`): Exited 0 with no errors.
  - ESLint check (`npm run lint`): Exited 0 with no errors.
  - Production build (`npm run build`): Exited 0, all static and dynamic routes compiled cleanly.

---

## Decisions & Assumptions
1. **Branch Handling**: Work is on `main`. Changes will be staged, committed, and pushed directly to `origin/main`.
2. **Commit Staging Scope**:
   - Modified files:
     - `app/api/search/route.ts`
     - `app/courses/[slug]/page.tsx`
     - `app/lessons/[slug]/page.tsx`
     - `app/search/page.tsx`
     - `components/catalog/CourseCatalogClient.tsx`
     - `components/course/CourseHeroActions.tsx`
     - `components/course/StickyCourseProgress.tsx`
     - `components/home/HeroSearchBar.tsx`
     - `components/lesson/LessonFooterNav.tsx`
     - `components/lesson/LessonSidebar.tsx`
     - `components/lesson/LessonTabs.tsx`
     - `components/lesson/LessonVideoPlayer.tsx`
     - `components/search/SearchAnalyticsTracker.tsx`
     - `components/search/SearchBar.tsx`
     - `components/search/SearchEmptyState.tsx`
     - `components/search/SearchResultCardLesson.tsx`
     - `components/search/SearchResultCardVideo.tsx`
     - `components/ui/HeaderNav.tsx`
     - `package.json`
     - `package-lock.json`
   - New files:
     - `app/api/progress/route.ts`
     - `components/course/CourseAnalyticsTracker.tsx`
     - `components/lesson/LessonAnalyticsTracker.tsx`
     - `lib/analytics/events.ts`
     - `lib/analytics/posthog-server.ts`
     - `prompts/implement-vertex-posthog-tracking.md`
     - `prompts/commit-and-push-posthog-tracking.md`
3. **Commit Convention**:
   - Conventional commit message: `feat(analytics): add PostHog tracking for search, video playback, watch depth, resume, and completion`

---

## Security Considerations
- Ensure `.env.local` remains untracked.
- Ensure no personal data or PII was checked in.

---

## Acceptance Criteria
- [ ] All analytics tracking files and updates are staged.
- [ ] Conventional commit created.
- [ ] Pushed to `origin/main`.
- [ ] Working tree clean.

---

## Checks to Run
- `git add .`
- `git status`
- `git commit -m "feat(analytics): add PostHog tracking for search, video playback, watch depth, resume, and completion"`
- `git push origin main`
- `git status`

---

## Manual Test Steps
1. Run `git status` to verify clean tree.
2. Run `git log -1` to confirm commit message and author.
