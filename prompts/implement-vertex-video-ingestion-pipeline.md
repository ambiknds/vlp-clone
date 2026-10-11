# Implementation Prompt: Implement Offline Video Ingestion Pipeline

## Goal
Implement the offline video ingestion pipeline for Vertex LMS per `AGENTS.md` (Sections 5, 7, 8, 9, 12, 13). The pipeline is dedicated offline tooling (never run in the request path) that extracts and ingests timestamped transcript chunks and chapter markers into Sanity `video` documents for YouTube, Vimeo, and Bunny Stream videos. It keys each document by a deterministic ID derived from the video URL (stripping datastore-rejected characters), splits transcripts into short timestamped chunks (never storing whole transcripts), formats table of contents chapters, and commits them via batch mutations to the private Sanity dataset.

---

## Skills Consulted
- `AGENTS.md` (Section 1: Vision; Section 2: Loop; Section 5: App structure & offline tooling boundary; Section 7: Grounded search & video intelligence; Section 8: Content model; Section 9: Video pipeline & provider support; Section 12: Gotchas & boundaries; Section 13: Checks to run)
- `sanity-best-practices` (`references/schema.md`, `references/groq.md`, video guidelines)
- `sanity-migration` (`SKILL.md`, deterministic IDs, batch mutations with `createOrReplace`, repeatability)
- `create-agent-with-sanity-context` (`SKILL.md`, video intelligence grounding for search)

---

## Code & Configuration Inspected
- `AGENTS.md` (Section 9):
  - "Build the video documents with offline tooling, keyed by an id derived from the video URL, stripping any characters the datastore rejects in ids. Store the transcript as many short timestamped chunks, and store the source's chapter markers as the table of contents. Keep whole transcripts out of anything the request path returns."
  - "The supported providers are YouTube, Vimeo, and Bunny, each shown as an embed on the lesson page. Ingestion is specific to each provider: to support one you need a way to turn its captions into chunks, a source of chapters or authored ones, and a playback and seek case for its embed. Do not treat a provider as supported until both ingestion and playback exist for it."
- `studio/schemaTypes/documents/video.ts`:
  - Sanity schema for `video` document: `videoId` (string), `url` (url), `provider` ('youtube' | 'vimeo' | 'bunny'), `chapters` (array of `{ startSeconds, label }`), `chunks` (array of `{ startSeconds, text }`).
- `components/lesson/LessonVideoPlayer.tsx`:
  - Verified playback and seek embed cases already implemented for YouTube (`start=${start}`), Vimeo (`#t=${start}s`), and Bunny Stream (`&t=${start}`).
- `lib/search/grounded-search.ts`:
  - Verified grounded search queries `*[_type == "video"]` and maps them by `url` to lessons, matching `chapters` first and `chunks` second.
- `studio/scripts/seed/seed.mjs`:
  - Seed script with Sanity HTTP batch mutation helper using `SANITY_API_DEVELOPER_TOKEN`.
- `.env.local` & `.env.example`:
  - `SANITY_API_DEVELOPER_TOKEN` and `SANITY_API_READ_TOKEN` configured for project `zq8k8g90` / dataset `production`.

---

## Decisions & Assumptions
1. **Pipeline Architecture & Boundary**:
   - The ingestion pipeline is purely **offline tooling** housed in `scripts/video-pipeline/`. It never executes within Next.js runtime or request handlers.
   - Invokable via standard npm scripts (`npm run video:ingest` or `npx tsx scripts/video-pipeline/cli.ts`).
2. **Provider Adapters & Ingestion Specifics**:
   - **YouTube**:
     - Extracts 11-character video ID from any YouTube URL variation (`watch?v=`, `youtu.be/`, `embed/`, `youtube-nocookie.com/embed/`).
     - Ingestion extracts captions via YouTube timedtext API / player context or local/remote VTT/SRT files.
     - Parses video description timestamps (e.g. `00:00 Intro`, `02:15 Server Actions`) into chapter markers, with authored/fallback chapter support.
   - **Vimeo**:
     - Extracts numeric Vimeo ID (`vimeo.com/{id}`, `player.vimeo.com/video/{id}`).
     - Supports ingesting VTT/SRT caption tracks and VTT/authored chapter markers.
   - **Bunny Stream**:
     - Extracts Library ID and Video ID (`iframe.mediadelivery.net/embed/{libId}/{videoId}`).
     - Supports ingesting Bunny VTT caption tracks and VTT/authored chapter markers.
3. **Transcript Parsing & Semantic Chunking**:
   - Universal parser for WebVTT (`.vtt`), SubRip (`.srt`), and timed caption JSON cues (`{ start: number, text: string }`).
   - Cleans cues: strips HTML/formatting tags (`<b>`, `<i>`, `<v ...>`), removes noise markers (`[Music]`, `[Applause]`), normalizes whitespace.
   - **Chunking algorithm**: Aggregates sequential short cues into semantic timestamped chunks spanning ~25 to 45 seconds (or ~60–80 words). Each chunk records the exact `startSeconds` of its first cue.
   - Strict adherence: **never stores the whole transcript in a single field** to protect search LLM context window and comply with `AGENTS.md`.
4. **Deterministic Sanity Document ID Generation**:
   - Sanity document IDs strictly permit `[a-zA-Z0-9_.-]`.
   - `deriveVideoDocumentId(url)` generates deterministic IDs:
     - YouTube: `video.youtube_<videoId>`
     - Vimeo: `video.vimeo_<videoId>`
     - Bunny: `video.bunny_<libraryId>_<videoId>`
     - Generic: `video.<cleanUrl>` (all rejected characters converted to `_`).
   - Guarantees idempotent, replayable `createOrReplace` mutations.
5. **CLI & Automation Capabilities**:
   - `--scan-lessons`: Queries Sanity for all published lessons, discovers unique video URLs, and runs ingestion.
   - `--url <videoUrl>`: Ingests a single specified video URL.
   - `--provider <youtube|vimeo|bunny>`: Explicitly overrides or sets provider.
   - `--transcript <path-or-url>`: Local or remote path to `.vtt`, `.srt`, or `.json` transcript.
   - `--chapters <path-or-url>`: Local or remote path to chapters file.
   - `--dry-run`: Runs parsing, chunking, and validation, outputting summary without writing mutations to Sanity.
   - `--output <path>`: Exports generated video documents to a local JSON/NDJSON file.
   - `--commit`: Writes `createOrReplace` mutations directly to the Sanity dataset via the private HTTP mutate endpoint.

---

## Files to Touch / Create
1. `scripts/video-pipeline/types.ts`: TypeScript interfaces for parsed cues, chunks, chapters, provider configs, and Sanity video documents.
2. `scripts/video-pipeline/utils/id-helper.ts`: Deterministic ID generator stripping characters rejected by Sanity.
3. `scripts/video-pipeline/parsers/vtt-srt-parser.ts`: Robust parser for WebVTT and SubRip SRT subtitle/caption formats.
4. `scripts/video-pipeline/parsers/chunker.ts`: Semantic chunking engine aggregating subtitle cues into ~25–45s timestamped pieces.
5. `scripts/video-pipeline/parsers/chapter-parser.ts`: Parser for timestamped chapter markers (text timestamps, VTT chapters, authored markers).
6. `scripts/video-pipeline/providers/youtube.ts`: YouTube provider adapter (extracts ID, fetches/parses captions and description chapters).
7. `scripts/video-pipeline/providers/vimeo.ts`: Vimeo provider adapter (extracts ID, ingests VTT/SRT captions and chapters).
8. `scripts/video-pipeline/providers/bunny.ts`: Bunny Stream provider adapter (extracts library/video ID, ingests VTT/SRT captions and chapters).
9. `scripts/video-pipeline/pipeline.ts`: Core orchestrator coordinating provider detection, caption fetching, chunking, chapter extraction, and document synthesis.
10. `scripts/video-pipeline/sanity-client.ts`: Dedicated offline Sanity API client for querying lessons and committing batch mutations using `SANITY_API_DEVELOPER_TOKEN` / `SANITY_API_WRITE_TOKEN`.
11. `scripts/video-pipeline/cli.ts`: Interactive and scriptable CLI with argument parsing for `--scan-lessons`, `--url`, `--dry-run`, etc.
12. `package.json`: Add `video:ingest` script to npm scripts.
13. `prompts/implement-vertex-video-ingestion-pipeline.md`: This implementation prompt document.

---

## Security Considerations
- The ingestion pipeline is purely offline tooling and is never bundled into client or server Next.js bundles.
- Secret tokens (`SANITY_API_DEVELOPER_TOKEN`, `SANITY_API_WRITE_TOKEN`) are loaded solely from local environment variables on the developer's machine / CI and are never exposed.
- All input URLs and text chunks are sanitized to prevent injection or malformed payloads.

---

## Acceptance Criteria
- [ ] Provider adapters exist for all three supported providers: YouTube, Vimeo, and Bunny Stream.
- [ ] Both ingestion and playback/seek exist and are verified for YouTube, Vimeo, and Bunny.
- [ ] `deriveVideoDocumentId` generates deterministic IDs containing only Sanity-valid characters `[a-zA-Z0-9_.-]`.
- [ ] WebVTT and SRT caption parsers convert timestamps and text into structured cues.
- [ ] Semantic chunker groups cues into timestamped chunks (~25–45 seconds) with clean text and valid `startSeconds`.
- [ ] Chapter parser extracts chronological chapter markers (`startSeconds`, `label`) for the table of contents.
- [ ] Whole transcripts are never stored in a single field.
- [ ] Video documents strictly match the Sanity `video` schema (`videoId`, `url`, `provider`, `chapters`, `chunks`).
- [ ] CLI runs in both dry-run mode and live commit mode.
- [ ] Running the pipeline ingests or validates video records for lessons and writes them to Sanity.
- [ ] TypeScript check (`npx tsc --noEmit`) passes cleanly.

---

## Checks to Run
- `npx tsc --noEmit` in root workspace
- `npm run lint` in root workspace
- Run dry-run ingestion test: `npx tsx scripts/video-pipeline/cli.ts --url "https://www.youtube.com/watch?v=9602Yzvd7ik" --dry-run`
- Run sample Vimeo and Bunny ingestion tests in dry-run mode.
- Run live test on sample lesson video or scan lessons to verify Sanity document creation.

---

## Manual Test Steps
1. Execute single YouTube video ingestion in dry-run mode:
   `npx tsx scripts/video-pipeline/cli.ts --url "https://www.youtube.com/watch?v=9602Yzvd7ik" --dry-run`
   Verify console outputs parsed chapters, timestamped chunks, and generated Sanity `video` document payload.
2. Execute single Vimeo video ingestion with sample transcript:
   `npx tsx scripts/video-pipeline/cli.ts --url "https://vimeo.com/76979871" --dry-run`
   Verify provider detected as `vimeo`, ID extracted as `76979871`, and document generated.
3. Execute single Bunny video ingestion:
   `npx tsx scripts/video-pipeline/cli.ts --url "https://iframe.mediadelivery.net/embed/12345/abcdef-6789" --dry-run`
   Verify provider detected as `bunny`, Library ID and Video ID extracted, and document generated.
4. Run lesson scan mode with commit or dry-run:
   `npx tsx scripts/video-pipeline/cli.ts --scan-lessons --dry-run`
   Verify all unique lesson videos are detected and prepared for ingestion.
5. Ingest and commit a video document to Sanity, then perform a search on `/search?q=...` or query via GROQ to confirm the video document is indexed and resolved.
