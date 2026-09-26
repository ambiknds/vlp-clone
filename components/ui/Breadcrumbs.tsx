import React from "react";
import { ChevronRight } from "lucide-react";
import { twMerge } from "tailwind-merge";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={twMerge("flex items-center space-x-2 text-[14px]", className)}>
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.active;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] mx-1.5 shrink-0" />
              )}
              {isLast ? (
                <span className="font-semibold text-[#0F172A] select-none">
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  className="text-[#64748B] hover:text-[#0F172A] transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-[#64748B]">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
