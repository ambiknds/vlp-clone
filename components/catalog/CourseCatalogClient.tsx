"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CourseCard } from "@/components/ui/CourseCard";
import { getBadgeIcon } from "./CourseIcons";
import posthog from "posthog-js";
import type { CourseCardItem, Category } from "@/types/sanity";

interface CourseCatalogClientProps {
  courses: CourseCardItem[];
  categories: Category[];
}

export function CourseCatalogClient({ courses, categories }: CourseCatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredCourses = courses.filter((course) => {
    if (selectedCategory === "all") return true;
    return course.category?.slug?.current === selectedCategory || course.category?._id === selectedCategory;
  });

  const selectCategory = (category: string) => {
    if (category === selectedCategory) return;

    posthog.capture("course_category_selected", {
      category_slug: category,
    });
    setSelectedCategory(category);
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={() => selectCategory("all")}
          className={`px-4 py-2 rounded-[12px] text-[13.5px] font-medium transition-all duration-150 cursor-pointer ${
            selectedCategory === "all"
              ? "bg-[#0F172A] text-white shadow-xs"
              : "bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
          }`}
        >
          All Courses ({courses.length})
        </button>

        {categories.map((cat) => {
          const catSlug = cat.slug?.current || cat._id;
          const count = courses.filter(
            (c) => c.category?.slug?.current === catSlug || c.category?._id === cat._id
          ).length;
          const isActive = selectedCategory === catSlug || selectedCategory === cat._id;

          if (count === 0) return null;

          return (
            <button
              key={cat._id}
              type="button"
              onClick={() => selectCategory(catSlug)}
              className={`px-4 py-2 rounded-[12px] text-[13.5px] font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-[#0F172A] text-white shadow-xs"
                  : "bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              }`}
            >
              {cat.title} ({count})
            </button>
          );
        })}
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const slug = course.slug?.current || "";
            const isNext = slug.includes("nextjs");
            const href = isNext ? "/courses/nextjs-for-production" : `/courses/${slug}`;
            const displayTitle = isNext ? "Next.js for Production" : course.title;
            const displayDuration = isNext ? "18h 24m" : course.duration;
            const displayModules = isNext ? 12 : course.moduleCount || 4;

            return (
              <Link
                key={course._id}
                href={href}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] rounded-[16px]"
              >
                <CourseCard
                  title={displayTitle}
                  description={course.summary}
                  level={course.level}
                  duration={displayDuration}
                  moduleCount={displayModules}
                  icon={getBadgeIcon(course.badgeIcon, slug)}
                />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="w-full bg-white border border-[#E2E8F0] rounded-[20px] p-12 text-center flex flex-col items-center justify-center">
          <p className="text-[16px] text-[#475569] font-medium">
            No courses found in this category.
          </p>
          <button
            type="button"
            onClick={() => selectCategory("all")}
            className="mt-4 px-4 py-2 rounded-[10px] bg-[#EA580C] text-white text-[14px] font-medium hover:bg-[#D94F06] transition-colors cursor-pointer"
          >
            View all courses
          </button>
        </div>
      )}
    </div>
  );
}
