import React, { useState } from "react";
import { VertexLogo } from "../ui/VertexLogo";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { Pagination } from "../ui/Pagination";

export function NavigationSection() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="bg-white p-8 rounded-[20px] border border-[#E2E8F0] shadow-sm space-y-8">
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-bold text-[#F97316]">13</span>
        <span className="text-[13px] font-bold tracking-wider uppercase text-[#0F172A]">NAVIGATION</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Header Navigation Sample */}
        <div className="lg:col-span-4">
          <span className="text-[12px] font-semibold text-[#64748B] block mb-2">Navigation Header</span>
          <div className="p-4 bg-[#FAFAFC] rounded-[14px] border border-[#E2E8F0] flex items-center gap-6">
            <VertexLogo size={24} />
            <div className="flex items-center gap-4 text-[14px] font-semibold">
              <span className="text-[#F97316]">Courses</span>
              <span className="text-[#64748B]">My Learning</span>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="lg:col-span-5">
          <span className="text-[12px] font-semibold text-[#64748B] block mb-2">Breadcrumbs</span>
          <div className="p-4 bg-[#FAFAFC] rounded-[14px] border border-[#E2E8F0] flex items-center">
            <Breadcrumbs
              items={[
                { label: "All Courses", href: "#" },
                { label: "Next.js for Production", href: "#" },
                { label: "Data Fetching & Caching", active: true },
              ]}
            />
          </div>
        </div>

        {/* Pagination */}
        <div className="lg:col-span-3">
          <span className="text-[12px] font-semibold text-[#64748B] block mb-2">Pagination</span>
          <div className="p-4 bg-[#FAFAFC] rounded-[14px] border border-[#E2E8F0] flex items-center justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={8}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
