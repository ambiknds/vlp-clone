import React from "react";
import { Badge } from "../ui/Badge";
import { StatusIndicator } from "../ui/StatusIndicator";
import { ProgressBar } from "../ui/ProgressBar";

export function IndicatorsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* 09 Badges / Tags */}
      <div className="bg-white p-8 rounded-[20px] border border-[#E2E8F0] shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#F97316]">09</span>
          <span className="text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">BADGES / TAGS</span>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[12px] text-[#64748B] font-medium">Video</span>
            <Badge variant="video">VIDEO</Badge>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[12px] text-[#64748B] font-medium">Lesson</span>
            <Badge variant="lesson">LESSON</Badge>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[12px] text-[#64748B] font-medium">Popular</span>
            <Badge variant="popular">POPULAR</Badge>
          </div>
        </div>
      </div>

      {/* 10 Status / Indicators */}
      <div className="bg-white p-8 rounded-[20px] border border-[#E2E8F0] shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#F97316]">10</span>
          <span className="text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">STATUS / INDICATORS</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <StatusIndicator status="in-progress" />
          <StatusIndicator status="completed" />
          <StatusIndicator status="now-playing" />
          <StatusIndicator status="locked" />
        </div>
      </div>

      {/* 11 Progress Bar */}
      <div className="bg-white p-8 rounded-[20px] border border-[#E2E8F0] shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#F97316]">11</span>
          <span className="text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">PROGRESS BAR</span>
        </div>

        <div className="pt-3">
          <ProgressBar value={35} />
        </div>
      </div>
    </div>
  );
}
