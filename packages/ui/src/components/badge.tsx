"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#FFCC00] text-[#080808]",
        secondary: "bg-[#F5F5F0]/10 text-[#F5F5F0] border border-[#F5F5F0]/20",
        accent: "bg-[#00E6E6] text-[#080808]",
        destructive: "bg-red-600 text-white",
        outline: "text-[#FFCC00] border-2 border-[#FFCC00]",
        success: "bg-green-600 text-white",
        // Rarity variants for gamification
        common: "bg-gray-500 text-white",
        rare: "bg-blue-500 text-white",
        epic: "bg-purple-500 text-white",
        legendary: "bg-gradient-to-r from-[#FFCC00] to-[#FF8800] text-[#080808]",
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
