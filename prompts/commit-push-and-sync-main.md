# Implementation Prompt: Commit, Push, and Sync Main Branch

## Goal
Stage, commit, push, and sync all pending workspace changes—comprising PostHog product analytics integration, telemetry logging in `sanityFetch`, Clerk user identity sync in header navigation, client event tracking across courses and catalog, global error tracking, and PostHog setup reports—to `origin/main`.

---

## Skills & Guidelines Consulted
- `AGENTS.md`: Section 2 (loop: prompt creation, user confirmation modal, execution, and short bullet report), Section 5 (security boundaries, public vs server tokens), Section 7 (PostHog product analytics decisions), Section 12 (secrets handling and env variables), Section 13 (checks: type check, lint, production build).

---

## Code & Configuration Inspected
- **Git Branch Status**:
  - Current branch: `main` (tracking `origin/main`).
  - No divergent branches; operations will be directly committed and pushed to `main`.
- **Environment & Secrets Safety**:
  - `.gitignore`: Verified `.env.local` is ignored (`git check-ignore .env.local` passed).
  - `.env.example`: Only contains sanitized public token placeholder `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN="phc_..."` and dummy host.
  - `instrumentation.ts` & `instrumentation-client.ts`: Read keys via `process.env.*`, no hardcoded secrets.
  - Reports (`posthog-self-driving-report.md`, `posthog-replay-vision-report.md`): Audited, no tokens or private secrets found.
- **Verification Checks Already Passed**:
  - TypeScript compiler check (`npx tsc --noEmit`): Exited 0 with no errors.
  - ESLint check (`npm run lint`): Exited 0 with no errors.
  - Production build (`npm run build`): Exited 0, all routes compiled cleanly.

---

## Decisions & Assumptions
1. **Branch Handling**: The workspace is already on the `main` branch. Merging into `main` is effectively satisfied by committing on `main` and pushing to `origin/main`.
2. **Commit Staging Scope**:
   - All modified application code and configuration files (`.env.example`, `.gitignore`, `package.json`, `package-lock.json`, `sanity/lib/fetch.ts`, course components, navigation).
   - Untracked runtime instrumentation files (`app/global-error.tsx`, `instrumentation.ts`, `instrumentation-client.ts`).
   - Documentation and reports (`posthog-self-driving-report.md`, `posthog-replay-vision-report.md`).
   - Claude skill directories in `.claude/skills/`.
   - Implementation prompt (`prompts/commit-push-and-sync-main.md`).
   - `.env.local` remains strictly untracked and excluded.
3. **Commit Convention**:
   - Use conventional commit format: `feat(analytics): add PostHog event tracking, error monitoring, and telemetry instrumentation`.

---

## Files to Touch / Stage
- Modified files:
  - [`.env.example`](file:///d:/learning/vertex-lms/.env.example)
  - [`.gitignore`](file:///d:/learning/vertex-lms/.gitignore)
  - [`package.json`](file:///d:/learning/vertex-lms/package.json)
  - [`package-lock.json`](file:///d:/learning/vertex-lms/package-lock.json)
  - [`sanity/lib/fetch.ts`](file:///d:/learning/vertex-lms/sanity/lib/fetch.ts)
  - [`app/courses/[slug]/page.tsx`](file:///d:/learning/vertex-lms/app/courses/[slug]/page.tsx)
  - [`components/catalog/CourseCatalogClient.tsx`](file:///d:/learning/vertex-lms/components/catalog/CourseCatalogClient.tsx)
  - [`components/course/CourseHero.tsx`](file:///d:/learning/vertex-lms/components/course/CourseHero.tsx)
  - [`components/course/CourseHeroActions.tsx`](file:///d:/learning/vertex-lms/components/course/CourseHeroActions.tsx)
  - [`components/course/CourseModulesList.tsx`](file:///d:/learning/vertex-lms/components/course/CourseModulesList.tsx)
  - [`components/home/HeroSearchBar.tsx`](file:///d:/learning/vertex-lms/components/home/HeroSearchBar.tsx)
  - [`components/ui/HeaderNav.tsx`](file:///d:/learning/vertex-lms/components/ui/HeaderNav.tsx)
- Untracked files:
  - [`app/global-error.tsx`](file:///d:/learning/vertex-lms/app/global-error.tsx)
  - [`instrumentation.ts`](file:///d:/learning/vertex-lms/instrumentation.ts)
  - [`instrumentation-client.ts`](file:///d:/learning/vertex-lms/instrumentation-client.ts)
  - [`posthog-replay-vision-report.md`](file:///d:/learning/vertex-lms/posthog-replay-vision-report.md)
  - [`posthog-self-driving-report.md`](file:///d:/learning/vertex-lms/posthog-self-driving-report.md)
  - [`.claude/skills/`](file:///d:/learning/vertex-lms/.claude/skills/)
  - [`prompts/commit-push-and-sync-main.md`](file:///d:/learning/vertex-lms/prompts/commit-push-and-sync-main.md)

---

## Security Considerations
- Verify `.env.local` is never staged or committed.
- Verify no production secret keys or tokens are in any staged file.
- PostHog project token is public by design; all private credentials remain server-side and out of git.

---

## Acceptance Criteria
- [ ] All changes staged cleanly without untracked remnants or ignored files.
- [ ] Commit created with a clear, descriptive message.
- [ ] Changes pushed to `origin/main`.
- [ ] `git status` reports working tree clean and up to date with `origin/main`.

---

## Checks to Run
- `git status` to verify staging.
- `git commit -m "..."` to create the commit.
- `git push origin main` to push upstream.
- `git status` to verify repository is in sync and clean.

---

## Manual Test Steps
1. Run `git status` in terminal to confirm working tree is clean.
2. Run `git log -1` to view the latest pushed commit on `main`.
3. Check remote repository at GitHub to verify commit reflects on `main`.
