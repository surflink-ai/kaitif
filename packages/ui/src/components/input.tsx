"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base glass styling
          "flex h-11 w-full px-4 py-2",
          "bg-white/[0.05] backdrop-blur-md",
          "border border-white/[0.1]",
          "rounded-xl",
          "text-white text-base",
          "placeholder:text-white/40",
          // Transitions
          "transition-all duration-200",
          // Focus state with glow
          "focus-visible:outline-none",
          "focus:bg-white/[0.08]",
          "focus:border-[#FFE500]/50",
          "focus:ring-2 focus:ring-[#FFE500]/20",
          "focus:shadow-[0_0_16px_rgba(255,229,0,0.1)]",
          // Disabled
          "disabled:cursor-not-allowed disabled:opacity-50",
          // File input
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white",
          // Error state
          error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
