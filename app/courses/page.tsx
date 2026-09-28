import React from "react";
import type { Metadata } from "next";
import { HeaderNav } from "@/components/ui/HeaderNav";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SteppedColumnsGraphic } from "@/components/home/SteppedColumnsGraphic";
import { CourseCatalogClient } from "@/components/catalog/CourseCatalogClient";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allCoursesQuery, allCategoriesQuery } from "@/sanity/lib/queries";
import type { CourseCardItem, Category } from "@/types/sanity";

export const metadata: Metadata = {
  title: "All Courses — Vertex",
  description:
    "Explore comprehensive, production-grade courses designed for modern developers and engineers.",
};

export default async function AllCoursesPage() {
  const [courses, categories] = await Promise.all([
    sanityFetch<CourseCardItem[]>({
      query: allCoursesQuery,
    }).catch(() => []),
    sanityFetch<Category[]>({
      query: allCategoriesQuery,
    }).catch(() => []),
  ]);

  return (
    <div
      className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#0F172A] selection:bg-[#FED7AA] selection:text-[#9A3412] relative overflow-x-hidden"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(226, 232, 240, 0.45) 18px, rgba(226, 232, 240, 0.45) 19px)",
      }}
    >
      {/* Top Navigation */}
      <HeaderNav
        activeTab="courses"
        showSearch={false}
        className="bg-transparent border-[#E2E8F0]/60 max-w-[1440px] mx-auto z-10"
      />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-20 z-10 flex flex-col gap-8 sm:gap-10">
        {/* Breadcrumb Navigation */}
        <div className="pt-2">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "All Courses", active: true },
            ]}
          />
        </div>

        {/* Catalog Header Section */}
        <section className="flex flex-col items-start gap-3 max-w-3xl">
          <div className="inline-flex items-center px-3 py-0.5 rounded-[6px] bg-[#FFF7ED] border border-[#FED7AA] text-[#EA580C] text-[11px] font-bold tracking-widest uppercase">
            COURSE CATALOG
          </div>
          <h1 className="text-[36px] sm:text-[44px] font-serif font-bold text-[#0F172A] tracking-tight leading-[1.15]">
            Explore All Courses
          </h1>
          <p className="text-[16px] sm:text-[17px] text-[#475569] leading-relaxed font-sans">
            Comprehensive, production-grade courses designed for modern developers and engineers. Master architecture, frameworks, and deployment.
          </p>
        </section>

        {/* Course Catalog Client (Filter tabs + grid) */}
        <CourseCatalogClient courses={courses} categories={categories} />
      </main>

      {/* Atmospheric 3D stepped peach columns at bottom background */}
      <div className="w-full relative mt-auto pointer-events-none opacity-40">
        <SteppedColumnsGraphic className="w-full" />
      </div>
    </div>
  );
}
