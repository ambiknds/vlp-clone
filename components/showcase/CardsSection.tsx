import React from "react";
import { CourseCard } from "../ui/CourseCard";
import { LessonCardVideo } from "../ui/LessonCardVideo";
import { LessonCardLesson } from "../ui/LessonCardLesson";
import { ResourceCard } from "../ui/ResourceCard";

export function CardsSection() {
  return (
    <div className="bg-white p-8 rounded-[20px] border border-[#E2E8F0] shadow-sm space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-bold text-[#F97316]">12</span>
        <span className="text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">CARDS</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Course Card */}
        <div>
          <span className="text-[12px] font-semibold text-[#64748B] block mb-2">Course Card</span>
          <CourseCard
            title="Next.js for Production"
            description="Build scalable, high-performance web applications with Next.js."
            level="Intermediate"
            duration="18h 24m"
            moduleCount={12}
          />
        </div>

        {/* Lesson Card (Video) */}
        <div>
          <span className="text-[12px] font-semibold text-[#64748B] block mb-2">Lesson Card (Video)</span>
          <LessonCardVideo
            title="Data Fetching in Server Components"
            description="Learn how to fetch data on the server using async/await and Next.js best practices."
            lessonNumber="Lesson 5.1"
            duration="12:45"
            timestamp="12:45"
          />
        </div>

        {/* Lesson Card (Lesson) */}
        <div>
          <span className="text-[12px] font-semibold text-[#64748B] block mb-2">Lesson Card (Lesson)</span>
          <LessonCardLesson
            title="Data Fetching & Caching"
            description="Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance."
            moduleLabel="Module 5"
          />
        </div>

        {/* Resource Card */}
        <div>
          <span className="text-[12px] font-semibold text-[#64748B] block mb-2">Resource Card</span>
          <ResourceCard
            title="Caching and Revalidation Guide"
            description="Deep dive into Next.js caching strategies."
            fileType="PDF"
            fileSize="1.2 MB"
          />
        </div>
      </div>
    </div>
  );
}
