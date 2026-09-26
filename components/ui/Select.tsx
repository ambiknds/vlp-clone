import React from "react";
import { ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  containerClassName?: string;
}

export function Select({
  options = [],
  children,
  className = "",
  containerClassName = "",
  defaultValue,
  ...props
}: SelectProps) {
  return (
    <div className={twMerge("relative inline-flex items-center w-full", containerClassName)}>
      <select
        defaultValue={defaultValue}
        className={twMerge(
          "w-full h-[44px] appearance-none bg-white border border-[#E2E8F0] rounded-[12px] pl-4 pr-10 text-[14px] text-[#0F172A] font-medium",
          "cursor-pointer shadow-sm transition-all duration-150",
          "focus:outline-none focus:border-[#FB923C] focus:ring-2 focus:ring-[#FB923C]/20",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
        {children}
      </select>
      <span className="absolute right-3.5 text-[#64748B] pointer-events-none">
        <ChevronDown className="w-4 h-4" />
      </span>
    </div>
  );
}
