import React from "react";
import { Layers, Database, Gauge, Cloud } from "lucide-react";

export interface LearningOutcomeItem {
  _key?: string;
  title: string;
  description?: string;
  icon?: string;
}

interface WhatYouWillLearnProps {
  outcomes?: LearningOutcomeItem[];
}

// Fallback outcome icons matching vertex-course.png
function getOutcomeIcon(iconType?: string, index: number = 0) {
  const normalized = (iconType || "").toLowerCase();
  
  if (normalized.includes("layer") || index === 0) {
    return <Layers className="w-8 h-8 text-[#D96B43] stroke-[1.6]" />;
  }
  if (normalized.includes("data") || normalized.includes("fetch") || normalized.includes("workflow") || index === 1) {
    return <Database className="w-8 h-8 text-[#D96B43] stroke-[1.6]" />;
  }
  if (normalized.includes("gauge") || normalized.includes("perf") || index === 2) {
    return <Gauge className="w-8 h-8 text-[#D96B43] stroke-[1.6]" />;
  }
  return <Cloud className="w-8 h-8 text-[#D96B43] stroke-[1.6]" />;
}

export function WhatYouWillLearn({ outcomes }: WhatYouWillLearnProps) {
  // If no outcomes provided from Sanity, fallback to design specification defaults
  const items: LearningOutcomeItem[] = outcomes && outcomes.length > 0
    ? outcomes
    : [
        {
          title: "App Router Foundations",
          description: "Master the App Router, layouts, loading states, and nested routing.",
          icon: "layers",
        },
        {
          title: "Data Fetching & Caching",
          description: "Fetch data efficiently and leverage caching for better performance.",
          icon: "database",
        },
        {
          title: "Performance Optimization",
          description: "Optimize rendering, assets, and bundle size for faster apps.",
          icon: "gauge",
        },
        {
          title: "Deployment & Scaling",
          description: "Deploy with confidence and scale your Next.js applications.",
          icon: "cloud",
        },
      ];

  return (
    <section className="w-full bg-white/70 border border-[#E2E8F0]/80 rounded-[24px] p-6 sm:p-8 lg:p-10 shadow-xs backdrop-blur-xs">
      <h2 className="text-[24px] sm:text-[26px] font-serif font-bold text-[#0F172A] tracking-tight mb-6">
        What you&apos;ll learn
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {items.map((item, idx) => (
          <div
            key={item._key || idx}
            className="flex items-start gap-4 p-5 sm:p-6 bg-white border border-[#E2E8F0]/70 rounded-[18px] shadow-xs hover:border-[#CBD5E1] transition-all duration-150"
          >
            <div className="w-12 h-12 rounded-[14px] bg-[#FFF7ED]/80 flex items-center justify-center shrink-0 border border-[#FFEDD5]">
              {getOutcomeIcon(item.icon, idx)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[17px] font-serif font-bold text-[#0F172A] tracking-tight mb-1.5">
                {item.title}
              </h3>
              <p className="text-[13.5px] sm:text-[14px] text-[#64748B] leading-relaxed font-sans">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
