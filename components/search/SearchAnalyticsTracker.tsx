"use client";

import { useEffect, useRef } from "react";
import posthog from "posthog-js";
import {
  trackSearchPerformed,
  trackVideoSearchPerformed,
} from "@/lib/analytics/events";

interface SearchAnalyticsTrackerProps {
  query: string;
  totalCount: number;
  courseCount: number;
  sort: string;
  videoResultsCount?: number;
}

export function SearchAnalyticsTracker({
  query,
  totalCount,
  courseCount,
  sort,
  videoResultsCount = 0,
}: SearchAnalyticsTrackerProps) {
  const trackedQueryRef = useRef<string | null>(null);

  useEffect(() => {
    if (!query) return;

    // Deduplicate tracking per query + sort combination
    const trackingKey = `${query}:${sort}:${totalCount}:${videoResultsCount}`;
    if (trackedQueryRef.current === trackingKey) return;
    trackedQueryRef.current = trackingKey;

    // 1. PostHog Standard Search Performed Event
    trackSearchPerformed({
      query,
      result_count: totalCount,
      course_count: courseCount,
      sort,
      source: "search_page",
      has_results: totalCount > 0,
    });

    // Backwards compatibility for existing dashboard widgets
    posthog.capture("learning_search_performed", {
      query,
      result_count: totalCount,
      course_count: courseCount,
      sort,
    });

    // 2. Video Search Performed Event (intelligence moments)
    trackVideoSearchPerformed({
      query,
      video_results_count: videoResultsCount,
      has_video_results: videoResultsCount > 0,
      sort,
    });
  }, [query, totalCount, courseCount, sort, videoResultsCount]);

  return null;
}
