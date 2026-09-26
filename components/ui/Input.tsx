import React from "react";
import { Search } from "lucide-react";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  shortcut?: string;
  containerClassName?: string;
}

export function Input({
  className = "",
  containerClassName = "",
  leftIcon,
  shortcut,
  type = "text",
  placeholder = "Search anything...",
  ...props
}: InputProps) {
  return (
    <div className={twMerge("relative flex items-center w-full group", containerClassName)}>
      {leftIcon !== null && (
        <span className="absolute left-3.5 text-[#64748B] pointer-events-none group-focus-within:text-[#F97316] transition-colors">
          {leftIcon || <Search className="w-4 h-4" />}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={twMerge(
          "w-full h-[44px] bg-white border border-[#E2E8F0] rounded-[12px] text-[14px] text-[#0F172A] placeholder-[#94A3B8]",
          "transition-all duration-150 shadow-sm",
          "focus:outline-none focus:border-[#FB923C] focus:ring-2 focus:ring-[#FB923C]/20",
          leftIcon !== null ? "pl-10" : "pl-4",
          shortcut ? "pr-12" : "pr-4",
          className
        )}
        {...props}
      />
      {shortcut && (
        <div className="absolute right-3 pointer-events-none flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-[11px] font-medium text-[#64748B]">
          {shortcut}
        </div>
      )}
    </div>
  );
}
