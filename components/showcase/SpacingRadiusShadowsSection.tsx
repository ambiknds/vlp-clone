import React from "react";

export function SpacingRadiusShadowsSection() {
  const spacingValues = [
    { px: 4, rem: "0.25rem" },
    { px: 8, rem: "0.5rem" },
    { px: 12, rem: "0.75rem" },
    { px: 16, rem: "1rem" },
    { px: 24, rem: "1.5rem" },
    { px: 32, rem: "2rem" },
    { px: 40, rem: "2.5rem" },
    { px: 48, rem: "3rem" },
    { px: 64, rem: "4rem" },
  ];

  const radiusList = [
    { name: "4px", label: "(xs)", radiusClass: "rounded-[4px]" },
    { name: "8px", label: "(sm)", radiusClass: "rounded-[8px]" },
    { name: "12px", label: "(md)", radiusClass: "rounded-[12px]" },
    { name: "16px", label: "(lg)", radiusClass: "rounded-[16px]" },
    { name: "24px", label: "(xl)", radiusClass: "rounded-[24px]" },
    { name: "Full", label: "(circle)", radiusClass: "rounded-full" },
  ];

  const shadowsList = [
    { name: "Sm", spec: "0 1px 2px 0 rgba(15, 23, 42, 0.05)", shadowClass: "shadow-[0_1px_2px_0_rgba(15,23,42,0.05)]" },
    { name: "Md", spec: "0 4px 12px -2px rgba(15, 23, 42, 0.08)", shadowClass: "shadow-[0_4px_12px_-2px_rgba(15,23,42,0.08)]" },
    { name: "Lg", spec: "0 12px 24px -4px rgba(15, 23, 42, 0.10)", shadowClass: "shadow-[0_12px_24px_-4px_rgba(15,23,42,0.10)]" },
    { name: "Xl", spec: "0 20px 40px -8px rgba(15, 23, 42, 0.12)", shadowClass: "shadow-[0_20px_40px_-8px_rgba(15,23,42,0.12)]" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* 04 Spacing System */}
      <div className="lg:col-span-6 bg-white p-8 rounded-[20px] border border-[#E2E8F0] shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-[#F97316]">04</span>
            <span className="text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">SPACING SYSTEM</span>
          </div>
          <span className="text-[13px] font-semibold text-[#64748B]">Base unit: 4px</span>
        </div>

        <div className="flex items-end justify-between gap-2 pt-6 overflow-x-auto pb-2">
          {spacingValues.map((s) => (
            <div key={s.px} className="flex flex-col items-center gap-2 min-w-[44px]">
              <div
                className="bg-[#FED7AA] border border-[#FDBA74] rounded-[4px] transition-all hover:bg-[#FB923C]"
                style={{ width: `${Math.max(16, s.px * 0.8)}px`, height: `${Math.max(16, s.px * 0.8)}px` }}
              />
              <span className="text-[14px] font-bold text-[#0F172A]">{s.px}</span>
              <span className="text-[11px] text-[#64748B] whitespace-nowrap">({s.rem})</span>
            </div>
          ))}
        </div>
      </div>

      {/* 05 Radius & Shadows */}
      <div className="lg:col-span-6 bg-white p-8 rounded-[20px] border border-[#E2E8F0] shadow-sm space-y-8">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#F97316]">05</span>
          <span className="text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">RADIUS &amp; SHADOWS</span>
        </div>

        {/* Radius */}
        <div>
          <h3 className="text-[13px] font-semibold text-[#64748B] mb-3">Radius</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {radiusList.map((r) => (
              <div key={r.name} className="flex flex-col items-center">
                <div className={`w-14 h-14 bg-[#FAFAFC] border-2 border-[#E2E8F0] ${r.radiusClass} mb-2 shadow-xs`} />
                <span className="text-[13px] font-bold text-[#0F172A]">{r.name}</span>
                <span className="text-[11px] text-[#64748B]">{r.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shadows */}
        <div className="pt-4 border-t border-[#F1F5F9]">
          <h3 className="text-[13px] font-semibold text-[#64748B] mb-3">Shadows</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {shadowsList.map((s) => (
              <div key={s.name} className={`p-4 bg-white rounded-[12px] border border-[#F1F5F9] ${s.shadowClass}`}>
                <span className="text-[14px] font-bold text-[#0F172A] block">{s.name}</span>
                <span className="text-[10px] text-[#64748B] leading-tight block mt-1 break-all">
                  {s.spec}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
