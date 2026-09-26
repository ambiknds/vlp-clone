import React from "react";
import { ExternalLink } from "lucide-react";
import { Badge } from "./Badge";
import { twMerge } from "tailwind-merge";

export interface LessonCardLessonProps {
  title?: string;
  description?: string;
  moduleLabel?: string;
  onView?: () => void;
  className?: string;
}

export function LessonCardLesson({
  title = "Data Fetching & Caching",
  description = "Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance.",
  moduleLabel = "Module 5",
  onView,
  className = "",
}: LessonCardLessonProps) {
  return (
    <div
      className={twMerge(
        "flex flex-col justify-between p-6 bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm hover:shadow-md transition-all duration-200 group",
        className
      )}
    >
      <div>
        {/* Badge */}
        <div className="mb-3">
          <Badge variant="lesson">LESSON</Badge>
        </div>

        {/* Title */}
        <h4 className="text-[17px] font-bold text-[#0F172A] mb-2 tracking-tight group-hover:text-[#F97316] transition-colors">
          {title}
        </h4>

        {/* Description */}
        <p className="text-[14px] text-[#64748B] line-clamp-2 leading-relaxed mb-6">
          {description}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
        <span className="text-[13px] font-medium text-[#64748B]">{moduleLabel}</span>
        <button
          type="button"
          onClick={onView}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors cursor-pointer group-hover:underline"
        >
          <span>View lesson</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#F97316]" />
        </button>
      </div>
    </div>
  );
}
