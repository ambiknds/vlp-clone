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
        {result.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={result.thumbnailUrl}
            alt={result.lessonTitle}
            className="w-full h-full object-cover"
          />
        ) : result.courseBadgeIcon === "react" ? (
          // React code editor preview
          <div className="absolute inset-0 bg-[#0D1117] p-3 text-[10px] font-mono leading-relaxed select-none overflow-hidden opacity-90">
            <div className="text-[#7EE787]">{"// Fetching Data with useEffect"}</div>
            <div className="text-[#FF7B72]">const <span className="text-[#79C0FF]">[data, setData]</span> = useState(null);</div>
            <div className="text-[#FF7B72]">useEffect<span className="text-[#D2A8FF]">(() =&gt; &#123;</span></div>
            <div className="pl-2 text-[#79C0FF]">fetchData<span className="text-[#FFA657]">()</span>.then(setData);</div>
            <div className="text-[#D2A8FF]">&#125;, []);</div>
          </div>
        ) : result.courseBadgeIcon === "nodejs" || result.courseBadgeIcon === "node" || result.courseTitle.toLowerCase().includes("node") ? (
          // Node.js Backend API Request flow diagram
          <div className="absolute inset-0 bg-[#F8FAFC] flex items-center justify-between px-3 select-none">
            <div className="w-[54px] h-[58px] rounded-[8px] border border-[#CBD5E1] bg-white flex flex-col items-center justify-center shadow-xs">
              <span className="text-[9px] font-semibold text-[#0284C7]">Client</span>
              <div className="w-6 h-5 rounded-[4px] bg-[#E0F2FE] border border-[#BAE6FD] mt-1" />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center px-1">
              <span className="text-[8.5px] font-semibold text-[#64748B] mb-1">API Request</span>
              <div className="w-full h-[2px] bg-[#94A3B8] relative">
                <div className="absolute right-0 -top-[3px] w-2 h-2 border-t-2 border-r-2 border-[#94A3B8] rotate-45" />
              </div>
            </div>
            <div className="w-[54px] h-[58px] rounded-[8px] border border-[#FED7AA] bg-[#FFF7ED] flex flex-col items-center justify-center shadow-xs">
              <span className="text-[9px] font-semibold text-[#EA580C]">Database</span>
              <div className="w-6 h-5 rounded-[4px] bg-[#FFEDD5] border border-[#FDBA74] mt-1" />
            </div>
          </div>
        ) : result.courseBadgeIcon === "javascript" || result.courseBadgeIcon === "js" || result.courseTitle.toLowerCase().includes("javascript") ? (
          // JavaScript Fetch API code snippet
          <div className="absolute inset-0 bg-[#0F172A] p-3 text-[10px] font-mono leading-relaxed select-none overflow-hidden opacity-95">
            <div className="text-[#F1F5F9]"><span className="text-[#F59E0B]">const</span> data = <span className="text-[#F59E0B]">await</span> fetch(<span className="text-[#34D399]">&apos;/api/users&apos;</span>)</div>
            <div className="text-[#94A3B8] pl-2">.then(res =&gt; res.json())</div>
            <div className="text-[#EF4444] pl-2">.catch(err =&gt; console.error(err))</div>
          </div>
        ) : (
          // Next.js styled preview with stylized N mark
          <div className="absolute inset-0 bg-[#0B0F19] flex items-center justify-center select-none overflow-hidden">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <svg className="w-14 h-14 text-white/80" viewBox="0 0 180 180" fill="none">
                <mask id="mask0_video" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
                  <circle cx="90" cy="90" r="90" fill="black" />
                </mask>
                <g mask="url(#mask0_video)">
                  <circle cx="90" cy="90" r="90" fill="#0B0F19" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                  <path d="M149.508 157.438L69.8373 54H54V125.97H66.2577V69.7129L139.965 164.842C143.344 162.604 146.541 160.124 149.508 157.438Z" fill="white" />
                  <rect x="115" y="54" width="12.2" height="72" fill="white" />
                </g>
              </svg>
            </div>
          </div>
        )}

        {/* Centered Play Button Overlay */}
        <div className="relative z-10 w-11 h-11 rounded-full bg-white/25 backdrop-blur-xs flex items-center justify-center text-white border border-white/50 group-hover/video:scale-110 group-hover/video:bg-white/35 transition-all shadow-md">
          <Play className="w-4.5 h-4.5 fill-white text-white ml-0.5" />
        </div>

        {/* Bottom-right Duration / Timestamp Badge */}
        <div className="absolute bottom-2.5 right-2.5 z-10 bg-black/85 backdrop-blur-xs text-white text-[11px] font-semibold font-mono px-2 py-0.5 rounded-[4px] shadow-xs">
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
