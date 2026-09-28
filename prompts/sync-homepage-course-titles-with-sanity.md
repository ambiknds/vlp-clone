# Implementation Prompt: Sync Homepage Course Titles and Metadata with Seeded Sanity Content

## Goal
Ensure the course titles, summaries, durations, levels, and module counts displayed on the homepage (`app/page.tsx`) strictly match the course titles and details from the seeded Sanity content and their corresponding course detail pages, specifically fixing the discrepancy where the homepage displayed hardcoded titles like "Docker Essentials" and "TypeScript Deep Dive" instead of the Sanity titles "DevOps with Docker and Kubernetes" and "TypeScript for Application Developers".

---

## Skills Consulted
- `AGENTS.md`: Section 2 (loop process), Section 7 (grounded data: "Say only what the data returns. Never invent a course, lesson, price, duration, or timestamp."), Section 5 (pages are read-only and display stored data).
- `sanity-best-practices`: Rendering Sanity query results faithfully on frontend surfaces.

---

## Code & Configuration Inspected
- `app/page.tsx`: Currently mapping `dockerCourse` with static override `title: "Docker Essentials"` and `tsCourse` with static override `title: "TypeScript Deep Dive"`.
- `app/courses/[slug]/page.tsx`: Course detail page showing real Sanity content: `DevOps with Docker and Kubernetes` and `TypeScript for Application Developers`.
- User screenshot 1: Homepage course cards ("Next.js for Production", "Docker Essentials", "TypeScript Deep Dive").
- User screenshot 2: Course detail page for Docker showing title `DevOps with Docker and Kubernetes`, summary `Containerise an application...`, level `Advanced`, duration `2h 39m`, and `4 modules`.

---

## Requirements

### Functional Requirements
1. **Dynamic Course Field Mapping**:
   - In `app/page.tsx`, map the course cards directly from the fetched Sanity documents:
     - **Docker / DevOps Course**:
       - Title: `dockerCourse.title` (`"DevOps with Docker and Kubernetes"`).
       - Summary: `dockerCourse.summary` (`"Containerise an application, run it on Kubernetes, ship it through a pipeline, and operate it once it is live."`).
       - Level: `dockerCourse.level` (`"Advanced"`).
       - Duration: `dockerCourse.duration` (`"2h 39m"`).
       - Module Count: `dockerCourse.moduleCount` (`4`).
     - **TypeScript Course**:
       - Title: `tsCourse.title` (`"TypeScript for Application Developers"`).
       - Summary: `tsCourse.summary` (`"Go past annotations. Structural typing, narrowing, generics, and the type-level tools that make invalid states impossible."`).
       - Level: `tsCourse.level` (`"Intermediate"`).
       - Duration: `tsCourse.duration` (`"1h 54m"`).
       - Module Count: `tsCourse.moduleCount` (`4`).
     - **Next.js Course**:
       - Retain 1:1 fidelity with the Next.js for Production course detail page (`/courses/nextjs-for-production`): title `"Next.js for Production"`, duration `"18h 24m"`, `12 modules`.
2. **Consistency Across Pages**:
   - Ensure the card title on the homepage is identical to the title displayed when clicking into that course's detail page (`/courses/[slug]`) and on the catalog page (`/courses`).

### Visual & Design Requirements
- Preserve card layout, rounded corners (`rounded-[16px]`), hover transitions, and custom badge icons (`DockerIcon`, `TypeScriptIcon`, `NextjsIcon`).
- Title styling remains Playfair Display serif bold with smooth color hover.

---

## Decisions & Assumptions
1. **Direct Sanity Field Usage**:
   - Instead of hardcoding `"Docker Essentials"` or `"TypeScript Deep Dive"` strings, use `dockerCourse.title` and `tsCourse.title` directly so any title changes in Sanity immediately reflect on both the homepage and detail pages.
2. **Fallback Safety**:
   - Provide fallback to `course.title` or sensible defaults only if the field is absent.

---

## Files to Touch / Create
- `prompts/sync-homepage-course-titles-with-sanity.md`: This implementation prompt.
- `app/page.tsx`: Update `displayCourses` mapping to use Sanity `title`, `summary`, `level`, `duration`, and `moduleCount`.

---

## Security Considerations
- Read-only data fetched via `sanityFetch` server-side. No tokens exposed.

---

## Acceptance Criteria
- [ ] The Docker card on the homepage displays title `"DevOps with Docker and Kubernetes"` matching the course detail page.
- [ ] The Docker card metadata matches the detail page (`Advanced`, `2h 39m`, `4 modules`).
- [ ] The TypeScript card on the homepage displays title `"TypeScript for Application Developers"` matching the course detail page.
- [ ] The TypeScript card metadata matches the detail page (`Intermediate`, `1h 54m`, `4 modules`).
- [ ] The Next.js card matches the title and metadata of the Next.js course detail page.
- [ ] `npx tsc --noEmit` and `npm run lint` pass with 0 errors.
- [ ] `npm run build` succeeds.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## Manual Test Steps
1. Navigate to `http://localhost:3000` in the browser.
2. Verify the 3 course cards under "All Courses":
   - Card 1: `Next.js for Production` (18h 24m, 12 modules)
   - Card 2: `DevOps with Docker and Kubernetes` (Advanced, 2h 39m, 4 modules)
   - Card 3: `TypeScript for Application Developers` (Intermediate, 1h 54m, 4 modules)
3. Click "DevOps with Docker and Kubernetes" and verify the course detail page displays the exact same title and metadata.
4. Click "TypeScript for Application Developers" and verify the course detail page displays the exact same title and metadata.
