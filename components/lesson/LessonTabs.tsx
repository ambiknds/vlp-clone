"use client";

import React, { useState } from "react";
import { CheckCircle2, Lightbulb, FileText, ExternalLink } from "lucide-react";
import { PortableText } from "@/components/ui/PortableText";
import type { PortableTextBlock } from "@portabletext/react";
import type { Resource } from "@/types/sanity";
import posthog from "posthog-js";

interface LessonTabsProps {
  overview?: string;
  keyPoints?: string[];
  proTip?: string | null;
  resources?: Resource[];
  notes?: PortableTextBlock[] | null;
  lessonTitle: string;
}

export function LessonTabs({
  overview,
  keyPoints = [],
  proTip,
  resources = [],
  notes,
  lessonTitle,
}: LessonTabsProps) {
  const [activeTab, setActiveTab] = useState<"content" | "notes">("content");

  const handleTabChange = (tab: "content" | "notes") => {
    setActiveTab(tab);
    posthog.capture("lesson_tab_switched", {
      lesson_title: lessonTitle,
      tab: tab === "content" ? "Lesson Content" : "Notes",
    });
  };

  return (
    <div className="w-full pt-4">
      {/* Tab Navigation */}
      <div className="flex items-center gap-8 border-b border-[#E2E8F0]">
        <button
          type="button"
          onClick={() => handleTabChange("content")}
          className={`pb-3.5 text-[15px] font-medium transition-all relative cursor-pointer ${
            activeTab === "content"
              ? "text-[#EA580C] font-semibold"
              : "text-[#64748B] hover:text-[#0F172A]"
          }`}
        >
          Lesson Content
          {activeTab === "content" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#EA580C] rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("notes")}
          className={`pb-3.5 text-[15px] font-medium transition-all relative cursor-pointer ${
            activeTab === "notes"
              ? "text-[#EA580C] font-semibold"
              : "text-[#64748B] hover:text-[#0F172A]"
          }`}
        >
          Notes
          {activeTab === "notes" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#EA580C] rounded-full" />
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="pt-6 sm:pt-8">
        {activeTab === "content" ? (
          <div className="flex flex-col">
            {/* Overview */}
            {overview && (
              <section className="mb-6">
                <h2 className="text-[20px] font-serif font-bold text-[#0F172A] tracking-tight mb-3">
                  Overview
                </h2>
                <p className="text-[15px] text-[#475569] font-sans leading-relaxed">
                  {overview}
                </p>
              </section>
            )}

            {/* Hairline Divider */}
            {overview && <hr className="border-[#E2E8F0]/80 my-4" />}

            {/* In this lesson you will */}
            {keyPoints && keyPoints.length > 0 && (
              <section className="my-4">
                <h3 className="text-[15px] font-semibold text-[#0F172A] mb-3.5 font-sans">
                  In this lesson you will:
                </h3>
                <div className="flex flex-col gap-3">
                  {keyPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#EA580C] stroke-[1.75] shrink-0 mt-0.5" />
                      <span className="text-[14.5px] text-[#334155] leading-relaxed font-sans">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Pro Tip Callout Box */}
            {proTip && (
              <section className="my-6">
                <div className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-[16px] p-5 sm:p-6 flex items-start gap-4 shadow-2xs">
                  <div className="p-1 rounded-full text-[#EA580C] shrink-0 mt-0.5">
                    <Lightbulb className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#0F172A] tracking-tight mb-1 font-sans">
                      Pro Tip
                    </h4>
                    <p className="text-[14px] text-[#475569] font-sans leading-relaxed">
                      {proTip}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Resources Section */}
            {resources && resources.length > 0 && (
              <section className="mt-4 mb-8">
                <h3 className="text-[20px] font-serif font-bold text-[#0F172A] tracking-tight mb-4">
                  Resources
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {resources.map((resource) => {
                    const isGithub =
                      resource.url?.includes("github.com") ||
                      resource.type?.toLowerCase().includes("code") ||
                      resource.title?.toLowerCase().includes("repository");

                    return (
                      <a
                        key={resource._key || resource.title}
                        href={resource.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-[16px] p-5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all duration-150 group"
                      >
                        <div>
                          {/* Top Icon & External Arrow */}
                          <div className="flex items-center justify-between">
                            <div className="w-9 h-9 rounded-[10px] bg-[#FFF7ED] border border-[#FFEDD5] flex items-center justify-center text-[#EA580C] shrink-0">
                              {isGithub ? (
                                <svg
                                  className="w-4 h-4 fill-current"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                  />
                                </svg>
                              ) : (
                                <FileText className="w-4 h-4 stroke-[2]" />
                              )}
                            </div>
                            <ExternalLink className="w-4 h-4 text-[#94A3B8] group-hover:text-[#EA580C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                          </div>

                          {/* Title */}
                          <h4 className="text-[14px] font-bold text-[#0F172A] group-hover:text-[#EA580C] transition-colors mt-3 mb-1 font-sans">
                            {resource.title}
                          </h4>

                          {/* Description */}
                          {resource.description && (
                            <p className="text-[12.5px] text-[#64748B] font-sans leading-relaxed line-clamp-2">
                              {resource.description}
                            </p>
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="py-2">
            {notes && notes.length > 0 ? (
              <PortableText value={notes} />
            ) : (
              <div className="py-12 text-center text-[#64748B] text-[14px] font-sans">
                Comprehensive notes and code examples for this lesson will appear here.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
