import React from "react";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "video" | "lesson" | "popular" | "neutral";
  size?: "sm" | "md";
}

export function Badge({
  children,
  variant = "video",
  size = "md",
  className = "",
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-bold uppercase tracking-wider rounded-md transition-colors select-none";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] leading-tight",
    md: "px-2.5 py-1 text-[11px] leading-tight",
  };

  const variantStyles = {
    video: "bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]",
    lesson: "bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]",
    popular: "bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA]",
    neutral: "bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]",
  };

  return (
    <span
      className={twMerge(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
