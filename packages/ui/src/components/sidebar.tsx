"use client";

import * as React from "react";
import { cn } from "../lib/utils";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, collapsed = false, children, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen",
          "bg-[#080808] border-r-2 border-[#F5F5F0]/10",
          "transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64",
          className
        )}
        {...props}
      >
        {children}
      </aside>
    );
  }
);
Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-16 items-center border-b-2 border-[#F5F5F0]/10 px-4", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-1 flex-col gap-1 overflow-y-auto p-2", className)}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-t-2 border-[#F5F5F0]/10 p-4", className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

interface SidebarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  active?: boolean;
  collapsed?: boolean;
}

const SidebarItem = React.forwardRef<HTMLButtonElement, SidebarItemProps>(
  ({ className, icon, active, collapsed, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "flex w-full items-center gap-3 px-3 py-2.5",
          "text-sm font-bold uppercase tracking-wider text-[#F5F5F0]/60",
          "transition-colors hover:bg-[#F5F5F0]/5 hover:text-[#F5F5F0]",
          active && "bg-[#FFCC00]/10 text-[#FFCC00] border-l-2 border-[#FFCC00]",
          collapsed && "justify-center",
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {!collapsed && <span className="truncate">{children}</span>}
      </button>
    );
  }
);
SidebarItem.displayName = "SidebarItem";

export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarItem };
