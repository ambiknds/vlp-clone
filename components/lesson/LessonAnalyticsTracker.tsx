"use client";

import { useEffect, useRef } from "react";
import { trackLessonViewed, trackResumeUsed } from "@/lib/analytics/events";

interface LessonAnalyticsTrackerProps {
  lessonSlug: string;
  lessonTitle: string;
  courseTitle?: string;
  courseSlug?: string;
  duration?: string;
  level?: string;
  startSeconds?: number;
}

export function LessonAnalyticsTracker({
  lessonSlug,
  lessonTitle,
  courseTitle,
  courseSlug,
  duration,
  level,
  startSeconds = 0,
}: LessonAnalyticsTrackerProps) {
  const trackedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!lessonSlug) return;
    const trackingKey = `${lessonSlug}:${startSeconds}`;
    if (trackedRef.current === trackingKey) return;
    trackedRef.current = trackingKey;

    // Track lesson viewed
    trackLessonViewed({
      lesson_slug: lessonSlug,
      lesson_title: lessonTitle,
      course_title: courseTitle,
      course_slug: courseSlug,
      duration,
      level,
    });

    // If navigated with startSeconds > 0, track resume used
    if (startSeconds > 0) {
      trackResumeUsed({
        lesson_slug: lessonSlug,
        lesson_title: lessonTitle,
        course_title: courseTitle,
        course_slug: courseSlug,
        start_seconds: startSeconds,
        source: "video_timestamp_seek",
      });
    }
  }, [lessonSlug, lessonTitle, courseTitle, courseSlug, duration, level, startSeconds]);

  return null;
}
