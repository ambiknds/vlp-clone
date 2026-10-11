import React from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

export function SearchEmptyState({ query }: { query?: string }) {
  const suggestedQueries = [
    "Next.js",
    "Server Components",
    "Docker",
    "TypeScript",
    "PostgreSQL",
    "Kubernetes",
    "RAG",
    "Web Security",
  ];

  return (
    <div className="w-full bg-white border border-[#E2E8F0] rounded-[16px] p-8 sm:p-12 text-center shadow-xs flex flex-col items-center max-w-2xl mx-auto my-6">
      <div className="w-14 h-14 rounded-full bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#EA580C] mb-4">
        <Search className="w-6 h-6 stroke-[1.75]" />
      </div>

      <h3 className="text-[20px] sm:text-[22px] font-bold text-[#0F172A] mb-2 font-serif">
        {query ? `No results found for "${query}"` : "Search across Vertex LMS"}
      </h3>

      <p className="text-[14px] sm:text-[15px] text-[#64748B] max-w-md mx-auto mb-6 leading-relaxed">
        {query
          ? "We couldn't find any lessons, modules, or timestamped video moments matching your query. Try different keywords or explore our catalog."
          : "Type a concept, technology, or question above to find lessons and exact video timestamps."}
      </p>

      {/* Suggested Topics */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-lg">
        {suggestedQueries.map((term) => (
          <Link
            key={term}
            href={`/search?q=${encodeURIComponent(term)}`}
            className="text-[12.5px] font-medium text-[#475569] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] px-3 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            {term}
          </Link>
        ))}
      </div>

      <Link
        href="/courses"
        className="inline-flex items-center gap-2 bg-[#EA580C] hover:bg-[#C2410C] text-white text-[14px] font-semibold px-5 py-2.5 rounded-[10px] transition-colors shadow-xs"
      >
        <span>Browse full catalog</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
