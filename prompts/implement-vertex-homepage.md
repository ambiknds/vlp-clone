# Implementation Prompt: Vertex Homepage

## Goal
Implement the pixel-accurate **Vertex Homepage** according to the visual design in `design/vertex-home.png` for the Vertex learning platform. This includes the top navigation bar, the "Intelligent Learning" hero section with search bar and CTA, the "All Courses" section with 3 course cards, the feature banner divider, and the bottom stepped coral/peach columns artwork.

---

## Skills Consulted
- `AGENTS.md` (Project core rules, Next.js App Router conventions, strict visual reproduction rules)
- `sanity-best-practices` (Content models and conventions for courses and lessons)
- `prompts/implement-vertex-design-system.md` (Established design tokens and UI components)

---

## Code & Configuration Inspected
- `design/vertex-home.png`: High-resolution visual specification for the homepage.
- `package.json`: Next.js 16.3.5, React 19.2.8, Tailwind CSS v4, Lucide React icons.
- `app/layout.tsx`: Configured Playfair Display (serif) and Inter (sans) typography.
- `app/globals.css`: Theme tokens (Primary 500-100, Neutral 900-50, custom type classes, shadows).
- `components/ui/`: Existing component library (`VertexLogo`, `CourseCard`, `HeaderNav`, `Input`, `Button`).
- `app/page.tsx`: Current design system showcase.

---

## Decisions & Assumptions
1. **Preserve Showcase**: Move the existing design system showcase from `app/page.tsx` to `app/design-system/page.tsx` so the design system remains accessible for reference and testing.
2. **Homepage Route**: Implement the homepage at `app/page.tsx` matching `design/vertex-home.png` exactly:
   - **Top Navigation**: Clean header with Vertex logo, "Courses" and "My Learning" links, notification bell icon, and a user profile avatar (matching the female portrait in the design).
   - **Hero Section**:
     - Pill badge: `INTELLIGENT LEARNING` (tracking-widest uppercase, soft orange border/background).
     - Headline: `Search your learning in plain English.` in Playfair Display serif.
     - Subtitle: `Vertex understands what you want to learn and finds the exact lessons across all your courses.` in Inter.
     - CTA Button: `Explore Courses →` with vibrant orange background, smooth hover, and arrow icon.
     - Search Input: Centered search bar with magnifying glass icon, placeholder `"Ask anything about your learning..."`, and `⌘ K` keyboard shortcut pill.
   - **All Courses Section**:
     - Header: `All Courses` (Playfair Display serif) and `View all courses →` link.
     - 3 Course Cards matching the design:
       1. **Next.js for Production**: Next.js dark badge, intermediate level, 18h 24m duration, 12 modules.
       2. **Docker Essentials**: Docker whale icon, beginner level, 10h 12m duration, 8 modules.
       3. **TypeScript Deep Dive**: TypeScript blue badge, intermediate level, 14h 36m duration, 10 modules.
     - Cards use serif font for titles, subtle borders, hover elevation, and metadata footer with signal, clock, and document icons.
   - **Weekly Updates Banner**:
     - Centered divider with orange star outline icon and text: `New courses and lessons added every week.` flanked by subtle horizontal lines.
   - **Stepped Columns Artwork**:
     - Bottom graphic featuring the soft 3D coral/peach gradient columns of varying heights with subtle shadows, faithful to `vertex-home.png`.
3. **Responsiveness**:
   - Maintain 1:1 desktop fidelity at full width (~1120px max content container).
   - Stack gracefully on mobile and tablet viewports without breaking proportions.

---

## Files to Touch / Create
- `prompts/implement-vertex-homepage.md`: This implementation prompt document.
- `app/design-system/page.tsx`: Design system showcase moved from root page.
- `app/page.tsx`: New Vertex Homepage.
- `components/ui/HeaderNav.tsx`: Update to support home variant (avatar photo, simplified right action items).
- `components/ui/CourseCard.tsx`: Ensure font-serif title styling and document icon match `vertex-home.png`.
- `components/home/SteppedColumnsGraphic.tsx`: Reusable component rendering the bottom 3D coral stepped columns graphic.

---

## Security Considerations
- Purely client/server presentation components.
- No sensitive keys or tokens exposed.
- Semantic HTML and accessibility (`aria-label`, button types, alt tags).

---

## Acceptance Criteria
- [ ] Top navigation bar matches `vertex-home.png` with Vertex logo, navigation links, notification bell, and user avatar.
- [ ] Hero section features `INTELLIGENT LEARNING` badge, serif headline, subtitle, `Explore Courses →` button, and `⌘ K` search bar.
- [ ] "All Courses" section renders 3 cards (Next.js for Production, Docker Essentials, TypeScript Deep Dive) with exact icons, titles, descriptions, and footer metadata.
- [ ] Star divider banner renders `"New courses and lessons added every week."`.
- [ ] Bottom stepped columns illustration is rendered cleanly at the base of the page.
- [ ] Layout is fully responsive across desktop, tablet, and mobile.
- [ ] `npm run lint` and `npx tsc --noEmit` pass with zero errors.

---

## Checks to Run
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

---

## Manual Test Steps
1. Open `http://localhost:3000` in the browser.
2. Verify top navigation bar: Vertex logo, "Courses", "My Learning", notification bell, and user avatar.
3. Verify Hero section: "INTELLIGENT LEARNING" badge, Playfair Display heading, subtitle, "Explore Courses" button, and interactive search bar with `⌘ K` badge.
4. Verify "All Courses" section: "All Courses" serif heading and "View all courses →" link.
5. Inspect the 3 course cards: verify icons (Next.js, Docker, TypeScript), serif titles, descriptions, and metadata footer (level, duration, modules).
6. Verify star divider: orange star icon and "New courses and lessons added every week.".
7. Verify bottom graphic: 3D stepped peach/coral columns at the bottom of the page.
8. Verify `/design-system` route displays the design system showcase without regressions.
