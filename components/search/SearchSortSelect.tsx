"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { SortOption } from "@/types/search";

export function SearchSortSelect({
  currentSort = "relevance",
}: {
  currentSort?: SortOption;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (newSort: string) => {
    const q = searchParams.get("q") || "";
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (newSort !== "relevance") params.set("sort", newSort);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="appearance-none bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] text-[#0F172A] text-[13px] font-semibold py-2 pl-3.5 pr-8 rounded-[10px] shadow-2xs cursor-pointer focus:outline-none focus:border-[#F97316] transition-colors"
      >
        <option value="relevance">Most Relevant</option>
        <option value="newest">Newest</option>
        <option value="duration">Duration</option>
      </select>
      <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 pointer-events-none" />
    </div>
  );
}
