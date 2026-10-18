# Implementation Prompt: Fix Lesson Footer Nav Text Layout & Dedicated Areas

## Goal
Fix the layout collision in `LessonFooterNav.tsx` where the Next Lesson text ("Pods, ReplicaSets, and Deployments 6:28") overlaps into the "Mark as complete" button, ensuring that previous lesson text, completion action, and next lesson text each have their own clearly separated, bounded, and responsive areas without any text overlap or visual clipping.

---

## Skills Consulted
- `sanity-best-practices`: Adherence to desktop reference design in `design/vertex-lesson.png`.
- Responsive layout guidelines in AGENTS.md Section 3: "Reproduce them exactly: layout, spacing, typography, color, and states... make each page responsive down to mobile, adapting the layout sensibly while keeping the desktop exact."

---

## Code Inspected & Root Cause Analysis
1. In `components/lesson/LessonFooterNav.tsx`:
   - The footer uses a single flex container: `<footer className="... flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">`.
   - On the left: Previous lesson button and text are wrapped in `flex items-center gap-4 w-full sm:w-auto`.
   - In the center: Mark as Complete button is in `flex items-center justify-center my-2 sm:my-0` without `shrink-0` or width bounds.
   - On the right: Next lesson text and button are in `flex items-center gap-4 w-full sm:w-auto justify-end ml-auto`.
2. When the 340px lesson sidebar is open, the main content area is ~700px–850px wide. Placing 5 distinct inline items (`[Prev Button]`, `[Prev Title + Duration]`, `[Mark Complete Button]`, `[Next Title + Duration]`, and `[Next Button]`) in a single flex row exceeds the available horizontal space.
3. Because the flex containers lacked `min-w-0` and explicit column constraints, the long next lesson title failed to truncate and overflowed directly into the center "Mark as complete" button, producing the text collision shown in the user's screenshot.

---

## Decisions & Assumptions
1. **Dedicated Layout Architecture**:
   - Structure the footer into distinct, dedicated areas with strict width constraints:
     - **Completion Action Row (Dedicated Top Section)**:
       - Displays the "Mark as complete" / "Completed ✓" button centered in its own dedicated status bar with subtle divider.
       - This gives the completion action prominence while freeing up full horizontal width for the previous and next lesson navigation.
     - **Navigation Row (Dedicated Bottom Section, matching `design/vertex-lesson.png`)**:
       - Left Area: `[← Previous Lesson]` button paired with its dedicated lesson title and duration block (`min-w-0 max-w-[280px] truncate`).
       - Right Area: Dedicated next lesson title and duration block (`min-w-0 max-w-[280px] truncate text-right`) paired with `[Next Lesson →]` button.
2. **Defensive Flex & Truncation Rules**:
   - Every text container will include `min-w-0` on all parent flex items and `truncate` on the title `<span>` so text cleanly truncates with ellipsis (`...`) instead of overflowing or colliding into adjacent buttons.
   - Buttons maintain `shrink-0` so they never shrink or wrap text across lines.
3. **Mobile & Tablet Responsiveness**:
   - On mobile viewports (`< sm`), elements stack neatly:
     - Mark as complete button on top.
     - Previous and Next navigation cards stack with full touch targets and clear lesson info.

---

## Files to Modify
- `components/lesson/LessonFooterNav.tsx`: Restructure footer layout into dedicated completion and navigation tiers with strict `min-w-0`, `shrink-0`, and truncation boundaries.

---

## Acceptance Criteria
- [ ] No text collision or overlap between "Mark as complete" button and next/previous lesson titles.
- [ ] Next lesson title ("Pods, ReplicaSets, and Deployments") and duration ("6:28") reside strictly in their own dedicated area next to the Next Lesson button.
- [ ] Previous lesson title and duration reside strictly in their own dedicated area next to the Previous Lesson button.
- [ ] "Mark as complete" button sits cleanly in its own dedicated, uncrowded area.
- [ ] Layout remains visually balanced, aligned, and responsive across desktop, laptop (with 340px sidebar open), tablet, and mobile.
- [ ] Interactive toggle functionality ("Mark as complete" ⇄ "Completed ✓") and navigation ("Next Lesson", "Previous Lesson") remain fully functional.

---

## Checks to Run
1. TypeScript compilation: `npx tsc --noEmit`
2. Next.js ESLint: `npx eslint components/lesson/LessonFooterNav.tsx`
3. Next.js Production Build: `npm run build`

---

## Manual Test Steps
1. Navigate to `/lessons/devops-with-docker-and-kubernetes-docker-images-and-dockerfiles` (the lesson from the user's screenshot).
2. Scroll to the footer navigation at the bottom of the page.
3. Verify that:
   - "Previous Lesson" button and its lesson title/duration are cleanly grouped on the left.
   - "Mark as complete" is centered in its own dedicated area with clean padding and no overlapping text.
   - "Next Lesson" button and its lesson title/duration ("Pods, ReplicaSets, and Deployments") are cleanly grouped on the right with no text wrapping into the center.
4. Click "Mark as complete"; verify it toggles to "Completed ✓" without altering layout spacing or causing shifts.
5. Resize browser to smaller viewport widths; verify text truncates smoothly with ellipsis and never touches or overlaps other buttons.
