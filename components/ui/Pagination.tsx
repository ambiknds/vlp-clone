import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { twMerge } from "tailwind-merge";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage = 1,
  totalPages = 8,
  onPageChange,
  className = "",
}: PaginationProps) {
  return (
    <div className={twMerge("flex items-center gap-1.5 select-none", className)}>
      <button
        type="button"
        aria-label="Previous Page"
        disabled={currentPage <= 1}
        onClick={() => onPageChange?.(currentPage - 1)}
        className="w-9 h-9 flex items-center justify-center rounded-[8px] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {[1, 2, 3].map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange?.(page)}
            className={twMerge(
              "w-9 h-9 flex items-center justify-center rounded-[8px] text-[14px] font-medium transition-all",
              isActive
                ? "border-2 border-[#F97316] text-[#F97316] font-semibold bg-[#FFF7ED]/40"
                : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
            )}
          >
            {page}
          </button>
        );
      })}

      <span className="w-9 h-9 flex items-center justify-center text-[#94A3B8] text-[14px]">
        ...
      </span>

      <button
        type="button"
        onClick={() => onPageChange?.(totalPages)}
        className={twMerge(
          "w-9 h-9 flex items-center justify-center rounded-[8px] text-[14px] font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors",
          currentPage === totalPages && "border-2 border-[#F97316] text-[#F97316] font-semibold"
        )}
      >
        {totalPages}
      </button>

      <button
        type="button"
        aria-label="Next Page"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange?.(currentPage + 1)}
        className="w-9 h-9 flex items-center justify-center rounded-[8px] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
