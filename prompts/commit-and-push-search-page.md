# Implementation Prompt: Commit and Push Search Page and Video Pipeline Updates

## Goal
Stage, commit, and push the verified Vertex search page UI improvements, grounded search optimizations, video ingestion pipeline offline tooling, and associated prompts to `origin/main`.

---

## Skills Consulted
- `AGENTS.md` (Section 2: How to work; Section 5: App structure & boundaries; Section 12: Secrets & environment safety; Section 13: Checks to run)

---

## Code & Configuration Inspected
- **Git Status**:
  - Current branch: `main` tracking `origin/main`.
  - Modified files:
    - `app/search/page.tsx`: Updated HeaderNav active tab, uppercase eyebrow badge, and clean meta bar without divider.
    - `components/search/CourseBadgeIcon.tsx`: Added Node.js and JavaScript badge presets.
    - `components/search/SearchResultCardLesson.tsx`: Removed unused import, refined topic icons, key points bullets, checkmark badge, and clean module label.
    - `components/search/SearchResultCardVideo.tsx`: Added themed thumbnail previews, play button overlay, duration badge, clean descriptions, and watch action.
    - `lib/search/grounded-search.ts`: Grounded search query resolution with course badge mapping and clean description extraction.
    - `package.json`: Added `video:ingest` script command.
  - Untracked files:
    - `prompts/implement-vertex-search-page.md`: Approved implementation prompt for search page.
    - `prompts/implement-vertex-video-ingestion-pipeline.md`: Approved implementation prompt for video ingestion pipeline.
    - `scripts/`: Offline video pipeline tooling.
- **Secrets & Gitignore**:
  - Confirmed `.env.local` is ignored by Git via `git check-ignore`.
  - Confirmed no secrets, private API tokens, or credentials exist in staged files.
- **Verification Checks**:
  - `npx tsc --noEmit`: Exited 0 with no errors.
  - `npm run lint`: Exited 0 with no errors.
  - HTTP 200 verification of `/search?q=data+fetching` and `/api/search?q=data+fetching`.

---

## Decisions & Assumptions
1. **Branch**: Commit and push directly to `origin/main`.
2. **Commit Message**: Use conventional commit format:
   `feat(search): polish search page UI to match design and wire video ingestion pipeline`
3. **Inclusions**:
   - `app/search/page.tsx`
   - `components/search/CourseBadgeIcon.tsx`
   - `components/search/SearchResultCardLesson.tsx`
   - `components/search/SearchResultCardVideo.tsx`
   - `lib/search/grounded-search.ts`
   - `package.json`
   - `scripts/`
   - `prompts/implement-vertex-search-page.md`
   - `prompts/implement-vertex-video-ingestion-pipeline.md`
   - `prompts/commit-and-push-search-page.md`

---

## Files to Touch / Stage
- `app/search/page.tsx`
- `components/search/CourseBadgeIcon.tsx`
- `components/search/SearchResultCardLesson.tsx`
- `components/search/SearchResultCardVideo.tsx`
- `lib/search/grounded-search.ts`
- `package.json`
- `scripts/`
- `prompts/implement-vertex-search-page.md`
- `prompts/implement-vertex-video-ingestion-pipeline.md`
- `prompts/commit-and-push-search-page.md`

---

## Security Considerations
- Ensure `.env.local` remains untracked.
- Verify no server tokens (`SANITY_API_READ_TOKEN`, `SANITY_API_DEVELOPER_TOKEN`, `CLERK_SECRET_KEY`) are committed.

---

## Acceptance Criteria
- [ ] All modified search and video pipeline files staged.
- [ ] Working tree clean after commit.
- [ ] Commit pushed successfully to `origin/main`.
- [ ] `git status` verifies clean state.

---

## Checks to Run
- `git add .`
- `git status`
- `git commit -m "feat(search): polish search page UI to match design and wire video ingestion pipeline"`
- `git push origin main`
- `git status`

---

## Manual Test Steps
1. Run `git status` to verify branch `main` is clean and up to date with `origin/main`.
2. Run `git log -1` to inspect the newly pushed commit.
