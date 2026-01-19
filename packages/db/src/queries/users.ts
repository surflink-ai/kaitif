import type { SupabaseClient } from "../client";
import type { User, UserWithRelations } from "../types";
import { LEVEL_THRESHOLDS, XP_VALUES } from "../constants";

// Get user by ID
export async function getUserById(
  supabase: SupabaseClient,
  userId: string
): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return data;
}

// Get user by email
export async function getUserByEmail(
  supabase: SupabaseClient,
  email: string
): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }

  return data;
}

// Get user with relations
export async function getUserWithRelations(
  supabase: SupabaseClient,
  userId: string
): Promise<UserWithRelations | null> {
  const { data, error } = await supabase
    .from("users")
    .select(`
      *,
      passes (*),
      waivers (*),
      badges:user_badges (
        *,
        badge:badges (*)
      )
    `)
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user with relations:", error);
    return null;
  }

  return data as UserWithRelations;
}

// Create or update user from auth
export async function upsertUser(
  supabase: SupabaseClient,
  userData: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  }
): Promise<User | null> {
  const { data, error } = await (supabase as any)
    .from("users")
    .upsert(
      {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatarUrl: userData.avatarUrl,
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (error) {
    console.error("Error upserting user:", error);
    return null;
  }

  return data as User;
}

// Update user profile
export async function updateUserProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: { name?: string; bio?: string; avatarUrl?: string }
): Promise<User | null> {
  const { data, error } = await (supabase as any)
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    return null;
  }

  return data as User;
}

// Add XP to user and update level
export async function addUserXP(
  supabase: SupabaseClient,
  userId: string,
  xpAmount: number
): Promise<User | null> {
  // First get current user
  const user = await getUserById(supabase, userId);
  if (!user) return null;

  const newXP = user.xp + xpAmount;
  const newLevel = calculateLevel(newXP);

  const { data, error } = await (supabase as any)
    .from("users")
    .update({ xp: newXP, level: newLevel })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error adding XP:", error);
    return null;
  }

  return data as User;
}

// Update user streak
export async function updateUserStreak(
  supabase: SupabaseClient,
  userId: string
): Promise<User | null> {
  const user = await getUserById(supabase, userId);
  if (!user) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastVisit = user.lastVisitDate ? new Date(user.lastVisitDate) : null;
  lastVisit?.setHours(0, 0, 0, 0);

  let newStreak = user.streak;
  let xpBonus = 0;

  if (!lastVisit) {
    // First visit
    newStreak = 1;
    xpBonus = XP_VALUES.FIRST_OF_DAY;
  } else {
    const daysDiff = Math.floor(
      (today.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 0) {
      // Same day, no streak change
      return user;
    } else if (daysDiff === 1) {
      // Consecutive day
      newStreak = user.streak + 1;
      xpBonus = XP_VALUES.FIRST_OF_DAY + XP_VALUES.DAILY_STREAK_BONUS * newStreak;

      // Weekly bonus
      if (newStreak % 7 === 0) {
        xpBonus += XP_VALUES.WEEKLY_STREAK_BONUS;
      }
      // Monthly bonus
      if (newStreak % 30 === 0) {
        xpBonus += XP_VALUES.MONTHLY_STREAK_BONUS;
      }
    } else {
      // Streak broken
      newStreak = 1;
      xpBonus = XP_VALUES.FIRST_OF_DAY;
    }
  }

  const newXP = user.xp + xpBonus;
  const newLevel = calculateLevel(newXP);

  const { data, error } = await (supabase as any)
    .from("users")
    .update({
      streak: newStreak,
      lastVisitDate: today.toISOString(),
      xp: newXP,
      level: newLevel,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating streak:", error);
    return null;
  }

  return data as User;
}

// Get leaderboard
export async function getLeaderboard(
  supabase: SupabaseClient,
  limit: number = 10
): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, avatarUrl, xp, level, streak")
    .order("xp", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }

  return data as User[];
}

// Get all users (paginated, searchable)
export async function getAllUsers(
  supabase: SupabaseClient,
  options: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  } = {}
): Promise<{ users: User[]; count: number }> {
  const { page = 1, limit = 10, search, role } = options;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("users")
    .select("*", { count: "exact" });

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (role) {
    query = query.eq("role", role);
  }

  query = query.range(from, to).order("createdAt", { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching users:", error);
    return { users: [], count: 0 };
  }

  return { users: data as User[], count: count || 0 };
}

// Helper function to calculate level from XP
export function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

// Get XP needed for next level
export function getXPForNextLevel(currentXP: number): {
  current: number;
  required: number;
  progress: number;
} {
  const currentLevel = calculateLevel(currentXP);
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

  const progress = currentXP - currentThreshold;
  const required = nextThreshold - currentThreshold;

  return {
    current: progress,
    required,
    progress: Math.min((progress / required) * 100, 100),
  };
}
