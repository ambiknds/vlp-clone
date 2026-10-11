export type SearchResultType = "video" | "lesson";

export interface VideoSearchResult {
  type: "video";
  id: string;
  lessonId: string;
  lessonTitle: string;
  lessonSlug: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  courseBadgeIcon?: string;
  moduleNumber: number;
  moduleTitle: string;
  lessonNumber: string; // e.g. "Lesson 5.1"
  thumbnailUrl?: string;
  duration: string; // e.g. "12:45"
  durationSeconds?: number;
  matchedSecond: number; // e.g. 765
  matchedTimestamp: string; // e.g. "12:45"
  matchedChapterLabel?: string;
  description: string;
  videoUrl: string;
  score?: number;
}

export interface LessonSearchResult {
  type: "lesson";
  id: string;
  lessonId: string;
  lessonTitle: string;
  lessonSlug: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  courseBadgeIcon?: string;
  moduleNumber: number;
  moduleTitle: string;
  lessonNumber: string; // e.g. "Lesson 5.1"
  moduleLabel: string; // e.g. "Module 5"
  description: string;
  keyPoints?: string[];
  score?: number;
}

export type SearchResultItem = VideoSearchResult | LessonSearchResult;

export interface SearchResponse {
  query: string;
  totalCount: number;
  courseCount: number;
  results: SearchResultItem[];
  source?: "context_mcp" | "grounded_groq";
}

export type SortOption = "relevance" | "newest" | "duration";
