import React from "react";
import { Shield, Database } from "lucide-react";

export function NextjsIcon() {
  return (
    <div className="w-12 h-12 rounded-[12px] bg-[#0F172A] flex items-center justify-center shadow-sm">
      <span className="font-bold text-[21px] font-sans tracking-tight text-white">
        N
      </span>
    </div>
  );
}

export function DockerIcon() {
  return (
    <div className="w-12 h-12 rounded-[12px] bg-transparent flex items-center justify-center">
      <svg
        viewBox="0 0 48 38"
        className="w-10 h-8 fill-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="#0284C7">
          <rect x="14" y="10" width="4.5" height="4" rx="0.5" />
          <rect x="20" y="10" width="4.5" height="4" rx="0.5" />
          <rect x="26" y="10" width="4.5" height="4" rx="0.5" />
          <rect x="32" y="10" width="4.5" height="4" rx="0.5" />
          <rect x="20" y="5" width="4.5" height="4" rx="0.5" />
          <rect x="26" y="5" width="4.5" height="4" rx="0.5" />
          <rect x="32" y="5" width="4.5" height="4" rx="0.5" />
          <rect x="26" y="0" width="4.5" height="4" rx="0.5" />
        </g>
        <path
          d="M44.5 14.5C43.2 14.5 41.5 15.2 40 16.5C38 14.8 35.5 14 32.5 14H10C6.5 14 4 17 4 20C4 26 9 30 16 30C25 30 33 28 39 23C41.5 23 44 21 46 18C46.5 17 46 15 44.5 14.5ZM13 22C12.2 22 11.5 21.3 11.5 20.5C11.5 19.7 12.2 19 13 19C13.8 19 14.5 19.7 14.5 20.5C14.5 21.3 13.8 22 13 22Z"
          fill="#38BDF8"
        />
        <circle cx="13" cy="20.5" r="1.2" fill="#0369A1" />
        <path
          d="M8.5 11C8.5 9 10 7.5 10 7.5C10 7.5 9 9.5 9.5 11"
          stroke="#0284C7"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function TypeScriptIcon() {
  return (
    <div className="w-12 h-12 rounded-[12px] bg-[#3178C6] flex items-center justify-center shadow-sm">
      <span className="font-bold text-[20px] font-sans tracking-tight text-white">
        TS
      </span>
    </div>
  );
}

export function PythonIcon() {
  return (
    <div className="w-12 h-12 rounded-[12px] bg-[#3776AB] flex items-center justify-center shadow-sm">
      <span className="font-bold text-[20px] font-sans tracking-tight text-[#FFD43B]">
        Py
      </span>
    </div>
  );
}

export function ReactIcon() {
  return (
    <div className="w-12 h-12 rounded-[12px] bg-[#23272F] flex items-center justify-center shadow-sm">
      <span className="font-bold text-[18px] font-sans tracking-tight text-[#58C4DC]">
        ⚛
      </span>
    </div>
  );
}

export function DatabaseIcon() {
  return (
    <div className="w-12 h-12 rounded-[12px] bg-[#336791] flex items-center justify-center shadow-sm">
      <Database className="w-6 h-6 text-white stroke-[2]" />
    </div>
  );
}

export function SecurityIcon() {
  return (
    <div className="w-12 h-12 rounded-[12px] bg-[#0F172A] flex items-center justify-center shadow-sm">
      <Shield className="w-6 h-6 text-[#F97316] stroke-[2]" />
    </div>
  );
}

export function getBadgeIcon(badgeIcon?: string, slug?: string) {
  const s = (slug || "").toLowerCase();
  const b = (badgeIcon || "").toLowerCase();

  if (b === "nextjs" || s.includes("nextjs")) return <NextjsIcon />;
  if (b === "docker" || s.includes("docker") || s.includes("devops")) return <DockerIcon />;
  if (b === "typescript" || s.includes("typescript")) return <TypeScriptIcon />;
  if (b === "react" || s.includes("react")) return <ReactIcon />;
  if (b === "python" || s.includes("python") || s.includes("ai") || s.includes("rag")) return <PythonIcon />;
  if (b === "database" || s.includes("postgres") || s.includes("system-design")) return <DatabaseIcon />;
  if (s.includes("security")) return <SecurityIcon />;

  return (
    <div className="w-12 h-12 rounded-[12px] bg-[#0F172A] flex items-center justify-center font-bold text-[19px] font-sans text-white shadow-sm">
      {s.charAt(0).toUpperCase() || "V"}
    </div>
  );
}
