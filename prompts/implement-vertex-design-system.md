# Implementation Prompt: Vertex Design System

## Goal
Implement the complete, pixel-accurate **Vertex Design System** according to the design specification in `design/vertex-designsystem.png` for the Koltech / Vertex LMS Next.js application. This includes the theme tokens (colors, typography, spacing, radius, shadows), reusable UI component library, and a living design system showcase page reproducing all 14 design system sections.

---

## Skills Consulted
- `AGENTS.md` (Project core rules, Tailwind and Next.js guidelines, visual fidelity rules)
- `sanity-best-practices` (Reference content patterns and conventions)

---

## Code & Configuration Inspected
- `package.json`: Next.js 16.3.5, React 19.2.8, Tailwind CSS v4 (`@tailwindcss/postcss`)
- `app/globals.css`: Tailwind v4 import (`@import "tailwindcss";`) and `@theme` setup
- `app/layout.tsx`: Root layout with font configuration
- `design/vertex-designsystem.png`: High-resolution visual specification defining all 14 modules:
  1. Colors (Primary 500-100, Neutral 900-50, White)
  2. Typography (Playfair Display & Inter)
  3. Type Scale (Display 1 & 2, Heading 1–3, Body Large, Body, Small)
  4. Spacing System (4px to 64px)
  5. Radius (4px to Full) & Shadows (Sm, Md, Lg, Xl)
  6. Icons (24px outline and filled sets)
  7. Buttons (Primary, Secondary, Tertiary, Text across Default, Hover, Disabled)
  8. Inputs (Search Input with ⌘K shortcut, Select dropdown)
  9. Badges / Tags (Video, Lesson, Popular)
  10. Status / Indicators (In Progress, Completed, Now Playing, Locked)
  11. Progress Bar (Visual bar + percentage indicator)
  12. Cards (Course Card, Lesson Card Video, Lesson Card Lesson, Resource Card)
  13. Navigation (Header Nav, Breadcrumbs, Pagination)
  14. Principles (Clarity First, Consistency, Focus & Calm, Accessible)

---

## Decisions & Assumptions
1. **Fonts**: Setup `Playfair_Display` and `Inter` via `next/font/google` in `app/layout.tsx` to match the exact typography specs.
2. **Tailwind v4 Theme Tokens**: Define CSS custom properties and `@theme` utilities in `app/globals.css` for primary palette, neutral palette, custom typography styles, box shadows, and border radii.
3. **Icons**: Install and utilize `lucide-react` (matching 24x24 grid, 2px stroke width, rounded caps) plus custom SVG paths where exact alignment is needed (e.g., Vertex folded orange logo).
4. **Component Architecture**: Build modular, reusable components in `components/ui/` (Button, Badge, StatusIndicator, ProgressBar, Input, Select, Breadcrumbs, Pagination, CourseCard, LessonCardVideo, LessonCardLesson, ResourceCard, VertexLogo, HeaderNav).
5. **Living Showcase**: Create a comprehensive, pixel-perfect showcase view matching `design/vertex-designsystem.png` rendered on the main page (`app/page.tsx`), demonstrating all tokens, states, and components in action.

---

## Files to Touch / Create
- `package.json`: Add `lucide-react`, `clsx`, `tailwind-merge`
- `app/globals.css`: Add Vertex Design System theme tokens, color scales, type scale utilities, and shadow definitions
- `app/layout.tsx`: Configure `Playfair_Display` and `Inter` fonts and CSS variables
- `components/ui/VertexLogo.tsx`: Vertex brand logo with icon and wordmark
- `components/ui/Button.tsx`: Button with Primary, Secondary, Tertiary, and Text variants & states
- `components/ui/Badge.tsx`: Video, Lesson, and Popular badges
- `components/ui/StatusIndicator.tsx`: In Progress, Completed, Now Playing, and Locked states
- `components/ui/ProgressBar.tsx`: Progress bar component with percentage
- `components/ui/Input.tsx`: Search/text input with leading icon and shortcut badge
- `components/ui/Select.tsx`: Dropdown select matching design
- `components/ui/Breadcrumbs.tsx`: Breadcrumb navigation
- `components/ui/Pagination.tsx`: Pagination controls
- `components/ui/CourseCard.tsx`: Course card with icon, title, description, and metadata
- `components/ui/LessonCardVideo.tsx`: Video lesson card with timestamp action
- `components/ui/LessonCardLesson.tsx`: Topic lesson card with view lesson action
- `components/ui/ResourceCard.tsx`: Resource download card with metadata
- `components/ui/HeaderNav.tsx`: Header navigation bar
- `app/page.tsx`: Interactive Vertex Design System showcase matching `vertex-designsystem.png`

---

## Security Considerations
- Pure frontend UI components; no tokens or secrets exposed.
- User input handling sanitizes displayed attributes and maintains accessible ARIA roles.

---

## Acceptance Criteria
- [x] All colors (Primary 100-500, Neutral 50-900, White) configured as CSS/Tailwind variables.
- [x] Typography matches Playfair Display and Inter font hierarchy and sizes.
- [x] Radius (xs, sm, md, lg, xl, full) and shadows (sm, md, lg, xl) configured.
- [x] All button variants (Primary, Secondary, Tertiary, Text) render Default, Hover, and Disabled states.
- [x] Input and Select components match 44px height, 12px radius, and border styling.
- [x] Badges, Status Indicators, and Progress Bar match the design specs.
- [x] Course Card, Lesson Cards (Video & Lesson), and Resource Card match layout, typography, and interactive actions.
- [x] Breadcrumbs and Pagination components render correctly.
- [x] Design system showcase page reproduces the visual reference in `vertex-designsystem.png`.
- [x] Type check (`npm run build` or `npx tsc --noEmit`) and lint pass with 0 errors.

---

## Checks to Run
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

---

## Manual Test Steps
1. Navigate to the running Next.js application (`http://localhost:3000`).
2. Verify Header and Brand ("Vertex Design System", Version 1.0 • May 2025).
3. Inspect Section 01: Verify primary and neutral color swatches and hex codes.
4. Inspect Section 02 & 03: Verify Playfair Display and Inter type specimens and type scale table.
5. Inspect Section 04 & 05: Verify spacing blocks, border radiuses, and shadow elevations.
6. Inspect Section 06 & 07: Verify outline/filled icon sets and buttons across default, hover, and disabled states.
7. Inspect Section 08: Test search input with `⌘K` badge and select dropdown.
8. Inspect Section 09, 10 & 11: Verify badges, status indicators, and progress bar.
9. Inspect Section 12: Verify all 4 card components (Course Card, Video Lesson Card with "Watch from 12:45", Topic Lesson Card with "View lesson", and Resource Card).
10. Inspect Section 13 & 14: Verify Navigation bar, breadcrumbs, pagination, and the 4 platform principles.
