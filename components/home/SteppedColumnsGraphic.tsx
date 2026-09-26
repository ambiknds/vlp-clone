import React from "react";

export function SteppedColumnsGraphic({ className = "" }: { className?: string }) {
  // Atmospheric 3D stepped columns in coral/peach gradient matching vertex-home.png
  const columns = [
    { height: 110, opacity: 0.75, width: 72 },
    { height: 160, opacity: 0.85, width: 76 },
    { height: 210, opacity: 0.95, width: 80 },
    { height: 190, opacity: 0.8, width: 78 },
    { height: 240, opacity: 0.85, width: 84 },
    { height: 140, opacity: 0.65, width: 74 },
    { height: 95, opacity: 0.5, width: 70 },
    { height: 130, opacity: 0.7, width: 72 },
    { height: 200, opacity: 0.8, width: 80 },
    { height: 260, opacity: 0.9, width: 84 },
    { height: 175, opacity: 0.75, width: 76 },
    { height: 220, opacity: 0.85, width: 80 },
  ];

  return (
    <div
      className={`relative w-full overflow-hidden flex items-end justify-center pointer-events-none select-none ${className}`}
      style={{ height: "260px" }}
      aria-hidden="true"
    >
      {/* Background radial warmth */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#FF8A65]/25 via-[#FFB74D]/10 to-transparent blur-2xl"
        style={{ transform: "translateY(20px)" }}
      />

      {/* Stepped vertical columns */}
      <div className="relative w-full max-w-[1440px] flex items-end justify-between px-4 sm:px-6 md:px-8 gap-2 sm:gap-3 md:gap-4">
        {columns.map((col, index) => (
          <div
            key={index}
            className="flex-1 rounded-t-sm relative transition-all duration-300"
            style={{
              height: `${col.height}px`,
              background: `linear-gradient(180deg, rgba(254, 215, 170, ${col.opacity * 0.7}) 0%, rgba(251, 146, 60, ${col.opacity * 0.85}) 40%, rgba(234, 88, 12, ${col.opacity * 0.95}) 100%)`,
              boxShadow: "0 -4px 20px rgba(251, 146, 60, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.4)",
            }}
          >
            {/* Top highlight / 3D facet cap */}
            <div
              className="w-full h-3 rounded-t-sm"
              style={{
                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(254, 215, 170, 0.1) 100%)",
              }}
            />
            {/* Subtle side shadow to give depth */}
            <div
              className="absolute top-0 right-0 bottom-0 w-[20%]"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(194, 65, 12, 0.15) 100%)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Base soft blur/fog overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FAFAF8]/90 via-[#FAFAF8]/40 to-transparent backdrop-blur-[1px]" />
    </div>
  );
}
