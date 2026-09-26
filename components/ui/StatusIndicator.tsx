import React from "react";
import { CheckCircle2, PlayCircle, Lock } from "lucide-react";
import { twMerge } from "tailwind-merge";

export interface StatusIndicatorProps {
  status: "in-progress" | "completed" | "now-playing" | "locked";
  label?: string;
  className?: string;
  showLabel?: boolean;
}

export function StatusIndicator({
  status,
  label,
  className = "",
  showLabel = true,
}: StatusIndicatorProps) {
  const configs = {
    "in-progress": {
      defaultLabel: "In Progress",
      textColor: "text-[#F97316]",
      icon: (
        <svg
          className="w-4 h-4 text-[#F97316]"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="8" cy="8" r="6" stroke="#FED7AA" strokeWidth="2" />
          <path
            d="M8 2C11.3137 2 14 4.68629 14 8"
            stroke="#F97316"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    completed: {
      defaultLabel: "Completed",
      textColor: "text-[#16A34A]",
      icon: <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />,
    },
    "now-playing": {
      defaultLabel: "Now Playing",
      textColor: "text-[#F97316]",
      icon: <PlayCircle className="w-4 h-4 text-[#F97316] fill-[#F97316] text-white" />,
    },
    locked: {
      defaultLabel: "Locked",
      textColor: "text-[#64748B]",
      icon: <Lock className="w-4 h-4 text-[#64748B]" />,
    },
  };

  const current = configs[status];
  const displayLabel = label ?? current.defaultLabel;

  return (
    <div className={twMerge("inline-flex items-center gap-1.5 font-medium text-[13px]", current.textColor, className)}>
      <span className="shrink-0">{current.icon}</span>
      {showLabel && <span>{displayLabel}</span>}
    </div>
  );
}
