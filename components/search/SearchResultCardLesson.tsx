"use client";

import React from "react";
import Link from "next/link";
import { FileText, CheckCircle2, ExternalLink, ChevronRight } from "lucide-react";
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
          <div className="flex items-center gap-2 mb-2 text-[#64748B]">
            <FileText className="w-4 h-4 text-[#94A3B8]" />
            <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#94A3B8]">
              Lesson Highlights
            </span>
          </div>

          <ul className="space-y-1.5 text-[12px] sm:text-[12.5px] text-[#475569] leading-snug">
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
                  <span>Core concepts & architecture</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#94A3B8]">•</span>
                  <span>Practical code examples</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#94A3B8]">•</span>
                  <span>Best practices & performance</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Bottom Right Checkmark Icon */}
        <div className="self-end text-[#94A3B8] group-hover/box:text-[#64748B] transition-colors">
          <CheckCircle2 className="w-4 h-4" />
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
            <span className="text-[#CBD5E1]">•</span>
            <span>{result.moduleTitle}</span>
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
