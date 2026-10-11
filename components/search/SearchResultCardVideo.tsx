"use client";

import React from "react";
import Link from "next/link";
import { Play, PlayCircle, FileText, Folder, ChevronRight } from "lucide-react";
import { CourseBadgeIcon } from "./CourseBadgeIcon";
import type { VideoSearchResult } from "@/types/search";
import posthog from "posthog-js";

export function SearchResultCardVideo({
  result,
  query,
  rank,
}: {
  result: VideoSearchResult;
  query?: string;
  rank?: number;
}) {
  const lessonUrl = `/lessons/${result.lessonSlug}?start=${result.matchedSecond}`;

  const handleResultClick = () => {
    posthog.capture("search_result_clicked", {
      query,
      result_type: "video",
      lesson_slug: result.lessonSlug,
      course_title: result.courseTitle,
      start_seconds: result.matchedSecond,
      rank,
    });
  };

  return (
    <div className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-[16px] p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row gap-5 items-stretch group">
      {/* Video Thumbnail / Preview Container */}
      <Link
        href={lessonUrl}
        onClick={handleResultClick}
        className="w-full md:w-[260px] h-[155px] rounded-[12px] overflow-hidden relative shrink-0 bg-[#0B0F19] flex items-center justify-center cursor-pointer group/video border border-[#0F172A]/10 shadow-2xs"
      >
        {/* Background gradient or poster simulation */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#0F172A] opacity-90" />

        {/* Subtle decorative code or pattern lines */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none pointer-events-none">
          <div className="text-[28px] font-mono text-slate-400 font-bold tracking-widest">
            VERTEX
          </div>
        </div>

        {/* Centered Play Button Overlay */}
        <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white border border-white/40 group-hover/video:scale-110 group-hover/video:bg-white/30 transition-all shadow-sm">
          <Play className="w-5 h-5 fill-white text-white ml-0.5" />
        </div>

        {/* Bottom-right Duration / Timestamp Badge */}
        <div className="absolute bottom-2.5 right-2.5 z-10 bg-black/85 backdrop-blur-xs text-white text-[11px] font-semibold font-mono px-2 py-0.5 rounded-[4px]">
          {result.duration || result.matchedTimestamp}
        </div>
      </Link>

      {/* Content & Details Container */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Header Row: Course info & VIDEO badge */}
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <CourseBadgeIcon preset={result.courseBadgeIcon} className="w-4 h-4 rounded-[4px]" />
              <span className="text-[13px] font-medium text-[#64748B] truncate">
                {result.courseTitle}
              </span>
            </div>

            <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA]">
              VIDEO
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

          {/* Description / Matched snippet */}
          <p className="text-[14px] text-[#64748B] line-clamp-2 leading-relaxed mb-4">
            {result.description}
          </p>
        </div>

        {/* Footer Meta & Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 border-t border-[#F1F5F9]">
          <div className="flex items-center gap-2 text-[13px] text-[#64748B] flex-wrap">
            <span className="inline-flex items-center gap-1 font-medium">
              <FileText className="w-3.5 h-3.5 text-[#94A3B8]" />
              {result.lessonNumber}
            </span>
            <span className="text-[#CBD5E1]">•</span>
            <span className="inline-flex items-center gap-1">
              <Folder className="w-3.5 h-3.5 text-[#94A3B8]" />
              {result.moduleTitle}
            </span>
          </div>

          <Link
            href={lessonUrl}
            onClick={handleResultClick}
            className="inline-flex items-center gap-1.5 text-[13.5px] sm:text-[14px] font-semibold text-[#EA580C] hover:text-[#C2410C] transition-colors shrink-0 group/action"
          >
            <PlayCircle className="w-4 h-4 text-[#EA580C]" />
            <span>Watch from {result.matchedTimestamp}</span>
            <ChevronRight className="w-4 h-4 text-[#EA580C] group-hover/action:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
