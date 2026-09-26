"use client";

import React from "react";
import Link from "next/link";
import { VertexLogo } from "./VertexLogo";
import { Bell, Search } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

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

      <div className="flex items-center gap-3">
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

        <Show when="signed-out">
          <div className="flex items-center gap-2.5">
            <SignInButton mode="modal">
              <button
                type="button"
                className="text-[14px] font-medium text-[#0F172A] hover:text-[#F97316] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                className="text-[14px] font-medium text-white bg-[#F97316] hover:bg-[#EA580C] px-4 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </Show>

        <Show when="signed-in">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 ring-1 ring-black/5",
              },
            }}
          />
        </Show>
      </div>
    </header>
  );
}
