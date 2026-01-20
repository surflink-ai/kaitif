"use client";

import * as React from "react";
import { cn } from "../lib/utils";

interface BottomDockProps extends React.HTMLAttributes<HTMLDivElement> {}

const BottomDock = React.forwardRef<HTMLDivElement, BottomDockProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="Main navigation"
        className={cn(
          // Positioning
          "fixed bottom-0 left-0 right-0 z-50",
          // Background with backdrop blur for modern iOS feel
          "bg-[#080808]/90 backdrop-blur-lg",
          "border-t border-[#F5F5F0]/10",
          // Safe area padding for home indicator
          "pb-[env(safe-area-inset-bottom)]",
          // Hide on desktop
          "md:hidden",
          className
        )}
        {...props}
      >
        {/* Min height 49pt matches iOS tab bar, content area for touch targets */}
        <div className="flex h-[52px] items-center justify-evenly px-4 py-1">
          {children}
        </div>
      </nav>
    );
  }
);
BottomDock.displayName = "BottomDock";

interface BottomDockItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
}

const BottomDockItem = React.forwardRef<HTMLButtonElement, BottomDockItemProps>(
  ({ className, icon, label, active, badge, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        className={cn(
          // Full touch target - minimum 44pt per Apple HIG
          "relative flex flex-col items-center justify-center gap-0.5",
          "h-[44px] w-[64px]",
          // Colors and transitions
          "text-[#F5F5F0]/50 transition-all duration-150",
          // Active state
          active && "text-[#FFCC00]",
          // Press/tap state feedback
          "active:scale-95 active:opacity-70",
          className
        )}
        {...props}
      >
        <span className="relative">
          {icon}
          {badge !== undefined && badge > 0 && (
            <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FFCC00] px-1 text-[10px] font-bold text-[#080808]">
              {badge > 99 ? "99+" : badge}
            </span>
          )}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider">
          {label}
        </span>
      </button>
    );
  }
);
BottomDockItem.displayName = "BottomDockItem";

export { BottomDock, BottomDockItem };
