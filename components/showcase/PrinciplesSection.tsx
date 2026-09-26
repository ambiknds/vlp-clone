import React from "react";
import { Eye, LayoutGrid, Target, Accessibility } from "lucide-react";

export function PrinciplesSection() {
  return (
    <div className="bg-white p-8 rounded-[20px] border border-[#E2E8F0] shadow-sm space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-bold text-[#F97316]">14</span>
        <span className="text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">PRINCIPLES</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
        {/* Principle 1 */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#F97316] shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-[#0F172A] mb-1">Clarity First</h4>
            <p className="text-[13px] text-[#64748B] leading-relaxed">
              Every element should communicate clearly.
            </p>
          </div>
        </div>

        {/* Principle 2 */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#F97316] shrink-0">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-[#0F172A] mb-1">Consistency</h4>
            <p className="text-[13px] text-[#64748B] leading-relaxed">
              Use components and patterns consistently across the platform.
            </p>
          </div>
        </div>

        {/* Principle 3 */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#F97316] shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-[#0F172A] mb-1">Focus &amp; Calm</h4>
            <p className="text-[13px] text-[#64748B] leading-relaxed">
              Remove noise and help learners focus on what matters.
            </p>
          </div>
        </div>

        {/* Principle 4 */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#F97316] shrink-0">
            <Accessibility className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-[#0F172A] mb-1">Accessible</h4>
            <p className="text-[13px] text-[#64748B] leading-relaxed">
              Design with accessibility and inclusivity in mind.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
