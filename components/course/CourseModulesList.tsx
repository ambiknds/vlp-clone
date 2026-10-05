"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Play } from "lucide-react";
import posthog from "posthog-js";

export interface LessonSummary {
  _id: string;
  title: string;
  slug?: { current: string } | string;
  duration?: string;
  durationSeconds?: number;
  freePreview?: boolean;
}

export interface ModuleItem {
  _key?: string;
  title: string;
  summary?: string;
  duration?: string;
  lessons?: LessonSummary[];
}

interface CourseModulesListProps {
  modules: ModuleItem[];
  totalModules?: number;
  totalDuration?: string;
}

// Format duration from seconds to "45m" or "1h 12m"
function formatModuleDuration(totalSeconds?: number): string {
  if (!totalSeconds) return "45m";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours === 0) return `${minutes}m`;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

export function CourseModulesList({
  modules,
  totalModules,
  totalDuration = "18h 24m",
}: CourseModulesListProps) {
  const [showAll, setShowAll] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});

  const toggleModule = (index: number, isExpanded: boolean) => {
    posthog.capture("course_module_toggled", {
      module_number: index + 1,
      expanded: !isExpanded,
    });
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const displayCount = totalModules || modules.length;
  const visibleModules = showAll ? modules : modules.slice(0, 6);
  const hasMoreThanSix = modules.length > 6;

  return (
    <section id="course-content" className="w-full pt-4 pb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[24px] sm:text-[26px] font-serif font-bold text-[#0F172A] tracking-tight">
          Course Content
        </h2>
        <span className="text-[14px] text-[#64748B] font-medium font-sans">
          {displayCount} modules • {totalDuration}
        </span>
      </div>

      {/* Modules List */}
      <div className="flex flex-col gap-3">
        {visibleModules.map((module, index) => {
          const isExpanded = Boolean(expandedModules[index]);
          const moduleNumber = index + 1;

          // Calculate duration if lessons have durationSeconds
          const lessonsDurationSeconds = module.lessons?.reduce(
            (acc, l) => acc + (l.durationSeconds || 0),
            0
          );
          const durationDisplay =
            module.duration ||
            (lessonsDurationSeconds ? formatModuleDuration(lessonsDurationSeconds) : `${40 + (index * 12) % 65}m`);

          return (
            <div
              key={module._key || `module-${index}`}
              className="bg-white border border-[#E2E8F0] rounded-[18px] transition-all duration-150 overflow-hidden shadow-xs hover:border-[#CBD5E1]"
            >
              {/* Module Header Row */}
              <button
                type="button"
                onClick={() => toggleModule(index, isExpanded)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer gap-4"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Circled Number */}
                  <div className="w-9 h-9 rounded-full border border-[#E2E8F0] bg-white flex items-center justify-center shrink-0 font-medium text-[14px] text-[#0F172A]">
                    {moduleNumber}
                  </div>

                  {/* Title & Summary */}
                  <div className="min-w-0">
                    <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#0F172A] tracking-tight truncate sm:whitespace-normal">
                      {module.title}
                    </h3>
                    {module.summary && (
                      <p className="text-[13px] sm:text-[13.5px] text-[#64748B] line-clamp-1 sm:line-clamp-2 mt-0.5 font-sans">
                        {module.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Duration & Chevron */}
                <div className="flex items-center gap-3.5 shrink-0 text-[#64748B]">
                  <span className="text-[13px] sm:text-[14px] font-medium font-sans">
                    {durationDisplay}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 stroke-[2] ${
                      isExpanded ? "rotate-180 text-[#0F172A]" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Collapsible Lessons Drawer */}
              {isExpanded && (
                <div className="px-5 pb-4 pt-1 border-t border-[#F1F5F9] bg-[#FAFAFC]/60 flex flex-col gap-2">
                  {module.lessons && module.lessons.length > 0 ? (
                    module.lessons.map((lesson, lessonIdx) => {
                      const lessonSlug = typeof lesson.slug === "object" ? lesson.slug?.current : lesson.slug;
                      return (
                        <div
                          key={lesson._id || `lesson-${lessonIdx}`}
                          className="flex items-center justify-between py-2 px-3 rounded-[10px] hover:bg-white text-[13.5px] transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-6 h-6 rounded-full bg-[#FFF7ED] flex items-center justify-center text-[#EA580C] shrink-0">
                              <Play className="w-2.5 h-2.5 fill-current translate-x-0.5" />
                            </div>
                            {lessonSlug ? (
                              <Link
                                href={`/lessons/${lessonSlug}`}
                                onClick={() =>
                                  posthog.capture("course_lesson_selected", {
                                    module_number: moduleNumber,
                                    lesson_number: lessonIdx + 1,
                                    is_free_preview: Boolean(lesson.freePreview),
                                  })
                                }
                                className="font-medium text-[#0F172A] hover:text-[#EA580C] truncate transition-colors"
                              >
                                {lesson.title}
                              </Link>
                            ) : (
                              <span className="font-medium text-[#0F172A] truncate">
                                {lesson.title}
                              </span>
                            )}
                            {lesson.freePreview && (
                              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] shrink-0">
                                Free Preview
                              </span>
                            )}
                          </div>
                          <span className="text-[12.5px] text-[#94A3B8] shrink-0 font-sans ml-3">
                            {lesson.duration || "10:00"}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-2.5 px-3 text-[13px] text-[#64748B] italic">
                      Lessons for this module will be available upon enrollment.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* "Show all X modules" Button */}
      {hasMoreThanSix && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-[14px] text-[14px] font-medium text-[#0F172A] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <span>{showAll ? "Show fewer modules" : `Show all ${displayCount} modules`}</span>
            <ChevronDown
              className={`w-4 h-4 text-[#64748B] transition-transform duration-200 stroke-[2] ${
                showAll ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      )}
    </section>
  );
}
