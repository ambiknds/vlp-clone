import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "text";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-[12px] select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FB923C] disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "h-[36px] px-3 text-[13px] gap-1.5",
    md: "h-[44px] px-4 text-[14px] gap-2",
    lg: "h-[48px] px-6 text-[15px] gap-2.5",
  };

  const variantStyles = {
    primary: clsx(
      "bg-[#F97316] text-white shadow-sm hover:bg-[#EA580C] active:bg-[#C2410C]",
      disabled && "bg-[#FED7AA] text-white opacity-80 hover:bg-[#FED7AA] shadow-none"
    ),
    secondary: clsx(
      "bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9] hover:border-[#CBD5E1] active:bg-[#E2E8F0]",
      disabled && "bg-[#FAFAFC] text-[#CBD5E1] border-[#E2E8F0] hover:bg-[#FAFAFC] hover:border-[#E2E8F0]"
    ),
    tertiary: clsx(
      "bg-transparent border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9] hover:border-[#CBD5E1] active:bg-[#E2E8F0]",
      disabled && "text-[#CBD5E1] border-[#E2E8F0] opacity-60 hover:bg-transparent"
    ),
    text: clsx(
      "bg-transparent text-[#F97316] hover:text-[#EA580C] hover:bg-[#FFEEE5]/50 px-2 h-auto py-1.5",
      disabled && "text-[#FDBA74] hover:text-[#FDBA74] hover:bg-transparent"
    ),
  };

  return (
    <button
      disabled={disabled}
      className={twMerge(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
