"use client";

import React from "react";
import { VertexLogo } from "@/components/ui";
import { ColorsSection } from "@/components/showcase/ColorsSection";
import { TypographySection } from "@/components/showcase/TypographySection";
import { SpacingRadiusShadowsSection } from "@/components/showcase/SpacingRadiusShadowsSection";
import { ControlsSection } from "@/components/showcase/ControlsSection";
import { IndicatorsSection } from "@/components/showcase/IndicatorsSection";
import { CardsSection } from "@/components/showcase/CardsSection";
import { NavigationSection } from "@/components/showcase/NavigationSection";
import { PrinciplesSection } from "@/components/showcase/PrinciplesSection";

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFC] text-[#0F172A] py-12 px-6 lg:px-16 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-16">
        
        {/* ========================================================================= */}
        {/* HEADER HERO / BRANDING & 01 COLORS                                       */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Brand Intro */}
          <div className="lg:col-span-4 space-y-6">
            <VertexLogo size={36} />
            <h1 className="text-[52px] leading-[1.1] font-serif font-bold text-[#0F172A] tracking-tight">
              Design System
            </h1>
            <p className="text-[16px] leading-relaxed text-[#64748B]">
              A unified design language for Vertex learning platform. Clean, modern and focused on clarity, consistency and intuitive learning experiences.
            </p>
            <div className="pt-4 text-[12px] font-semibold tracking-wider text-[#94A3B8] uppercase">
              VERSION 1.0 • MAY 2025
            </div>
          </div>

          {/* 01 COLORS */}
          <div className="lg:col-span-8">
            <ColorsSection />
          </div>
        </section>

        {/* 02 TYPOGRAPHY & 03 TYPE SCALE */}
        <section>
          <TypographySection />
        </section>

        {/* 04 SPACING & 05 RADIUS & SHADOWS */}
        <section>
          <SpacingRadiusShadowsSection />
        </section>

        {/* 06 ICONS, 07 BUTTONS, 08 INPUTS */}
        <section>
          <ControlsSection />
        </section>

        {/* 09 BADGES, 10 STATUS, 11 PROGRESS BAR */}
        <section>
          <IndicatorsSection />
        </section>

        {/* 12 CARDS */}
        <section>
          <CardsSection />
        </section>

        {/* 13 NAVIGATION */}
        <section>
          <NavigationSection />
        </section>

        {/* 14 PRINCIPLES */}
        <section>
          <PrinciplesSection />
        </section>

      </div>
    </main>
  );
}
