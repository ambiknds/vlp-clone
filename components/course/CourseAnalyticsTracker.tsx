"use client";

import { useEffect, useRef } from "react";
import { trackCourseViewed } from "@/lib/analytics/events";

interface CourseAnalyticsTrackerProps {
  courseSlug: string;
  courseTitle: string;
  level?: string;
  moduleCount?: number;
  studentCount?: number;
}

export function CourseAnalyticsTracker({
  courseSlug,
  courseTitle,
  level,
  moduleCount,
  studentCount,
}: CourseAnalyticsTrackerProps) {
  const trackedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!courseSlug) return;
    if (trackedRef.current === courseSlug) return;
    trackedRef.current = courseSlug;

    trackCourseViewed({
      course_slug: courseSlug,
      course_title: courseTitle,
      level,
      module_count: moduleCount,
      student_count: studentCount,
    });
  }, [courseSlug, courseTitle, level, moduleCount, studentCount]);

  return null;
}
