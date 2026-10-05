# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for Vertex: Session Replay, Error Tracking, and Support are enabled; health, error, and support signal sources are enabled; and the scout troop and Replay Vision monitors are armed. Findings should begin appearing in the [Self-driving inbox](https://us.posthog.com/project/584623/inbox) within about 30 minutes as new data and recordings arrive.

## AI data processing

Approved by the wizard gate before this setup.

## GitHub

Connected before this run through the PostHog GitHub App.

## Products enabled

| Product | Result | Integration check |
|---|---|---|
| Session Replay | enabled | Web `posthog.init` has no `disable_session_recording: true` override. No recordings exist yet. |
| Error Tracking | enabled | Web `posthog.init` has `capture_exceptions: true`. |
| Support (Conversations) | enabled | Tickets will arrive only after an inbound email, inbox, or Slack channel is connected. |

## Signal sources

| Source product / type | Action | Detail |
|---|---|---|
| `health_checks` / `health_issue` | enabled | Source config `01a10a4d-6830-7f66-86e9-323b6d53af4f` |
| `error_tracking` / `issue_created` | enabled | Source config `01a10a4d-683b-76dd-8cbd-b9760a84162a` |
| `error_tracking` / `issue_reopened` | enabled | Source config `01a10a4d-67ff-7b18-ab09-70117bfc9c84` |
| `error_tracking` / `issue_spiking` | enabled | Source config `01a10a4d-68c6-77f1-a3d7-f322dc44b32f` |
| `conversations` / `ticket` | enabled | Source config `01a10a4d-6830-7645-a68a-daef197e4080`; dormant until a support channel is connected. |
| `signals_scout` / `cross_source_issue` | skipped | Enabled by default; no source config row is needed. |
| Session Replay responder | skipped | Replay coverage is provided by the two Replay Vision scanners below; the retired replay source was not created. |

## Connected tools

No optional connected tools were selected. GitHub remains connected for code access, but GitHub Issues was not selected as an inbox responder.

| Tool | Result |
|---|---|
| GitHub Issues, Linear, Jira, Sentry, Zendesk | not used |

## Scout troop

**Enabled (7):**

| Scout | Why it is enabled |
|---|---|
| `signals-scout-general` | Cross-product patterns and surfaces without a dedicated specialist. |
| `signals-scout-product-analytics` | Core learning engagement and product-flow analysis. |
| `signals-scout-web-analytics` | Web traffic, acquisition, landing-page health, and attribution. |
| `signals-scout-logs` | Server-side PostHog log patterns emitted by `instrumentation.ts`. |
| `signals-scout-observability-gaps` | Finds important events with no insight, dashboard, or alert coverage. |
| `signals-scout-course-discovery-to-learning` | Custom course-discovery and course-start health. |
| `signals-scout-lesson-navigation-health` | Custom course-module to lesson-selection health. |

**Disabled (23):**

| Scout(s) | Reason |
|---|---|
| AI observability, APM, CSP violations, customer analytics, data pipelines, data warehouse, experiments, feature flags, insight alerts, MCP tool calls, revenue analytics, skills store, surveys, tasks, web vitals, workflows | No active evidence for these product surfaces in this repo or project state. Enable if those surfaces are adopted. |
| Conversations | Support is enabled but no inbound channel is connected yet. |
| Anomaly detection | No established dashboard/insight time series to monitor yet. |
| Error tracking | Covered by the enabled native Error Tracking sources. |
| Session replay | Covered by Replay Vision scanners below. |
| Replay vision | Kept off because these newly created scanners have no accumulated observations yet. |
| PR follow-up | No self-driving PR lifecycle is established yet. |
| Inbox validation | Fresh setup; there are no resolved inbox reports to validate. |

**Run budget:** 100 runs/day confirmed; 0 used and 100 remaining at setup time. Banner: “Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more.”

## Custom scouts

| Scout | What it watches | Discriminator | Why it adds coverage |
|---|---|---|---|
| `signals-scout-course-discovery-to-learning` | Search and catalog engagement through course starts, based on `HeroSearchBar`, `CourseCatalogClient`, and `CourseHeroActions`. | Sustained broad-reach discovery or course-start decline, or a worsening discovery-to-start relationship while entrants hold. | The built-in product-analytics scout focuses on saved flow-rate regressions; this adds learning-specific entry-volume and handoff coverage. |
| `signals-scout-lesson-navigation-health` | Module exploration through lesson selection in `CourseModulesList`. | Sustained decline in lesson selection relative to steady module exploration. | Adds a concrete course-navigation failure mode beyond broad funnel monitoring. |

Both proposals were approved. Payment, AI, surveys, experiments, account analytics, CSP, and data-pipeline surfaces were ruled out because the repository scan found no watchable evidence for them. To make a noisy custom scout dry-run only, set its `emit` setting to `false` in PostHog.

## Replay Vision scanners

A scanner is an LLM that watches individual session recordings on a schedule and pushes qualifying findings to the inbox. These are the only setup components that consume Replay Vision quota. Findings have half weight and require corroboration before promotion to an inbox report.

| Status | Scanner | What it watches | Query scope | Sampling | Estimate |
|---|---|---|---|---|---|
| created | [Vertex course experience breakage](https://us.posthog.com/project/584623/replay-vision/01a10a51-21e5-7447-bb15-6426de3e4d57) | Visible course-page breakage: content load failures, missing modules or lesson links, and Continue Learning failures. | Recordings that include `/courses/`; this is the course detail flow where a learner explores content and begins a lesson. | 0.5 | 0 observations and 0 credits/month while recordings are absent. |
| created | [Vertex learner navigation frustration](https://us.posthog.com/project/584623/replay-vision/01a10a51-21f7-72be-aaa5-3f2376e88efa) | Visible learner struggle while searching, browsing course cards, expanding modules, selecting lessons, or continuing learning. | `$rageclick` only, intentionally disjoint from the URL-scoped breakage monitor. | 1.0 | 0 observations and 0 credits/month while recordings are absent. |

The organization has 2,500 Replay Vision credits remaining in the current period and was not exhausted at setup time. No recordings were found, so both scanners are armed and will begin work when recorded web sessions arrive.

## Follow-ups

- [ ] Connect an inbound Support channel (email, inbox, or Slack) so Conversations tickets can reach the enabled support responder.
- [ ] Generate real web sessions with the configured PostHog client so Session Replay, Replay Vision, and the new scouts have data to assess.
- [ ] Rate the first Replay Vision observations in the linked scanner pages with a short thumbs-up/down note to improve monitor quality.
- [ ] The MCP connection did not have schema-read scopes, so server-side verification of the custom event taxonomy could not be completed during setup; the custom scouts confirm their event taxonomy before querying.

## Repository files

- Created: `posthog-self-driving-report.md`.
- No application source files were modified.

## What happens next

The scout coordinator picks up fresh configurations within about 30 minutes. Scout runs use the daily budget, cluster findings into reports in the Self-driving inbox, and can begin coding tasks when a finding is immediately actionable.
