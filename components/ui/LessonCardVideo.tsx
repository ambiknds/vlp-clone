import React from "react";
import { PlayCircle } from "lucide-react";
import { Badge } from "./Badge";
import { twMerge } from "tailwind-merge";

export interface LessonCardVideoProps {
  title?: string;
  description?: string;
  lessonNumber?: string;
  duration?: string;
  timestamp?: string;
  onWatch?: () => void;
  className?: string;
}

export function LessonCardVideo({
  title = "Data Fetching in Server Components",
  description = "Learn how to fetch data on the server using async/await and Next.js best practices.",
  lessonNumber = "Lesson 5.1",
  duration = "12:45",
  timestamp = "12:45",
  onWatch,
  className = "",
}: LessonCardVideoProps) {
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
          <Badge variant="video">VIDEO</Badge>
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
        <span className="text-[13px] font-medium text-[#64748B]">
          {lessonNumber} &nbsp;•&nbsp; {duration}
        </span>
        <button
          type="button"
          onClick={onWatch}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors cursor-pointer group-hover:underline"
        >
          <PlayCircle className="w-4 h-4 text-[#F97316]" />
          <span>Watch from {timestamp}</span>
        </button>
      </div>
    </div>
  );
}
