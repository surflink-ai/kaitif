"use client";

import { useState } from "react";
import { Avatar } from "./avatar";
import { Card, CardContent } from "./card";
import { LikeButton } from "./like-button";
import { CommentSection } from "./comment-section";
import { MessageCircle, Share2, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "./button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "./dropdown-menu";
import { cn } from "../lib/utils";

// Local type definition to avoid cross-package dependency
interface FeedPostWithRelations {
  id: string;
  authorId: string;
  type: string;
  content: string | null;
  mediaUrl: string | null;
  trickTag: string | null;
  createdAt: string | Date;
  author?: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
  likes?: { userId: string }[];
  comments?: any[];
  _count?: {
    likes: number;
    comments: number;
  };
  isLiked?: boolean;
}

interface FeedPostCardProps {
  post: FeedPostWithRelations;
  currentUserId: string;
  onDelete?: (postId: string) => void;
}

export function FeedPostCard({ post, currentUserId, onDelete }: FeedPostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/feed/${post.id}`, { method: "DELETE" });
      if (res.ok && onDelete) {
        onDelete(post.id);
      }
    } catch (error) {
      console.error("Failed to delete post", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwner = post.authorId === currentUserId;

  return (
    <Card className="bg-[#1A1A1A] border-[#F5F5F0]/5 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Avatar
              src={post.author?.avatarUrl}
              alt={post.author?.name || "User"}
              name={post.author?.name}
            />
            <div>
              <p className="font-bold text-[#F5F5F0]">{post.author?.name || "Unknown User"}</p>
              <p className="text-xs text-[#F5F5F0]/40">
                {new Date(post.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#F5F5F0]/40 hover:text-[#F5F5F0]">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#2A2A2A] border-[#F5F5F0]/10">
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Content */}
        <div className="px-4 pb-2">
          {post.content && (
            <p className="text-[#F5F5F0] whitespace-pre-wrap mb-3">{post.content}</p>
          )}
        </div>

        {/* Media */}
        {post.mediaUrl && (
          <div className="relative aspect-video w-full bg-black mb-2">
            {/* Simple check for video vs image based on extension or metadata would be better */}
            {post.mediaUrl.match(/\.(mp4|mov|webm)$/i) ? (
              <video 
                src={post.mediaUrl} 
                controls 
                className="h-full w-full object-cover" 
                poster={post.mediaUrl + "?thumb=true"} // If we had thumbnail generation
              />
            ) : (
              <img 
                src={post.mediaUrl} 
                alt="Post media" 
                className="h-full w-full object-cover"
              />
            )}
          </div>
        )}

        {/* Trick Tag */}
        {post.trickTag && (
          <div className="px-4 pb-2">
            <span className="inline-block bg-[#FFCC00]/10 text-[#FFCC00] text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
              {post.trickTag}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#F5F5F0]/5">
          <div className="flex items-center gap-6">
            <LikeButton
              initialLiked={(post as any).isLiked}
              initialCount={post._count?.likes || 0}
              postId={post.id}
            />
            
            <button
              onClick={() => setShowComments(!showComments)}
              className={cn(
                "flex items-center gap-1.5 transition-colors",
                showComments ? "text-[#FFCC00]" : "text-[#F5F5F0]/60 hover:text-[#FFCC00]"
              )}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{post._count?.comments || 0}</span>
            </button>
          </div>
          
          <Button variant="ghost" size="icon" className="text-[#F5F5F0]/40 hover:text-[#F5F5F0]">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="px-4 pb-4">
            <CommentSection 
              postId={post.id} 
              initialCount={post._count?.comments || 0}
              currentUserId={currentUserId}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
