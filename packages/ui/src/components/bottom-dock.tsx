"use client";

import * as React from "react";
import { cn } from "../lib/utils";

interface BottomDockProps extends React.HTMLAttributes<HTMLDivElement> {}

const BottomDock = React.forwardRef<HTMLDivElement, BottomDockProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          "bg-[#080808] border-t-2 border-[#F5F5F0]/10",
          "safe-area-inset-bottom",
          "md:hidden",
          className
        )}
        {...props}
      >
        <div className="flex h-16 items-center justify-around px-2">
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
        className={cn(
          "relative flex flex-1 flex-col items-center justify-center gap-1 py-2",
          "text-[#F5F5F0]/60 transition-colors",
          active && "text-[#FFCC00]",
          className
        )}
        {...props}
      >
        <span className="relative">
          {icon}
          {badge !== undefined && badge > 0 && (
            <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center bg-[#FFCC00] px-1 text-[10px] font-bold text-[#080808]">
              {badge > 99 ? "99+" : badge}
            </span>
          )}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </button>
    );
  }
);
BottomDockItem.displayName = "BottomDockItem";

export { BottomDock, BottomDockItem };
