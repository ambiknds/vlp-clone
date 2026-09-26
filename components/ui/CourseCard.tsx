import React from "react";
import { BarChart2, Clock, Layers } from "lucide-react";
import { twMerge } from "tailwind-merge";

export interface CourseCardProps {
  title?: string;
  description?: string;
  level?: string;
  duration?: string;
  moduleCount?: number;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function CourseCard({
  title = "Next.js for Production",
  description = "Build scalable, high-performance web applications with Next.js.",
  level = "Intermediate",
  duration = "18h 24m",
  moduleCount = 12,
  icon,
  className = "",
  onClick,
}: CourseCardProps) {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        "flex flex-col justify-between p-6 bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer",
        className
      )}
    >
      <div>
        {/* Course Logo / Icon */}
        <div className="w-12 h-12 rounded-[12px] bg-[#0F172A] flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-105 transition-transform">
          {icon || (
            <span className="font-bold text-[20px] font-sans tracking-tight">N</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[18px] font-bold text-[#0F172A] mb-1.5 tracking-tight group-hover:text-[#F97316] transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[14px] text-[#64748B] line-clamp-2 leading-relaxed mb-6">
          {description}
        </p>
      </div>

      {/* Meta Footer */}
      <div className="flex items-center gap-4 text-[13px] text-[#64748B] pt-4 border-t border-[#F1F5F9]">
        <div className="flex items-center gap-1.5">
          <BarChart2 className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span>{level}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span>{moduleCount} modules</span>
        </div>
      </div>
    </div>
  );
}
