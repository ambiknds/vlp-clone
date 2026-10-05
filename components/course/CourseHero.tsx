import React from "react";
import Image from "next/image";
import { BarChart2, Clock, FileText, Users } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageReference } from "@/types/sanity";
import { CourseHeroActions } from "./CourseHeroActions";

interface CourseHeroProps {
  title: string;
  summary: string;
  level?: string;
  duration?: string;
  moduleCount?: number;
  studentCount?: number;
  popular?: boolean;
  coverImage?: SanityImageReference;
  badgeIcon?: string;
  courseSlug: string;
  firstLessonSlug?: string;
}

// Metallic Next.js cover graphic matching vertex-course.png exactly
function NextjsMetallicCover() {
  return (
    <div className="w-full h-full bg-[#0A0A0A] rounded-[24px] flex items-center justify-center p-8 shadow-md relative overflow-hidden select-none">
      {/* Subtle radial inner glow */}
      <div className="absolute inset-0 bg-radial from-white/[0.07] via-transparent to-black pointer-events-none" />

      {/* Stylized Beveled Metallic Next.js "N" logo */}
      <svg
        viewBox="0 0 200 200"
        className="w-48 h-48 drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="metalLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#D4D4D8" />
            <stop offset="100%" stopColor="#71717A" />
          </linearGradient>
          <linearGradient id="metalSlash" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#F4F4F5" />
            <stop offset="65%" stopColor="#71717A" />
            <stop offset="100%" stopColor="#18181B" />
          </linearGradient>
          <linearGradient id="metalRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#A1A1AA" />
            <stop offset="100%" stopColor="#3F3F46" />
          </linearGradient>
        </defs>

        {/* Left vertical pillar of 'N' */}
        <path
          d="M48 36H72V164H48V36Z"
          fill="url(#metalLeft)"
        />

        {/* Diagonal slash of 'N' */}
        <path
          d="M68 36L142 152H120L48 40V36H68Z"
          fill="url(#metalSlash)"
        />

        {/* Right vertical pillar of 'N' */}
        <path
          d="M128 36H152V164H128V36Z"
          fill="url(#metalRight)"
        />
      </svg>
    </div>
  );
}

// Format student count to e.g. "2.1k students"
function formatStudentCount(count?: number): string {
  if (!count) return "2.1k students";
  if (count >= 1000) {
    const k = (count / 1000).toFixed(1).replace(/\.0$/, "");
    return `${k}k students`;
  }
  return `${count} students`;
}

export function CourseHero({
  title,
  summary,
  level = "Intermediate",
  duration = "18h 24m",
  moduleCount = 12,
  studentCount = 2100,
  popular = true,
  coverImage,
  courseSlug,
  firstLessonSlug,
}: CourseHeroProps) {
  const imageUrl = coverImage?.asset ? urlFor(coverImage).width(680).height(680).url() : null;

  return (
    <section className="w-full flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12 pt-4 pb-8">
      {/* Course Cover Card (Left) */}
      <div className="w-full max-w-[320px] sm:max-w-[340px] aspect-square shrink-0">
        {imageUrl ? (
          <div className="relative w-full h-full rounded-[24px] overflow-hidden border border-[#E2E8F0] shadow-md bg-black">
            <Image
              src={imageUrl}
              alt={title}
              fill
              priority
              className="object-cover"
            />
          </div>
        ) : (
          <NextjsMetallicCover />
        )}
      </div>

      {/* Course Details (Right) */}
      <div className="flex-1 flex flex-col items-start gap-4">
        {/* Popular Pill Badge */}
        {popular && (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-[6px] bg-[#FFF7ED] border border-[#FED7AA] text-[#EA580C] text-[11px] font-bold tracking-widest uppercase">
            POPULAR
          </div>
        )}

        {/* Course Title */}
        <h1 className="text-[36px] sm:text-[44px] lg:text-[48px] font-serif font-bold text-[#0F172A] tracking-tight leading-[1.12]">
          {title}
        </h1>

        {/* Course Summary */}
        <p className="text-[16px] sm:text-[17px] text-[#475569] leading-relaxed max-w-2xl font-sans">
          {summary}
        </p>

        {/* Metadata Footer Row */}
        <div className="flex flex-wrap items-center gap-5 sm:gap-6 text-[13.5px] sm:text-[14px] text-[#475569] font-sans pt-1">
          <div className="flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-[#94A3B8]" />
            <span>{level}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#94A3B8]" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#94A3B8]" />
            <span>{moduleCount} modules</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#94A3B8]" />
            <span>{formatStudentCount(studentCount)}</span>
          </div>
        </div>

        {/* Action CTAs */}
        <CourseHeroActions courseSlug={courseSlug} firstLessonSlug={firstLessonSlug} />
      </div>
    </section>
  );
}
