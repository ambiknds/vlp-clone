import React from "react";
import type { Metadata } from "next";
import { HeaderNav } from "@/components/ui/HeaderNav";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResultCardVideo } from "@/components/search/SearchResultCardVideo";
import { SearchResultCardLesson } from "@/components/search/SearchResultCardLesson";
import { SearchSortSelect } from "@/components/search/SearchSortSelect";
import { SearchEmptyState } from "@/components/search/SearchEmptyState";
import { SearchCtaBanner } from "@/components/search/SearchCtaBanner";
import { SearchAnalyticsTracker } from "@/components/search/SearchAnalyticsTracker";
import { executeGroundedSearch } from "@/lib/search/grounded-search";
import type { SortOption } from "@/types/search";

interface PageProps {
  searchParams: Promise<{ q?: string; query?: string; sort?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q || params.query || "";

  if (q) {
    return {
      title: `Results for "${q}" — Vertex Search`,
      description: `Intelligent search results for "${q}" across courses, lessons, and video moments in Vertex LMS.`,
    };
  }

  return {
    title: "Search — Vertex LMS",
    description: "Search courses, lessons, and video moments in plain English.",
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = (params.q || params.query || "").trim();
  const sort = (params.sort || "relevance") as SortOption;

  // Execute grounded search over courses, lessons, and video intelligence
  const searchResponse = await executeGroundedSearch(query, sort);
  const { totalCount, courseCount, results } = searchResponse;

  return (
    <div
      className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#0F172A] selection:bg-[#FED7AA] selection:text-[#9A3412] relative overflow-x-hidden"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(226, 232, 240, 0.45) 18px, rgba(226, 232, 240, 0.45) 19px)",
      }}
    >
      {/* PostHog Search Analytics */}
      <SearchAnalyticsTracker
        query={query}
        totalCount={totalCount}
        courseCount={courseCount}
        sort={sort}
      />

      {/* Top Header Navigation */}
      <HeaderNav activeTab="courses" showSearch={false} />

      {/* Main Search View Area */}
      <main className="flex-1 flex flex-col items-center w-full">
        {/* ========================================================================= */}
        {/* HERO SEARCH SECTION (Matches design/vertex-search.png)                     */}
        {/* ========================================================================= */}
        <section className="w-full max-w-[800px] mx-auto px-6 pt-10 sm:pt-14 pb-8 flex flex-col items-center text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center px-3.5 py-1 rounded-[8px] bg-[#FFEEE5] border border-[#FED7AA] mb-4">
            <span className="text-[11px] font-bold tracking-[0.14em] text-[#EA580C] uppercase font-sans">
              SEARCH RESULTS
            </span>
          </div>

          {/* Headline with Query in Orange Serif */}
          <h1 className="text-[38px] sm:text-[48px] md:text-[54px] font-serif font-bold text-[#0F172A] leading-[1.14] tracking-tight">
            {query ? (
              <>
                Results for <span className="text-[#EA580C]">“{query}”</span>
              </>
            ) : (
              "Search Courses & Lessons"
            )}
          </h1>

          {/* Subtitle / Counts */}
          <p className="text-[15px] sm:text-[16px] text-[#64748B] font-sans mt-3 mb-8">
            {query
              ? `Found ${totalCount} ${totalCount === 1 ? "result" : "results"} across ${courseCount} ${courseCount === 1 ? "course" : "courses"}`
              : "Search in plain English to jump to exact moments in lesson videos"}
          </p>

          {/* Search Input Bar */}
          <div className="w-full max-w-[680px]">
            <SearchBar initialQuery={query} />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* RESULTS FEED SECTION                                                      */}
        {/* ========================================================================= */}
        <section className="w-full max-w-[940px] mx-auto px-4 sm:px-6 pb-20">
          {/* Meta Bar: Results Count & Sort Dropdown */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-[15px] font-bold text-[#0F172A]">
              {totalCount} {totalCount === 1 ? "result" : "results"}
            </div>

            <div className="flex items-center gap-3">
              <SearchSortSelect currentSort={sort} />
            </div>
          </div>

          {/* Results List or Empty State */}
          {results.length > 0 ? (
            <div className="flex flex-col gap-4">
              {results.map((item, index) =>
                item.type === "video" ? (
                  <SearchResultCardVideo
                    key={item.id}
                    result={item}
                    query={query}
                    rank={index + 1}
                  />
                ) : (
                  <SearchResultCardLesson
                    key={item.id}
                    result={item}
                    query={query}
                    rank={index + 1}
                  />
                )
              )}
            </div>
          ) : (
            <SearchEmptyState query={query} />
          )}

          {/* Bottom CTA Banner */}
          <SearchCtaBanner />
        </section>
      </main>
    </div>
  );
}
