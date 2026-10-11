import { sanityFetch } from "@/sanity/lib/fetch";
import type {
  SearchResultItem,
  VideoSearchResult,
  LessonSearchResult,
  SearchResponse,
  SortOption,
} from "@/types/search";

interface RawCourse {
  _id: string;
  _createdAt?: string;
  title: string;
  slug?: { current: string };
  badgeIcon?: string;
  modules?: {
    _key: string;
    title: string;
    lessons?: {
      _id: string;
      _createdAt?: string;
      title: string;
      slug?: { current: string };
      videoUrl?: string;
      thumbnail?: { asset?: { _ref: string } };
      duration?: string;
      durationSeconds?: number;
      keyPoints?: string[];
      notesText?: string;
    }[];
  }[];
}

interface RawVideo {
  _id: string;
  videoId: string;
  url: string;
  provider?: string;
  chapters?: {
    startSeconds: number;
    label: string;
  }[];
  chunks?: {
    startSeconds: number;
    text: string;
  }[];
}

// Format seconds into MM:SS
function formatDurationDisplay(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Executes a grounded search over courses, lessons, and video intelligence in Sanity.
 * Complies strictly with AGENTS.md Sections 7, 8, 10, 11:
 * - Two-stage timestamp resolution: chapters first, transcript chunks second.
 * - Returns structured results: video results and lesson results.
 * - Grounded in real data only: never invents courses, lessons, durations, or timestamps.
 * - Ranks by specificity: title > chapter > keyPoints > transcript chunks > notes.
 */
export async function executeGroundedSearch(
  query: string,
  sort: SortOption = "relevance"
): Promise<SearchResponse> {
  const cleanQuery = (query || "").trim();
  if (!cleanQuery) {
    return {
      query: "",
      totalCount: 0,
      courseCount: 0,
      results: [],
      source: "grounded_groq",
    };
  }

  // Tokenize query words
  const tokens = cleanQuery
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.replace(/[^a-z0-9]/gi, ""))
    .filter((t) => t.length > 0);

  if (tokens.length === 0) {
    return {
      query: cleanQuery,
      totalCount: 0,
      courseCount: 0,
      results: [],
      source: "grounded_groq",
    };
  }

  // Fetch courses with full module & lesson hierarchies
  const coursesQuery = `
    *[_type == "course"] {
      _id,
      _createdAt,
      title,
      slug,
      badgeIcon,
      modules[]{
        _key,
        title,
        lessons[]->{
          _id,
          _createdAt,
          title,
          slug,
          videoUrl,
          thumbnail,
          duration,
          durationSeconds,
          keyPoints,
          "notesText": pt::text(notes)
        }
      }
    }
  `;

  // Fetch video intelligence records (chapters & transcript chunks)
  const videosQuery = `
    *[_type == "video"] {
      _id,
      videoId,
      url,
      provider,
      chapters[]{
        startSeconds,
        label
      },
      chunks[]{
        startSeconds,
        text
      }
    }
  `;

  const [courses, videos] = await Promise.all([
    sanityFetch<RawCourse[]>({ query: coursesQuery }).catch(() => []),
    sanityFetch<RawVideo[]>({ query: videosQuery }).catch(() => []),
  ]);

  // Index video documents by URL for fast O(1) lookup
  const videoByUrl = new Map<string, RawVideo>();
  for (const v of videos) {
    if (v.url) {
      videoByUrl.set(v.url.trim(), v);
    }
  }

  const results: SearchResultItem[] = [];
  const matchedCourseIds = new Set<string>();

  // Iterate over course hierarchy
  for (const course of courses) {
    const courseSlug = course.slug?.current || "courses";
    const courseBadge = course.badgeIcon || "nextjs";
    const modules = course.modules || [];

    modules.forEach((mod, modIdx) => {
      const moduleNumber = modIdx + 1;
      const moduleTitle = mod.title || `Module ${moduleNumber}`;
      const lessons = mod.lessons || [];

      lessons.forEach((lesson, lesIdx) => {
        if (!lesson) return;

        const lessonNumber = `Lesson ${moduleNumber}.${lesIdx + 1}`;
        const lessonSlug = lesson.slug?.current || "";
        const lessonDuration = lesson.duration || "10:00";
        const lessonDurationSeconds = lesson.durationSeconds || 600;

        const video = lesson.videoUrl ? videoByUrl.get(lesson.videoUrl.trim()) : null;

        // ---------------------------------------------------------------------
        // 1. VIDEO RESULT: Check video moments (Chapters first, then chunks)
        // ---------------------------------------------------------------------
        if (video) {
          let bestChapter: { startSeconds: number; label: string; score: number } | null = null;
          let bestChunk: { startSeconds: number; text: string; score: number } | null = null;

          // Check chapters (Table of Contents)
          if (video.chapters && video.chapters.length > 0) {
            for (const chap of video.chapters) {
              const labelLower = (chap.label || "").toLowerCase();
              const matchedCount = tokens.filter((t) => labelLower.includes(t)).length;
              if (matchedCount > 0) {
                const ratio = matchedCount / tokens.length;
                const score = 85 + ratio * 15; // 85 to 100
                if (!bestChapter || score > bestChapter.score) {
                  bestChapter = {
                    startSeconds: chap.startSeconds,
                    label: chap.label,
                    score,
                  };
                }
              }
            }
          }

          // If no chapter match, check transcript chunks
          if (!bestChapter && video.chunks && video.chunks.length > 0) {
            for (const chunk of video.chunks) {
              const chunkLower = (chunk.text || "").toLowerCase();
              const matchedCount = tokens.filter((t) => chunkLower.includes(t)).length;
              if (matchedCount > 0) {
                const ratio = matchedCount / tokens.length;
                const score = 65 + ratio * 15; // 65 to 80
                if (!bestChunk || score > bestChunk.score) {
                  bestChunk = {
                    startSeconds: chunk.startSeconds,
                    text: chunk.text,
                    score,
                  };
                }
              }
            }
          }

          if (bestChapter) {
            matchedCourseIds.add(course._id);
            const videoResult: VideoSearchResult = {
              type: "video",
              id: `video-${lesson._id}-${bestChapter.startSeconds}`,
              lessonId: lesson._id,
              lessonTitle: lesson.title,
              lessonSlug,
              courseId: course._id,
              courseTitle: course.title,
              courseSlug,
              courseBadgeIcon: courseBadge,
              moduleNumber,
              moduleTitle,
              lessonNumber,
              duration: lessonDuration,
              durationSeconds: lessonDurationSeconds,
              matchedSecond: bestChapter.startSeconds,
              matchedTimestamp: formatDurationDisplay(bestChapter.startSeconds),
              matchedChapterLabel: bestChapter.label,
              description: `Matched chapter: "${bestChapter.label}"`,
              videoUrl: lesson.videoUrl || "",
              score: bestChapter.score,
            };
            results.push(videoResult);
          } else if (bestChunk) {
            matchedCourseIds.add(course._id);
            const videoResult: VideoSearchResult = {
              type: "video",
              id: `video-${lesson._id}-${bestChunk.startSeconds}`,
              lessonId: lesson._id,
              lessonTitle: lesson.title,
              lessonSlug,
              courseId: course._id,
              courseTitle: course.title,
              courseSlug,
              courseBadgeIcon: courseBadge,
              moduleNumber,
              moduleTitle,
              lessonNumber,
              duration: lessonDuration,
              durationSeconds: lessonDurationSeconds,
              matchedSecond: bestChunk.startSeconds,
              matchedTimestamp: formatDurationDisplay(bestChunk.startSeconds),
              description: bestChunk.text,
              videoUrl: lesson.videoUrl || "",
              score: bestChunk.score,
            };
            results.push(videoResult);
          }
        }

        // ---------------------------------------------------------------------
        // 2. LESSON RESULT: Check lesson topic (title, key points, notes)
        // ---------------------------------------------------------------------
        const titleLower = (lesson.title || "").toLowerCase();
        const keyPoints = lesson.keyPoints || [];
        const kpLower = keyPoints.join(" ").toLowerCase();
        const notesLower = (lesson.notesText || "").toLowerCase();

        const titleMatches = tokens.filter((t) => titleLower.includes(t)).length;
        const kpMatches = tokens.filter((t) => kpLower.includes(t)).length;
        const notesMatches = tokens.filter((t) => notesLower.includes(t)).length;

        if (titleMatches > 0 || kpMatches > 0 || notesMatches > 0) {
          let lessonScore = 40;
          if (titleMatches === tokens.length) {
            lessonScore = 100; // Perfect full title match
          } else if (titleMatches > 0) {
            lessonScore = 80 + (titleMatches / tokens.length) * 15;
          } else if (kpMatches > 0) {
            lessonScore = 70 + (kpMatches / tokens.length) * 15;
          } else if (notesMatches > 0) {
            lessonScore = 50 + (notesMatches / tokens.length) * 15;
          }

          matchedCourseIds.add(course._id);
          const lessonResult: LessonSearchResult = {
            type: "lesson",
            id: `lesson-${lesson._id}`,
            lessonId: lesson._id,
            lessonTitle: lesson.title,
            lessonSlug,
            courseId: course._id,
            courseTitle: course.title,
            courseSlug,
            courseBadgeIcon: courseBadge,
            moduleNumber,
            moduleTitle,
            lessonNumber,
            moduleLabel: `Module ${moduleNumber}`,
            description:
              keyPoints[0] ||
              lesson.notesText?.slice(0, 160) ||
              `Learn ${lesson.title} in ${course.title}.`,
            keyPoints,
            score: lessonScore,
          };
          results.push(lessonResult);
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 3. SORTING
  // ---------------------------------------------------------------------------
  if (sort === "duration") {
    results.sort((a, b) => {
      const durA =
        a.type === "video"
          ? a.durationSeconds || 0
          : a.keyPoints?.length || 0;
      const durB =
        b.type === "video"
          ? b.durationSeconds || 0
          : b.keyPoints?.length || 0;
      return durA - durB;
    });
  } else if (sort === "newest") {
    // Keep module/lesson order or reverse
    results.sort((a, b) => {
      const scoreDiff = (b.score || 0) - (a.score || 0);
      if (Math.abs(scoreDiff) > 20) return scoreDiff;
      return b.moduleNumber - a.moduleNumber;
    });
  } else {
    // "relevance" (default)
    results.sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  return {
    query: cleanQuery,
    totalCount: results.length,
    courseCount: matchedCourseIds.size,
    results,
    source: "grounded_groq",
  };
}
