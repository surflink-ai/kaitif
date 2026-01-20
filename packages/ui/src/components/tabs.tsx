"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      // Glass container
      "inline-flex h-12 items-center gap-1 p-1",
      "bg-white/[0.05] backdrop-blur-lg",
      "border border-white/[0.08]",
      "rounded-2xl",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base
      "inline-flex items-center justify-center whitespace-nowrap px-4 py-2",
      "text-sm font-medium text-white/60",
      "rounded-xl",
      // Transitions
      "transition-all duration-200",
      // Focus
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE500]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]",
      // Disabled
      "disabled:pointer-events-none disabled:opacity-50",
      // Hover (inactive)
      "hover:text-white/80 hover:bg-white/[0.05]",
      // Active state
      "data-[state=active]:bg-[#FFE500] data-[state=active]:text-[#0A0A0F]",
      "data-[state=active]:shadow-[0_0_16px_rgba(255,229,0,0.3)]",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE500]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]",
      // Animation
      "data-[state=active]:animate-fade-in",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
