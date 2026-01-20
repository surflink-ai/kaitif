"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  // Base - pill shape with glass effect
  "inline-flex items-center px-3 py-1 text-xs font-medium rounded-full transition-colors",
  {
    variants: {
      variant: {
        // Default - Electric yellow
        default: "bg-[#FFE500] text-[#0A0A0F] shadow-[0_0_12px_rgba(255,229,0,0.3)]",
        // Secondary - Glass
        secondary: "bg-white/[0.1] text-white/80 border border-white/[0.1] backdrop-blur-sm",
        // Accent - Cyan
        accent: "bg-[#00E6E6] text-[#0A0A0F] shadow-[0_0_12px_rgba(0,230,230,0.3)]",
        // Destructive
        destructive: "bg-red-500/20 text-red-400 border border-red-500/30",
        // Outline
        outline: "bg-transparent text-[#FFE500] border border-[#FFE500]/50",
        // Success
        success: "bg-green-500/20 text-green-400 border border-green-500/30",
        // Warning
        warning: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
        // Live indicator
        live: [
          "bg-[#FFE500] text-[#0A0A0F]",
          "shadow-[0_0_12px_rgba(255,229,0,0.4)]",
          "animate-pulse-glow",
        ],
        // Rarity variants for gamification
        common: "bg-white/[0.1] text-white/70 border border-white/[0.1]",
        rare: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
        epic: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
        legendary: [
          "bg-gradient-to-r from-[#FFE500]/20 to-[#FF8800]/20",
          "text-[#FFE500]",
          "border border-[#FFE500]/30",
          "shadow-[0_0_16px_rgba(255,229,0,0.2)]",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
