"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { trackLessonCompleted } from "@/lib/analytics/events";

interface ProgressMutationParams {
  lessonSlug: string;
  courseSlug?: string;
  lessonTitle?: string;
  courseTitle?: string;
  completionTrigger?: "video_ended" | "next_lesson_click" | "mark_complete_button" | "server_api";
}

interface CourseProgressResult {
  completedCount: number;
  totalCount: number;
  percentage: number;
  firstIncompleteSlug?: string;
}

interface LearnerProgressContextValue {
  completedLessons: Set<string>;
  isLessonCompleted: (lessonSlug?: string) => boolean;
  markLessonCompleted: (params: ProgressMutationParams) => Promise<void>;
  unmarkLessonCompleted: (params: ProgressMutationParams) => Promise<void>;
  toggleLessonCompleted: (params: ProgressMutationParams) => Promise<void>;
  getCourseProgress: (courseLessonSlugs?: string[]) => CourseProgressResult;
  isLoading: boolean;
}

const STORAGE_KEY = "vertex_completed_lessons";

const LearnerProgressContext = createContext<LearnerProgressContextValue | null>(null);

export function LearnerProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch {
      // LocalStorage access failure fallback
    }
    return new Set();
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sync with server if user is logged in
  useEffect(() => {
    let isMounted = true;

    fetch("/api/progress")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted) return;
        if (data?.completedLessonSlugs && Array.isArray(data.completedLessonSlugs)) {
          setCompletedLessons((prev) => {
            const next = new Set(prev);
            data.completedLessonSlugs.forEach((s: string) => next.add(s));
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
            } catch {
              // Ignore storage quota errors
            }
            return next;
          });
        }
      })
      .catch(() => {
        // Safe offline / network failure noop
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const saveToLocal = useCallback((updated: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(updated)));
    } catch {
      // Safe noop
    }
  }, []);

  const isLessonCompleted = useCallback(
    (lessonSlug?: string) => {
      if (!lessonSlug) return false;
      return completedLessons.has(lessonSlug);
    },
    [completedLessons]
  );

  const markLessonCompleted = useCallback(
    async ({
      lessonSlug,
      courseSlug,
      lessonTitle,
      courseTitle,
      completionTrigger,
    }: ProgressMutationParams) => {
      if (!lessonSlug) return;

      // Optimistic client update
      setCompletedLessons((prev) => {
        if (prev.has(lessonSlug)) return prev;
        const next = new Set(prev);
        next.add(lessonSlug);
        saveToLocal(next);
        return next;
      });

      // Track PostHog client event
      trackLessonCompleted({
        lesson_slug: lessonSlug,
        lesson_title: lessonTitle,
        course_title: courseTitle,
        completion_trigger: completionTrigger || "mark_complete_button",
      });

      // Persist to server route
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonSlug,
            courseSlug,
            lessonTitle,
            courseTitle,
            completed: true,
          }),
        });
      } catch (err) {
        console.warn("Failed to sync progress to server:", err);
      }
    },
    [saveToLocal]
  );

  const unmarkLessonCompleted = useCallback(
    async ({
      lessonSlug,
      courseSlug,
      lessonTitle,
      courseTitle,
    }: ProgressMutationParams) => {
      if (!lessonSlug) return;

      // Optimistic client update
      setCompletedLessons((prev) => {
        if (!prev.has(lessonSlug)) return prev;
        const next = new Set(prev);
        next.delete(lessonSlug);
        saveToLocal(next);
        return next;
      });

      // Persist to server route
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonSlug,
            courseSlug,
            lessonTitle,
            courseTitle,
            completed: false,
          }),
        });
      } catch (err) {
        console.warn("Failed to sync progress reversal to server:", err);
      }
    },
    [saveToLocal]
  );

  const toggleLessonCompleted = useCallback(
    async (params: ProgressMutationParams) => {
      if (isLessonCompleted(params.lessonSlug)) {
        await unmarkLessonCompleted(params);
      } else {
        await markLessonCompleted(params);
      }
    },
    [isLessonCompleted, markLessonCompleted, unmarkLessonCompleted]
  );

  const getCourseProgress = useCallback(
    (courseLessonSlugs?: string[]): CourseProgressResult => {
      if (!courseLessonSlugs || courseLessonSlugs.length === 0) {
        return {
          completedCount: 0,
          totalCount: 0,
          percentage: 0,
          firstIncompleteSlug: undefined,
        };
      }

      const totalCount = courseLessonSlugs.length;
      let completedCount = 0;
      let firstIncompleteSlug: string | undefined;

      for (const slug of courseLessonSlugs) {
        if (completedLessons.has(slug)) {
          completedCount += 1;
        } else if (!firstIncompleteSlug) {
          firstIncompleteSlug = slug;
        }
      }

      const percentage = Math.min(
        100,
        Math.max(0, Math.round((completedCount / totalCount) * 100))
      );

      return {
        completedCount,
        totalCount,
        percentage,
        firstIncompleteSlug: firstIncompleteSlug || courseLessonSlugs[0],
      };
    },
    [completedLessons]
  );

  const value = useMemo(
    () => ({
      completedLessons,
      isLessonCompleted,
      markLessonCompleted,
      unmarkLessonCompleted,
      toggleLessonCompleted,
      getCourseProgress,
      isLoading,
    }),
    [
      completedLessons,
      isLessonCompleted,
      markLessonCompleted,
      unmarkLessonCompleted,
      toggleLessonCompleted,
      getCourseProgress,
      isLoading,
    ]
  );

  return (
    <LearnerProgressContext.Provider value={value}>
      {children}
    </LearnerProgressContext.Provider>
  );
}

export function useLearnerProgress() {
  const context = useContext(LearnerProgressContext);
  if (!context) {
    throw new Error(
      "useLearnerProgress must be used within a LearnerProgressProvider"
    );
  }
  return context;
}
