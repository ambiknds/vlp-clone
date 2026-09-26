# Implementation Prompt: Setup Sanity Studio Workspace

## Goal
Resolve the npm cache locking error (`ECOMPROMISED`), initialize a standalone Sanity Studio workspace in `studio/` for the Vertex project, configure TypeGen, and prepare the core content schemas specified in `AGENTS.md`.

---

## Skills Consulted
- `AGENTS.md` (Section 5: Two standalone workspaces in one repo; Section 6: Tech stack; Section 8: Content modeling; Section 12: Pitfalls & boundaries; Section 13: Checks to run)
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`, `references/project-structure.md`, `references/schema.md`)

---

## Code & Configuration Inspected
- Root repository: `d:\learning\vertex-lms` currently holds the Next.js 16 web application.
- `.env.local`: Contains Clerk credentials; Sanity project variables will be added once created.
- npm cache: Identified and resolved lockfile corruption (`ECOMPROMISED`) via `npm cache verify` and `npm cache clean --force`.

---

## Decisions & Assumptions
1. **Cache Fix**: Cleared corrupted npm cache with `npm cache clean --force` so `npm create sanity@latest` can execute without `ECOMPROMISED` error.
2. **Standalone Workspace**: Following `AGENTS.md` Section 5, the Studio will reside in `studio/` as an independent workspace, never embedded into Next.js.
3. **Interactive Initialization**: The user runs `npm create sanity@latest studio` in their terminal to authenticate interactively with their Sanity account and select/create their Sanity project and `production` dataset with the **Clean project with no predefined schemas** template and TypeScript.
4. **Schema Architecture (AGENTS.md Section 8)**:
   - `course`: Top-level document (title, slug, marketing fields, learning outcomes, instructor reference, category reference, modules array).
   - `module`: Embedded object inside course (title, summary, lessons reference array).
   - `lesson`: Standalone document (title, slug, video URL, poster/thumbnail, duration, free preview flag, rich text notes in Portable Text, key points, pro tip, resources).
   - `instructor`: Standalone document (name, slug, photo, expertise, bio).
   - `category`: Standalone document (title, slug, description).
   - `video`: Dedicated video document for ingestion pipeline (url, chapters array of `{ startSeconds, label }`, chunks array of `{ startSeconds, text }`).
   - `agentContext`: Search configuration document for the Sanity Context MCP (content scope filter and query instructions).
   - `progressRecord`: Learner progress document keyed by Clerk user id (completed lessons, resume position).
5. **TypeGen Configuration**: Configure `studio/sanity.cli.ts` to output generated types for use by the web workspace.

---

## Files to Touch / Create
- `prompts/setup-sanity-studio.md`: This implementation prompt document.
- `studio/sanity.config.ts`: Sanity Studio configuration (plugins, schemas, structure).
- `studio/sanity.cli.ts`: Sanity CLI configuration (project ID, dataset, TypeGen paths).
- `studio/package.json`: Studio dependencies and scripts.
- `studio/schemaTypes/index.ts`: Central schema registry.
- `studio/schemaTypes/documents/*`: Content schemas (`course.ts`, `lesson.ts`, `instructor.ts`, `category.ts`, `video.ts`, `agentContext.ts`, `progressRecord.ts`).
- `studio/schemaTypes/objects/*`: Object schemas (`module.ts`, `learningOutcome.ts`, `resource.ts`).

---

## Security Considerations
- Sanity write tokens and read tokens must remain strictly server-side in the web application's environment.
- Studio dataset is private; browser never receives read/write tokens directly.
- The Studio workspace uses its own configuration and dependencies.

---

## Acceptance Criteria
- [x] npm cache cleaned and verified (`npm cache clean --force`), resolving `ECOMPROMISED`.
- [ ] User runs `npm create sanity@latest studio` in terminal to authenticate and link Sanity project.
- [ ] Standalone Studio workspace established in `studio/`.
- [ ] Core schemas configured matching `AGENTS.md` specifications.
- [ ] Studio builds and launches cleanly with `npm run dev` in `studio/`.

---

## Checks to Run
- In `studio/`: `npm run build` or `npx sanity schema extract`
- In web: `npm run lint` and `npx tsc --noEmit`

---

## Manual Test Steps
1. In your terminal at `d:\learning\vertex-lms`, run:
   ```bash
   npm create sanity@latest studio
   ```
2. When prompted:
   - Select or log in with your Sanity account.
   - Choose or create a new project (e.g. `vertex-lms`).
   - Select default dataset (`production`).
   - Choose the template: **Clean project with no predefined schemas**.
   - Choose **TypeScript**: Yes.
   - Choose package manager: **npm**.
3. Once completed, we will structure all schema types per `AGENTS.md` and verify the Studio.
