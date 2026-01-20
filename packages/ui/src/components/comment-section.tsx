"use client";

import { useState, useEffect } from "react";
import { Avatar } from "./avatar";
import { Button } from "./button";
import { Input } from "./input";
import { Send, Trash2 } from "lucide-react";

// Local type definition to avoid cross-package dependency
interface FeedCommentWithRelations {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string | Date;
  author?: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
}

interface CommentSectionProps {
  postId: string;
  initialCount: number;
  currentUserId: string;
}

export function CommentSection({
  postId,
  initialCount,
  currentUserId,
}: CommentSectionProps) {
  const [comments, setComments] = useState<FeedCommentWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [count, setCount] = useState(initialCount);

  const fetchComments = async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/feed/${postId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
        setLoaded(true);
      }
    } catch (error) {
      console.error("Failed to load comments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/feed/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        const comment = await res.json();
        setComments((prev) => [...prev, comment]);
        setNewComment("");
        setCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const res = await fetch(`/api/feed/${postId}/comments/${commentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        setCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  // Only load comments when expanded (handled by parent or state)
  // For this component, we'll assume it's shown when rendered
  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="space-y-4 pt-4 border-t border-[#F5F5F0]/10">
      {/* Comments List */}
      <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
        {loading ? (
          <div className="text-center text-sm text-[#F5F5F0]/40 py-2">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center text-sm text-[#F5F5F0]/40 py-2">No comments yet. Be the first!</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group">
              <Avatar
                src={comment.author?.avatarUrl}
                alt={comment.author?.name || "User"}
                name={comment.author?.name}
                size="sm"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#F5F5F0]">
                    {comment.author?.name || "Unknown User"}
                  </span>
                  <span className="text-xs text-[#F5F5F0]/40">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-[#F5F5F0]/80">{comment.content}</p>
                
                {comment.authorId === currentUserId && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-1"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-[#F5F5F0]/5 border-none focus:ring-1 focus:ring-[#FFCC00]/50"
          disabled={submitting}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!newComment.trim() || submitting}
          variant="ghost"
          className="text-[#FFCC00] hover:text-[#FFCC00]/80 hover:bg-[#FFCC00]/10"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
