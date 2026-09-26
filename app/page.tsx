"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeaderNav, CourseCard } from "@/components/ui";
import { SteppedColumnsGraphic } from "@/components/home/SteppedColumnsGraphic";
import { Search, ArrowRight, Star } from "lucide-react";

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

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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

            {/* Search Input Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 w-full max-w-[620px] bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-[#F97316]/20 rounded-[14px] shadow-sm px-4 py-3.5 flex items-center gap-3 transition-all"
            >
              <Search className="w-5 h-5 text-[#94A3B8] shrink-0 stroke-[1.75]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask anything about your learning..."
                className="w-full bg-transparent border-none outline-none text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] font-sans"
              />
              <div className="shrink-0 flex items-center justify-center px-2 py-1 rounded-[6px] border border-[#E2E8F0] bg-[#F8FAFC] text-[12px] font-medium text-[#64748B] select-none">
                ⌘ K
              </div>
            </form>
          </section>

          {/* ========================================================================= */}
          {/* ALL COURSES SECTION                                                      */}
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
              {/* Course 1: Next.js for Production */}
              <CourseCard
                title="Next.js for Production"
                description="Build scalable, high-performance web applications with Next.js."
                level="Intermediate"
                duration="18h 24m"
                moduleCount={12}
                icon={<NextjsIcon />}
              />

              {/* Course 2: Docker Essentials */}
              <CourseCard
                title="Docker Essentials"
                description="Containerize applications and streamline your development workflow."
                level="Beginner"
                duration="10h 12m"
                moduleCount={8}
                icon={<DockerIcon />}
              />

              {/* Course 3: TypeScript Deep Dive */}
              <CourseCard
                title="TypeScript Deep Dive"
                description="Go beyond the basics and write safer, more expressive code."
                level="Intermediate"
                duration="14h 36m"
                moduleCount={10}
                icon={<TypeScriptIcon />}
              />
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
