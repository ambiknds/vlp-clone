import React from "react";
import { FileText, ExternalLink } from "lucide-react";
import { twMerge } from "tailwind-merge";

export interface ResourceCardProps {
  title?: string;
  description?: string;
  fileType?: string;
  fileSize?: string;
  onDownload?: () => void;
  className?: string;
}

export function ResourceCard({
  title = "Caching and Revalidation Guide",
  description = "Deep dive into Next.js caching strategies.",
  fileType = "PDF",
  fileSize = "1.2 MB",
  onDownload,
  className = "",
}: ResourceCardProps) {
  return (
    <div
      onClick={onDownload}
      className={twMerge(
        "flex flex-col justify-between p-6 bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer",
        className
      )}
    >
      <div>
        <div className="flex items-start gap-3.5 mb-2">
          <div className="w-10 h-10 rounded-[10px] bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] shrink-0 group-hover:border-[#FB923C] group-hover:text-[#F97316] transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[16px] font-bold text-[#0F172A] tracking-tight group-hover:text-[#F97316] transition-colors">
              {title}
            </h4>
          </div>
        </div>

        <p className="text-[14px] text-[#64748B] line-clamp-2 leading-relaxed mb-6 pl-[54px]">
          {description}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
        <span className="text-[13px] font-medium text-[#64748B]">
          {fileType} &nbsp;•&nbsp; {fileSize}
        </span>
        <span className="text-[#F97316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
          <ExternalLink className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
}
