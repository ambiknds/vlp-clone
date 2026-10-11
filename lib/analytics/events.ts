import posthog from "posthog-js";

/**
 * PostHog Event Taxonomy for Vertex LMS
 * Strictly follows PostHog's Next.js best practices:
 * - snake_case event names: <object>_<action>
 * - snake_case property keys
 * - No PII beyond Clerk user ID
 */
export const POSTHOG_EVENTS = {
  SEARCH_PERFORMED: "search_performed",
  SEARCH_RESULT_OPENED: "search_result_opened",
  SEARCH_RESULT_CLICKED: "search_result_clicked",
  VIDEO_PLAYED: "video_played",
  VIDEO_SEARCH_PERFORMED: "video_search_performed",
  VIDEO_WATCH_DEPTH_REACHED: "video_watch_depth_reached",
  RESUME_USED: "resume_used",
  LESSON_COMPLETED: "lesson_completed",
  COURSE_VIEWED: "course_viewed",
  LESSON_VIEWED: "lesson_viewed",
  SEARCH_EMPTY_STATE_VIEWED: "search_empty_state_viewed",
  LESSON_RESOURCE_CLICKED: "lesson_resource_clicked",
} as const;

export type PostHogEventName = (typeof POSTHOG_EVENTS)[keyof typeof POSTHOG_EVENTS];

// Search performed properties
export interface SearchPerformedProps {
  query: string;
  result_count?: number;
  course_count?: number;
  sort?: string;
  source: "search_page" | "search_bar" | "hero_search_bar" | "api";
  has_results?: boolean;
}

// Search result opened properties
export interface SearchResultOpenedProps {
  query?: string;
  result_type: "video" | "lesson";
  lesson_slug: string;
  lesson_title?: string;
  course_title?: string;
  course_slug?: string;
  start_seconds?: number;
  rank?: number;
}

// Video played properties
export interface VideoPlayedProps {
  lesson_slug: string;
  lesson_title: string;
  course_title?: string;
  video_url: string;
  provider: "youtube" | "vimeo" | "bunny" | "other";
  start_seconds: number;
  duration_seconds?: number;
  resume_used: boolean;
}

// Video search performed properties
export interface VideoSearchPerformedProps {
  query: string;
  video_results_count: number;
  has_video_results: boolean;
  chapter_matches_count?: number;
  transcript_matches_count?: number;
  sort?: string;
}

// Video watch depth properties
export interface VideoWatchDepthProps {
  lesson_slug: string;
  lesson_title: string;
  course_title?: string;
  video_url: string;
  provider: "youtube" | "vimeo" | "bunny" | "other";
  watch_depth: "25%" | "50%" | "75%" | "90%" | "100%";
  depth_percentage: 25 | 50 | 75 | 90 | 100;
  current_seconds: number;
  duration_seconds: number;
}

// Resume used properties
export interface ResumeUsedProps {
  lesson_slug?: string;
  lesson_title?: string;
  course_slug?: string;
  course_title?: string;
  start_seconds?: number;
  source: "course_hero" | "sticky_progress" | "video_timestamp_seek" | "sidebar_resume";
}

// Lesson completed properties
export interface LessonCompletedProps {
  lesson_slug: string;
  lesson_title?: string;
  course_title?: string;
  course_slug?: string;
  completion_trigger: "video_ended" | "next_lesson_click" | "mark_complete_button" | "server_api";
}

// Course viewed properties
export interface CourseViewedProps {
  course_slug: string;
  course_title: string;
  level?: string;
  module_count?: number;
  student_count?: number;
}

// Lesson viewed properties
export interface LessonViewedProps {
  lesson_slug: string;
  lesson_title: string;
  course_title?: string;
  course_slug?: string;
  duration?: string;
  level?: string;
}

// Search empty state properties
export interface SearchEmptyStateProps {
  query: string;
}

// Lesson resource clicked properties
export interface LessonResourceClickedProps {
  lesson_title: string;
  resource_title: string;
  resource_type: string;
  resource_url: string;
}

/**
 * Client-side helper functions for capturing events safely.
 * They gracefully guard against SSR or uninitialized PostHog instances.
 */

export function trackSearchPerformed(props: SearchPerformedProps) {
  if (typeof window === "undefined") return;
  posthog.capture(POSTHOG_EVENTS.SEARCH_PERFORMED, props);
}

export function trackSearchResultOpened(props: SearchResultOpenedProps) {
  if (typeof window === "undefined") return;
  posthog.capture(POSTHOG_EVENTS.SEARCH_RESULT_OPENED, props);
  // Maintain backward-compatible search_result_clicked
  posthog.capture(POSTHOG_EVENTS.SEARCH_RESULT_CLICKED, props);
}

export function trackVideoPlayed(props: VideoPlayedProps) {
  if (typeof window === "undefined") return;
  posthog.capture(POSTHOG_EVENTS.VIDEO_PLAYED, props);
}

export function trackVideoSearchPerformed(props: VideoSearchPerformedProps) {
  if (typeof window === "undefined") return;
  posthog.capture(POSTHOG_EVENTS.VIDEO_SEARCH_PERFORMED, props);
}

export function trackVideoWatchDepth(props: VideoWatchDepthProps) {
  if (typeof window === "undefined") return;
  posthog.capture(POSTHOG_EVENTS.VIDEO_WATCH_DEPTH_REACHED, props);
}

export function trackResumeUsed(props: ResumeUsedProps) {
  if (typeof window === "undefined") return;
  posthog.capture(POSTHOG_EVENTS.RESUME_USED, props);
}

export function trackLessonCompleted(props: LessonCompletedProps) {
  if (typeof window === "undefined") return;
  posthog.capture(POSTHOG_EVENTS.LESSON_COMPLETED, props);
}

export function trackCourseViewed(props: CourseViewedProps) {
  if (typeof window === "undefined") return;
  posthog.capture(POSTHOG_EVENTS.COURSE_VIEWED, props);
}

export function trackLessonViewed(props: LessonViewedProps) {
  if (typeof window === "undefined") return;
  posthog.capture(POSTHOG_EVENTS.LESSON_VIEWED, props);
}

export function trackSearchEmptyStateViewed(props: SearchEmptyStateProps) {
  if (typeof window === "undefined") return;
  posthog.capture(POSTHOG_EVENTS.SEARCH_EMPTY_STATE_VIEWED, props);
}

export function trackLessonResourceClicked(props: LessonResourceClickedProps) {
  if (typeof window === "undefined") return;
  posthog.capture(POSTHOG_EVENTS.LESSON_RESOURCE_CLICKED, props);
}
