"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ChevronDown, Play } from "lucide-react";
import posthog from "posthog-js";

export interface SidebarLessonItem {
  id: string;
  title: string;
  slug: string;
  duration?: string;
  freePreview?: boolean;
}

export interface SidebarModuleItem {
  key: string;
  moduleNumber: number;
  title: string;
  duration: string;
  lessons: SidebarLessonItem[];
}

interface LessonSidebarProps {
  courseTitle: string;
  courseSlug: string;
  badgeIcon?: string;
  progressPercentage?: number;
  currentModuleIndex: number;
  currentLessonSlug: string;
  modules: SidebarModuleItem[];
  className?: string;
}

export function LessonSidebar({
  courseTitle,
  courseSlug,
  badgeIcon = "nextjs",
  progressPercentage = 35,
  currentModuleIndex,
  currentLessonSlug,
  modules,
  className = "",
}: LessonSidebarProps) {
  // Track expanded state for each module; default the current active module to expanded
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({
    [currentModuleIndex]: true,
  });

  const toggleModule = (index: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const totalModules = modules.length;
  const currentModuleNumber = currentModuleIndex + 1;

  return (
    <aside
      className={`w-full lg:w-[340px] shrink-0 font-sans flex flex-col gap-4 select-none ${className}`}
    >
      {/* Back to course link */}
      <Link
        href={`/courses/${courseSlug}`}
        className="inline-flex items-center gap-2 text-[14px] font-medium text-[#EA580C] hover:text-[#C2410C] transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 stroke-[2.2] group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to course</span>
      </Link>

      {/* Course Summary Card */}
      <div className="flex items-center gap-3.5 p-3.5 bg-white border border-[#E2E8F0] rounded-[16px] shadow-2xs">
        {/* Badge Icon */}
        <div className="w-11 h-11 rounded-[12px] bg-black text-white flex items-center justify-center font-bold text-[20px] shrink-0 shadow-xs">
          {badgeIcon === "nextjs" ? (
            <span className="font-serif">N</span>
          ) : badgeIcon === "typescript" ? (
            <span className="text-[14px] font-mono">TS</span>
          ) : badgeIcon === "docker" ? (
            <span className="text-[16px]">🐳</span>
          ) : (
            <span className="font-serif text-[18px]">V</span>
          )}
        </div>

        {/* Title & Progress */}
        <div className="min-w-0">
          <h2 className="text-[15px] font-bold text-[#0F172A] leading-snug truncate">
            {courseTitle}
          </h2>
          <span className="text-[12.5px] text-[#64748B] font-medium">
            {progressPercentage}% complete
          </span>
        </div>
      </div>

      {/* Module Progress Header */}
      <div className="flex items-center justify-between px-1 pt-1 text-[13px] text-[#64748B] font-medium">
        <span className="text-[#0F172A] font-semibold">
          Module {currentModuleNumber} of {totalModules}
        </span>
        <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
      </div>

      {/* Modules Curriculum List */}
      <div className="flex flex-col gap-2">
        {modules.map((module, idx) => {
          const isCurrentModule = idx === currentModuleIndex;
          const isCompleted = idx < currentModuleIndex;
          const isExpanded = Boolean(expandedModules[idx]);
          const modNumber = module.moduleNumber || idx + 1;

          return (
            <div
              key={module.key || `sidebar-mod-${idx}`}
              className={`rounded-[14px] transition-all overflow-hidden border ${
                isCurrentModule
                  ? "bg-white border-[#E2E8F0] shadow-2xs"
                  : "bg-white/60 border-transparent hover:border-[#E2E8F0] hover:bg-white"
              }`}
            >
              {/* Module Header Row */}
              <button
                type="button"
                onClick={() => toggleModule(idx)}
                className="w-full flex items-center justify-between p-3 sm:p-3.5 text-left cursor-pointer gap-3"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Circled Index */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] shrink-0 font-medium ${
                      isCurrentModule
                        ? "bg-[#EA580C] text-white font-bold shadow-xs"
                        : "border border-[#E2E8F0] bg-white text-[#475569]"
                    }`}
                  >
                    {modNumber}
                  </div>

                  {/* Title & Duration */}
                  <div className="min-w-0">
                    <h3
                      className={`text-[13.5px] leading-snug truncate ${
                        isCurrentModule
                          ? "font-bold text-[#0F172A]"
                          : "font-semibold text-[#0F172A]"
                      }`}
                    >
                      {module.title}
                    </h3>
                    <span className="text-[12px] text-[#64748B] font-medium font-sans">
                      {module.duration}
                    </span>
                  </div>
                </div>

                {/* Right Status / Indicator */}
                <div className="shrink-0 flex items-center pl-2">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full border border-[#EA580C] text-[#EA580C] flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  ) : (
                    <ChevronDown
                      className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 stroke-[2] ${
                        isExpanded ? "rotate-180 text-[#0F172A]" : ""
                      }`}
                    />
                  )}
                </div>
              </button>

              {/* Nested Lessons Drawer */}
              {isExpanded && module.lessons && module.lessons.length > 0 && (
                <div className="pl-6 pr-3 pb-3 pt-0.5 flex flex-col gap-1 border-t border-[#F1F5F9]/80 bg-[#FAFAF9]/40">
                  <div className="relative pl-4 border-l-2 border-[#E2E8F0] flex flex-col gap-2.5 my-1">
                    {module.lessons.map((lesson) => {
                      const isNowPlaying =
                        lesson.slug === currentLessonSlug ||
                        (isCurrentModule && lesson.slug.includes("caching"));

                      return (
                        <div
                          key={lesson.id || lesson.slug}
                          className="flex items-center justify-between text-[13px] group py-1"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            {/* Dot indicator */}
                            {isNowPlaying ? (
                              <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C] shrink-0 mt-1 shadow-2xs" />
                            ) : (
                              <span className="w-2 h-2 rounded-full border border-[#94A3B8] bg-white shrink-0 mt-1.5 group-hover:border-[#EA580C]" />
                            )}

                            {/* Title & subtitle */}
                            <div className="min-w-0 flex flex-col">
                              <Link
                                href={`/lessons/${lesson.slug}`}
                                onClick={() =>
                                  posthog.capture("lesson_sidebar_selected", {
                                    lesson_title: lesson.title,
                                    course_title: courseTitle,
                                  })
                                }
                                className={`truncate transition-colors ${
                                  isNowPlaying
                                    ? "font-bold text-[#0F172A]"
                                    : "font-medium text-[#475569] hover:text-[#0F172A]"
                                }`}
                              >
                                {lesson.title}
                              </Link>
                              {isNowPlaying && (
                                <span className="text-[11.5px] text-[#EA580C] font-semibold leading-tight mt-0.5">
                                  Now playing
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right duration or play icon */}
                          {isNowPlaying ? (
                            <div className="w-6 h-6 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0 shadow-2xs ml-2">
                              <Play className="w-2.5 h-2.5 fill-current translate-x-0.5" />
                            </div>
                          ) : (
                            lesson.duration && (
                              <span className="text-[12px] text-[#94A3B8] shrink-0 ml-2 font-sans">
                                {lesson.duration}
                              </span>
                            )
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
