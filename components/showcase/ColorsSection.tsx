import React from "react";

export function ColorsSection() {
  const primaryColors = [
    { name: "Primary 500", hex: "#F97316", bg: "bg-[#F97316]" },
    { name: "Primary 400", hex: "#FB923C", bg: "bg-[#FB923C]" },
    { name: "Primary 300", hex: "#FDBA74", bg: "bg-[#FDBA74]" },
    { name: "Primary 200", hex: "#FED7AA", bg: "bg-[#FED7AA]" },
    { name: "Primary 100", hex: "#FFEEE5", bg: "bg-[#FFEEE5]" },
  ];

  const neutralColors = [
    { name: "Neutral 900", hex: "#0F172A", bg: "bg-[#0F172A]" },
    { name: "Neutral 700", hex: "#334155", bg: "bg-[#334155]" },
    { name: "Neutral 500", hex: "#64748B", bg: "bg-[#64748B]" },
    { name: "Neutral 300", hex: "#CBD5E1", bg: "bg-[#CBD5E1]" },
    { name: "Neutral 200", hex: "#E2E8F0", bg: "bg-[#E2E8F0]" },
    { name: "Neutral 100", hex: "#F1F5F9", bg: "bg-[#F1F5F9]" },
    { name: "Neutral 50", hex: "#FAFAFC", bg: "bg-[#FAFAFC]", border: "border border-[#E2E8F0]" },
    { name: "White", hex: "#FFFFFF", bg: "bg-white", border: "border border-[#E2E8F0]" },
  ];

  return (
    <div className="bg-white p-8 rounded-[20px] border border-[#E2E8F0] shadow-sm space-y-8">
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-bold text-[#F97316]">01</span>
        <span className="text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">COLORS</span>
      </div>

      {/* Primary Palette */}
      <div>
        <h3 className="text-[14px] font-semibold text-[#64748B] mb-3">Primary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {primaryColors.map((c) => (
            <div key={c.name} className="flex flex-col">
              <div className={`h-20 rounded-[12px] ${c.bg} shadow-xs mb-2 transition-transform hover:scale-102`} />
              <span className="text-[13px] font-bold text-[#0F172A]">{c.name}</span>
              <span className="text-[12px] text-[#64748B] font-mono">{c.hex}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Neutral Palette */}
      <div>
        <h3 className="text-[14px] font-semibold text-[#64748B] mb-3">Neutral</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {neutralColors.map((c) => (
            <div key={c.name} className="flex flex-col">
              <div className={`h-20 rounded-[12px] ${c.bg} ${c.border || ""} shadow-xs mb-2 transition-transform hover:scale-102`} />
              <span className="text-[12px] font-bold text-[#0F172A] truncate">{c.name}</span>
              <span className="text-[11px] text-[#64748B] font-mono truncate">{c.hex}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
