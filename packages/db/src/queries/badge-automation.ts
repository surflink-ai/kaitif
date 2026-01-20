import type { SupabaseClient } from "../client";
import type { Badge, UserBadge, User } from "../types";
import { BADGE_CRITERIA } from "../constants";

interface BadgeCriteria {
  type: string;
  count?: number;
  days?: number;
  before?: string;
}

/**
 * Check and award badges for a user based on their activity
 * Call this after relevant actions (check-in, challenge completion, etc.)
 */
export async function checkAndAwardBadges(
  supabase: SupabaseClient,
  userId: string
): Promise<Badge[]> {
  const awardedBadges: Badge[] = [];

  // Get user's current stats
  const userStats = await getUserStats(supabase, userId);
  if (!userStats) return awardedBadges;

  // Get user's existing badges
  const { data: existingBadges } = await supabase
    .from("user_badges")
    .select("badgeId")
    .eq("userId", userId);

  const existingBadgeIds = new Set(
    (existingBadges || []).map((b: any) => b.badgeId)
  );

  // Get all badges
  const { data: allBadges } = await supabase.from("badges").select("*");
  if (!allBadges) return awardedBadges;

  // Check each badge
  for (const badge of allBadges as Badge[]) {
    // Skip if user already has this badge
    if (existingBadgeIds.has(badge.id)) continue;

    // Parse criteria
    let criteria: BadgeCriteria;
    try {
      criteria = JSON.parse(badge.criteria);
    } catch {
      continue;
    }

    // Check if user qualifies
    const qualifies = checkBadgeCriteria(criteria, userStats);

    if (qualifies) {
      // Award the badge
      const { error } = await (supabase as any)
        .from("user_badges")
        .insert({ userId, badgeId: badge.id });

      if (!error) {
        awardedBadges.push(badge);
      }
    }
  }

  return awardedBadges;
}

/**
 * Get user's stats for badge checking
 */
async function getUserStats(supabase: SupabaseClient, userId: string) {
  // Get user
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (!user) return null;

  // Count pass scans (visits)
  const { count: visitCount } = await supabase
    .from("pass_scans")
    .select("*", { count: "exact", head: true })
    .in(
      "passId",
      (
        await supabase.from("passes").select("id").eq("userId", userId)
      ).data?.map((p: any) => p.id) || []
    );

  // Count approved challenge completions
  const { count: challengeCount } = await supabase
    .from("challenge_completions")
    .select("*", { count: "exact", head: true })
    .eq("userId", userId)
    .eq("status", "APPROVED");

  // Count event attendances
  const { count: eventCount } = await supabase
    .from("event_attendances")
    .select("*", { count: "exact", head: true })
    .eq("userId", userId);

  // Count completed sales
  const { count: salesCount } = await supabase
    .from("transactions")
    .select("*", { count: "exact", head: true })
    .eq("sellerId", userId)
    .eq("status", "COMPLETED");

  // Check for competition wins (would need a competition_results table, simplified here)
  const competitionWins = 0;

  return {
    user: user as User,
    visits: visitCount || 0,
    streak: (user as User).streak || 0,
    challenges: challengeCount || 0,
    events: eventCount || 0,
    sales: salesCount || 0,
    competitionWins,
    joinDate: new Date((user as User).createdAt),
  };
}

/**
 * Check if a user meets badge criteria
 */
function checkBadgeCriteria(
  criteria: BadgeCriteria,
  stats: NonNullable<Awaited<ReturnType<typeof getUserStats>>>
): boolean {
  switch (criteria.type) {
    case "visits":
      return stats.visits >= (criteria.count || 0);

    case "streak":
      return stats.streak >= (criteria.days || 0);

    case "challenges":
      return stats.challenges >= (criteria.count || 0);

    case "events":
      return stats.events >= (criteria.count || 0);

    case "sales":
      return stats.sales >= (criteria.count || 0);

    case "competition_win":
      return stats.competitionWins >= (criteria.count || 0);

    case "join_date":
      if (!criteria.before) return false;
      return stats.joinDate < new Date(criteria.before);

    default:
      return false;
  }
}

/**
 * Check badges for a specific action type
 * More efficient than checking all badges
 */
export async function checkBadgesForAction(
  supabase: SupabaseClient,
  userId: string,
  actionType: "visit" | "challenge" | "event" | "sale" | "streak"
): Promise<Badge[]> {
  const awardedBadges: Badge[] = [];

  // Map action types to criteria types
  const criteriaTypeMap: Record<string, string[]> = {
    visit: ["visits"],
    challenge: ["challenges"],
    event: ["events"],
    sale: ["sales"],
    streak: ["streak"],
  };

  const relevantTypes = criteriaTypeMap[actionType] || [];
  if (relevantTypes.length === 0) return awardedBadges;

  // Get user stats
  const userStats = await getUserStats(supabase, userId);
  if (!userStats) return awardedBadges;

  // Get user's existing badges
  const { data: existingBadges } = await supabase
    .from("user_badges")
    .select("badgeId")
    .eq("userId", userId);

  const existingBadgeIds = new Set(
    (existingBadges || []).map((b: any) => b.badgeId)
  );

  // Get badges that match the criteria types
  const { data: allBadges } = await supabase.from("badges").select("*");
  if (!allBadges) return awardedBadges;

  for (const badge of allBadges as Badge[]) {
    if (existingBadgeIds.has(badge.id)) continue;

    let criteria: BadgeCriteria;
    try {
      criteria = JSON.parse(badge.criteria);
    } catch {
      continue;
    }

    // Only check relevant badges
    if (!relevantTypes.includes(criteria.type)) continue;

    if (checkBadgeCriteria(criteria, userStats)) {
      const { error } = await (supabase as any)
        .from("user_badges")
        .insert({ userId, badgeId: badge.id });

      if (!error) {
        awardedBadges.push(badge);
      }
    }
  }

  return awardedBadges;
}

/**
 * Award a specific badge to a user (admin/manual)
 */
export async function awardSpecificBadge(
  supabase: SupabaseClient,
  userId: string,
  badgeName: string
): Promise<Badge | null> {
  // Find badge by name
  const { data: badgeData } = await supabase
    .from("badges")
    .select("*")
    .eq("name", badgeName)
    .single();

  if (!badgeData) return null;

  const badge = badgeData as Badge;

  // Check if already awarded
  const { data: existing } = await supabase
    .from("user_badges")
    .select("*")
    .eq("userId", userId)
    .eq("badgeId", badge.id)
    .single();

  if (existing) return badge;

  // Award it
  const { error } = await (supabase as any)
    .from("user_badges")
    .insert({ userId, badgeId: badge.id });

  if (error) {
    console.error("Error awarding badge:", error);
    return null;
  }

  return badge;
}

/**
 * Check early adopter badges on signup
 */
export async function checkEarlyAdopterBadges(
  supabase: SupabaseClient,
  userId: string
): Promise<Badge[]> {
  const awardedBadges: Badge[] = [];
  const now = new Date();

  // Get all early adopter badges
  const { data: allBadges } = await supabase.from("badges").select("*");
  if (!allBadges) return awardedBadges;

  for (const badge of allBadges as Badge[]) {
    let criteria: BadgeCriteria;
    try {
      criteria = JSON.parse(badge.criteria);
    } catch {
      continue;
    }

    if (criteria.type !== "join_date") continue;
    if (!criteria.before) continue;

    if (now < new Date(criteria.before)) {
      const { error } = await (supabase as any)
        .from("user_badges")
        .insert({ userId, badgeId: badge.id });

      if (!error) {
        awardedBadges.push(badge);
      }
    }
  }

  return awardedBadges;
}
