# Implementation Prompt: Fix Dynamic Learner Progress & Synchronization

## Goal
Fix the issue where course progress is frozen at hardcoded percentages (25% on general courses and 35% on Next.js) by implementing full dynamic progress calculation, automatic completion when a video lesson finishes, a manual "Mark as Complete" button on the lesson page, and real-time synchronization between the UI, client state (localStorage fallback), and server-side Sanity `progressRecord` persistence.

---

## Skills Consulted
- `sanity-best-practices`: Schema design, GROQ queries, document mutations, and server-side Sanity client patterns.
- `clerk-nextjs-patterns`: Server-side Clerk `auth()` session validation in App Router API routes.

---

## Code & Data Inspected
1. `app/courses/[slug]/page.tsx`: Lines 267-271 hardcode `<StickyCourseProgress progressPercentage={35} ... />`.
2. `app/lessons/[slug]/page.tsx`: Lines 323 and 469 hardcode `progressPercentage={35}` and `progressPercentage={25}` for `<LessonSidebar />`.
3. `components/course/StickyCourseProgress.tsx`: Displays default `35% complete` with hardcoded progress track width.
4. `components/lesson/LessonSidebar.tsx`: Displays default `35% complete` or passed value, and checks module completion purely based on `idx < currentModuleIndex` instead of actual lesson completion.
5. `components/lesson/LessonFooterNav.tsx`: Has Previous / Next lesson navigation, but no "Mark as Complete" button, and clicking "Next Lesson" captures analytics without saving progress to the server.
6. `components/lesson/LessonVideoPlayer.tsx`: Fires `trackLessonCompleted` on 100% video milestone or ended event, but does not persist completion to the progress API.
7. `app/api/progress/route.ts`:
   - `GET` returns hardcoded `{ completedLessons: [], lastPositionSeconds: 0 }`.
   - `POST` only captures a PostHog server event, never writes or updates `progressRecord` in Sanity.
8. `studio/schemaTypes/documents/progressRecord.ts`: Schema exists with `userId` (string), `completedLessons` (array of references to `lesson`), `lastLesson` (reference to `lesson`), `lastPositionSeconds` (number), and `updatedAt` (datetime).
9. Sanity Database: Inspected dataset `production`. 120 lessons exist across 10 courses (12 lessons per course). Currently 0 `progressRecord` documents exist.
10. Environment: `.env.local` contains `SANITY_API_DEVELOPER_TOKEN` with mutation permissions, `SANITY_API_READ_TOKEN`, and Clerk keys.

---

## Decisions & Assumptions
1. **Dynamic Progress Formula**:
   - Course progress percentage is calculated dynamically:
     $$\text{percentage} = \begin{cases} \text{round}\left(\frac{\text{completedLessonsInCourse}}{\text{totalLessonsInCourse}} \times 100\right) & \text{if } \text{totalLessonsInCourse} > 0 \\ 0 & \text{otherwise} \end{cases}$$
   - When 0 lessons are completed, progress is 0%. Completing 1 lesson in a 12-lesson course yields 8%, 2 lessons yields 17%, 3 lessons yields 25%, etc., advancing smoothly to 100%.
2. **Dual-Layer Persistence**:
   - **Authenticated Users**: Persisted to Sanity `progressRecord` document (`_id: progress-<userId>`) via `/api/progress` server route using server-only write token, strictly adhering to AGENTS.md Section 5, 7, and 8.
   - **Guest / Unauthenticated Fallback**: Stored in `localStorage` (`vertex_completed_lessons`), allowing instant testing and state preservation across browser reloads without blocking unauthenticated exploration.
3. **Automatic & Manual Completion**:
   - **Video Finish**: When video reaches 100% or finishes (`ended` / 100% depth milestone in `LessonVideoPlayer`), the lesson is automatically marked as completed.
   - **Next Lesson Button**: Clicking "Next Lesson" in `LessonFooterNav` automatically marks the current lesson as complete.
   - **Manual Toggle**: A prominent, beautifully styled "Mark as Complete" / "Completed ✓" button is added to `LessonFooterNav` so learners can manually mark or unmark any lesson at will.
4. **App-Wide React Context (`LearnerProgressContext`)**:
   - Provides `isLessonCompleted(slug)`, `toggleLessonCompleted(...)`, `markLessonCompleted(...)`, and `getCourseProgress(courseLessonSlugs)`.
   - Wrapped in `app/layout.tsx` so all components (sticky bottom progress, lesson sidebar, course module list, footer nav) re-render immediately with optimistic state updates.
5. **Visual Completion Indicators**:
   - Lesson Sidebar: Shows dynamic course progress percentage in the summary card, completed checkmarks on modules whose lessons are all finished, and individual lesson completion checkmark badges.
   - Course Page: `StickyCourseProgress` displays the live course percentage and points "Continue Learning" to the next uncompleted lesson.

---

## Files to Create & Modify

### 1. New Server Write Client & Helper
- `sanity/lib/write-client.ts`: Server-only Sanity client instantiated with `SANITY_API_DEVELOPER_TOKEN || SANITY_API_WRITE_TOKEN || SANITY_API_READ_TOKEN` with `useCdn: false`.

### 2. Update Progress API Server Route
- `app/api/progress/route.ts`:
  - `GET`: Return user's completed lesson slugs, last active lesson, and position from Sanity `progressRecord`.
  - `POST`: Resolve lesson by slug, upsert `progressRecord` in Sanity adding/removing references from `completedLessons`, update `lastLesson` and `lastPositionSeconds`, trigger PostHog event, and return the updated completed lesson slugs.

### 3. Create Learner Progress Context & Hook
- `components/providers/LearnerProgressProvider.tsx`:
  - Client context holding `completedLessons: Set<string>`.
  - Initializes from `localStorage` and synchronizes with `/api/progress`.
  - Exposes `isLessonCompleted`, `markLessonCompleted`, `toggleLessonCompleted`, and `getCourseProgress`.

### 4. Update Root Layout
- `app/layout.tsx`: Wrap application children with `<LearnerProgressProvider>`.

### 5. Update Lesson Components
- `components/lesson/LessonFooterNav.tsx`:
  - Add interactive "Mark as Complete" / "Completed ✓" button with checkmark icon and visual toggle states.
  - Automatically call `markLessonCompleted` when clicking "Next Lesson".
- `components/lesson/LessonVideoPlayer.tsx`:
  - Call `markLessonCompleted` when video ends or reaches 100% watch depth.
- `components/lesson/LessonSidebar.tsx`:
  - Replace static `progressPercentage` with dynamic progress derived from `getCourseProgress`.
  - Display checkmark icon next to completed lessons in the sidebar drawer.
  - Display module completed checkmark when all lessons in that module are done.

### 6. Update Course Components & Pages
- `components/course/StickyCourseProgress.tsx`:
  - Consume dynamic course progress via `getCourseProgress`.
  - Update progress bar width and percentage label dynamically.
  - Direct "Continue Learning" button to the first uncompleted lesson.
- `app/courses/[slug]/page.tsx`:
  - Collect all lesson slugs for the course and pass to `StickyCourseProgress`.
- `app/lessons/[slug]/page.tsx`:
  - Pass all course lesson slugs to `LessonSidebar` for dynamic course percentage computation.

---

## Security Considerations
- Read and write tokens (`SANITY_API_DEVELOPER_TOKEN`, `SANITY_API_WRITE_TOKEN`) are accessed strictly server-side in `sanity/lib/write-client.ts` and `app/api/progress/route.ts`.
- No Sanity tokens are prefixed with `NEXT_PUBLIC_` or exposed to the browser.
- Clerk authentication verifies the `userId` in `/api/progress`.
- PII is not leaked to PostHog; only the Clerk `userId` is used as distinct ID.

---

## Acceptance Criteria
- [ ] No more hardcoded 25% or 35% on any course or lesson page.
- [ ] When a user marks a lesson as complete (or completes a video), the progress percentage immediately increases.
- [ ] If 1 of 12 lessons is completed, progress shows 8%. If 3 of 12 are completed, it shows 25%. If 6 of 12 are completed, it shows 50%.
- [ ] The "Mark as Complete" button toggles state smoothly between "Mark as Complete" and "Completed ✓".
- [ ] The lesson sidebar immediately reflects the updated completion percentage and displays completion badges on completed lessons.
- [ ] The sticky bottom progress bar on the course page reflects the live percentage and links to the next incomplete lesson.
- [ ] State persists upon page refresh and between page transitions.
- [ ] Completing a video lesson at 100% triggers automatic completion and updates progress.

---

## Checks to Run
1. TypeScript compilation: `npx tsc --noEmit`
2. Next.js ESLint: `npm run lint`
3. Next.js Production Build: `npm run build`

---

## Manual Test Steps
1. Navigate to `/courses/devops-with-docker-and-kubernetes` and check the sticky progress bar at the bottom.
2. Click "Continue Learning" or enter a lesson at `/lessons/devops-with-docker-and-kubernetes-docker-basics`.
3. Verify the sidebar initially shows the real progress percentage (e.g. 0% if fresh, or current completed count).
4. In the lesson footer, click the "Mark as Complete" button:
   - Observe the button transitions to "Completed ✓" with a green accent.
   - Observe the sidebar course summary percentage immediately increases (e.g. from 0% to 8%).
   - Observe the checkmark appears next to the lesson in the curriculum drawer.
5. Click "Next Lesson":
   - Navigate to lesson 2.
   - Mark lesson 2 as complete; observe percentage increases to 17%.
6. Refresh the browser page; verify that progress percentage and completed checkmarks remain intact.
7. Return to `/courses/devops-with-docker-and-kubernetes`; verify the sticky bottom progress bar now displays 17% and the progress bar track fills proportionally.
