# Implementation Prompt: Implement My Learning Page and Course Enrollment

## Goal
Implement the **My Learning** page (`/my-learning`) and course enrollment workflow:
1. When a user is **not enrolled** in a course, display an **"Enroll Now"** button instead of the "Continue Learning" button on the Course Detail page hero (`CourseHeroActions`) and sticky bottom progress bar (`StickyCourseProgress`).
2. When a user clicks **"Enroll Now"**:
   - If unauthenticated: prompts them to sign in via Clerk modal.
   - If authenticated: records the enrollment server-side in the user's Sanity `progressRecord` (keyed by Clerk `userId`), tracks the `course_enrolled` event in PostHog analytics, and updates client state so the button seamlessly switches to "Continue Learning".
3. Implement the **My Learning page** (`/my-learning`):
   - Integrates into the main navigation (`HeaderNav` with `activeTab="my-learning"`).
   - Shows a sign-in card if the user is unauthenticated.
   - Shows an empty state with a "Browse Courses" CTA if the user is enrolled in zero courses.
   - Shows learning metrics (enrolled courses, lessons completed, in-progress count) and enrolled course cards with live progress bars and "Continue Learning" buttons linking directly to their next incomplete lesson.

---

## Skills Consulted
- `AGENTS.md` (Sections 1, 2, 5, 7, 8, 12, 13)
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`)
- `clerk-nextjs-patterns` (`.agents/skills/clerk-nextjs-patterns/SKILL.md`)
- `clerk` (`.agents/skills/clerk/SKILL.md`)

---

## Code & Configuration Inspected
- `AGENTS.md`:
  - Section 5 & 7: Writes to progress/enrollment must only go through server routes using a server-side write token; Clerk `userId` keys all learner state; browsing remains public.
  - Section 8: `progressRecord` captures learner state.
  - Section 12: Private dataset, keep secret tokens strictly server-side.
- `studio/schemaTypes/documents/progressRecord.ts`:
  - Contains `userId`, `completedLessons`, `lastLesson`, `lastPositionSeconds`, `updatedAt`.
  - Needs `enrolledCourses` array of references to `course`.
- `components/course/CourseHeroActions.tsx`:
  - Unconditionally renders "Continue Learning". Needs conditional rendering based on enrollment status: "Enroll Now" vs "Continue Learning".
- `components/course/StickyCourseProgress.tsx`:
  - Unconditionally renders "Continue Learning". Needs "Enroll Now" CTA when learner is not enrolled in the course.
- `app/courses/[slug]/page.tsx`:
  - Course detail page; passes course metadata, slug, and lesson slugs to hero actions and sticky progress.
- `components/providers/LearnerProgressProvider.tsx`:
  - Manages `completedLessons` and syncs with `/api/progress`.
  - Needs extension to manage `enrolledCourses`, `isCourseEnrolled(courseSlug)`, and `enrollCourse(courseSlug, courseTitle)`.
- `app/api/progress/route.ts`:
  - Server route reading and writing `progressRecord` in Sanity.
  - Will be enhanced to return `enrolledCourseSlugs`.
- `components/ui/HeaderNav.tsx`:
  - Already contains navigation link `/my-learning` with `activeTab === "my-learning"` support.
- `lib/analytics/events.ts`:
  - PostHog events taxonomy. Needs `course_enrolled` event tracking.

---

## Decisions & Assumptions
1. **Schema Extension (`progressRecord`)**:
   Add `enrolledCourses` array of references to `course` in `studio/schemaTypes/documents/progressRecord.ts`.
2. **Server-Side API Route (`/api/enroll`)**:
   - `POST /api/enroll`: Gated by Clerk `auth()`. Validates Clerk `userId`, checks/creates `progressRecord`, patches `enrolledCourses` array with course reference, captures PostHog server event `course_enrolled`, and returns updated `enrolledCourseSlugs`.
   - `GET /api/progress`: Enhanced to return `enrolledCourseSlugs` along with `completedLessonSlugs`. Also automatically treats any course with completed lessons as enrolled to prevent state discrepancy.
3. **Client State in `LearnerProgressProvider`**:
   - Stores `enrolledCourses: Set<string>` in React context with `localStorage` fallback (`vertex_enrolled_courses`).
   - `isCourseEnrolled(courseSlug)`: Checks if `courseSlug` (or alias `nextjs-for-production` / `nextjs-app-router-in-depth`) is in `enrolledCourses` or has any completed lessons.
   - `enrollCourse(courseSlug, courseTitle)`: Optimistically adds course to `enrolledCourses`, persists to `localStorage`, dispatches `POST /api/enroll`, and tracks PostHog `course_enrolled` client event.
   - Supports auto-enrolling a pending course if an unauthenticated user clicked "Enroll Now" and just finished signing in.
4. **Course Page CTA Logic**:
   - `CourseHeroActions.tsx`:
     - If `!isCourseEnrolled(courseSlug)`: Shows terracotta primary "Enroll Now" button with `ArrowRight` icon.
       - If signed out: triggers Clerk sign in modal (`SignInButton mode="modal"`).
       - If signed in: calls `enrollCourse(courseSlug, courseTitle)` and immediately updates to "Continue Learning".
     - If `isCourseEnrolled(courseSlug)`: Shows "Continue Learning" button linking to next uncompleted lesson.
   - `StickyCourseProgress.tsx`:
     - If `!isCourseEnrolled(courseSlug)`: Shows "Course Enrollment: Not enrolled" and "Enroll Now" CTA.
     - If `isCourseEnrolled(courseSlug)`: Shows "Your Progress: X% complete" and "Continue Learning" CTA.
5. **My Learning Page (`app/my-learning/page.tsx`)**:
   - Server Component fetching all courses from Sanity.
   - Renders `HeaderNav` with `activeTab="my-learning"`, breadcrumbs ("Home" > "My Learning"), and `MyLearningClient`.
   - Beautiful responsive UI conforming strictly to Vertex design system:
     - Header: "My Learning" pill badge, Playfair Display heading "Your Courses & Progress", description.
     - Unauthenticated state: Card with sign-in prompt and "Sign In to Vertex" button.
     - Empty enrolled state: Friendly empty card with "Explore Courses" button linking to `/courses`.
     - Enrolled state:
       - 3 metric highlight cards: Enrolled Courses count, Lessons Completed count, Courses In-Progress count.
       - Enrolled course cards grid:
         - Course logo/icon (Next.js, Docker, TypeScript, Python, etc.)
         - Title, level, duration, module count
         - Percentage progress bar with "X% complete (N of M lessons)"
         - Primary CTA: "Continue Learning" (or "Start Learning" if 0%) linking directly to the first incomplete lesson
         - Secondary link: "View Course Overview"
     - Background: repeating subtle graph paper grid and stepped columns graphic at bottom.

---

## Files to Touch / Create
1. `studio/schemaTypes/documents/progressRecord.ts`: Add `enrolledCourses` field.
2. `lib/analytics/events.ts`: Add `course_enrolled` event and `trackCourseEnrolled` helper.
3. `app/api/enroll/route.ts`: Create server endpoint for enrollment mutations.
4. `app/api/progress/route.ts`: Update `GET` to include `enrolledCourseSlugs`.
5. `components/providers/LearnerProgressProvider.tsx`: Add enrollment state, `isCourseEnrolled`, and `enrollCourse`.
6. `components/course/CourseHeroActions.tsx`: Conditional "Enroll Now" vs "Continue Learning".
7. `components/course/StickyCourseProgress.tsx`: Conditional "Enroll Now" vs "Continue Learning".
8. `app/courses/[slug]/page.tsx`: Pass `courseTitle` to hero actions and sticky progress.
9. `components/learning/MyLearningClient.tsx`: Create rich client component for My Learning page.
10. `app/my-learning/page.tsx`: Create Next.js App Router page for `/my-learning`.

---

## Security Considerations
- All writes to Sanity use server-only `writeClient` inside `/api/enroll` and `/api/progress`.
- Secret tokens (`SANITY_API_WRITE_TOKEN`, `CLERK_SECRET_KEY`) remain strictly on the server.
- Clerk `auth()` validates user identity; unauthenticated writes are rejected with 401.
- Zero PII tracked in PostHog beyond Clerk `userId`.

---

## Acceptance Criteria
- [ ] On course detail page (`/courses/[slug]`), if user is not enrolled, the hero actions button and sticky bottom button display "Enroll Now" instead of "Continue Learning".
- [ ] Clicking "Enroll Now" when signed out triggers Clerk sign-in modal.
- [ ] Clicking "Enroll Now" when signed in records the enrollment in Sanity, tracks `course_enrolled` in PostHog, and switches the button to "Continue Learning".
- [ ] Navigating to `/my-learning` renders the page with `activeTab="my-learning"` in `HeaderNav`.
- [ ] When signed out on `/my-learning`, shows a clean prompt to sign in.
- [ ] When signed in with no enrolled courses, shows an empty state with a link to `/courses`.
- [ ] When enrolled in one or more courses, `/my-learning` shows stats and enrolled course cards with live progress bars and "Continue Learning" buttons.
- [ ] `npm run lint` and `npx tsc --noEmit` pass with zero errors.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## Manual Test Steps
1. Start dev server: `npm run dev`.
2. Visit `/courses/nextjs-for-production` while not enrolled:
   - Verify hero action displays "Enroll Now".
   - Verify sticky bottom bar displays "Enroll Now".
3. Click "Enroll Now":
   - If signed out: verify Clerk modal opens.
   - If signed in: verify button transitions to "Continue Learning".
4. Click "My Learning" in the top navigation:
   - Verify URL is `/my-learning` and "My Learning" tab is highlighted in orange.
   - Verify enrolled courses are displayed with correct progress percentage and "Continue Learning" button.
5. Click "Continue Learning" on an enrolled course:
   - Verify it navigates to the first uncompleted lesson.
