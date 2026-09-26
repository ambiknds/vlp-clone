import React from "react";
import Link from "next/link";
import { VertexLogo } from "./VertexLogo";
import { Bell, Search } from "lucide-react";
import { twMerge } from "tailwind-merge";

export interface HeaderNavProps {
  activeTab?: "courses" | "my-learning" | "search" | "none";
  className?: string;
  showSearch?: boolean;
  avatarUrl?: string;
  onTabChange?: (tab: string) => void;
}

export function HeaderNav({
  activeTab = "none",
  className = "",
  showSearch = false,
  avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
  onTabChange,
}: HeaderNavProps) {
  return (
    <header
      className={twMerge(
        "w-full bg-white/80 backdrop-blur-sm border-b border-[#F1F5F9] px-6 lg:px-12 py-3.5 flex items-center justify-between transition-colors",
        className
      )}
    >
      <div className="flex items-center gap-10">
        <Link href="/" className="cursor-pointer">
          <VertexLogo size={30} />
        </Link>
        <nav className="flex items-center gap-7">
          <Link
            href="/courses"
            onClick={(e) => {
              if (onTabChange) {
                e.preventDefault();
                onTabChange("courses");
              }
            }}
            className={twMerge(
              "text-[15px] font-medium transition-colors cursor-pointer",
              activeTab === "courses"
                ? "text-[#F97316] font-semibold"
                : "text-[#0F172A] hover:text-[#F97316]"
            )}
          >
            Courses
          </Link>
          <Link
            href="/my-learning"
            onClick={(e) => {
              if (onTabChange) {
                e.preventDefault();
                onTabChange("my-learning");
              }
            }}
            className={twMerge(
              "text-[15px] font-medium transition-colors cursor-pointer",
              activeTab === "my-learning"
                ? "text-[#F97316] font-semibold"
                : "text-[#0F172A] hover:text-[#F97316]"
            )}
          >
            My Learning
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {showSearch && (
          <button
            type="button"
            aria-label="Search"
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5 stroke-[1.75]" />
          </button>
        )}
        <button
          type="button"
          aria-label="Notifications"
          className="w-9 h-9 flex items-center justify-center rounded-full text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5 stroke-[1.75]" />
        </button>
        {avatarUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={avatarUrl}
            alt="User avatar"
            className="w-9 h-9 rounded-full object-cover ring-1 ring-black/5 cursor-pointer hover:opacity-90 transition-opacity"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-[#E2E8F0] border border-[#CBD5E1] flex items-center justify-center font-bold text-[13px] text-[#334155] cursor-pointer">
            VL
          </div>
        )}
      </div>
    </header>
  );
}
