"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export function SearchAnalyticsTracker({
  query,
  totalCount,
  courseCount,
  sort,
}: {
  query: string;
  totalCount: number;
  courseCount: number;
  sort: string;
}) {
  useEffect(() => {
    if (query) {
      posthog.capture("learning_search_performed", {
        query,
        result_count: totalCount,
        course_count: courseCount,
        sort,
      });
    }
  }, [query, totalCount, courseCount, sort]);

  return null;
}
