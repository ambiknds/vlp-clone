# Implementation Prompt: Sanity Content Model, Studio Workspace, & Server-Side Data Layer

## Goal
Implement the complete Sanity content model and standalone Sanity Studio workspace in `studio/` for Vertex (courses, modules, lessons, instructors, categories, plus video and search context documents), along with the server-side read client, data access layer, typed GROQ queries, Portable Text rendering, and environment configuration in the Next.js web application.

---

## Skills Consulted
- `AGENTS.md` (Section 2: How to work; Section 5: Standalone Studio vs web workspace; Section 6: Tech stack; Section 7: Decisions; Section 8: Content modeling; Section 12: Pitfalls & boundaries; Section 13: Checks to run)
- `sanity-best-practices` (`SKILL.md`, `references/schema.md`, `references/nextjs.md`, `references/project-structure.md`, `references/studio-structure.md`, `references/groq.md`, `references/typegen.md`)
- `content-modeling-best-practices` (`SKILL.md`)

---

## Code & Configuration Inspected
- Root repository: Next.js 16 (App Router) with existing UI design system in `components/ui/` (`CourseCard.tsx`, `LessonCardLesson.tsx`, `LessonCardVideo.tsx`, `ResourceCard.tsx`, `Badge.tsx`, etc.).
- Root `.env.local`: `NEXT_PUBLIC_SANITY_PROJECT_ID="zq8k8g90"` and `NEXT_PUBLIC_SANITY_DATASET="production"`.
- Untracked artifacts: `app/studio/[[...tool]]/page.tsx` and root `sanity.config.ts` from an initial embedded attempt, which violates the strict rule in `AGENTS.md` Section 5 & 12 prohibiting embedded Studios.
- Design specs in `design/`: `vertex-home.png`, `vertex-course.png`, `vertex-lesson.png`, `vertex-search.png`.

---

## Decisions & Assumptions
1. **Two Standalone Workspaces in One Repo (AGENTS.md Section 5)**:
   - Sanity Studio will live in `studio/` as its own standalone workspace with dedicated dependencies, Vite-based bundling, and independent deployment (`sanity deploy`), preserving automatic updates and TypeGen.
   - The untracked embedded Next.js studio route `app/studio/` will be removed.
   - Root `package.json` will have convenience scripts (`npm run studio`, `npm run studio:build`, `npm run typegen`).

2. **Schema Architecture (AGENTS.md Section 8)**:
   - **`course`** (top-level document): `title`, `slug`, `summary`, `coverImage`, `badgeIcon` (for category/course icon display like Next.js, TS, Docker), `level` ('Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'), `price` (number, 0 for free), `popular` (boolean), `studentCount` (number for display), `instructor` (reference to `instructor`), `category` (reference to `category`), `learningOutcomes` (array of `learningOutcome` objects), and `modules` (ordered array of embedded `module` objects).
   - **`module`** (embedded object in course, not a separate document): `title`, `summary`, and `lessons` (ordered array of references to `lesson`). Numbers like "Module 5" or "Lesson 5.1" are derived by order at render time, not stored.
   - **`lesson`** (standalone document): `title`, `slug`, `videoUrl` (embed URL for YouTube/Vimeo/Bunny), `thumbnail` (image), `duration` (formatted display string, e.g. "12:45"), `durationSeconds` (number for seeking and progress calculation), `freePreview` (boolean), `studentCount` (number), `notes` (Portable Text array), `keyPoints` (array of strings for "In this lesson you will..."), `proTip` (optional callout text), and `resources` (array of `resource` objects with `type`, `title`, `description`, `url`, `fileSize`).
   - **`instructor`** (standalone document): `name`, `slug`, `photo` (image with hotspot), `expertise` (string), `bio` (text).
   - **`category`** (standalone document): `title`, `slug`, `description`.
   - **`video`** (dedicated document for ingestion pipeline per Section 8 & 9): `videoId`, `url`, `chapters` array of `{ startSeconds, label }`, and `chunks` array of `{ startSeconds, text }`.
   - **`agentContext`** (search config document per Section 8 & 10): `name`, `scopeFilter`, `instructions`.
   - **`progressRecord`** (learner progress document per Section 8): `userId` (Clerk user ID), `completedLessons` (array of references to `lesson`), `lastLesson` (reference to `lesson`), `lastPositionSeconds` (number), `updatedAt` (datetime).
   - Supporting objects: `module`, `learningOutcome`, `resource`, `blockContent`.

3. **Studio Desk Structure (`studio/structure.ts`)**:
   - Custom structure using `@sanity/icons` with grouped sections:
     - 🎓 Course Catalog (`course`, `category`)
     - 📖 Lesson Content (`lesson`)
     - 👤 Instructors (`instructor`)
     - 🎬 Video Intelligence (`video` - marked as ingestion data)
     - ⚙️ Agent & Search Config (`agentContext`)
     - 📊 Learner Progress (`progressRecord`)

4. **Server-Side Data Layer (AGENTS.md Section 5, 6, 12)**:
   - Private dataset with read token: `SANITY_API_READ_TOKEN` strictly server-side.
   - Client configured with `useCdn: false` for authenticated queries.
   - `sanityFetch` server helper in `sanity/lib/fetch.ts` with error handling, revalidation options, and automatic token injection.
   - Pure server-only boundary: `sanity/lib/client.ts` and `fetch.ts` will never leak tokens to the browser.
   - Canonical GROQ queries in `sanity/lib/queries.ts` using `defineQuery`:
     - `allCoursesQuery`: Catalog listing with category, instructor, module count, lesson count, total duration.
     - `courseBySlugQuery`: Full course details with instructor, category, learning outcomes, modules, and expanded lessons.
     - `lessonBySlugQuery`: Lesson details, plus reverse lookup of parent course, module title, and calculated next/previous lessons.
     - `allInstructorsQuery` & `instructorBySlugQuery`: Instructor profile and their authored courses.
     - `allCategoriesQuery`: Category listing with associated course counts.
   - Portable Text component in `components/ui/PortableText.tsx` using `@portabletext/react` for rich text lesson notes, styled cleanly to match Vertex aesthetics.
   - Canonical `.env.example` created with all configuration keys.

---

## Files to Touch / Create

### Studio Workspace (`studio/`)
- `studio/package.json`
- `studio/sanity.config.ts`
- `studio/sanity.cli.ts`
- `studio/structure.ts`
- `studio/tsconfig.json`
- `studio/schemaTypes/index.ts`
- `studio/schemaTypes/documents/course.ts`
- `studio/schemaTypes/documents/lesson.ts`
- `studio/schemaTypes/documents/instructor.ts`
- `studio/schemaTypes/documents/category.ts`
- `studio/schemaTypes/documents/video.ts`
- `studio/schemaTypes/documents/agentContext.ts`
- `studio/schemaTypes/documents/progressRecord.ts`
- `studio/schemaTypes/objects/module.ts`
- `studio/schemaTypes/objects/learningOutcome.ts`
- `studio/schemaTypes/objects/resource.ts`
- `studio/schemaTypes/objects/blockContent.ts`

### Web Workspace (`sanity/`, `types/`, `components/`)
- `sanity/env.ts` (updated to validate project ID, dataset, API version, and server read token)
- `sanity/lib/client.ts` (server-side Sanity client)
- `sanity/lib/fetch.ts` (server-only `sanityFetch` helper)
- `sanity/lib/queries.ts` (GROQ queries with `defineQuery`)
- `sanity/lib/image.ts` (Image URL builder)
- `types/sanity.ts` (TypeScript interfaces for courses, modules, lessons, instructors, categories, resources)
- `components/ui/PortableText.tsx` (Portable Text renderer for lesson notes)
- `.env.example` (committed environment variable template)
- `package.json` (root: install `@portabletext/react`, add `studio` scripts)
- Remove `app/studio/` (untracked embedded studio page) and root `sanity.config.ts`

---

## Security Considerations
- `SANITY_API_READ_TOKEN` is strictly server-only. It must NEVER have a `NEXT_PUBLIC_` prefix and must never be imported into client components.
- The dataset is private; all queries run on the Next.js server (Server Components or Server Actions).
- No write operations are exposed on the client; writes go through authenticated server routes.

---

## Acceptance Criteria
- [ ] Standalone Sanity Studio workspace created in `studio/` with independent configuration and dependencies.
- [ ] All 7 document types (`course`, `lesson`, `instructor`, `category`, `video`, `agentContext`, `progressRecord`) and 4 object types (`module`, `learningOutcome`, `resource`, `blockContent`) implemented strictly per AGENTS.md Section 8.
- [ ] Custom desk structure organizes Studio navigation with descriptive labels and icons.
- [ ] Legacy embedded studio route `app/studio/` removed.
- [ ] Web data layer (`sanity/lib/client.ts`, `sanity/lib/fetch.ts`, `sanity/lib/queries.ts`, `sanity/lib/image.ts`) configured with server-only token support and CDN bypass.
- [ ] Comprehensive GROQ queries covering Catalog, Course Detail, Lesson (with reverse parent course & prev/next navigation), and Instructor pages.
- [ ] Portable Text rendering component created for lesson notes.
- [ ] `.env.example` created and committed.
- [ ] Next.js app passes typecheck (`npx tsc --noEmit`) and linting (`npm run lint`).
- [ ] Studio builds cleanly (`npx sanity schema extract` / `npm run build` in studio).

---

## Checks to Run
- `npm run lint` in root workspace
- `npx tsc --noEmit` in root workspace
- Studio schema validation in `studio/`

---

## Manual Test Steps
1. Navigate to `studio/` and run `npm run dev` to start Sanity Studio at `http://localhost:3333`.
2. Verify Studio desk structure: Course Catalog, Lesson Content, Instructors, Video Intelligence, and Agent Config appear with icons.
3. Create test documents:
   - An Instructor (e.g. "Guillermo Rauch")
   - A Category (e.g. "Full-Stack Development")
   - A Lesson (e.g. "Data Fetching in Server Components" with notes and resources)
   - A Course (e.g. "Next.js for Production" referencing the category, instructor, with a module containing the lesson)
4. In Studio Vision tool (`http://localhost:3333/vision`), run the `allCoursesQuery` and `courseBySlugQuery` from `sanity/lib/queries.ts` to confirm data is resolved cleanly.
5. In web workspace, run `npm run dev` to verify the Next.js site boots without errors.
