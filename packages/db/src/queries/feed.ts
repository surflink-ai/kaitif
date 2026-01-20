import type { SupabaseClient } from "../client";
import type { 
  FeedPost, 
  FeedPostWithRelations, 
  FeedCommentWithRelations, 
  FeedPostType,
  FeedLike,
  FeedComment
} from "../types";

// Get feed posts (paginated)
export async function getFeedPosts(
  supabase: SupabaseClient,
  options: {
    page?: number;
    limit?: number;
    userId?: string; // To check if user liked
  } = {}
): Promise<{ posts: FeedPostWithRelations[]; nextCursor?: number }> {
  const { page = 1, limit = 20, userId } = options;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Fetch posts with author info and likes (to check if user liked)
  const { data, error } = await supabase
    .from("feed_posts")
    .select(`
      *,
      author:users (id, name, avatarUrl),
      likes:feed_likes (userId)
    `)
    .order("createdAt", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching feed posts:", error);
    return { posts: [] };
  }

  if (!data || data.length === 0) {
    return { posts: [], nextCursor: undefined };
  }

  const postIds = data.map((p: any) => p.id);
  
  // Fetch all likes and comments for these posts in parallel
  const [likesResult, commentsResult] = await Promise.all([
    supabase
      .from("feed_likes")
      .select("postId")
      .in("postId", postIds),
    supabase
      .from("feed_comments")
      .select("postId")
      .in("postId", postIds)
  ]);

  // Count likes and comments per post
  const likeCounts: Record<string, number> = {};
  const commentCounts: Record<string, number> = {};
  
  (likesResult.data || []).forEach((like: any) => {
    likeCounts[like.postId] = (likeCounts[like.postId] || 0) + 1;
  });
  
  (commentsResult.data || []).forEach((comment: any) => {
    commentCounts[comment.postId] = (commentCounts[comment.postId] || 0) + 1;
  });

  // Transform data to include user-specific state
  const posts = (data as any[]).map((post) => ({
    ...post,
    likes: post.likes || [],
    comments: [],
    _count: {
      likes: likeCounts[post.id] || 0,
      comments: commentCounts[post.id] || 0
    },
    isLiked: userId ? (post.likes || []).some((like: any) => like.userId === userId) : false
  }));

  return { 
    posts: posts as FeedPostWithRelations[], 
    nextCursor: data.length === limit ? page + 1 : undefined 
  };
}

// Create feed post
export async function createFeedPost(
  supabase: SupabaseClient,
  authorId: string,
  data: {
    content?: string;
    mediaUrl?: string;
    type: FeedPostType;
    trickTag?: string;
  }
): Promise<FeedPost | null> {
  const { data: post, error } = await (supabase as any)
    .from("feed_posts")
    .insert({
      authorId,
      ...data,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating feed post:", error);
    return null;
  }

  return post as FeedPost;
}

// Delete feed post
export async function deleteFeedPost(
  supabase: SupabaseClient,
  postId: string,
  userId: string
): Promise<boolean> {
  // Check ownership first (or if admin - handled by RLS typically, but good to check)
  const { error } = await supabase
    .from("feed_posts")
    .delete()
    .eq("id", postId)
    .eq("authorId", userId);

  if (error) {
    console.error("Error deleting feed post:", error);
    return false;
  }

  return true;
}

// Toggle like
export async function toggleLike(
  supabase: SupabaseClient,
  postId: string,
  userId: string
): Promise<{ liked: boolean; count: number }> {
  // Check if already liked
  const { data: existing } = await supabase
    .from("feed_likes")
    .select("*")
    .eq("postId", postId)
    .eq("userId", userId)
    .single();

  if (existing) {
    // Unlike
    await supabase
      .from("feed_likes")
      .delete()
      .eq("postId", postId)
      .eq("userId", userId);
      
    // Get new count
    const { count } = await supabase
      .from("feed_likes")
      .select("*", { count: "exact", head: true })
      .eq("postId", postId);
      
    return { liked: false, count: count || 0 };
  } else {
    // Like
    await (supabase as any)
      .from("feed_likes")
      .insert({ postId, userId });
      
    // Get new count
    const { count } = await supabase
      .from("feed_likes")
      .select("*", { count: "exact", head: true })
      .eq("postId", postId);
      
    return { liked: true, count: count || 0 };
  }
}

// Get post comments
export async function getPostComments(
  supabase: SupabaseClient,
  postId: string
): Promise<FeedCommentWithRelations[]> {
  const { data, error } = await supabase
    .from("feed_comments")
    .select(`
      *,
      author:users (id, name, avatarUrl)
    `)
    .eq("postId", postId)
    .order("createdAt", { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }

  return data as FeedCommentWithRelations[];
}

// Create comment
export async function createComment(
  supabase: SupabaseClient,
  postId: string,
  authorId: string,
  content: string
): Promise<FeedCommentWithRelations | null> {
  const { data, error } = await (supabase as any)
    .from("feed_comments")
    .insert({
      postId,
      authorId,
      content,
    })
    .select(`
      *,
      author:users (id, name, avatarUrl)
    `)
    .single();

  if (error) {
    console.error("Error creating comment:", error);
    return null;
  }

  return data as FeedCommentWithRelations;
}

// Delete comment
export async function deleteComment(
  supabase: SupabaseClient,
  commentId: string,
  userId: string
): Promise<boolean> {
  const { error } = await supabase
    .from("feed_comments")
    .delete()
    .eq("id", commentId)
    .eq("authorId", userId);

  if (error) {
    console.error("Error deleting comment:", error);
    return false;
  }

  return true;
}

// Activity item types for the feed
interface BadgeActivityItem {
  id: string;
  earnedAt: string;
  user: { id: string; name: string | null; avatarUrl: string | null };
  badge: { name: string; description: string; imageUrl: string; rarity: string };
}

interface ChallengeActivityItem {
  id: string;
  submittedAt: string;
  xpAwarded: number;
  user: { id: string; name: string | null; avatarUrl: string | null };
  challenge: { title: string; difficulty: string; xpReward: number };
}

interface CheckinActivityItem {
  id: string;
  checkedIn: string;
  user: { id: string; name: string | null; avatarUrl: string | null };
  event: { title: string; category: string };
}

// Get activity feed (aggregated from other tables)
export async function getActivityFeed(
  supabase: SupabaseClient,
  limit: number = 20
): Promise<any[]> {
  // In a real app with high volume, we'd probably want a dedicated activity table
  // For now, we'll fetch recent items from different tables and merge/sort them
  
  // 1. Badge earnings
  const { data: badges } = await supabase
    .from("user_badges")
    .select(`
      id,
      earnedAt,
      user:users (id, name, avatarUrl),
      badge:badges (name, description, imageUrl, rarity)
    `)
    .order("earnedAt", { ascending: false })
    .limit(limit);

  // 2. Challenge completions
  const { data: challenges } = await supabase
    .from("challenge_completions")
    .select(`
      id,
      submittedAt,
      xpAwarded,
      user:users (id, name, avatarUrl),
      challenge:challenges (title, difficulty, xpReward)
    `)
    .eq("status", "APPROVED")
    .order("submittedAt", { ascending: false })
    .limit(limit);
    
  // 3. Event check-ins
  const { data: checkins } = await supabase
    .from("event_attendances")
    .select(`
      id,
      checkedIn,
      user:users (id, name, avatarUrl),
      event:events (title, category)
    `)
    .order("checkedIn", { ascending: false })
    .limit(limit);
    
  // Transform and merge with explicit type casting
  const badgeItems = ((badges || []) as BadgeActivityItem[]).map(item => ({
    id: `badge-${item.id}`,
    type: 'BADGE_EARNED' as const,
    timestamp: new Date(item.earnedAt),
    data: item
  }));

  const challengeItems = ((challenges || []) as ChallengeActivityItem[]).map(item => ({
    id: `challenge-${item.id}`,
    type: 'CHALLENGE_COMPLETED' as const,
    timestamp: new Date(item.submittedAt),
    data: item
  }));

  const checkinItems = ((checkins || []) as CheckinActivityItem[]).map(item => ({
    id: `checkin-${item.id}`,
    type: 'EVENT_CHECKIN' as const,
    timestamp: new Date(item.checkedIn),
    data: item
  }));

  const activityItems = [...badgeItems, ...challengeItems, ...checkinItems];
  
  // Sort by timestamp desc and take limit
  return activityItems
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}
