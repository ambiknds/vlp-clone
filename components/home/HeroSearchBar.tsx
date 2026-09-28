"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function HeroSearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="mt-8 w-full max-w-[620px] bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-[#F97316]/20 rounded-[14px] shadow-sm px-4 py-3.5 flex items-center gap-3 transition-all"
    >
      <Search className="w-5 h-5 text-[#94A3B8] shrink-0 stroke-[1.75]" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Ask anything about your learning..."
        className="w-full bg-transparent border-none outline-none text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] font-sans"
      />
      <div className="shrink-0 flex items-center justify-center px-2 py-1 rounded-[6px] border border-[#E2E8F0] bg-[#F8FAFC] text-[12px] font-medium text-[#64748B] select-none">
        ⌘ K
      </div>
    </form>
  );
}
