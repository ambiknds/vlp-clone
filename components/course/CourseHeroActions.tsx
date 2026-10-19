"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, Loader2 } from "lucide-react";
import posthog from "posthog-js";
import { useUser, SignInButton } from "@clerk/nextjs";

import { trackResumeUsed } from "@/lib/analytics/events";
import { useLearnerProgress } from "@/components/providers/LearnerProgressProvider";

interface CourseHeroActionsProps {
  courseSlug: string;
  courseTitle?: string;
  firstLessonSlug?: string;
  courseLessonSlugs?: string[];
}

export function CourseHeroActions({
  courseSlug,
  courseTitle,
  firstLessonSlug,
  courseLessonSlugs,
}: CourseHeroActionsProps) {
  const { isSignedIn, isLoaded: isUserLoaded } = useUser();
  const { isCourseEnrolled, enrollCourse, getCourseProgress } = useLearnerProgress();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const isEnrolled = isCourseEnrolled(courseSlug);
  const courseProgress = getCourseProgress(courseLessonSlugs);

  // Target lesson: first incomplete or first lesson in course
  const targetLessonSlug = courseProgress.firstIncompleteSlug || firstLessonSlug;
  const targetHref = targetLessonSlug
    ? `/lessons/${targetLessonSlug}`
    : "#course-content";

  const toggleBookmark = () => {
    const bookmarked = !isBookmarked;
    posthog.capture("course_bookmark_toggled", {
      course_slug: courseSlug,
      bookmarked,
    });
    setIsBookmarked(bookmarked);
  };

  const handleEnrollClick = async () => {
    if (!isSignedIn) {
      try {
        localStorage.setItem("vertex_pending_enrollment", courseSlug);
      } catch {
        // Safe noop
      }
      return;
    }

    setIsEnrolling(true);
    try {
      await enrollCourse(courseSlug, courseTitle);
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3.5 pt-2">
      {isEnrolled ? (
        /* Enrolled state: Continue Learning button */
        <Link
          href={targetHref}
          onClick={() => {
            posthog.capture("course_learning_started", {
              course_slug: courseSlug,
            });
            trackResumeUsed({
              course_slug: courseSlug,
              lesson_slug: targetLessonSlug,
              source: "course_hero",
            });
          }}
          className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-[14px] bg-[#D96B43] hover:bg-[#C25832] text-white font-medium text-[15px] shadow-sm hover:shadow transition-all duration-150 group cursor-pointer"
        >
          <span>Continue Learning</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 stroke-[2.2]" />
        </Link>
      ) : isUserLoaded && !isSignedIn ? (
        /* Not enrolled & signed out: Enroll Now with Clerk modal trigger */
        <SignInButton mode="modal">
          <button
            type="button"
            onClick={handleEnrollClick}
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-[14px] bg-[#D96B43] hover:bg-[#C25832] text-white font-medium text-[15px] shadow-sm hover:shadow transition-all duration-150 group cursor-pointer"
          >
            <span>Enroll Now</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 stroke-[2.2]" />
          </button>
        </SignInButton>
      ) : (
        /* Not enrolled & signed in: Direct Enroll Now button */
        <button
          type="button"
          onClick={handleEnrollClick}
          disabled={isEnrolling}
          className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-[14px] bg-[#D96B43] hover:bg-[#C25832] text-white font-medium text-[15px] shadow-sm hover:shadow transition-all duration-150 group cursor-pointer disabled:opacity-75"
        >
          {isEnrolling ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin stroke-[2.2]" />
              <span>Enrolling...</span>
            </>
          ) : (
            <>
              <span>Enroll Now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 stroke-[2.2]" />
            </>
          )}
        </button>
      )}

      {/* Bookmark button */}
      <button
        type="button"
        onClick={toggleBookmark}
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
