import React from "react";
import { twMerge } from "tailwind-merge";

export interface ProgressBarProps {
  value: number; // 0 to 100
  showLabel?: boolean;
  className?: string;
  barClassName?: string;
}

export function ProgressBar({
  value,
  showLabel = true,
  className = "",
  barClassName = "",
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={twMerge("flex items-center gap-3 w-full", className)}>
      <div className="relative w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
        <div
          className={twMerge(
            "h-full bg-[#F97316] rounded-full transition-all duration-300 ease-out",
            barClassName
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[13px] font-medium text-[#64748B] shrink-0 whitespace-nowrap">
          <strong className="text-[#0F172A] font-semibold">{clampedValue}%</strong> complete
        </span>
      )}
    </div>
  );
}
