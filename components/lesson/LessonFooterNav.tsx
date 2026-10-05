"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import posthog from "posthog-js";

interface LessonNavTarget {
  title: string;
  slug: string;
  duration?: string;
}

interface LessonFooterNavProps {
  previousLesson?: LessonNavTarget | null;
  nextLesson?: LessonNavTarget | null;
  currentLessonTitle?: string;
}

export function LessonFooterNav({
  previousLesson,
  nextLesson,
  currentLessonTitle,
}: LessonFooterNavProps) {
  return (
    <footer className="w-full pt-8 pb-16 mt-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
      {/* Previous Lesson */}
      {previousLesson ? (
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Link
            href={`/lessons/${previousLesson.slug}`}
            onClick={() =>
              posthog.capture("lesson_navigated", {
                from: currentLessonTitle,
                to: previousLesson.title,
                direction: "previous",
              })
            }
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-[12px] text-[14px] font-medium text-[#0F172A] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2]" />
            <span>Previous Lesson</span>
          </Link>

          <div className="flex flex-col min-w-0">
            <span className="text-[13.5px] font-semibold text-[#0F172A] truncate">
              {previousLesson.title}
            </span>
            {previousLesson.duration && (
              <span className="text-[12px] text-[#64748B]">
                {previousLesson.duration}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden sm:block" />
      )}

      {/* Next Lesson */}
      {nextLesson ? (
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end ml-auto">
          <div className="flex flex-col items-end min-w-0 text-right">
            <span className="text-[13.5px] font-semibold text-[#0F172A] truncate">
              {nextLesson.title}
            </span>
            {nextLesson.duration && (
              <span className="text-[12px] text-[#64748B]">
                {nextLesson.duration}
              </span>
            )}
          </div>

          <Link
            href={`/lessons/${nextLesson.slug}`}
            onClick={() =>
              posthog.capture("lesson_navigated", {
                from: currentLessonTitle,
                to: nextLesson.title,
                direction: "next",
              })
            }
            className="flex items-center gap-2 px-5 py-2.5 bg-[#EA580C] hover:bg-[#D94E07] text-white rounded-[12px] text-[14px] font-medium shadow-xs hover:shadow-sm transition-all cursor-pointer shrink-0"
          >
            <span>Next Lesson</span>
            <ArrowRight className="w-4 h-4 stroke-[2]" />
          </Link>
        </div>
      ) : (
        <div className="hidden sm:block" />
      )}
    </footer>
  );
}
