import React from "react";
import Link from "next/link";
import { HeaderNav, CourseCard } from "@/components/ui";
import { SteppedColumnsGraphic } from "@/components/home/SteppedColumnsGraphic";
import { HeroSearchBar } from "@/components/home/HeroSearchBar";
import { ArrowRight, Star } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/fetch";
import { homepageCoursesQuery } from "@/sanity/lib/queries";
import type { CourseCardItem } from "@/types/sanity";

// Custom Docker Whale SVG Icon matching vertex-home.png
function DockerIcon() {
  return (
    <div className="w-12 h-12 rounded-[12px] bg-transparent flex items-center justify-center">
      <svg
        viewBox="0 0 48 38"
        className="w-10 h-8 fill-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Containers stack on whale back */}
        <g fill="#0284C7">
          {/* Bottom row */}
          <rect x="14" y="10" width="4.5" height="4" rx="0.5" />
          <rect x="20" y="10" width="4.5" height="4" rx="0.5" />
          <rect x="26" y="10" width="4.5" height="4" rx="0.5" />
          <rect x="32" y="10" width="4.5" height="4" rx="0.5" />
          {/* Middle row */}
          <rect x="20" y="5" width="4.5" height="4" rx="0.5" />
          <rect x="26" y="5" width="4.5" height="4" rx="0.5" />
          <rect x="32" y="5" width="4.5" height="4" rx="0.5" />
          {/* Top container */}
          <rect x="26" y="0" width="4.5" height="4" rx="0.5" />
        </g>
        {/* Whale body */}
        <path
          d="M44.5 14.5C43.2 14.5 41.5 15.2 40 16.5C38 14.8 35.5 14 32.5 14H10C6.5 14 4 17 4 20C4 26 9 30 16 30C25 30 33 28 39 23C41.5 23 44 21 46 18C46.5 17 46 15 44.5 14.5ZM13 22C12.2 22 11.5 21.3 11.5 20.5C11.5 19.7 12.2 19 13 19C13.8 19 14.5 19.7 14.5 20.5C14.5 21.3 13.8 22 13 22Z"
          fill="#38BDF8"
        />
        {/* Eye */}
        <circle cx="13" cy="20.5" r="1.2" fill="#0369A1" />
        {/* Water spout / small detail */}
        <path
          d="M8.5 11C8.5 9 10 7.5 10 7.5C10 7.5 9 9.5 9.5 11"
          stroke="#0284C7"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// Custom TypeScript Blue Badge Icon matching vertex-home.png
function TypeScriptIcon() {
  return (
    <div className="w-12 h-12 rounded-[12px] bg-[#3178C6] flex items-center justify-center shadow-sm">
      <span className="font-bold text-[20px] font-sans tracking-tight text-white">
        TS
      </span>
    </div>
  );
}

// Custom Next.js Dark Badge Icon matching vertex-home.png
function NextjsIcon() {
  return (
    <div className="w-12 h-12 rounded-[12px] bg-[#0F172A] flex items-center justify-center shadow-sm">
      <span className="font-bold text-[21px] font-sans tracking-tight text-white">
        N
      </span>
    </div>
  );
}

export default async function HomePage() {
  // Fetch showcase courses from seeded Sanity dataset
  const rawCourses = await sanityFetch<CourseCardItem[]>({
    query: homepageCoursesQuery,
  }).catch(() => []);

  // Match each course from Sanity
  const nextCourse = rawCourses.find((c) => c.slug?.current?.includes("nextjs"));
  const dockerCourse = rawCourses.find(
    (c) => c.slug?.current?.includes("docker") || c.slug?.current?.includes("devops")
  );
  const tsCourse = rawCourses.find((c) => c.slug?.current?.includes("typescript"));

  const displayCourses = [
    {
      id: nextCourse?._id || "course-nextjs",
      href: "/courses/nextjs-for-production",
      title: "Next.js for Production",
      description: nextCourse?.summary || "Build scalable, high-performance web applications with Next.js.",
      level: nextCourse?.level ? (nextCourse.level.charAt(0).toUpperCase() + nextCourse.level.slice(1)) : "Intermediate",
      duration: "18h 24m",
      moduleCount: 12,
      icon: <NextjsIcon />,
    },
    {
      id: dockerCourse?._id || "course-docker",
      href: `/courses/${dockerCourse?.slug?.current || "devops-with-docker-and-kubernetes"}`,
      title: dockerCourse?.title || "DevOps with Docker and Kubernetes",
      description: dockerCourse?.summary || "Containerise an application, run it on Kubernetes, ship it through a pipeline, and operate it once it is live.",
      level: dockerCourse?.level ? (dockerCourse.level.charAt(0).toUpperCase() + dockerCourse.level.slice(1)) : "Advanced",
      duration: dockerCourse?.duration || "2h 39m",
      moduleCount: dockerCourse?.moduleCount || 4,
      icon: <DockerIcon />,
    },
    {
      id: tsCourse?._id || "course-ts",
      href: `/courses/${tsCourse?.slug?.current || "typescript-for-application-developers"}`,
      title: tsCourse?.title || "TypeScript for Application Developers",
      description: tsCourse?.summary || "Go past annotations. Structural typing, narrowing, generics, and the type-level tools that make invalid states impossible.",
      level: tsCourse?.level ? (tsCourse.level.charAt(0).toUpperCase() + tsCourse.level.slice(1)) : "Intermediate",
      duration: tsCourse?.duration || "1h 54m",
      moduleCount: tsCourse?.moduleCount || 4,
      icon: <TypeScriptIcon />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#0F172A] selection:bg-[#FED7AA] selection:text-[#9A3412]">
      {/* Top Navigation */}
      <HeaderNav
        activeTab="none"
        showSearch={false}
        className="bg-transparent border-[#E2E8F0]/60 max-w-[1440px] mx-auto"
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-between w-full">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 pt-10 sm:pt-14 pb-8 flex-1 flex flex-col justify-between">
          
          {/* ========================================================================= */}
          {/* HERO SECTION                                                             */}
          {/* ========================================================================= */}
          <section className="flex flex-col items-center text-center max-w-3xl mx-auto pt-2 sm:pt-4">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center px-3.5 py-1 rounded-[8px] bg-[#FFEEE5] border border-[#FED7AA] mb-6">
              <span className="text-[11px] font-bold tracking-[0.14em] text-[#EA580C] uppercase font-sans">
                Intelligent Learning
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[44px] sm:text-[56px] md:text-[64px] font-serif font-bold text-[#0F172A] leading-[1.12] tracking-tight">
              Search your learning<br />
              in plain English.
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-[16px] sm:text-[17px] text-[#475569] leading-relaxed max-w-xl font-sans font-normal">
              Vertex understands what you want to learn and finds the exact lessons across all your courses.
            </p>

            {/* CTA Button */}
            <div className="mt-7">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-[12px] bg-[#EA580C] hover:bg-[#D94F06] text-white text-[15px] font-medium shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>Explore Courses</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </Link>
            </div>

            {/* Search Input Bar (Client Component) */}
            <HeroSearchBar />
          </section>

          {/* ========================================================================= */}
          {/* ALL COURSES SECTION (WIRED TO SANITY CONTENT)                              */}
          {/* ========================================================================= */}
          <section className="mt-20 sm:mt-24 w-full">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[26px] sm:text-[28px] font-serif font-bold text-[#0F172A] tracking-tight">
                All Courses
              </h2>
              <Link
                href="/courses"
                className="group flex items-center gap-1.5 text-[14px] sm:text-[15px] font-medium text-[#EA580C] hover:text-[#C2410C] transition-colors"
              >
                <span>View all courses</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 stroke-[2]" />
              </Link>
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCourses.map((course) => (
                <Link
                  key={course.id}
                  href={course.href}
                  className="block focus:outline-none"
                >
                  <CourseCard
                    title={course.title}
                    description={course.description}
                    level={course.level}
                    duration={course.duration}
                    moduleCount={course.moduleCount}
                    icon={course.icon}
                  />
                </Link>
              ))}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* BANNER / DIVIDER: WEEKLY UPDATES                                         */}
          {/* ========================================================================= */}
          <section className="mt-14 mb-8 flex items-center justify-center gap-4 w-full">
            <div className="flex-1 max-w-[200px] sm:max-w-xs h-[1px] bg-[#E2E8F0]" />
            <div className="flex items-center gap-2 text-[14px] text-[#475569] font-sans font-normal shrink-0">
              <Star className="w-4 h-4 text-[#F97316] stroke-[1.75]" />
              <span>New courses and lessons added every week.</span>
            </div>
            <div className="flex-1 max-w-[200px] sm:max-w-xs h-[1px] bg-[#E2E8F0]" />
          </section>

        </div>

        {/* ========================================================================= */}
        {/* STEPPED 3D COLUMNS GRAPHIC AT BOTTOM                                      */}
        {/* ========================================================================= */}
        <SteppedColumnsGraphic className="w-full mt-auto" />
      </main>
    </div>
  );
}
