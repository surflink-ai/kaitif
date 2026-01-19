import type { SupabaseClient } from "../client";
import type { Challenge, ChallengeCompletion, ChallengeDifficulty, User, Badge, UserBadge } from "../types";

// Get challenges
export async function getChallenges(
  supabase: SupabaseClient,
  difficulty?: ChallengeDifficulty
): Promise<(Challenge & { completions: { count: number }[] })[]> {
  let query = supabase
    .from("challenges")
    .select(`
      *,
      completions:challenge_completions(count)
    `)
    .eq("isActive", true);

  if (difficulty && difficulty !== ("ALL" as any)) {
    query = query.eq("difficulty", difficulty);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching challenges:", error);
    return [];
  }

  return data;
}

// Get active challenges (alias for getChallenges)
export async function getActiveChallenges(
  supabase: SupabaseClient
): Promise<(Challenge & { completions: { count: number }[] })[]> {
  return getChallenges(supabase);
}

// Get challenge by ID
export async function getChallengeById(
  supabase: SupabaseClient,
  challengeId: string
): Promise<Challenge | null> {
  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", challengeId)
    .single();

  if (error) {
    console.error("Error fetching challenge:", error);
    return null;
  }
  return data;
}

// Create challenge
export async function createChallenge(
  supabase: SupabaseClient,
  challenge: Omit<Challenge, "id" | "createdAt" | "updatedAt">
): Promise<Challenge | null> {
  const { data, error } = await (supabase as any)
    .from("challenges")
    .insert(challenge)
    .select()
    .single();

  if (error) {
    console.error("Error creating challenge:", error);
    return null;
  }
  return data as Challenge;
}

// Update challenge
export async function updateChallenge(
  supabase: SupabaseClient,
  challengeId: string,
  updates: Partial<Challenge>
): Promise<Challenge | null> {
  const { data, error } = await (supabase as any)
    .from("challenges")
    .update(updates)
    .eq("id", challengeId)
    .select()
    .single();

  if (error) {
    console.error("Error updating challenge:", error);
    return null;
  }
  return data as Challenge;
}

// Get user completions
export async function getUserCompletions(
  supabase: SupabaseClient,
  userId: string
): Promise<ChallengeCompletion[]> {
  const { data, error } = await supabase
    .from("challenge_completions")
    .select("*")
    .eq("userId", userId);

  if (error) {
    console.error("Error fetching user completions:", error);
    return [];
  }

  return data;
}

// Get user challenge completions (alias)
export const getUserChallengeCompletions = getUserCompletions;

// Submit challenge completion
export async function submitChallengeCompletion(
  supabase: SupabaseClient,
  userId: string,
  challengeId: string,
  videoUrl: string
): Promise<ChallengeCompletion | null> {
  // Check if already submitted
  const { data: existing } = await (supabase as any)
    .from("challenge_completions")
    .select("*")
    .eq("userId", userId)
    .eq("challengeId", challengeId)
    .single();

  if (existing) {
    const { data, error } = await (supabase as any)
      .from("challenge_completions")
      .update({
        videoUrl,
        status: "PENDING",
        submittedAt: new Date().toISOString(),
      })
      .eq("id", (existing as ChallengeCompletion).id)
      .select()
      .single();
      
    if (error) return null;
    return data as ChallengeCompletion;
  }

  const { data, error } = await (supabase as any)
    .from("challenge_completions")
    .insert({
      userId,
      challengeId,
      videoUrl,
      status: "PENDING",
    })
    .select()
    .single();

  if (error) {
    console.error("Error submitting challenge:", error);
    return null;
  }

  return data;
}

// Review completion
export async function reviewChallengeCompletion(
  supabase: SupabaseClient,
  completionId: string,
  status: "APPROVED" | "REJECTED",
  reviewerId: string,
  xpAwarded: number = 0
): Promise<ChallengeCompletion | null> {
  const { data, error } = await (supabase as any)
    .from("challenge_completions")
    .update({
      status,
      reviewerId,
      reviewedAt: new Date().toISOString(),
      xpAwarded,
    })
    .eq("id", completionId)
    .select()
    .single();

  if (error) {
    console.error("Error reviewing completion:", error);
    return null;
  }
  return data as ChallengeCompletion;
}

// Get pending completions
export async function getPendingCompletions(
  supabase: SupabaseClient
): Promise<(ChallengeCompletion & { user: User; challenge: Challenge })[]> {
  const { data, error } = await supabase
    .from("challenge_completions")
    .select(`
      *,
      user:users(*),
      challenge:challenges(*)
    `)
    .eq("status", "PENDING");

  if (error) {
    console.error("Error fetching pending completions:", error);
    return [];
  }
  return data as (ChallengeCompletion & { user: User; challenge: Challenge })[];
}

// Get challenge leaderboard (users with most completions)
export async function getChallengeLeaderboard(
  supabase: SupabaseClient,
  limit: number = 10
): Promise<{ user: User; count: number }[]> {
  // This is a complex query, simplifying for now
  // In real app, might need a view or RPC
  return []; 
}

// Get badges
export async function getUserBadges(
  supabase: SupabaseClient,
  userId: string
): Promise<(UserBadge & { badge: Badge })[]> {
  const { data, error } = await supabase
    .from("user_badges")
    .select(`
      *,
      badge:badges (*)
    `)
    .eq("userId", userId);

  if (error) {
    console.error("Error fetching badges:", error);
    return [];
  }

  return data as (UserBadge & { badge: Badge })[];
}

// Get all badges
export async function getAllBadges(
  supabase: SupabaseClient
): Promise<Badge[]> {
  const { data, error } = await supabase.from("badges").select("*");
  if (error) return [];
  return data;
}

// Award badge
export async function awardBadge(
  supabase: SupabaseClient,
  userId: string,
  badgeId: string
): Promise<UserBadge | null> {
  const { data, error } = await (supabase as any)
    .from("user_badges")
    .insert({ userId, badgeId })
    .select()
    .single();
  
  if (error) return null;
  return data as UserBadge;
}

// Create badge
export async function createBadge(
  supabase: SupabaseClient,
  badge: Omit<Badge, "id" | "createdAt">
): Promise<Badge | null> {
  const { data, error } = await (supabase as any)
    .from("badges")
    .insert(badge)
    .select()
    .single();
    
  if (error) return null;
  return data as Badge;
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

// Get all challenges for admin (including inactive)
export async function getAllChallengesAdmin(
  supabase: SupabaseClient,
  options: {
    page?: number;
    limit?: number;
    search?: string;
    difficulty?: ChallengeDifficulty;
    active?: boolean;
  } = {}
): Promise<{ challenges: (Challenge & { completions: { count: number }[] })[]; count: number }> {
  const { page = 1, limit = 20, search, difficulty, active } = options;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("challenges")
    .select(`
      *,
      completions:challenge_completions(count)
    `, { count: "exact" });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (difficulty) {
    query = query.eq("difficulty", difficulty);
  }

  if (active !== undefined) {
    query = query.eq("isActive", active);
  }

  query = query
    .range(from, to)
    .order("createdAt", { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching challenges for admin:", error);
    return { challenges: [], count: 0 };
  }

  return { challenges: data, count: count || 0 };
}

// Toggle challenge active status
export async function toggleChallengeActive(
  supabase: SupabaseClient,
  challengeId: string,
  isActive: boolean
): Promise<Challenge | null> {
  const { data, error } = await (supabase as any)
    .from("challenges")
    .update({ isActive })
    .eq("id", challengeId)
    .select()
    .single();

  if (error) {
    console.error("Error toggling challenge active:", error);
    return null;
  }

  return data as Challenge;
}

// Get challenge completion stats
export async function getChallengeStats(
  supabase: SupabaseClient
): Promise<{
  totalChallenges: number;
  activeChallenges: number;
  pendingSubmissions: number;
  totalCompletions: number;
}> {
  const { count: totalChallenges } = await supabase
    .from("challenges")
    .select("*", { count: "exact", head: true });

  const { count: activeChallenges } = await supabase
    .from("challenges")
    .select("*", { count: "exact", head: true })
    .eq("isActive", true);

  const { count: pendingSubmissions } = await supabase
    .from("challenge_completions")
    .select("*", { count: "exact", head: true })
    .eq("status", "PENDING");

  const { count: totalCompletions } = await supabase
    .from("challenge_completions")
    .select("*", { count: "exact", head: true })
    .eq("status", "APPROVED");

  return {
    totalChallenges: totalChallenges || 0,
    activeChallenges: activeChallenges || 0,
    pendingSubmissions: pendingSubmissions || 0,
    totalCompletions: totalCompletions || 0,
  };
}
