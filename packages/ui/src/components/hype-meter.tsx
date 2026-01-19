"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Flame } from "lucide-react";

interface HypeMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const HypeMeter = React.forwardRef<HTMLDivElement, HypeMeterProps>(
  ({ className, value, showLabel = true, size = "md", ...props }, ref) => {
    const clampedValue = Math.min(100, Math.max(0, value));

    const sizes = {
      sm: { height: "h-2", icon: "h-4 w-4", text: "text-xs" },
      md: { height: "h-3", icon: "h-5 w-5", text: "text-sm" },
      lg: { height: "h-4", icon: "h-6 w-6", text: "text-base" },
    };

    const getColor = (val: number) => {
      if (val >= 80) return "bg-red-500";
      if (val >= 60) return "bg-orange-500";
      if (val >= 40) return "bg-[#FFCC00]";
      if (val >= 20) return "bg-yellow-300";
      return "bg-[#F5F5F0]/30";
    };

    const getFlameColor = (val: number) => {
      if (val >= 80) return "text-red-500";
      if (val >= 60) return "text-orange-500";
      if (val >= 40) return "text-[#FFCC00]";
      return "text-[#F5F5F0]/40";
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        {React.createElement(Flame as any, { className: cn(sizes[size].icon, getFlameColor(clampedValue)) })}
        <div className="flex-1">
          <div className={cn("w-full bg-[#F5F5F0]/10 overflow-hidden", sizes[size].height)}>
            <div
              className={cn(
                "h-full transition-all duration-500 ease-out",
                getColor(clampedValue),
                clampedValue >= 80 && "animate-pulse"
              )}
              style={{ width: `${clampedValue}%` }}
            />
          </div>
        </div>
        {showLabel && (
          <span className={cn("font-bold text-[#F5F5F0]", sizes[size].text)}>
            {clampedValue}%
          </span>
        )}
      </div>
    );
  }
);
HypeMeter.displayName = "HypeMeter";

export { HypeMeter };
