# Implementation Prompt: Seed Comprehensive Sample Content in Sanity

## Goal
Seed realistic, production-grade sample content into the Sanity `production` dataset for Vertex LMS. This includes 6 categories, 5 detailed instructors, 10 complete courses spanning web development, AI engineering, data, languages, backend, systems, and security, with 40 modules and 120 lessons (with rich Portable Text notes, key points, resources, and video URLs), plus video intelligence records and the agent search configuration document. Ensure all relationships and durations are strictly consistent (module duration equals sum of lesson durations, course duration equals sum of module durations).

---

## Skills Consulted
- `AGENTS.md` (Section 2: How to work; Section 7: Decisions already made; Section 8: Content modeling; Section 9: Video transcripts; Section 10: Search config document; Section 11: Search behavior; Section 12: Pitfalls & boundaries; Section 13: Checks to run)
- `sanity-best-practices` (`references/schema.md`, `references/groq.md`, `references/image.md`, `references/migration.md`)
- `sanity-migration` (`SKILL.md`)
- `content-modeling-best-practices` (`SKILL.md`)

---

## Code & Configuration Inspected
- `studio/schemaTypes/documents/`:
  - `course.ts`: requires `title`, `slug`, `summary`, `coverImage`, `badgeIcon` (`nextjs`, `typescript`, `docker`, `react`, `python`, `database`), `level`, `duration` (string e.g. "2h 15m"), `price`, `popular`, `studentCount`, `instructor` (ref), `category` (ref), `learningOutcomes` (array of `learningOutcome`), `modules` (array of embedded `module` objects).
  - `lesson.ts`: requires `title`, `slug`, `videoUrl`, `thumbnail`, `duration` (string display, e.g. "5:50"), `durationSeconds` (number, e.g. 350), `freePreview`, `studentCount`, `keyPoints` (string[]), `proTip` (optional string), `notes` (Portable Text `blockContent`), `resources` (array of `resource`).
  - `instructor.ts`: requires `name`, `slug`, `photo` (image asset), `expertise` (string title), `bio` (text).
  - `category.ts`: requires `title`, `slug`, `description`.
  - `video.ts`: requires `videoId`, `url`, `provider` ('youtube'), `chapters` (`{ startSeconds, label }[]`), `chunks` (`{ startSeconds, text }[]`).
  - `agentContext.ts`: requires `name`, `scopeFilter`, `instructions`.
- Existing files in `studio/scripts/seed/`:
  - `seed.ndjson`: 141 pre-structured documents (6 categories, 5 instructors, 10 courses, 120 lessons) with rich Portable Text, key points, and zero broken references, but needing duration format alignment (`duration` string vs `durationSeconds` number on lessons, calculated `duration` string on courses, schema alignment on instructor `expertise` string and `bio` text, and real Sanity image asset references).
  - `videos.json`: 120 mapped YouTube tutorial videos with titles, video IDs, and durations.
- Next.js web application:
  - `sanity/lib/queries.ts`: `allCoursesQuery`, `courseBySlugQuery`, `lessonBySlugQuery`, `allInstructorsQuery`, `allCategoriesQuery`.
  - `types/sanity.ts`: TypeScript interfaces for courses, modules, lessons, instructors, categories.
  - `sanity/lib/image.ts`: `@sanity/image-url` builder requiring Sanity image assets.
  - `.env.local`: `NEXT_PUBLIC_SANITY_PROJECT_ID="zq8k8g90"`, `NEXT_PUBLIC_SANITY_DATASET="production"`, `SANITY_API_READ_TOKEN` with confirmed mutation permissions.

---

## Decisions & Assumptions
1. **Content Scope & Catalog Depth**:
   - **6 Categories**:
     - Web Development (`category.web-development`)
     - AI Engineering (`category.ai-engineering`)
     - Backend & Infrastructure (`category.backend-infrastructure`)
     - Data (`category.data`)
     - Languages (`category.languages`)
     - Security (`category.security`)
   - **5 Instructors**:
     - Mira Kovac (Frontend Architecture & Performance, Next.js / React)
     - Daniel Okafor (Data Modeling, TypeScript, PostgreSQL)
     - Priya Raman (AI Systems, LLMs, RAG & Evaluation)
     - Tomas Berg (Distributed Systems, Python, System Design)
     - Alina Costa (DevOps, Cloud Infrastructure, Docker, Kubernetes & Security)
     Each instructor will have a high-resolution portrait uploaded as a genuine Sanity image asset, a concise professional expertise headline string, and an insightful markdown/text biography.
   - **10 Complete Courses**:
     1. *Next.js App Router in Depth* (Web Development, Intermediate, 4 modules, 12 lessons, badge: `nextjs`, price: $89, popular: true)
     2. *React Performance Engineering* (Web Development, Advanced, 4 modules, 12 lessons, badge: `react`, price: $119, popular: true)
     3. *TypeScript for Application Developers* (Languages, Intermediate, 4 modules, 12 lessons, badge: `typescript`, price: $79, popular: false)
     4. *Building AI Apps with LLMs* (AI Engineering, Intermediate, 4 modules, 12 lessons, badge: `python`, price: $99, popular: true)
     5. *Retrieval-Augmented Generation from Scratch* (AI Engineering, Advanced, 4 modules, 12 lessons, badge: `python`, price: $129, popular: false)
     6. *Python for Data Work* (Data, Beginner, 4 modules, 12 lessons, badge: `python`, price: $0, popular: true)
     7. *System Design Foundations* (Backend & Infrastructure, Intermediate, 4 modules, 12 lessons, badge: `database`, price: $109, popular: false)
     8. *PostgreSQL for Developers* (Data, Intermediate, 4 modules, 12 lessons, badge: `database`, price: $89, popular: false)
     9. *DevOps with Docker and Kubernetes* (Backend & Infrastructure, Advanced, 4 modules, 12 lessons, badge: `docker`, price: $139, popular: true)
     10. *Practical Web Security* (Security, Intermediate, 4 modules, 12 lessons, badge: `nextjs`, price: $99, popular: false)
   - **120 Lessons**:
     - 4 modules per course, 3 lessons per module.
     - Real YouTube tutorial embed URLs mapped to actual topics.
     - Rich notes in Portable Text with headings, code explanations, bullet points.
     - Key points bullet arrays, pro tips, and documentation resources.

2. **Strict Duration & Structural Consistency**:
   - Every lesson will have:
     - `durationSeconds`: exact integer seconds (e.g., 350s).
     - `duration`: human-readable formatted string (e.g., "5:50" or "12:28").
   - Module duration: sum of its constituent lessons' seconds.
   - Course duration: exact sum of all module durations, formatted cleanly as e.g. "1h 59m", "2h 21m", "3h 35m".
   - Student count coherence: Course student count represents active enrolled base, and lesson counts follow a logical progression curve across the modules.

3. **Search & Intelligence Data**:
   - Seed 120 dedicated `video` documents (`_id: video.<lessonSlug>` or derived from video URL) containing:
     - `videoId`, `url`, `provider: 'youtube'`
     - `chapters`: array of `{ _key, startSeconds, label }` timestamped milestones derived from the lesson's key points and topics.
     - `chunks`: array of `{ _key, startSeconds, text }` timestamped transcript chunks derived from the lesson notes, enabling granular timestamp search grounding per AGENTS.md Section 7 & 11.
   - Seed `agentContext` search configuration document:
     - `_id: "agentContext.default"`
     - `name`: "Vertex Search Agent"
     - `scopeFilter`: `_type in ["course", "lesson", "instructor", "category"]`
     - `instructions`: Grounded query and ranking guidance matching AGENTS.md Sections 7, 10, and 11.

4. **Image Asset Handling**:
   - Download and upload real image assets to Sanity's Asset API (`/assets/images/production`) for instructors and course covers, storing canonical `{ asset: { _type: 'reference', _ref: assetId } }` references.
   - This ensures `@sanity/image-url` builds valid URLs seamlessly on the Next.js frontend without broken images.

5. **Repeatable, Idempotent Seed Pipeline**:
   - A dedicated script `studio/scripts/seed/seed.mjs` that can be run with `npm run seed` or `npm run --prefix studio seed`.
   - Uses `createOrReplace` batch mutations against Sanity HTTP API so that running it multiple times converges without duplicates.
   - Outputs progress, verifies counts upon completion, and runs sample GROQ queries to validate relationship integrity.

---

## Files to Touch / Create
- `studio/scripts/seed/seed.mjs` (automated seeding script with asset upload, duration calculation, and mutation batching)
- `studio/scripts/seed/seed.ndjson` (updated with formatted duration strings, durationSeconds, and schema fixes)
- `studio/package.json` (add convenience script `"seed": "node scripts/seed/seed.mjs"`)
- `package.json` (root: add `"sanity:seed": "npm run seed --prefix studio"`)

---

## Security Considerations
- The API read/write token is read strictly from `.env.local` during local seeding and is never committed to Git.
- Dataset is private and client components never receive write tokens.

---

## Acceptance Criteria
- [ ] 6 categories seeded and queryable in Sanity (`category.web-development`, `category.ai-engineering`, etc.).
- [ ] 5 instructors seeded with uploaded photos, expertise strings, and bios.
- [ ] 10 courses seeded across web, AI, data, systems, languages, and security with valid badges and learning outcomes.
- [ ] 120 lessons seeded with valid slugs, YouTube video URLs, formatted display durations, `durationSeconds`, key points, pro tips, resources, and Portable Text notes.
- [ ] Course and module durations are mathematically consistent: module duration equals the sum of its lessons, course duration equals the sum of its modules.
- [ ] 120 `video` intelligence documents seeded with chapter markers and transcript chunks for search grounding.
- [ ] `agentContext` configuration document seeded with content filter and query instructions.
- [ ] Image assets uploaded as real Sanity image assets so `@sanity/image-url` works smoothly in Next.js.
- [ ] GROQ validation confirms 0 broken references and verified document counts.
- [ ] Next.js type check passes (`npx tsc --noEmit`).

---

## Checks to Run
- `npm run --prefix studio seed` (executes the seed script and prints verification summary)
- Node validation script verifying GROQ query execution for `allCoursesQuery`, `courseBySlugQuery`, and `lessonBySlugQuery`
- `npx tsc --noEmit` in root workspace
- `npm run lint` in root workspace

---

## Manual Test Steps
1. In `studio/`, verify Sanity Studio (`http://localhost:3333`):
   - Open Course Catalog -> view the 10 courses, check images, badge icons, prices, categories, and instructors.
   - Open any Course -> inspect modules and ordered lessons, verify total duration matches module sum.
   - Open Lesson Content -> inspect lesson notes (Portable Text), key points, duration display, and video URL.
   - Open Instructors -> verify 5 instructors with photos and bios.
   - Open Video Intelligence -> verify video documents with chapters and chunks.
   - Open Agent & Search Config -> verify "Vertex Search Agent" configuration.
2. In Studio Vision tool (`http://localhost:3333/vision`):
   - Execute `*[_type == "course"]{title, duration, "modules": count(modules), "lessons": count(modules[].lessons[])}`.
   - Execute `*[_type == "category"]{title, "courseCount": count(*[_type == "course" && references(^._id)])}`.
3. In web workspace (`http://localhost:3000`):
   - Run Next.js dev server and verify no build or data fetching errors occur.
