"use client";

import { Heart } from "lucide-react";
import { cn } from "../lib/utils";
import { useState } from "react";

interface LikeButtonProps {
  initialLiked: boolean;
  initialCount: number;
  postId: string;
  onLikeToggle?: (postId: string, newLiked: boolean) => Promise<void>;
  className?: string;
}

export function LikeButton({
  initialLiked,
  initialCount,
  postId,
  onLikeToggle,
  className,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;

    const newLiked = !liked;
    setLiked(newLiked);
    setCount(newLiked ? count + 1 : count - 1);
    setLoading(true);

    try {
      if (onLikeToggle) {
        await onLikeToggle(postId, newLiked);
      } else {
        // Default implementation if no handler provided
        await fetch(`/api/feed/${postId}/like`, { method: "POST" });
      }
    } catch (error) {
      // Revert on error
      setLiked(!newLiked);
      setCount(initialCount);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "flex items-center gap-1.5 transition-colors group",
        liked ? "text-red-500" : "text-[#F5F5F0]/60 hover:text-red-500",
        className
      )}
      disabled={loading}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all active:scale-95",
          liked && "fill-current"
        )}
      />
      <span className="text-sm font-medium">{count}</span>
    </button>
  );
}
