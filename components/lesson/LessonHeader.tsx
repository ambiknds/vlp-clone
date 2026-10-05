"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Clock, BarChart2, Users, Bookmark } from "lucide-react";
import posthog from "posthog-js";

interface LessonHeaderProps {
  courseTitle: string;
  courseSlug: string;
  moduleTitle: string;
  lessonTitle: string;
  lessonLabel: string; // e.g. "LESSON 5.1"
  summary?: string;
  duration?: string;
  level?: string;
  studentCount?: number;
}

export function LessonHeader({
  courseTitle,
  courseSlug,
  moduleTitle,
  lessonTitle,
  lessonLabel,
  summary,
  duration = "1h 28m",
  level = "Intermediate",
  studentCount = 3426,
}: LessonHeaderProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    posthog.capture("lesson_bookmarked", {
      lesson_title: lessonTitle,
      course_title: courseTitle,
      is_bookmarked: nextState,
    });
  };

  const formattedStudents = studentCount.toLocaleString();

  return (
    <div className="flex flex-col gap-3">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "All Courses", href: "/courses" },
          { label: courseTitle, href: `/courses/${courseSlug}` },
          { label: moduleTitle },
          { label: lessonTitle, active: true },
        ]}
      />

      {/* Pill Badge */}
      <div className="pt-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]">
          {lessonLabel}
        </span>
      </div>

      {/* Title & Bookmark Button */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-[32px] sm:text-[38px] font-serif font-bold text-[#0F172A] tracking-tight leading-[1.18]">
          {lessonTitle}
        </h1>

        <button
          type="button"
          onClick={toggleBookmark}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark lesson"}
          className={`w-10 h-10 rounded-[12px] border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
            isBookmarked
              ? "bg-[#FFF7ED] border-[#FED7AA] text-[#EA580C] shadow-xs"
              : "bg-white border-[#E2E8F0] hover:border-[#CBD5E1] text-[#EA580C] hover:bg-[#FFF7ED]/50 shadow-2xs"
          }`}
        >
          <Bookmark
            className={`w-5 h-5 stroke-[1.75] ${isBookmarked ? "fill-current" : ""}`}
          />
        </button>
      </div>

      {/* Subtitle / Summary */}
      {summary && (
        <p className="text-[15px] sm:text-[16px] text-[#475569] font-sans leading-relaxed max-w-[880px]">
          {summary}
        </p>
      )}

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-5 sm:gap-7 pt-1 text-[13.5px] text-[#475569] font-medium font-sans">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#64748B] stroke-[1.75]" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#64748B] stroke-[1.75]" />
          <span>{level}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#64748B] stroke-[1.75]" />
          <span>{formattedStudents} students</span>
        </div>
      </div>
    </div>
  );
}
