import { NextRequest, NextResponse } from "next/server";
import { executeGroundedSearch } from "@/lib/search/grounded-search";
import type { SortOption } from "@/types/search";
import { auth } from "@clerk/nextjs/server";
import { captureServerEvent } from "@/lib/analytics/posthog-server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const sort = (searchParams.get("sort") || "relevance") as SortOption;

  try {
    const searchResult = await executeGroundedSearch(query, sort);

    // Track search execution server-side with zero PII
    try {
      const { userId } = await auth();
      const distinctId = userId || "anonymous";
      const videoResultsCount =
        searchResult.results?.filter((r) => r.type === "video").length || 0;

      await captureServerEvent(distinctId, "search_performed", {
        query,
        result_count: searchResult.totalCount,
        course_count: searchResult.courseCount,
        sort,
        source: "api",
        has_results: searchResult.totalCount > 0,
      });

      if (videoResultsCount > 0) {
        await captureServerEvent(distinctId, "video_search_performed", {
          query,
          video_results_count: videoResultsCount,
          has_video_results: true,
          sort,
        });
      }
    } catch {
      // Telemetry failure is non-blocking
    }

    return NextResponse.json(searchResult);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      {
        query,
        totalCount: 0,
        courseCount: 0,
        results: [],
        error: "Failed to execute search",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const query = body.query || body.q || "";
    const sort = (body.sort || "relevance") as SortOption;

    const searchResult = await executeGroundedSearch(query, sort);

    // Track search execution server-side with zero PII
    try {
      const { userId } = await auth();
      const distinctId = userId || "anonymous";
      const videoResultsCount =
        searchResult.results?.filter((r) => r.type === "video").length || 0;

      await captureServerEvent(distinctId, "search_performed", {
        query,
        result_count: searchResult.totalCount,
        course_count: searchResult.courseCount,
        sort,
        source: "api",
        has_results: searchResult.totalCount > 0,
      });

      if (videoResultsCount > 0) {
        await captureServerEvent(distinctId, "video_search_performed", {
          query,
          video_results_count: videoResultsCount,
          has_video_results: true,
          sort,
        });
      }
    } catch {
      // Telemetry failure is non-blocking
    }

    return NextResponse.json(searchResult);
  } catch (error) {
    console.error("Search API POST error:", error);
    return NextResponse.json(
      {
        query: "",
        totalCount: 0,
        courseCount: 0,
        results: [],
        error: "Failed to process search request",
      },
      { status: 500 }
    );
  }
}
