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
          // Glass effect
          "bg-[#0A0A0F]/80 backdrop-blur-2xl",
          "border-t border-white/[0.08]",
          // Inner highlight
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
          // Safe area padding for home indicator
          "pb-[env(safe-area-inset-bottom)]",
          // Hide on desktop
          "md:hidden",
          className
        )}
        {...props}
      >
        {/* Ambient glow at top */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Min height 49pt matches iOS tab bar */}
        <div className="flex h-[56px] items-center justify-evenly px-4 py-1">
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
          "relative flex flex-col items-center justify-center gap-1",
          "h-[48px] w-[64px]",
          "rounded-xl",
          // Colors and transitions
          "text-white/40 transition-all duration-200",
          // Hover/tap state
          "hover:text-white/60",
          "active:scale-95",
          // Active state with glow
          active && [
            "text-[#FFE500]",
            "bg-[#FFE500]/10",
          ],
          className
        )}
        {...props}
      >
        <span className="relative">
          {icon}
          {badge !== undefined && badge > 0 && (
            <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FFE500] px-1 text-[10px] font-bold text-[#0A0A0F] shadow-[0_0_8px_rgba(255,229,0,0.5)]">
              {badge > 99 ? "99+" : badge}
            </span>
          )}
        </span>
        <span className={cn(
          "text-[10px] font-medium",
          active ? "text-[#FFE500]" : "text-white/40"
        )}>
          {label}
        </span>
        
        {/* Active indicator dot */}
        {active && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FFE500] shadow-[0_0_6px_rgba(255,229,0,0.8)]" />
        )}
      </button>
    );
  }
);
BottomDockItem.displayName = "BottomDockItem";

export { BottomDock, BottomDockItem };
