import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeaderNav } from "@/components/ui/HeaderNav";
import { LessonHeader } from "@/components/lesson/LessonHeader";
import { LessonVideoPlayer } from "@/components/lesson/LessonVideoPlayer";
import { LessonTabs } from "@/components/lesson/LessonTabs";
import { LessonSidebar, type SidebarModuleItem } from "@/components/lesson/LessonSidebar";
import { LessonFooterNav } from "@/components/lesson/LessonFooterNav";
import { sanityFetch } from "@/sanity/lib/fetch";
import { lessonBySlugQuery } from "@/sanity/lib/queries";
import type { PortableTextBlock } from "@portabletext/react";
import type { Resource } from "@/types/sanity";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ start?: string; t?: string; startSeconds?: string }>;
}

// 12 Production Modules matching design/vertex-lesson.png & vertex-course.png specification
const NEXTJS_PRODUCTION_MODULES = [
  {
    title: "Introduction to Next.js",
    duration: "45m",
  },
  {
    title: "Project Setup & Structure",
    duration: "1h 12m",
  },
  {
    title: "Routing & Layouts",
    duration: "1h 36m",
  },
  {
    title: "Server Components",
    duration: "1h 42m",
  },
  {
    title: "Data Fetching & Caching",
    duration: "1h 28m",
  },
  {
    title: "Authentication",
    duration: "1h 18m",
  },
  {
    title: "API Routes & Handlers",
    duration: "1h 26m",
  },
  {
    title: "Middleware & Edge Functions",
    duration: "1h 10m",
  },
  {
    title: "Performance Optimization",
    duration: "1h 34m",
  },
  {
    title: "Deployment on Vercel",
    duration: "56m",
  },
  {
    title: "Monitoring & Logging",
    duration: "1h 8m",
  },
  {
    title: "Best Practices & Next Steps",
    duration: "52m",
  },
];

// Production module 5 lessons matching design/vertex-lesson.png exactly
const NEXTJS_MODULE_5_LESSONS = [
  {
    id: "lesson-5-1",
    title: "Data Fetching & Caching",
    slug: "nextjs-app-router-in-depth-caching-and-revalidation",
    duration: undefined, // active / now playing
  },
  {
    id: "lesson-5-2",
    title: "Fetching in Server Components",
    slug: "nextjs-app-router-in-depth-fetching-in-server-components",
    duration: "21m",
  },
  {
    id: "lesson-5-3",
    title: "Caching Strategies",
    slug: "nextjs-app-router-in-depth-caching-and-revalidation",
    duration: "23m",
  },
  {
    id: "lesson-5-4",
    title: "Revalidation & Cache Control",
    slug: "nextjs-app-router-in-depth-caching-and-revalidation",
    duration: "18m",
  },
  {
    id: "lesson-5-5",
    title: "Hands-on: Implement Caching",
    slug: "nextjs-app-router-in-depth-caching-and-revalidation",
    duration: "26m",
  },
];

const NEXTJS_LESSON_RESOURCES: Resource[] = [
  {
    _key: "res-next-docs",
    title: "Next.js Data Fetching Documentation",
    description: "Official Next.js docs on data fetching methods.",
    type: "Guide",
    url: "https://nextjs.org/docs/app/building-your-application/data-fetching",
  },
  {
    _key: "res-caching-guide",
    title: "Caching and Revalidation Guide",
    description: "Deep dive into Next.js caching strategies.",
    type: "Guide",
    url: "https://nextjs.org/docs/app/building-your-application/caching",
  },
  {
    _key: "res-example-repo",
    title: "Example Repository",
    description: "Explore the source code for this lesson.",
    type: "Code",
    url: "https://github.com/vercel/next.js",
  },
];

const NEXTJS_LESSON_KEY_POINTS = [
  "Understand the different data fetching methods in Next.js",
  "Learn how caching works in Server Components",
  "Implement revalidation and cache control",
  "Optimize performance with advanced caching strategies",
];

interface SanityLessonQueryResult {
  _id: string;
  _type: "lesson";
  title: string;
  slug: { current: string };
  videoUrl?: string;
  duration?: string;
  durationSeconds?: number;
  freePreview?: boolean;
  studentCount?: number;
  keyPoints?: string[];
  proTip?: string;
  notes?: PortableTextBlock[];
  resources?: Resource[];
  course?: {
    _id: string;
    title: string;
    slug: { current: string };
    level?: string;
    badgeIcon?: string;
    modules?: {
      _key: string;
      title: string;
      summary?: string;
      lessons?: {
        _id: string;
        title: string;
        slug: { current: string };
        duration?: string;
        durationSeconds?: number;
        freePreview?: boolean;
      }[];
    }[];
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const isNextProductionLesson =
    slug === "data-fetching-and-caching" ||
    slug === "nextjs-for-production-data-fetching-and-caching" ||
    slug === "nextjs-app-router-in-depth-caching-and-revalidation";

  if (isNextProductionLesson) {
    return {
      title: "Data Fetching & Caching — Next.js for Production | Vertex",
      description:
        "Learn how Next.js handles data fetching and caching in both Server and Client Components.",
    };
  }

  const lesson = await sanityFetch<SanityLessonQueryResult | null>({
    query: lessonBySlugQuery,
    params: { slug },
  });

  if (!lesson) {
    return {
      title: "Lesson Not Found — Vertex",
    };
  }

  return {
    title: `${lesson.title} — ${lesson.course?.title || "Vertex"}`,
    description: `Learn ${lesson.title} in Vertex LMS.`,
  };
}

export default async function LessonPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const search = await searchParams;

  // Resolve start seconds from query param (e.g. ?start=120, ?t=120, or ?startSeconds=120)
  const rawStart = search.start || search.t || search.startSeconds;
  const startSeconds = rawStart ? parseFloat(rawStart) : 0;

  // Resolve slug aliasing for design specification
  const isNextProductionLesson =
    slug === "data-fetching-and-caching" ||
    slug === "nextjs-for-production-data-fetching-and-caching" ||
    slug === "nextjs-app-router-in-depth-caching-and-revalidation";

  const querySlug = isNextProductionLesson
    ? "nextjs-app-router-in-depth-caching-and-revalidation"
    : slug;

  let lesson = await sanityFetch<SanityLessonQueryResult | null>({
    query: lessonBySlugQuery,
    params: { slug: querySlug },
  });

  // Fallback to caching lesson if requested Next.js lesson was not found
  if (!lesson && isNextProductionLesson) {
    lesson = await sanityFetch<SanityLessonQueryResult | null>({
      query: lessonBySlugQuery,
      params: { slug: "nextjs-app-router-in-depth-caching-and-revalidation" },
    });
  }

  if (!lesson) {
    notFound();
  }

  // 1. SPECIFIC SPECIFICATION: Next.js for Production matching design/vertex-lesson.png
  if (isNextProductionLesson) {
    const courseTitle = "Next.js for Production";
    const courseSlug = "nextjs-for-production";
    const moduleTitle = "Data Fetching & Caching";
    const lessonTitle = "Data Fetching & Caching";
    const lessonLabel = "LESSON 5.1";
    const summary =
      "Learn how Next.js handles data fetching and caching in both Server and Client Components.";
    const duration = "1h 28m";
    const level = "Intermediate";
    const studentCount = 3426;
    const videoUrl =
      lesson.videoUrl || "https://www.youtube.com/watch?v=VBlSe8tvg4U";

    const overview =
      "In this lesson, you'll learn how Next.js handles data fetching and caching in both Server and Client Components. We'll explore different caching strategies and revalidation techniques to build fast and scalable applications.";
    const keyPoints = NEXTJS_LESSON_KEY_POINTS;
    const proTip =
      "Use caching and revalidation wisely to ensure your app stays fast and data remains fresh without unnecessary requests.";
    const resources = NEXTJS_LESSON_RESOURCES;

    // Sidebar modules: 12 production modules with Module 5 active & containing its 5 lessons
    const sidebarModules: SidebarModuleItem[] = NEXTJS_PRODUCTION_MODULES.map(
      (prodMod, modIdx) => {
        const isMod5 = modIdx === 4;
        return {
          key: `prod-mod-${modIdx + 1}`,
          moduleNumber: modIdx + 1,
          title: prodMod.title,
          duration: prodMod.duration,
          lessons: isMod5 ? NEXTJS_MODULE_5_LESSONS : [],
        };
      }
    );

    const previousLesson = {
      title: "Server Components",
      slug: "nextjs-app-router-in-depth-server-components",
      duration: "1h 42m",
    };

    const nextLesson = {
      title: "Authentication",
      slug: "nextjs-app-router-in-depth-server-actions-basics",
      duration: "1h 18m",
    };

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

        {/* Main Content Layout */}
        <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-16 z-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Curriculum Sidebar */}
          <LessonSidebar
            courseTitle={courseTitle}
            courseSlug={courseSlug}
            badgeIcon="nextjs"
            progressPercentage={35}
            currentModuleIndex={4} // Module 5 (0-indexed)
            currentLessonSlug={querySlug}
            modules={sidebarModules}
          />

          {/* Right Main Lesson Area */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">
            <LessonHeader
              courseTitle={courseTitle}
              courseSlug={courseSlug}
              moduleTitle={moduleTitle}
              lessonTitle={lessonTitle}
              lessonLabel={lessonLabel}
              summary={summary}
              duration={duration}
              level={level}
              studentCount={studentCount}
            />

            <LessonVideoPlayer
              videoUrl={videoUrl}
              startSeconds={startSeconds}
              title={lessonTitle}
            />

            <LessonTabs
              overview={overview}
              keyPoints={keyPoints}
              proTip={proTip}
              resources={resources}
              notes={lesson.notes}
              lessonTitle={lessonTitle}
            />

            <LessonFooterNav
              previousLesson={previousLesson}
              nextLesson={nextLesson}
              currentLessonTitle={lessonTitle}
            />
          </div>
        </main>
      </div>
    );
  }

  // 2. DYNAMIC GENERIC SANITY LESSON (Docker, Kubernetes, Python, React, AI, etc.)
  const course = lesson.course;
  const courseTitle = course?.title || "Course";
  const courseSlug = course?.slug?.current || "courses";
  const badgeIcon = course?.badgeIcon || "database";

  // Derive modules and find active module/lesson index
  const rawModules = course?.modules || [];

  // Find module & lesson index before mapping
  let foundModuleIndex = 0;
  let foundLessonIndex = 0;
  let currentModuleTitle = "Module";

  for (let m = 0; m < rawModules.length; m++) {
    const mod = rawModules[m];
    const lessons = mod.lessons || [];
    for (let l = 0; l < lessons.length; l++) {
      if (lessons[l].slug?.current === querySlug) {
        foundModuleIndex = m;
        foundLessonIndex = l;
        currentModuleTitle = mod.title;
        break;
      }
    }
  }

  const allLessonsFlat = rawModules.flatMap((mod) =>
    (mod.lessons || []).map((l) => ({
      id: l._id,
      title: l.title,
      slug: l.slug?.current || "",
      duration: l.duration,
      freePreview: l.freePreview,
    }))
  );

  const sidebarModules: SidebarModuleItem[] = rawModules.map((mod, mIdx) => ({
    key: mod._key || `mod-${mIdx}`,
    moduleNumber: mIdx + 1,
    title: mod.title,
    duration: "1h 15m",
    lessons: (mod.lessons || []).map((l) => ({
      id: l._id,
      title: l.title,
      slug: l.slug?.current || "",
      duration: l.duration,
      freePreview: l.freePreview,
    })),
  }));

  const currentFlatIndex = allLessonsFlat.findIndex((l) => l.slug === querySlug);
  const previousLesson =
    currentFlatIndex > 0 ? allLessonsFlat[currentFlatIndex - 1] : null;
  const nextLesson =
    currentFlatIndex !== -1 && currentFlatIndex < allLessonsFlat.length - 1
      ? allLessonsFlat[currentFlatIndex + 1]
      : null;

  const lessonLabel = `LESSON ${foundModuleIndex + 1}.${foundLessonIndex + 1}`;
  const videoUrl =
    lesson.videoUrl || "https://www.youtube.com/watch?v=9602Yzvd7ik";

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

      {/* Main Content Layout */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-16 z-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Curriculum Sidebar */}
        <LessonSidebar
          courseTitle={courseTitle}
          courseSlug={courseSlug}
          badgeIcon={badgeIcon}
          progressPercentage={25}
          currentModuleIndex={foundModuleIndex}
          currentLessonSlug={querySlug}
          modules={sidebarModules}
        />

        {/* Right Main Lesson Area */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <LessonHeader
            courseTitle={courseTitle}
            courseSlug={courseSlug}
            moduleTitle={currentModuleTitle}
            lessonTitle={lesson.title}
            lessonLabel={lessonLabel}
            summary={`Learn ${lesson.title} as part of ${courseTitle}.`}
            duration={lesson.duration}
            level={course?.level || "Intermediate"}
            studentCount={lesson.studentCount || 1500}
          />

          <LessonVideoPlayer
            videoUrl={videoUrl}
            startSeconds={startSeconds}
            title={lesson.title}
          />

          <LessonTabs
            overview={`In this lesson, you will learn ${lesson.title}. Explore key principles and practical implementations.`}
            keyPoints={lesson.keyPoints}
            proTip={lesson.proTip}
            resources={lesson.resources}
            notes={lesson.notes}
            lessonTitle={lesson.title}
          />

          <LessonFooterNav
            previousLesson={previousLesson}
            nextLesson={nextLesson}
            currentLessonTitle={lesson.title}
          />
        </div>
      </main>
    </div>
  );
}
