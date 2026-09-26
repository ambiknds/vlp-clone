import React from "react";

export function TypographySection() {
  const typeScales = [
    { style: "Display 1", font: "Playfair Display", size: "48 / 56", weight: "Bold", use: "Page titles" },
    { style: "Display 2", font: "Playfair Display", size: "36 / 44", weight: "Bold", use: "Section titles" },
    { style: "Heading 1", font: "Inter", size: "28 / 36", weight: "Semi Bold", use: "Card titles" },
    { style: "Heading 2", font: "Inter", size: "22 / 30", weight: "Semi Bold", use: "Sub section" },
    { style: "Heading 3", font: "Inter", size: "18 / 26", weight: "Medium", use: "Small titles" },
    { style: "Body Large", font: "Inter", size: "16 / 24", weight: "Regular", use: "Body copy" },
    { style: "Body", font: "Inter", size: "14 / 20", weight: "Regular", use: "Supporting text" },
    { style: "Small", font: "Inter", size: "12 / 16", weight: "Regular", use: "Captions, meta" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* 02 Typography */}
      <div className="lg:col-span-4 bg-white p-8 rounded-[20px] border border-[#E2E8F0] shadow-sm flex flex-col justify-between space-y-8">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#F97316]">02</span>
          <span className="text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">TYPOGRAPHY</span>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-6">
            <span className="font-serif text-[64px] font-bold text-[#0F172A] leading-none select-none">
              Ag
            </span>
            <div>
              <h3 className="text-[20px] font-serif font-bold text-[#0F172A]">Playfair Display</h3>
              <p className="text-[13px] text-[#64748B] mt-0.5">Elegant • Readable • Timeless</p>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-[#F1F5F9]">
            <span className="font-sans text-[56px] font-bold text-[#0F172A] leading-none select-none">
              Ag
            </span>
            <div>
              <h3 className="text-[20px] font-sans font-bold text-[#0F172A]">Inter</h3>
              <p className="text-[13px] text-[#64748B] mt-0.5">Clean • Modern • Highly legible</p>
            </div>
          </div>
        </div>

        <div className="text-[12px] text-[#94A3B8]">
          Primary sans-serif pairing for interface density &amp; high reading comfort.
        </div>
      </div>

      {/* 03 Type Scale */}
      <div className="lg:col-span-8 bg-white p-8 rounded-[20px] border border-[#E2E8F0] shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#F97316]">03</span>
          <span className="text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">TYPE SCALE</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[12px] font-semibold text-[#94A3B8] uppercase">
                <th className="pb-3 pr-4">Style</th>
                <th className="pb-3 pr-4">Font</th>
                <th className="pb-3 pr-4">Size / Line Height</th>
                <th className="pb-3 pr-4">Weight</th>
                <th className="pb-3">Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
              {typeScales.map((ts) => (
                <tr key={ts.style} className="hover:bg-[#FAFAFC] transition-colors">
                  <td className="py-3 pr-4 font-bold text-[#0F172A] whitespace-nowrap">{ts.style}</td>
                  <td className="py-3 pr-4 text-[#64748B]">{ts.font}</td>
                  <td className="py-3 pr-4 font-mono text-[13px] text-[#0F172A]">{ts.size}</td>
                  <td className="py-3 pr-4 text-[#64748B]">{ts.weight}</td>
                  <td className="py-3 text-[#64748B]">{ts.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
