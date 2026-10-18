"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from "lucide-react";
import posthog from "posthog-js";
import { useLearnerProgress } from "@/components/providers/LearnerProgressProvider";

interface LessonNavTarget {
  title: string;
  slug: string;
  duration?: string;
}

interface LessonFooterNavProps {
  previousLesson?: LessonNavTarget | null;
  nextLesson?: LessonNavTarget | null;
  currentLessonTitle?: string;
  currentLessonSlug?: string;
  courseTitle?: string;
  courseSlug?: string;
}

export function LessonFooterNav({
  previousLesson,
  nextLesson,
  currentLessonTitle = "",
  currentLessonSlug = "",
  courseTitle = "",
  courseSlug = "",
}: LessonFooterNavProps) {
  const { isLessonCompleted, toggleLessonCompleted, markLessonCompleted } =
    useLearnerProgress();
  const completed = isLessonCompleted(currentLessonSlug);

  return (
    <footer className="w-full pt-8 pb-16 mt-8 border-t border-[#E2E8F0] flex flex-col gap-6 font-sans">
      {/* 1. Dedicated Mark As Complete Center Action Area */}
      {currentLessonSlug && (
        <div className="flex items-center justify-center w-full">
          <button
            type="button"
            onClick={() =>
              toggleLessonCompleted({
                lessonSlug: currentLessonSlug,
                courseSlug,
                lessonTitle: currentLessonTitle,
                courseTitle,
              })
            }
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-[14px] text-[14px] font-medium transition-all duration-150 cursor-pointer shadow-2xs select-none ${
              completed
                ? "bg-[#ECFDF5] border border-[#10B981]/30 text-[#047857] hover:bg-[#D1FAE5]"
                : "bg-white border border-[#CBD5E1] text-[#334155] hover:border-[#EA580C] hover:text-[#EA580C]"
            }`}
            aria-pressed={completed}
          >
            {completed ? (
              <>
                <Check className="w-4 h-4 text-[#10B981] stroke-[2.5]" />
                <span className="font-semibold">Completed</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#94A3B8] stroke-[2]" />
                <span>Mark as complete</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 2. Dedicated Lesson Navigation Row (Previous on Left, Next on Right) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
        {/* Previous Lesson (Left Area) */}
        {previousLesson ? (
          <div className="flex items-center gap-3.5 w-full sm:w-auto min-w-0 max-w-full sm:max-w-[45%]">
            <Link
              href={`/lessons/${previousLesson.slug}`}
              onClick={() =>
                posthog.capture("lesson_navigated", {
                  from: currentLessonTitle,
                  to: previousLesson.title,
                  direction: "previous",
                })
              }
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-[12px] text-[14px] font-medium text-[#0F172A] shadow-2xs hover:shadow-xs transition-all cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2]" />
              <span>Previous Lesson</span>
            </Link>

            <div className="flex flex-col min-w-0">
              <span
                className="text-[13.5px] font-semibold text-[#0F172A] truncate"
                title={previousLesson.title}
              >
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

        {/* Next Lesson (Right Area) */}
        {nextLesson ? (
          <div className="flex items-center gap-3.5 w-full sm:w-auto min-w-0 max-w-full sm:max-w-[45%] justify-end sm:ml-auto">
            <div className="flex flex-col items-end min-w-0 text-right">
              <span
                className="text-[13.5px] font-semibold text-[#0F172A] truncate"
                title={nextLesson.title}
              >
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
              onClick={() => {
                if (currentLessonSlug) {
                  markLessonCompleted({
                    lessonSlug: currentLessonSlug,
                    courseSlug,
                    lessonTitle: currentLessonTitle,
                    courseTitle,
                    completionTrigger: "next_lesson_click",
                  });
                }
                posthog.capture("lesson_navigated", {
                  from: currentLessonTitle,
                  to: nextLesson.title,
                  direction: "next",
                });
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#EA580C] hover:bg-[#D94E07] text-white rounded-[12px] text-[14px] font-medium shadow-xs hover:shadow-sm transition-all cursor-pointer shrink-0"
            >
              <span>Next Lesson</span>
              <ArrowRight className="w-4 h-4 stroke-[2]" />
            </Link>
          </div>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>
    </footer>
  );
}
