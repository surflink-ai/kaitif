"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Base glass styling
          "flex min-h-[120px] w-full px-4 py-3",
          "bg-white/[0.05] backdrop-blur-md",
          "border border-white/[0.1]",
          "rounded-xl",
          "text-white text-base",
          "placeholder:text-white/40",
          // Transitions
          "transition-all duration-200 resize-y",
          // Focus state
          "focus-visible:outline-none",
          "focus:bg-white/[0.08]",
          "focus:border-[#FFE500]/50",
          "focus:ring-2 focus:ring-[#FFE500]/20",
          "focus:shadow-[0_0_16px_rgba(255,229,0,0.1)]",
          // Disabled
          "disabled:cursor-not-allowed disabled:opacity-50",
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
Textarea.displayName = "Textarea";

export { Textarea };
