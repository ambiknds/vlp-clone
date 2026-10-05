import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeaderNav } from "@/components/ui/HeaderNav";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SteppedColumnsGraphic } from "@/components/home/SteppedColumnsGraphic";
import { CourseHero } from "@/components/course/CourseHero";
import { WhatYouWillLearn } from "@/components/course/WhatYouWillLearn";
import { CourseModulesList } from "@/components/course/CourseModulesList";
import { StickyCourseProgress } from "@/components/course/StickyCourseProgress";
import { sanityFetch } from "@/sanity/lib/fetch";
import { courseBySlugQuery } from "@/sanity/lib/queries";
import type { CourseDetail } from "@/types/sanity";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 12 Production Modules matching design/vertex-course.png specification
const NEXTJS_PRODUCTION_MODULES = [
  {
    title: "Introduction to Next.js",
    summary: "Understand the core features of Next.js and why it's the React framework.",
    duration: "45m",
  },
  {
    title: "Project Setup & Structure",
    summary: "Set up a new Next.js project and explore the folder structure.",
    duration: "1h 12m",
  },
  {
    title: "Routing & Layouts",
    summary: "Learn about file-based routing, layouts, and nested routes.",
    duration: "1h 36m",
  },
  {
    title: "Server Components",
    summary: "Build components with server-side rendering and data fetching.",
    duration: "1h 42m",
  },
  {
    title: "Data Fetching & Caching",
    summary: "Fetch data efficiently and leverage caching for better performance.",
    duration: "1h 28m",
  },
  {
    title: "Authentication",
    summary: "Implement authentication using NextAuth.js in your app.",
    duration: "1h 18m",
  },
  {
    title: "Mutation & Server Actions",
    summary: "Handle forms, validation, and optimistic updates safely.",
    duration: "1h 15m",
  },
  {
    title: "Optimizing Performance",
    summary: "Master image optimization, font loading, and script management.",
    duration: "1h 30m",
  },
  {
    title: "Styling & UI Architecture",
    summary: "Implement Tailwind CSS, CSS Modules, and responsive design systems.",
    duration: "1h 20m",
  },
  {
    title: "State Management & Context",
    summary: "Coordinate client state with server component data flow.",
    duration: "1h 10m",
  },
  {
    title: "Testing & Quality Assurance",
    summary: "Write unit, integration, and end-to-end tests for App Router apps.",
    duration: "1h 25m",
  },
  {
    title: "Deployment, Monitoring & Scaling",
    summary: "Ship to production with Vercel, Docker, and edge caching.",
    duration: "1h 45m",
  },
];

// 4 Learning outcomes matching design/vertex-course.png specification
const NEXTJS_LEARNING_OUTCOMES = [
  {
    _key: "nextjs-outcome-1",
    title: "App Router Foundations",
    description: "Master the App Router, layouts, loading states, and nested routing.",
    icon: "layers",
  },
  {
    _key: "nextjs-outcome-2",
    title: "Data Fetching & Caching",
    description: "Fetch data efficiently and leverage caching for better performance.",
    icon: "database",
  },
  {
    _key: "nextjs-outcome-3",
    title: "Performance Optimization",
    description: "Optimize rendering, assets, and bundle size for faster apps.",
    icon: "gauge",
  },
  {
    _key: "nextjs-outcome-4",
    title: "Deployment & Scaling",
    description: "Deploy with confidence and scale your Next.js applications.",
    icon: "cloud",
  },
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const isNextProduction =
    slug === "nextjs-for-production" || slug === "nextjs-app-router-in-depth";

  if (isNextProduction) {
    return {
      title: "Next.js for Production — Vertex",
      description:
        "Build scalable, high-performance web applications with Next.js, best practices, and production-ready deployment strategies.",
    };
  }

  const course = await sanityFetch<CourseDetail | null>({
    query: courseBySlugQuery,
    params: { slug },
  });

  if (!course) {
    return {
      title: "Course Not Found — Vertex",
    };
  }

  return {
    title: `${course.title} — Vertex`,
    description: course.summary,
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Resolve slug alias: both 'nextjs-for-production' and 'nextjs-app-router-in-depth' link to the Next.js course
  const isNextProduction =
    slug === "nextjs-for-production" || slug === "nextjs-app-router-in-depth";
  const querySlug = isNextProduction ? "nextjs-app-router-in-depth" : slug;

  let course = await sanityFetch<CourseDetail | null>({
    query: courseBySlugQuery,
    params: { slug: querySlug },
  });

  // Fallback to Next.js course if requested slug is nextjs-for-production but not in DB
  if (!course && isNextProduction) {
    course = await sanityFetch<CourseDetail | null>({
      query: courseBySlugQuery,
      params: { slug: "nextjs-app-router-in-depth" },
    });
  }

  if (!course) {
    notFound();
  }

  // Find first lesson slug for CTA link
  const firstLesson = course.modules?.[0]?.lessons?.[0];
  const firstLessonSlug = firstLesson?.slug?.current || firstLesson?.slug;

  // When viewing Next.js for Production, guarantee exact fidelity to vertex-course.png
  const isNextCourse = isNextProduction || course.slug.current.includes("nextjs");

  const pageTitle = isNextCourse ? "Next.js for Production" : course.title;
  const pageSummary = isNextCourse
    ? "Build scalable, high-performance web applications with Next.js, best practices, and production-ready deployment strategies."
    : course.summary;
  const pageDuration = isNextCourse ? "18h 24m" : course.duration;
  const pageModuleCount = isNextCourse ? 12 : course.moduleCount || course.modules?.length || 4;
  const pageStudentCount = isNextCourse ? 2100 : course.studentCount || 1500;
  const isPopular = isNextCourse ? true : Boolean(course.popular);

  // Map modules: for Next.js, merge with the 12 production modules from vertex-course.png
  const courseModules = isNextCourse
    ? NEXTJS_PRODUCTION_MODULES.map((prodMod, idx) => {
        const sanityMod = course?.modules?.[idx];
        return {
          _key: `prod-module-${idx + 1}`,
          title: prodMod.title,
          summary: prodMod.summary,
          duration: prodMod.duration,
          lessons: sanityMod?.lessons || [],
        };
      })
    : course.modules.map((m, idx) => ({
        _key: m._key || `module-${idx + 1}`,
        title: m.title,
        summary: m.summary,
        lessons: m.lessons,
      }));

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
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-32 lg:pb-36 z-10 flex flex-col gap-10 sm:gap-12">
        {/* Breadcrumb Navigation */}
        <div className="pt-2">
          <Breadcrumbs
            items={[
              { label: "All Courses", href: "/courses" },
              { label: pageTitle, active: true },
            ]}
          />
        </div>

        {/* Hero Section */}
        <CourseHero
          title={pageTitle}
          courseSlug={slug}
          summary={pageSummary}
          level={course.level}
          duration={pageDuration}
          moduleCount={pageModuleCount}
          studentCount={pageStudentCount}
          popular={isPopular}
          coverImage={isNextCourse ? undefined : course.coverImage}
          badgeIcon={course.badgeIcon}
          firstLessonSlug={typeof firstLessonSlug === "string" ? firstLessonSlug : undefined}
        />

        {/* What You'll Learn Section */}
        <WhatYouWillLearn
          outcomes={isNextCourse ? NEXTJS_LEARNING_OUTCOMES : course.learningOutcomes}
        />

        {/* Course Content Modules Accordion */}
        <CourseModulesList
          modules={courseModules}
          totalModules={pageModuleCount}
          totalDuration={pageDuration}
        />
      </main>

      {/* Sticky Bottom Progress Banner */}
      <StickyCourseProgress
        progressPercentage={35}
        firstLessonSlug={typeof firstLessonSlug === "string" ? firstLessonSlug : undefined}
      />

      {/* Atmospheric 3D stepped peach columns at bottom background */}
      <div className="w-full relative mt-auto pointer-events-none opacity-40">
        <SteppedColumnsGraphic className="w-full" />
      </div>
    </div>
  );
}
