"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { trackResumeUsed } from "@/lib/analytics/events";
import { useLearnerProgress } from "@/components/providers/LearnerProgressProvider";

interface StickyCourseProgressProps {
  progressPercentage?: number;
  firstLessonSlug?: string;
  courseSlug?: string;
  courseLessonSlugs?: string[];
}

export function StickyCourseProgress({
  progressPercentage,
  firstLessonSlug,
  courseSlug = "",
  courseLessonSlugs,
}: StickyCourseProgressProps) {
  const { getCourseProgress } = useLearnerProgress();
  const progress = getCourseProgress(courseLessonSlugs);

  const displayPercentage =
    courseLessonSlugs && courseLessonSlugs.length > 0
      ? progress.percentage
      : (progressPercentage ?? 0);

  const targetLessonSlug = progress.firstIncompleteSlug || firstLessonSlug;
  const targetHref = targetLessonSlug ? `/lessons/${targetLessonSlug}` : "#course-content";

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
      <div className="w-full bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
        {/* Progress Info (Left) */}
        <div className="flex flex-col sm:items-start shrink-0">
          <span className="text-[12px] text-[#64748B] font-medium font-sans">
            Your Progress
          </span>
          <span className="text-[15px] sm:text-[16px] font-bold text-[#0F172A] tracking-tight font-sans">
            {displayPercentage}% <span className="font-normal text-[#64748B]">complete</span>
          </span>
        </div>

        {/* Progress Track (Center) */}
        <div className="w-full sm:flex-1 max-w-xl mx-0 sm:mx-6">
          <div className="w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D96B43] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${displayPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Button (Right) */}
        <div className="shrink-0 w-full sm:w-auto">
          <Link
            href={targetHref}
            onClick={() => {
              trackResumeUsed({
                course_slug: courseSlug,
                lesson_slug: targetLessonSlug,
                source: "sticky_progress",
              });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-[14px] bg-[#D96B43] hover:bg-[#C25832] text-white font-medium text-[15px] shadow-sm hover:shadow transition-all duration-150 group cursor-pointer"
          >
            <span>Continue Learning</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 stroke-[2.2]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
