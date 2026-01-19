"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#FFCC00] text-[#080808] hover:bg-[#FFD633] active:translate-y-0.5 border-2 border-[#FFCC00]",
        secondary:
          "bg-[#080808] text-[#F5F5F0] border-2 border-[#F5F5F0] hover:bg-[#F5F5F0] hover:text-[#080808]",
        accent:
          "bg-[#00E6E6] text-[#080808] hover:bg-[#33EBEB] active:translate-y-0.5 border-2 border-[#00E6E6]",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 active:translate-y-0.5 border-2 border-red-600",
        ghost:
          "text-[#F5F5F0] hover:bg-[#F5F5F0]/10 border-2 border-transparent",
        link:
          "text-[#FFCC00] underline-offset-4 hover:underline border-0",
        outline:
          "bg-transparent text-[#FFCC00] border-2 border-[#FFCC00] hover:bg-[#FFCC00] hover:text-[#080808]",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
        icon: "h-11 w-11",
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
