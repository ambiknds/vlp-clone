import React from "react";

interface VertexLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function VertexLogo({ className = "", size = 28, showText = true }: VertexLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M3 6L16 28L29 6H20.5L16 14.5L11.5 6H3Z"
          fill="url(#vertex_grad)"
        />
        <path
          d="M16 14.5L12 6H20L16 14.5Z"
          fill="#FB923C"
        />
        <defs>
          <linearGradient
            id="vertex_grad"
            x1="3"
            y1="6"
            x2="29"
            y2="28"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F97316" />
            <stop offset="1" stopColor="#EA580C" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <span className="font-bold text-[22px] tracking-tight text-[#0F172A] font-sans">
          Vertex
        </span>
      )}
    </div>
  );
}
