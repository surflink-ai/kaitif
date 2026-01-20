"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE500]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary - Electric yellow with glow
        default: [
          "bg-[#FFE500] text-[#0A0A0F]",
          "rounded-full",
          "shadow-[0_0_20px_rgba(255,229,0,0.3)]",
          "hover:shadow-[0_0_30px_rgba(255,229,0,0.5)]",
          "hover:scale-[1.02]",
          "active:scale-[0.98]",
        ],
        // Secondary - Glass outline
        secondary: [
          "bg-white/[0.05] text-white backdrop-blur-md",
          "border border-white/[0.15]",
          "rounded-full",
          "hover:bg-white/[0.1] hover:border-white/[0.25]",
          "active:scale-[0.98]",
        ],
        // Accent - Cyan
        accent: [
          "bg-[#00E6E6] text-[#0A0A0F]",
          "rounded-full",
          "shadow-[0_0_20px_rgba(0,230,230,0.3)]",
          "hover:shadow-[0_0_30px_rgba(0,230,230,0.5)]",
          "hover:scale-[1.02]",
          "active:scale-[0.98]",
        ],
        // Destructive - Red with glow
        destructive: [
          "bg-red-500 text-white",
          "rounded-full",
          "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
          "hover:bg-red-600",
          "hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]",
          "active:scale-[0.98]",
        ],
        // Ghost - Transparent with hover glass
        ghost: [
          "text-white/70 rounded-xl",
          "hover:bg-white/[0.08] hover:text-white",
          "active:scale-[0.98]",
        ],
        // Link style
        link: [
          "text-[#FFE500] underline-offset-4",
          "hover:underline hover:text-[#FFE500]/80",
        ],
        // Outline - Yellow border
        outline: [
          "bg-transparent text-[#FFE500]",
          "border border-[#FFE500]/50",
          "rounded-full",
          "hover:bg-[#FFE500]/10 hover:border-[#FFE500]",
          "active:scale-[0.98]",
        ],
        // Glass variant - for overlays
        glass: [
          "bg-white/[0.1] text-white backdrop-blur-xl",
          "border border-white/[0.15]",
          "rounded-xl",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]",
          "hover:bg-white/[0.15] hover:border-white/[0.25]",
          "active:scale-[0.98]",
        ],
      },
      size: {
        default: "h-11 px-6 py-2 text-sm",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
