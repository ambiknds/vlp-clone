"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useUser } from "@clerk/nextjs";
import { trackLessonCompleted, trackCourseEnrolled } from "@/lib/analytics/events";

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
  enrolledCourses: Set<string>;
  isLessonCompleted: (lessonSlug?: string) => boolean;
  isCourseEnrolled: (courseSlug?: string) => boolean;
  enrollCourse: (courseSlug: string, courseTitle?: string) => Promise<boolean>;
  markLessonCompleted: (params: ProgressMutationParams) => Promise<void>;
  unmarkLessonCompleted: (params: ProgressMutationParams) => Promise<void>;
  toggleLessonCompleted: (params: ProgressMutationParams) => Promise<void>;
  getCourseProgress: (courseLessonSlugs?: string[]) => CourseProgressResult;
  isLoading: boolean;
}

const STORAGE_KEY_LESSONS = "vertex_completed_lessons";
const STORAGE_KEY_ENROLLED = "vertex_enrolled_courses";
const PENDING_ENROLL_KEY = "vertex_pending_enrollment";

const LearnerProgressContext = createContext<LearnerProgressContextValue | null>(null);

function normalizeCourseSlug(slug?: string): string[] {
  if (!slug) return [];
  if (slug === "nextjs-for-production" || slug === "nextjs-app-router-in-depth") {
    return ["nextjs-for-production", "nextjs-app-router-in-depth"];
  }
  return [slug];
}

export function LearnerProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded: isUserLoaded } = useUser();

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LESSONS);
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch {
      // LocalStorage access fallback
    }
    return new Set();
  });

  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ENROLLED);
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch {
      // LocalStorage access fallback
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
        if (!isMounted || !data) return;

        // Sync completed lessons
        if (data.completedLessonSlugs && Array.isArray(data.completedLessonSlugs)) {
          setCompletedLessons((prev) => {
            const next = new Set(prev);
            data.completedLessonSlugs.forEach((s: string) => next.add(s));
            try {
              localStorage.setItem(STORAGE_KEY_LESSONS, JSON.stringify(Array.from(next)));
            } catch {
              // Ignore storage quota
            }
            return next;
          });
        }

        // Sync enrolled courses
        if (data.enrolledCourseSlugs && Array.isArray(data.enrolledCourseSlugs)) {
          setEnrolledCourses((prev) => {
            const next = new Set(prev);
            data.enrolledCourseSlugs.forEach((s: string) => {
              normalizeCourseSlug(s).forEach((alias) => next.add(alias));
            });
            try {
              localStorage.setItem(STORAGE_KEY_ENROLLED, JSON.stringify(Array.from(next)));
            } catch {
              // Ignore storage quota
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
  }, [isSignedIn]);

  const saveLessonsToLocal = useCallback((updated: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY_LESSONS, JSON.stringify(Array.from(updated)));
    } catch {
      // Safe noop
    }
  }, []);

  const saveEnrolledToLocal = useCallback((updated: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY_ENROLLED, JSON.stringify(Array.from(updated)));
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

  const isCourseEnrolled = useCallback(
    (courseSlug?: string) => {
      if (!courseSlug) return false;
      const aliases = normalizeCourseSlug(courseSlug);
      return aliases.some((alias) => enrolledCourses.has(alias));
    },
    [enrolledCourses]
  );

  const enrollCourse = useCallback(
    async (courseSlug: string, courseTitle?: string): Promise<boolean> => {
      if (!courseSlug) return false;

      const aliases = normalizeCourseSlug(courseSlug);

      // Optimistic client update
      setEnrolledCourses((prev) => {
        const next = new Set(prev);
        aliases.forEach((alias) => next.add(alias));
        saveEnrolledToLocal(next);
        return next;
      });

      // Track PostHog client event
      trackCourseEnrolled({
        course_slug: courseSlug,
        course_title: courseTitle,
        source: "course_hero",
      });

      // Persist to server route
      try {
        const res = await fetch("/api/enroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseSlug,
            courseTitle,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.enrolledCourseSlugs && Array.isArray(data.enrolledCourseSlugs)) {
            setEnrolledCourses((prev) => {
              const next = new Set(prev);
              data.enrolledCourseSlugs.forEach((s: string) => {
                normalizeCourseSlug(s).forEach((alias) => next.add(alias));
              });
              saveEnrolledToLocal(next);
              return next;
            });
          }
        }
      } catch (err) {
        console.warn("Failed to sync enrollment to server:", err);
      }

      return true;
    },
    [saveEnrolledToLocal]
  );

  // Auto-enroll if there was a pending enrollment waiting for authentication
  useEffect(() => {
    if (!isUserLoaded || !isSignedIn) return;

    try {
      const pendingCourse = localStorage.getItem(PENDING_ENROLL_KEY);
      if (pendingCourse) {
        localStorage.removeItem(PENDING_ENROLL_KEY);
        setTimeout(() => {
          enrollCourse(pendingCourse);
        }, 0);
      }
    } catch {
      // Ignore
    }
  }, [isUserLoaded, isSignedIn, enrollCourse]);

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
        saveLessonsToLocal(next);
        return next;
      });

      // Also ensure parent course is considered enrolled
      if (courseSlug) {
        setEnrolledCourses((prev) => {
          const next = new Set(prev);
          normalizeCourseSlug(courseSlug).forEach((alias) => next.add(alias));
          saveEnrolledToLocal(next);
          return next;
        });
      }

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
    [saveLessonsToLocal, saveEnrolledToLocal]
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
        saveLessonsToLocal(next);
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
    [saveLessonsToLocal]
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
      enrolledCourses,
      isLessonCompleted,
      isCourseEnrolled,
      enrollCourse,
      markLessonCompleted,
      unmarkLessonCompleted,
      toggleLessonCompleted,
      getCourseProgress,
      isLoading,
    }),
    [
      completedLessons,
      enrolledCourses,
      isLessonCompleted,
      isCourseEnrolled,
      enrollCourse,
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
