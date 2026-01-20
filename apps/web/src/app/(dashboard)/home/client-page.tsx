"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { FeedPostCard, FeedActivityCard, CreatePostForm, Button, useToast } from "@kaitif/ui";
import { Loader2 } from "lucide-react";
import { useRealtimeTable } from "@/lib/hooks/use-realtime";
import { createClient } from "@/lib/supabase/client";

interface FeedPost {
  id: string;
  authorId: string;
  type: string;
  content: string | null;
  mediaUrl: string | null;
  trickTag: string | null;
  createdAt: string;
  updatedAt: string;
}

interface FeedLike {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
}

interface FeedComment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

interface ClientFeedProps {
  userId: string;
}

export default function ClientFeed({ userId }: ClientFeedProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);
  const supabase = createClient();
  const { toast } = useToast();

  const fetchFeed = useCallback(async (pageNum: number) => {
    try {
      const res = await fetch(`/api/feed?page=${pageNum}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        
        if (pageNum === 1) {
          setItems(data.items);
        } else {
          setItems(prev => [...prev, ...data.items]);
        }
        
        if (!data.nextCursor || data.items.length === 0) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch feed", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed(1);
  }, [fetchFeed]);

  // Realtime: Subscribe to new posts
  useRealtimeTable<FeedPost>({
    table: "feed_posts",
    onInsert: async (newPost) => {
      // Don't add our own posts (already handled optimistically)
      if (newPost.authorId === userId) return;
      
      // Fetch the full post with author info
      const { data: fullPost } = await supabase
        .from("feed_posts")
        .select("*, author:users(id, name, avatar)")
        .eq("id", newPost.id)
        .single();
      
      if (fullPost) {
        const postData = fullPost as FeedPost & { author?: { name?: string } };
        setItems(prev => [{ type: "POST", data: postData }, ...prev]);
        toast({
          title: "New Post",
          description: `${postData.author?.name || "Someone"} just posted`,
        });
      }
    },
    onDelete: (oldPost) => {
      setItems(prev => prev.filter(item => 
        !(item.type === "POST" && item.data.id === oldPost.id)
      ));
    },
  });

  // Realtime: Subscribe to likes
  useRealtimeTable<FeedLike>({
    table: "feed_likes",
    onInsert: (newLike) => {
      // Update the like count for the post
      setItems(prev => prev.map(item => {
        if (item.type === "POST" && item.data.id === newLike.postId) {
          const currentLikes = item.data._count?.likes || item.data.likes?.length || 0;
          const isLikedByMe = item.data.isLikedByMe || newLike.userId === userId;
          return {
            ...item,
            data: {
              ...item.data,
              _count: { ...item.data._count, likes: currentLikes + 1 },
              isLikedByMe: newLike.userId === userId ? true : item.data.isLikedByMe,
            },
          };
        }
        return item;
      }));
    },
    onDelete: (oldLike) => {
      setItems(prev => prev.map(item => {
        if (item.type === "POST" && item.data.id === oldLike.postId) {
          const currentLikes = item.data._count?.likes || item.data.likes?.length || 0;
          return {
            ...item,
            data: {
              ...item.data,
              _count: { ...item.data._count, likes: Math.max(0, currentLikes - 1) },
              isLikedByMe: oldLike.userId === userId ? false : item.data.isLikedByMe,
            },
          };
        }
        return item;
      }));
    },
  });

  // Realtime: Subscribe to comments
  useRealtimeTable<FeedComment>({
    table: "feed_comments",
    onInsert: async (newComment) => {
      // Update the comment count and add the comment to the post
      const { data: fullComment } = await supabase
        .from("feed_comments")
        .select("*, author:users(id, name, avatar)")
        .eq("id", newComment.id)
        .single();

      setItems(prev => prev.map(item => {
        if (item.type === "POST" && item.data.id === newComment.postId) {
          const currentComments = item.data._count?.comments || item.data.comments?.length || 0;
          const existingComments = item.data.comments || [];
          return {
            ...item,
            data: {
              ...item.data,
              _count: { ...item.data._count, comments: currentComments + 1 },
              comments: fullComment 
                ? [...existingComments, fullComment]
                : existingComments,
            },
          };
        }
        return item;
      }));
    },
  });

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => {
            const newPage = prev + 1;
            fetchFeed(newPage);
            return newPage;
          });
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading, fetchFeed]);

  const handlePostCreated = (post: any) => {
    // Optimistically add new post to top
    setItems(prev => [
      { type: 'POST', data: { ...post, author: { 
        id: userId, 
        // We might not have full user data here, typically fetched or passed down
        // For now relying on what API returns or refreshing
      } } },
      ...prev
    ]);
    // Re-fetch page 1 to ensure correct data
    fetchFeed(1);
  };

  const handlePostDeleted = (postId: string) => {
    setItems(prev => prev.filter(item => 
      !(item.type === 'POST' && item.data.id === postId)
    ));
  };

  return (
    <>
      <div className="space-y-6">
        {items.map((item, i) => (
          <div key={item.data.id || i}>
            {item.type === "POST" ? (
              <FeedPostCard 
                post={item.data} 
                currentUserId={userId} 
                onDelete={handlePostDeleted}
              />
            ) : (
              <FeedActivityCard item={item.data} />
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.05] backdrop-blur-sm">
              <Loader2 className="h-5 w-5 animate-spin text-[#FFE500]" />
              <span className="text-sm text-white/60">Loading...</span>
            </div>
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.05] mb-4">
              <span className="text-3xl">🛹</span>
            </div>
            <p className="text-white/60 mb-2">No activity yet</p>
            <p className="text-sm text-white/40">Be the first to post!</p>
          </div>
        )}

        <div ref={observerTarget} className="h-4" />
      </div>

      <CreatePostForm onPostCreated={handlePostCreated} />
    </>
  );
}
