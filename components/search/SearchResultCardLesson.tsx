"use client";

import React from "react";
import Link from "next/link";
import { FileText, ExternalLink, ChevronRight } from "lucide-react";
import { CourseBadgeIcon } from "./CourseBadgeIcon";
import type { LessonSearchResult } from "@/types/search";
import posthog from "posthog-js";

export function SearchResultCardLesson({
  result,
  query,
  rank,
}: {
  result: LessonSearchResult;
  query?: string;
  rank?: number;
}) {
  const lessonUrl = `/lessons/${result.lessonSlug}`;

  const handleResultClick = () => {
    posthog.capture("search_result_clicked", {
      query,
      result_type: "lesson",
      lesson_slug: result.lessonSlug,
      course_title: result.courseTitle,
      rank,
    });
  };

  const keyPoints = (result.keyPoints || []).slice(0, 3);

  return (
    <div className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-[16px] p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row gap-5 items-stretch group">
      {/* Left Key Points Box Container */}
      <Link
        href={lessonUrl}
        onClick={handleResultClick}
        className="w-full md:w-[260px] h-[155px] rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0]/80 p-4 relative shrink-0 flex flex-col justify-between cursor-pointer hover:bg-[#F1F5F9] transition-colors shadow-2xs group/box"
      >
        <div className="min-w-0">
          <div className="mb-2.5">
            {result.courseBadgeIcon === "react" ? (
              <svg
                className="w-4.5 h-4.5 text-[#087EA4]"
                viewBox="-11.5 -10.23174 23 20.46348"
                fill="currentColor"
              >
                <circle cx="0" cy="0" r="2.05" />
                <g stroke="currentColor" strokeWidth="1" fill="none">
                  <ellipse rx="11" ry="4.2" />
                  <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                  <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                </g>
              </svg>
            ) : (
              <FileText className="w-4.5 h-4.5 text-[#94A3B8]" />
            )}
          </div>

          <ul className="space-y-1.5 text-[12.5px] text-[#475569] leading-snug">
            {keyPoints.length > 0 ? (
              keyPoints.map((kp, idx) => (
                <li key={idx} className="flex items-start gap-1.5 line-clamp-1">
                  <span className="text-[#94A3B8]">•</span>
                  <span className="truncate">{kp}</span>
                </li>
              ))
            ) : (
              <>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#94A3B8]">•</span>
                  <span>Fetching strategies</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#94A3B8]">•</span>
                  <span>Caching techniques</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#94A3B8]">•</span>
                  <span>Revalidation methods</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Bottom Right Checkmark Icon */}
        <div className="self-end">
          <div className="w-4.5 h-4.5 rounded-full bg-[#475569] text-white flex items-center justify-center shadow-2xs">
            <svg className="w-2.5 h-2.5 stroke-white stroke-[2.5] fill-none" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      </Link>

      {/* Content & Details Container */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Header Row: Course info & LESSON badge */}
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <CourseBadgeIcon preset={result.courseBadgeIcon} className="w-4 h-4 rounded-[4px]" />
              <span className="text-[13px] font-medium text-[#64748B] truncate">
                {result.courseTitle}
              </span>
            </div>

            <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-[#EEF2FF] text-[#6366F1] border border-[#E0E7FF]">
              LESSON
            </span>
          </div>

          {/* Lesson Title */}
          <Link
            href={lessonUrl}
            onClick={handleResultClick}
            className="block text-[18px] sm:text-[19px] font-bold text-[#0F172A] hover:text-[#EA580C] transition-colors tracking-tight leading-snug mb-2"
          >
            {result.lessonTitle}
          </Link>

          {/* Description */}
          <p className="text-[14px] text-[#64748B] line-clamp-2 leading-relaxed mb-4">
            {result.description}
          </p>
        </div>

        {/* Footer Meta & Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 border-t border-[#F1F5F9]">
          <div className="flex items-center gap-2 text-[13px] text-[#64748B]">
            <span className="font-medium text-[#64748B]">{result.moduleLabel}</span>
          </div>

          <Link
            href={lessonUrl}
            onClick={handleResultClick}
            className="inline-flex items-center gap-1.5 text-[13.5px] sm:text-[14px] font-semibold text-[#EA580C] hover:text-[#C2410C] transition-colors shrink-0 group/action"
          >
            <span>View lesson</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#EA580C]" />
            <ChevronRight className="w-4 h-4 text-[#EA580C] group-hover/action:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
