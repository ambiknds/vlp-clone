import { NextRequest, NextResponse } from "next/server";
import { executeGroundedSearch } from "@/lib/search/grounded-search";
import type { SortOption } from "@/types/search";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const sort = (searchParams.get("sort") || "relevance") as SortOption;

  try {
    const searchResult = await executeGroundedSearch(query, sort);
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
