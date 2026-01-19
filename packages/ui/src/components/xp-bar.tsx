"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Zap } from "lucide-react";

interface XPBarProps extends React.HTMLAttributes<HTMLDivElement> {
  currentXP: number;
  requiredXP: number;
  level: number;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
}

const XPBar = React.forwardRef<HTMLDivElement, XPBarProps>(
  ({ className, currentXP, requiredXP, level, showDetails = true, size = "md", ...props }, ref) => {
    const progress = Math.min((currentXP / requiredXP) * 100, 100);

    const sizes = {
      sm: { bar: "h-2", badge: "h-6 w-6 text-xs", text: "text-xs" },
      md: { bar: "h-3", badge: "h-8 w-8 text-sm", text: "text-sm" },
      lg: { bar: "h-4", badge: "h-10 w-10 text-base", text: "text-base" },
    };

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        <div className="flex items-center gap-3">
          {/* Level Badge */}
          <div
            className={cn(
              "flex items-center justify-center bg-[#FFCC00] font-bold text-[#080808]",
              sizes[size].badge
            )}
          >
            {level}
          </div>

          {/* Progress Bar */}
          <div className="flex-1">
            <div className={cn("w-full bg-[#F5F5F0]/10 overflow-hidden", sizes[size].bar)}>
              <div
                className="h-full bg-gradient-to-r from-[#FFCC00] to-[#00E6E6] transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* XP Display */}
          {showDetails && (
            <div className={cn("flex items-center gap-1 font-bold text-[#F5F5F0]", sizes[size].text)}>
              {React.createElement(Zap as any, { className: "h-4 w-4 text-[#FFCC00]" })}
              <span>{currentXP}</span>
              <span className="text-[#F5F5F0]/40">/ {requiredXP}</span>
            </div>
          )}
        </div>

        {/* Level info */}
        {showDetails && (
          <div className="flex items-center justify-between text-xs text-[#F5F5F0]/60">
            <span>Level {level}</span>
            <span>{Math.round(progress)}% to Level {level + 1}</span>
          </div>
        )}
      </div>
    );
  }
);
XPBar.displayName = "XPBar";

export { XPBar };
