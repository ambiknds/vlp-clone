"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  BarChart2,
  ArrowRight,
  GraduationCap,
  Compass,
  ArrowUpRight,
  Layers,
} from "lucide-react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useLearnerProgress } from "@/components/providers/LearnerProgressProvider";
import { getBadgeIcon } from "@/components/catalog/CourseIcons";
import { trackResumeUsed } from "@/lib/analytics/events";
import type { CourseCardItem } from "@/types/sanity";

export interface MyLearningCourseItem extends CourseCardItem {
  lessonSlugs?: string[];
  firstLessonSlug?: string;
}

interface MyLearningClientProps {
  allCourses: MyLearningCourseItem[];
}

export function MyLearningClient({ allCourses }: MyLearningClientProps) {
  const { isSignedIn, isLoaded: isUserLoaded } = useUser();
  const { isCourseEnrolled, getCourseProgress, completedLessons, isLoading } =
    useLearnerProgress();

  const [activeFilter, setActiveFilter] = useState<"all" | "in-progress" | "completed">("all");

  // Filter courses that user is enrolled in
  const enrolledCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const slug = course.slug?.current || "";
      const isNext = slug.includes("nextjs");
      return (
        isCourseEnrolled(slug) ||
        (isNext && (isCourseEnrolled("nextjs-for-production") || isCourseEnrolled("nextjs-app-router-in-depth")))
      );
    });
  }, [allCourses, isCourseEnrolled]);

  // Aggregate learner statistics
  const stats = useMemo(() => {
    let completedCoursesCount = 0;
    let inProgressCount = 0;

    enrolledCourses.forEach((course) => {
      const progress = getCourseProgress(course.lessonSlugs);
      if (progress.percentage === 100) {
        completedCoursesCount += 1;
      } else if (progress.percentage > 0) {
        inProgressCount += 1;
      }
    });

    return {
      totalEnrolled: enrolledCourses.length,
      completedLessonsCount: completedLessons.size,
      inProgressCount,
      completedCoursesCount,
    };
  }, [enrolledCourses, getCourseProgress, completedLessons]);

  // Filter based on active tab
  const displayedCourses = useMemo(() => {
    return enrolledCourses.filter((course) => {
      const progress = getCourseProgress(course.lessonSlugs);
      if (activeFilter === "in-progress") {
        return progress.percentage > 0 && progress.percentage < 100;
      }
      if (activeFilter === "completed") {
        return progress.percentage === 100;
      }
      return true;
    });
  }, [enrolledCourses, activeFilter, getCourseProgress]);

  // Loading Skeleton State
  if (!isUserLoaded || isLoading) {
    return (
      <div className="w-full flex flex-col gap-8 animate-pulse">
        {/* Skeleton stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-white/70 border border-[#E2E8F0] rounded-[16px]"
            />
          ))}
        </div>
        {/* Skeleton cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-white/70 border border-[#E2E8F0] rounded-[20px]"
            />
          ))}
        </div>
      </div>
    );
  }

  // Unauthenticated State
  if (!isSignedIn) {
    return (
      <div className="w-full bg-white border border-[#E2E8F0] rounded-[24px] p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-2xl mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-[20px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#EA580C] mb-5 shadow-xs">
          <GraduationCap className="w-8 h-8 stroke-[1.8]" />
        </div>
        <h2 className="text-[24px] sm:text-[28px] font-serif font-bold text-[#0F172A] tracking-tight">
          Sign In to Access Your Learning
        </h2>
        <p className="mt-3 text-[15px] sm:text-[16px] text-[#475569] leading-relaxed max-w-lg font-sans">
          Track your course completion, pick up lessons right where you left off, and access your enrolled curriculum across devices.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
          <SignInButton mode="modal">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] bg-[#EA580C] hover:bg-[#D94F06] text-white text-[15px] font-medium shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <span>Sign In to Vertex</span>
              <ArrowRight className="w-4 h-4 stroke-[2]" />
            </button>
          </SignInButton>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#0F172A] text-[15px] font-medium transition-colors cursor-pointer"
          >
            <span>Explore Course Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  // Zero Enrolled Courses State
  if (enrolledCourses.length === 0) {
    return (
      <div className="w-full bg-white border border-[#E2E8F0] rounded-[24px] p-8 sm:p-14 text-center flex flex-col items-center justify-center max-w-2xl mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-[20px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#EA580C] mb-5 shadow-xs">
          <Compass className="w-8 h-8 stroke-[1.8]" />
        </div>
        <h2 className="text-[24px] sm:text-[28px] font-serif font-bold text-[#0F172A] tracking-tight">
          No Enrolled Courses Yet
        </h2>
        <p className="mt-3 text-[15px] sm:text-[16px] text-[#475569] leading-relaxed max-w-md font-sans">
          You haven&apos;t enrolled in any courses yet. Browse our production-grade engineering courses to begin your learning journey.
        </p>
        <div className="mt-7">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-[12px] bg-[#EA580C] hover:bg-[#D94F06] text-white text-[15px] font-medium shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <span>Explore All Courses</span>
            <ArrowRight className="w-4 h-4 stroke-[2]" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Metric 1 */}
        <div className="p-5 bg-white border border-[#E2E8F0] rounded-[18px] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#EA580C] shrink-0">
            <BookOpen className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <div className="text-[24px] font-bold text-[#0F172A] font-serif leading-none">
              {stats.totalEnrolled}
            </div>
            <div className="text-[13px] text-[#64748B] font-medium mt-1 font-sans">
              Enrolled Courses
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 bg-white border border-[#E2E8F0] rounded-[18px] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] shrink-0">
            <CheckCircle2 className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <div className="text-[24px] font-bold text-[#0F172A] font-serif leading-none">
              {stats.completedLessonsCount}
            </div>
            <div className="text-[13px] text-[#64748B] font-medium mt-1 font-sans">
              Completed Lessons
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 bg-white border border-[#E2E8F0] rounded-[18px] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] shrink-0">
            <Clock className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <div className="text-[24px] font-bold text-[#0F172A] font-serif leading-none">
              {stats.inProgressCount}
            </div>
            <div className="text-[13px] text-[#64748B] font-medium mt-1 font-sans">
              Courses In Progress
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-[12px] text-[13.5px] font-medium transition-all cursor-pointer ${
              activeFilter === "all"
                ? "bg-[#0F172A] text-white shadow-xs"
                : "bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
            }`}
          >
            All Courses ({enrolledCourses.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("in-progress")}
            className={`px-4 py-2 rounded-[12px] text-[13.5px] font-medium transition-all cursor-pointer ${
              activeFilter === "in-progress"
                ? "bg-[#0F172A] text-white shadow-xs"
                : "bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
            }`}
          >
            In Progress ({stats.inProgressCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("completed")}
            className={`px-4 py-2 rounded-[12px] text-[13.5px] font-medium transition-all cursor-pointer ${
              activeFilter === "completed"
                ? "bg-[#0F172A] text-white shadow-xs"
                : "bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
            }`}
          >
            Completed ({stats.completedCoursesCount})
          </button>
        </div>

        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#EA580C] hover:text-[#C2410C] transition-colors"
        >
          <span>Browse more courses</span>
          <ArrowUpRight className="w-4 h-4 stroke-[2]" />
        </Link>
      </div>

      {/* Enrolled Courses Grid */}
      {displayedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCourses.map((course) => {
            const rawSlug = course.slug?.current || "";
            const isNext = rawSlug.includes("nextjs");
            const courseSlug = isNext ? "nextjs-for-production" : rawSlug;
            const displayTitle = isNext ? "Next.js for Production" : course.title;
            const displayDuration = isNext ? "18h 24m" : course.duration;
            const displayModules = isNext ? 12 : course.moduleCount || 4;

            const progress = getCourseProgress(course.lessonSlugs);
            const targetLessonSlug = progress.firstIncompleteSlug || course.firstLessonSlug;
            const lessonHref = targetLessonSlug
              ? `/lessons/${targetLessonSlug}`
              : `/courses/${courseSlug}`;

            return (
              <div
                key={course._id}
                className="flex flex-col justify-between p-6 bg-white border border-[#E2E8F0] rounded-[20px] shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div>
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-[12px] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                      {getBadgeIcon(course.badgeIcon, rawSlug)}
                    </div>
                    {progress.percentage === 100 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                        <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                        <span>Completed</span>
                      </span>
                    ) : progress.percentage > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA]">
                        In Progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                        Enrolled
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-[20px] font-serif font-bold text-[#0F172A] mb-2 tracking-tight group-hover:text-[#EA580C] transition-colors">
                    <Link href={`/courses/${courseSlug}`}>{displayTitle}</Link>
                  </h3>

                  {/* Description */}
                  <p className="text-[14px] text-[#64748B] line-clamp-2 leading-relaxed mb-5 font-sans">
                    {course.summary}
                  </p>

                  {/* Course Meta Info */}
                  <div className="flex items-center gap-4 text-[12.5px] text-[#64748B] mb-5 font-sans">
                    <div className="flex items-center gap-1.5">
                      <BarChart2 className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <span>{course.level}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <span>{displayDuration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <span>{displayModules} modules</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Actions */}
                <div className="pt-4 border-t border-[#F1F5F9] flex flex-col gap-4 font-sans">
                  {/* Progress track */}
                  <div>
                    <div className="flex items-center justify-between text-[12.5px] mb-1.5">
                      <span className="text-[#64748B] font-medium">
                        {progress.completedCount} of {progress.totalCount || displayModules} lessons
                      </span>
                      <span className="font-bold text-[#0F172A]">
                        {progress.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D96B43] rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex items-center gap-3 pt-1">
                    <Link
                      href={lessonHref}
                      onClick={() => {
                        trackResumeUsed({
                          course_slug: courseSlug,
                          lesson_slug: targetLessonSlug,
                          source: "my_learning",
                        });
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[12px] bg-[#D96B43] hover:bg-[#C25832] text-white font-medium text-[14px] shadow-xs hover:shadow transition-all group/btn cursor-pointer"
                    >
                      <span>
                        {progress.percentage === 0
                          ? "Start Course"
                          : progress.percentage === 100
                          ? "Review Lessons"
                          : "Continue Learning"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 stroke-[2.2]" />
                    </Link>

                    <Link
                      href={`/courses/${courseSlug}`}
                      className="px-3 py-2.5 rounded-[12px] border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] hover:text-[#0F172A] text-[13.5px] font-medium transition-colors"
                      title="View course outline"
                    >
                      Outline
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full bg-white border border-[#E2E8F0] rounded-[20px] p-10 text-center flex flex-col items-center justify-center">
          <p className="text-[15px] text-[#64748B] font-medium">
            No courses found matching this filter.
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className="mt-3 text-[14px] font-medium text-[#EA580C] hover:underline cursor-pointer"
          >
            Show all enrolled courses
          </button>
        </div>
      )}
    </div>
  );
}
