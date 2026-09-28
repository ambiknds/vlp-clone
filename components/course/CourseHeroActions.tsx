"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Bookmark } from "lucide-react";

interface CourseHeroActionsProps {
  firstLessonSlug?: string;
}

export function CourseHeroActions({ firstLessonSlug }: CourseHeroActionsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const targetHref = firstLessonSlug
    ? `/lessons/${firstLessonSlug}`
    : "#course-content";

  return (
    <div className="flex flex-wrap items-center gap-3.5 pt-2">
      <Link
        href={targetHref}
        className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-[14px] bg-[#D96B43] hover:bg-[#C25832] text-white font-medium text-[15px] shadow-sm hover:shadow transition-all duration-150 group cursor-pointer"
      >
        <span>Continue Learning</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 stroke-[2.2]" />
      </Link>

      <button
        type="button"
        onClick={() => setIsBookmarked((prev) => !prev)}
        className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[14px] border font-medium text-[15px] transition-all duration-150 cursor-pointer ${
          isBookmarked
            ? "bg-[#FFF7ED] border-[#FED7AA] text-[#EA580C]"
            : "bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]"
        }`}
      >
        <Bookmark
          className={`w-4 h-4 stroke-[2] ${
            isBookmarked ? "fill-[#EA580C] text-[#EA580C]" : "text-[#475569]"
          }`}
        />
        <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
      </button>
    </div>
  );
}
