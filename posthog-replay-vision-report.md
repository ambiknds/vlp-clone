# Replay Vision Setup Report

## Recording status

Session replay was already enabled server-side, and the `posthog-js` init in
`instrumentation-client.ts` has no `disable_session_recording` override — so
recording was already fully live. No code changes were needed to turn this on.

## Scanners created

Two monitor scanners and one summarizer scanner were created and enabled.
(Two older scanners — "Vertex course experience breakage" and "Vertex learner
navigation frustration" — already existed from a separate self-driving flow
and were left untouched, since they emit signals and belong to that flow, not
this one.)

### 1. Course-to-lesson breakage (monitor)
- **Watches for:** the Continue Learning / sticky-progress-bar control not
  opening a lesson, the course cover/modules/outcomes failing to load, a
  module expanding to show no lessons, a lesson link leading to a broken or
  missing lesson page, and the bookmark action not responding.
- **Scope:** sessions touching `$current_url` matching `/courses/` or
  `/lessons/` — the catalog/course-detail flow plus the lesson route it leads
  into.
- **Estimated spend:** 0 credits/month at current traffic (0 matched sessions
  in the estimate window); re-estimate as traffic grows.
- **Link:** https://us.posthog.com/project/584623/replay-vision/01a10a58-c2e4-7be6-abd5-9139618b5ec8

**Follow-up needed:** `/lessons/[slug]` has no page built yet in this repo —
it's only referenced by links and capture calls (`course_lesson_selected`,
`course_learning_started`). Until that page exists, any session reaching it
will look broken/404 to this scanner by design — that's legitimate signal,
not a false positive, and it'll resolve itself once the lesson page ships.

### 2. Catalog and lesson frustration (monitor)
- **Watches for:** hammering the header search or notifications icons (which
  currently have no click handlers), retrying the hero search after
  mismatched results, repeatedly switching catalog category filters without
  finding the right course, expanding/collapsing modules hunting for a
  lesson, or retrying "Continue Learning" without it opening a lesson.
- **Scope:** gated on rageclick events (`$rageclick`) only — no URL filter, so
  it covers the whole app and stays disjoint from the breakage monitor above.
- **Estimated spend:** 0 credits/month at current traffic (0 matched sessions
  in the estimate window).
- **Link:** https://us.posthog.com/project/584623/replay-vision/01a10a58-002e-7bbe-83d3-688eb4197d48

**Note:** the header search and notifications-bell icons in `HeaderNav.tsx`
have no `onClick` handlers at all right now. Any rageclick signal there is a
real dead-button bug worth fixing on its own, independent of this scanner.

### 3. Vertex learner session recaps (summarizer)
- **Watches:** every new session recording, unscoped — produces a plain-
  language recap of what the learner did (browsing courses, searching,
  expanding modules, starting lessons).
- **Scope:** all recordings (`RecordingsQuery`, no filter).
- **Sampling:** 10% of sessions (locked by the setup brief).
- **Estimated spend:** low — sampling is capped at 10%, no backfill, create-
  only step with no further budget check required by the brief.
- **Link:** https://us.posthog.com/project/584623/replay-vision/01a10a57-c8a3-71fb-9a68-692c2a35727e

## Skipped / deferred

Nothing was skipped. All three scanners the setup flow calls for (breakage
monitor, frustration monitor, session summarizer) were created successfully.
The two pre-existing scanners from the self-driving flow were intentionally
left alone — they're owned by a different flow and already live.

## Where to look

Results land on the **Replay vision** page in PostHog
(https://us.posthog.com/project/584623/replay-vision) — open each scanner
link above to see its live scores, tags, and summaries. The first
observations will appear as new session recordings complete and get
processed; nothing retroactive runs unless a backfill is requested
separately.
