import React from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import {
  Bell,
  Search,
  PlayCircle,
  FileText,
  Bookmark,
  BarChart2,
  Clock,
  User,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export function ControlsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* 06 Icons */}
      <div className="lg:col-span-4 bg-white p-8 rounded-[20px] border border-[#E2E8F0] shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#F97316]">06</span>
          <span className="text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">ICONS</span>
        </div>

        <div className="space-y-6">
          {/* Outline Icons */}
          <div>
            <h4 className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-3">
              Outline Style
            </h4>
            <div className="flex flex-wrap items-center gap-3 text-[#0F172A]">
              <div className="p-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors"><Bell className="w-5 h-5" strokeWidth={2} /></div>
              <div className="p-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors"><Search className="w-5 h-5" strokeWidth={2} /></div>
              <div className="p-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors"><PlayCircle className="w-5 h-5" strokeWidth={2} /></div>
              <div className="p-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors"><FileText className="w-5 h-5" strokeWidth={2} /></div>
              <div className="p-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors"><Bookmark className="w-5 h-5" strokeWidth={2} /></div>
              <div className="p-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors"><BarChart2 className="w-5 h-5" strokeWidth={2} /></div>
              <div className="p-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors"><Clock className="w-5 h-5" strokeWidth={2} /></div>
              <div className="p-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors"><User className="w-5 h-5" strokeWidth={2} /></div>
              <div className="p-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors"><ChevronRight className="w-5 h-5" strokeWidth={2} /></div>
            </div>
          </div>

          {/* Filled Style */}
          <div>
            <h4 className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-3">
              Filled Style
            </h4>
            <div className="flex flex-wrap items-center gap-3 text-[#0F172A]">
              <div className="p-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors"><Bell className="w-5 h-5" fill="#0F172A" /></div>
              <div className="p-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors"><Search className="w-5 h-5" strokeWidth={2.5} /></div>
              <div className="p-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors"><PlayCircle className="w-5 h-5" fill="#0F172A" stroke="#FFFFFF" /></div>
              <div className="p-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors"><FileText className="w-5 h-5" fill="#0F172A" stroke="#FFFFFF" /></div>
              <div className="p-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors"><Bookmark className="w-5 h-5" fill="#0F172A" /></div>
              <div className="p-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors"><BarChart2 className="w-5 h-5" strokeWidth={3} /></div>
              <div className="p-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors"><Clock className="w-5 h-5" fill="#0F172A" stroke="#FFFFFF" /></div>
              <div className="p-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors"><User className="w-5 h-5" fill="#0F172A" /></div>
              <div className="p-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors"><ChevronRight className="w-5 h-5" strokeWidth={3} /></div>
            </div>
          </div>

          {/* Icon Specs */}
          <div className="p-4 bg-[#FAFAFC] rounded-[12px] border border-[#E2E8F0] space-y-1 text-[12px] text-[#64748B]">
            <div className="font-bold text-[#0F172A] mb-1">Icon Specs</div>
            <div>&bull; 24x24px grid</div>
            <div>&bull; 2px stroke width (outline)</div>
            <div>&bull; Rounded line caps</div>
            <div>&bull; Consistent optical balance</div>
          </div>
        </div>
      </div>

      {/* 07 Buttons */}
      <div className="lg:col-span-5 bg-white p-8 rounded-[20px] border border-[#E2E8F0] shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#F97316]">07</span>
          <span className="text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">BUTTONS</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-semibold text-[#94A3B8] uppercase border-b border-[#E2E8F0]">
                <th className="pb-3 pr-2">State</th>
                <th className="pb-3 pr-2">Primary</th>
                <th className="pb-3 pr-2">Secondary</th>
                <th className="pb-3 pr-2">Tertiary</th>
                <th className="pb-3">Text</th>
              </tr>
            </thead>
            <tbody className="text-[13px] divide-y divide-[#F1F5F9]">
              <tr>
                <td className="py-3 pr-2 font-medium text-[#64748B]">Default</td>
                <td className="py-3 pr-2"><Button variant="primary" size="sm">Get Started</Button></td>
                <td className="py-3 pr-2"><Button variant="secondary" size="sm">Explore Courses</Button></td>
                <td className="py-3 pr-2"><Button variant="tertiary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>View Lesson</Button></td>
                <td className="py-3"><Button variant="text" size="sm" rightIcon={<PlayCircle className="w-3.5 h-3.5" />}>Watch Video</Button></td>
              </tr>
              <tr>
                <td className="py-3 pr-2 font-medium text-[#64748B]">Hover</td>
                <td className="py-3 pr-2"><Button variant="primary" size="sm" className="bg-[#EA580C]">Get Started</Button></td>
                <td className="py-3 pr-2"><Button variant="secondary" size="sm" className="bg-[#F1F5F9]">Explore Courses</Button></td>
                <td className="py-3 pr-2"><Button variant="tertiary" size="sm" className="bg-[#F1F5F9]" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>View Lesson</Button></td>
                <td className="py-3"><Button variant="text" size="sm" className="text-[#EA580C]" rightIcon={<PlayCircle className="w-3.5 h-3.5" />}>Watch Video</Button></td>
              </tr>
              <tr>
                <td className="py-3 pr-2 font-medium text-[#64748B]">Disabled</td>
                <td className="py-3 pr-2"><Button variant="primary" size="sm" disabled>Get Started</Button></td>
                <td className="py-3 pr-2"><Button variant="secondary" size="sm" disabled>Explore Courses</Button></td>
                <td className="py-3 pr-2"><Button variant="tertiary" size="sm" disabled rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>View Lesson</Button></td>
                <td className="py-3"><Button variant="text" size="sm" disabled rightIcon={<PlayCircle className="w-3.5 h-3.5" />}>Watch Video</Button></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Button Specs */}
        <div className="p-4 bg-[#FAFAFC] rounded-[12px] border border-[#E2E8F0] space-y-1 text-[12px] text-[#64748B]">
          <div className="font-bold text-[#0F172A] mb-1">Button Specs</div>
          <div>&bull; Height: 44px (default)</div>
          <div>&bull; Padding: 0 16px (lg), 0 12px (md)</div>
          <div>&bull; Radius: 12px</div>
          <div>&bull; Font: Inter Medium (14–16px)</div>
        </div>
      </div>

      {/* 08 Inputs */}
      <div className="lg:col-span-3 bg-white p-8 rounded-[20px] border border-[#E2E8F0] shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#F97316]">08</span>
          <span className="text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">INPUTS</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold text-[#64748B] block mb-1.5">
              Search / Text Input
            </label>
            <Input placeholder="Search anything..." shortcut="⌘ K" />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#64748B] block mb-1.5">
              Select
            </label>
            <Select
              options={[
                { value: "most-relevant", label: "Most Relevant" },
                { value: "newest", label: "Newest" },
                { value: "popular", label: "Most Popular" },
              ]}
            />
          </div>

          {/* Field Specs */}
          <div className="p-4 bg-[#FAFAFC] rounded-[12px] border border-[#E2E8F0] space-y-1 text-[12px] text-[#64748B]">
            <div className="font-bold text-[#0F172A] mb-1">Field Specs</div>
            <div>&bull; Height: 44px</div>
            <div>&bull; Radius: 12px</div>
            <div>&bull; Border: 1px solid #E2E8F0</div>
            <div>&bull; Padding: 0 16px</div>
            <div>&bull; Focus: Border color #FB923C</div>
          </div>
        </div>
      </div>
    </div>
  );
}
