# Implementation Prompt: Fix Syntax and Parsing Error in LessonVideoPlayer

## 1. Goal
Resolve the TypeScript compile and ESLint parsing errors in `components/lesson/LessonVideoPlayer.tsx` caused by orphaned trailing lines left outside the `LessonVideoPlayer` component function.

---

## 2. Skills Read
- `AGENTS.md` - Core project rules, loop workflow, architecture boundaries, and verification checks.
- Next.js and React component standards in `components/lesson/`.

---

## 3. Code Inspected
- `components/lesson/LessonVideoPlayer.tsx`: Lines 258–280 properly complete the JSX tree and close the `LessonVideoPlayer` function:
  ```tsx
  return (
    <div
      onClick={() => handlePlayDetected()}
      className="relative w-full aspect-video rounded-[20px] overflow-hidden bg-black shadow-lg border border-[#E2E8F0]/80 group"
    >
      {embedUrl ? (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={title}
          onLoad={handleIframeLoad}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0F172A] text-[#94A3B8] text-[15px] font-sans">
          <span>No video source available for this lesson.</span>
        </div>
      )}
    </div>
  );
}
```
- Lines 281–303 contain orphaned, broken trailing JSX and event handler statements (`e.stopPropagation(); toggleFullscreen(); ...`) that cause `TS1128: Declaration or statement expected` and ESLint parsing errors.

---

## 4. Decisions and Assumptions
- The `LessonVideoPlayer` component is already fully structured and functional.
- Lines 281–303 are dangling remnants from an earlier edit and must be removed.
- No other logic or props in `LessonVideoPlayer.tsx` will be modified.

---

## 5. Files to Touch
- `components/lesson/LessonVideoPlayer.tsx` (remove lines 281–303)

---

## 6. Requirements
1. Remove lines 281–303 from `components/lesson/LessonVideoPlayer.tsx`.
2. Ensure the file terminates cleanly after `LessonVideoPlayer`'s closing brace.
3. Pass `npx tsc --noEmit` with zero errors.
4. Pass `npm run lint` with zero errors.

---

## 7. Security Considerations
- Client/server boundaries remain unchanged; no tokens or secrets exposed.

---

## 8. Acceptance Criteria
- `npx tsc --noEmit` exits with 0 errors.
- `npm run lint` passes with 0 errors.
- The dev server compiles `/lessons/[slug]` without any syntax or runtime exceptions.

---

## 9. Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- Verify HTTP response of `http://localhost:3000/lessons/nextjs-app-router-in-depth-caching-and-revalidation`

---

## 10. Manual Test Steps
1. Run `npx tsc --noEmit` and confirm clean exit code 0.
2. Run `npm run lint` and confirm zero ESLint issues reported.
3. In browser, navigate to `http://localhost:3000/lessons/nextjs-app-router-in-depth-caching-and-revalidation`.
4. Verify the video player renders correctly with YouTube embed and no compilation error banner appears.
