import React from "react";
import Link from "next/link";
import { VertexLogo } from "./VertexLogo";
import { Bell, Search } from "lucide-react";
import { twMerge } from "tailwind-merge";

export interface HeaderNavProps {
  activeTab?: "courses" | "my-learning" | "search";
  className?: string;
  onTabChange?: (tab: string) => void;
}

export function HeaderNav({
  activeTab = "courses",
  className = "",
  onTabChange,
}: HeaderNavProps) {
  return (
    <header
      className={twMerge(
        "w-full bg-white border-b border-[#E2E8F0] px-6 py-3.5 flex items-center justify-between shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-10">
        <Link href="/" className="cursor-pointer">
          <VertexLogo size={30} />
        </Link>
        <nav className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => onTabChange?.("courses")}
            className={twMerge(
              "text-[15px] font-semibold transition-colors cursor-pointer",
              activeTab === "courses"
                ? "text-[#F97316]"
                : "text-[#64748B] hover:text-[#0F172A]"
            )}
          >
            Courses
          </button>
          <button
            type="button"
            onClick={() => onTabChange?.("my-learning")}
            className={twMerge(
              "text-[15px] font-semibold transition-colors cursor-pointer",
              activeTab === "my-learning"
                ? "text-[#F97316]"
                : "text-[#64748B] hover:text-[#0F172A]"
            )}
          >
            My Learning
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Search"
          className="w-10 h-10 flex items-center justify-center rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="w-10 h-10 flex items-center justify-center rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-[#E2E8F0] border border-[#CBD5E1] flex items-center justify-center font-bold text-[13px] text-[#334155] cursor-pointer">
          VL
        </div>
      </div>
    </header>
  );
}
