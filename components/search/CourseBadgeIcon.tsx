import React from "react";
import { Database } from "lucide-react";

export function CourseBadgeIcon({
  preset = "nextjs",
  className = "w-5 h-5 rounded-[5px]",
}: {
  preset?: string;
  className?: string;
}) {
  switch (preset?.toLowerCase()) {
    case "nextjs":
      return (
        <div
          className={`${className} bg-[#0F172A] flex items-center justify-center shrink-0 shadow-2xs`}
        >
          <span className="text-white text-[11px] font-bold font-sans">N</span>
        </div>
      );
    case "typescript":
      return (
        <div
          className={`${className} bg-[#3178C6] flex items-center justify-center shrink-0 shadow-2xs`}
        >
          <span className="text-white text-[10px] font-bold font-sans">TS</span>
        </div>
      );
    case "react":
      return (
        <div
          className={`${className} bg-[#087EA4] flex items-center justify-center shrink-0 shadow-2xs`}
        >
          <svg
            className="w-3.5 h-3.5 text-white"
            viewBox="-11.5 -10.23174 23 20.46348"
            fill="currentColor"
          >
            <circle cx="0" cy="0" r="2.05" />
            <g stroke="currentColor" strokeWidth="1" fill="none">
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
          </svg>
        </div>
      );
    case "docker":
      return (
        <div
          className={`${className} bg-[#0284C7] flex items-center justify-center shrink-0 shadow-2xs`}
        >
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 11h2v2H4zm3 0h2v2H7zm3 0h2v2h-2zm3 0h2v2h-2zm-6-3h2v2H7zm3 0h2v2h-2zm3 0h2v2h-2zm3 0h2v2h-2zm-3-3h2v2h-2zm10 8.5c-.4 0-.8.1-1.1.2-.6-1.5-2.1-2.6-3.8-2.7h-.5c-.3 0-.6.1-.9.2V13h-1v-2H2v6.5C2 20 4 22 7.5 22c5.8 0 10.6-3.3 12.3-7.5.7.1 1.4-.1 1.9-.5.6-.5.9-1.2.9-2 0-.3-.1-.6-.2-.8-.6.2-1.6.3-2.4.3z" />
          </svg>
        </div>
      );
    case "python":
      return (
        <div
          className={`${className} bg-[#3776AB] flex items-center justify-center shrink-0 shadow-2xs`}
        >
          <span className="text-[#FFD43B] text-[10px] font-bold font-sans">Py</span>
        </div>
      );
    case "nodejs":
    case "node":
      return (
        <div
          className={`${className} bg-[#16A34A] flex items-center justify-center shrink-0 shadow-2xs`}
        >
          <span className="text-white text-[10px] font-bold font-sans">JS</span>
        </div>
      );
    case "javascript":
    case "js":
      return (
        <div
          className={`${className} bg-[#F7DF1E] flex items-center justify-center shrink-0 shadow-2xs`}
        >
          <span className="text-[#000000] text-[10px] font-bold font-sans">JS</span>
        </div>
      );
    case "database":
    default:
      return (
        <div
          className={`${className} bg-[#334155] flex items-center justify-center shrink-0 shadow-2xs`}
        >
          <Database className="w-3 h-3 text-white" />
        </div>
      );
  }
}
