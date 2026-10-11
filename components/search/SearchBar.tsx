"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchBar({
  initialQuery = "",
  placeholder = "Search lessons, topics, or timestamps...",
}: {
  initialQuery?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  const [prevQuery, setPrevQuery] = useState(initialQuery);

  if (initialQuery !== prevQuery) {
    setPrevQuery(initialQuery);
    setValue(initialQuery);
  }

  // Global keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      const currentSort = searchParams.get("sort");
      const url = currentSort
        ? `/search?q=${encodeURIComponent(trimmed)}&sort=${encodeURIComponent(currentSort)}`
        : `/search?q=${encodeURIComponent(trimmed)}`;
      router.push(url);
    }
  };

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-[#F97316]/20 rounded-[14px] shadow-sm px-4 py-3 flex items-center gap-3 transition-all"
    >
      <Search className="w-5 h-5 text-[#94A3B8] shrink-0 stroke-[1.75]" />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-none outline-none text-[15px] sm:text-[16px] text-[#0F172A] placeholder:text-[#94A3B8] font-sans"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear query"
          className="text-[#94A3B8] hover:text-[#0F172A] p-0.5 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="shrink-0 flex items-center justify-center px-2 py-1 rounded-[6px] border border-[#E2E8F0] bg-[#F8FAFC] text-[11.5px] font-semibold text-[#64748B] select-none font-sans">
        ⌘ K
      </div>
    </form>
  );
}
