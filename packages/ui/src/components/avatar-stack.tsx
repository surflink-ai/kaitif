"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { Avatar } from "./avatar";

interface AvatarStackProps extends React.HTMLAttributes<HTMLDivElement> {
  users: { name?: string | null; avatarUrl?: string | null }[];
  max?: number;
  size?: "sm" | "md" | "lg";
}

const AvatarStack = React.forwardRef<HTMLDivElement, AvatarStackProps>(
  ({ className, users, max = 4, size = "sm", ...props }, ref) => {
    // Filter out null/undefined users to prevent errors
    const validUsers = users.filter((u): u is { name?: string | null; avatarUrl?: string | null } => u != null);
    const visibleUsers = validUsers.slice(0, max);
    const remainingCount = validUsers.length - max;

    const sizes = {
      sm: "h-8 w-8 text-xs -ml-3 first:ml-0",
      md: "h-10 w-10 text-sm -ml-4 first:ml-0",
      lg: "h-14 w-14 text-base -ml-5 first:ml-0",
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-center", className)}
        {...props}
      >
        {visibleUsers.map((user, index) => (
          <Avatar
            key={index}
            src={user.avatarUrl}
            name={user.name}
            size={size}
            className={cn(sizes[size], "ring-2 ring-[#080808]")}
          />
        ))}
        {remainingCount > 0 && (
          <div
            className={cn(
              "flex items-center justify-center bg-[#F5F5F0]/10 border-2 border-[#F5F5F0]/20",
              "font-bold text-[#F5F5F0]",
              "ring-2 ring-[#080808]",
              sizes[size]
            )}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    );
  }
);
AvatarStack.displayName = "AvatarStack";

export { AvatarStack };
