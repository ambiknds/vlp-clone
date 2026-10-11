import React from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

export function SearchCtaBanner() {
  return (
    <div className="w-full bg-[#FFF7ED] border border-[#FED7AA]/70 rounded-[16px] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-10 shadow-2xs">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-[#FFEDD5] border border-[#FED7AA] flex items-center justify-center text-[#EA580C] shrink-0">
          <Search className="w-5 h-5 stroke-[2]" />
        </div>
        <div>
          <h4 className="text-[15px] sm:text-[16px] font-bold text-[#0F172A] mb-0.5">
            Can&apos;t find what you&apos;re looking for?
          </h4>
          <p className="text-[13px] sm:text-[13.5px] text-[#64748B]">
            Try different keywords or browse our full course catalog.
          </p>
        </div>
      </div>

      <Link
        href="/courses"
        className="self-start sm:self-center shrink-0 bg-white hover:bg-[#FAFAF9] border border-[#E2E8F0] hover:border-[#CBD5E1] text-[#EA580C] hover:text-[#C2410C] text-[13.5px] font-semibold px-4 py-2.5 rounded-[10px] shadow-2xs inline-flex items-center gap-2 transition-all cursor-pointer"
      >
        <span>Browse all courses</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
