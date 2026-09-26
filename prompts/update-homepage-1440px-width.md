# Implementation Prompt: Update Homepage Main Content Max-Width to 1440px

## Goal
Update the main content container and top navigation on the Vertex homepage (`app/page.tsx`) and the stepped columns graphic (`components/home/SteppedColumnsGraphic.tsx`) to take a max width of about `1440px` (`max-w-[1440px]`), ensuring generous spacing and balanced proportions on large screens.

---

## Skills Consulted
- `AGENTS.md` (Project core rules, layout and styling guidelines)

---

## Code & Configuration Inspected
- `app/page.tsx`: HeaderNav container was `max-w-[1240px]`, main content inner div was `max-w-[1120px]`.
- `components/home/SteppedColumnsGraphic.tsx`: Columns container was `max-w-[1300px]`.

---

## Decisions & Assumptions
1. Update `HeaderNav` wrapper in `app/page.tsx` to `max-w-[1440px] mx-auto`.
2. Update the main content wrapper in `app/page.tsx` from `max-w-[1120px]` to `max-w-[1440px]` with responsive horizontal padding (`px-6 sm:px-8 lg:px-12`).
3. Update `SteppedColumnsGraphic.tsx` column container to `max-w-[1440px]` to span the full width harmoniously with the main content.
4. Keep the hero text and search bar centered with optimal reading line lengths (`max-w-3xl` and `max-w-[620px]`).

---

## Files to Touch / Create
- `prompts/update-homepage-1440px-width.md`: This prompt document.
- `app/page.tsx`: Update container max-widths to `max-w-[1440px]`.
- `components/home/SteppedColumnsGraphic.tsx`: Update columns container to `max-w-[1440px]`.

---

## Security Considerations
- Purely CSS styling and container width adjustments; no security implications.

---

## Acceptance Criteria
- [ ] Main content wrapper in `app/page.tsx` takes `max-w-[1440px]`.
- [ ] Header navigation bar spans up to `max-w-[1440px]`.
- [ ] Stepped columns graphic spans up to `max-w-[1440px]`.
- [ ] Course cards grid expands cleanly across the 1440px layout on desktop viewports.
- [ ] `npm run lint` and `npx tsc --noEmit` pass with 0 errors.

---

## Checks to Run
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

---

## Manual Test Steps
1. Open `http://localhost:3000` in a desktop browser at or above 1440px viewport width.
2. Inspect the main content container and verify its maximum width is 1440px (`max-w-[1440px]`).
3. Verify the Header, "All Courses" section, and bottom graphic align smoothly with the 1440px grid.
