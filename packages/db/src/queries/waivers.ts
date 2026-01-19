import type { SupabaseClient } from "../client";
import type { Waiver, WaiverVersion } from "../types";
import { WAIVER_VALIDITY_DAYS } from "../constants";

// Get active waiver version
export async function getActiveWaiverVersion(
  supabase: SupabaseClient
): Promise<WaiverVersion | null> {
  const { data, error } = await supabase
    .from("waiver_versions")
    .select("*")
    .eq("isActive", true)
    .order("version", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching active waiver:", error);
    return null;
  }

  return data;
}

// Get waiver version by ID
export async function getWaiverVersionById(
  supabase: SupabaseClient,
  waiverVersionId: string
): Promise<WaiverVersion | null> {
  const { data, error } = await supabase
    .from("waiver_versions")
    .select("*")
    .eq("id", waiverVersionId)
    .single();

  if (error) {
    console.error("Error fetching waiver version:", error);
    return null;
  }

  return data;
}

// Create a new waiver version
export async function createWaiverVersion(
  supabase: SupabaseClient,
  content: string
): Promise<WaiverVersion | null> {
  // Get the latest version number
  const { data: latest } = await supabase
    .from("waiver_versions")
    .select("version")
    .order("version", { ascending: false })
    .limit(1)
    .single();

  const newVersion = ((latest as any)?.version || 0) + 1;

  // Deactivate old versions
  await (supabase as any).from("waiver_versions").update({ isActive: false }).eq("isActive", true);

  // Create new version
  const { data, error } = await (supabase as any)
    .from("waiver_versions")
    .insert({
      version: newVersion,
      content,
      isActive: true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating waiver version:", error);
    return null;
  }

  return data as WaiverVersion;
}

// Get user's valid waiver
export async function getUserValidWaiver(
  supabase: SupabaseClient,
  userId: string
): Promise<Waiver | null> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("waivers")
    .select("*")
    .eq("userId", userId)
    .gt("expiresAt", now)
    .order("signedAt", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching valid waiver:", error);
    return null;
  }

  return data;
}

// Check if user has valid waiver
export async function hasValidWaiver(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const waiver = await getUserValidWaiver(supabase, userId);
  return waiver !== null;
}

// Sign a new waiver
export async function signWaiver(
  supabase: SupabaseClient,
  userId: string,
  waiverVersionId: string,
  signature: string,
  guardianName?: string,
  guardianSignature?: string
): Promise<Waiver | null> {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + WAIVER_VALIDITY_DAYS);

  const { data, error } = await (supabase as any)
    .from("waivers")
    .insert({
      userId,
      waiverVersionId,
      signature,
      guardianName,
      guardianSignature,
      signedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error signing waiver:", error);
    return null;
  }

  return data as Waiver;
}

// Get all waivers for a user
export async function getUserWaivers(
  supabase: SupabaseClient,
  userId: string
): Promise<Waiver[]> {
  const { data, error } = await supabase
    .from("waivers")
    .select(`
      *,
      waiverVersion:waiver_versions (*)
    `)
    .eq("userId", userId)
    .order("signedAt", { ascending: false });

  if (error) {
    console.error("Error fetching user waivers:", error);
    return [];
  }

  return data;
}

// Get waivers expiring soon
export async function getExpiringWaivers(
  supabase: SupabaseClient,
  daysAhead: number = 30
): Promise<(Waiver & { user: { id: string; email: string; name: string | null } })[]> {
  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + daysAhead);

  const { data, error } = await supabase
    .from("waivers")
    .select(`
      *,
      user:users (id, email, name)
    `)
    .gte("expiresAt", now.toISOString())
    .lte("expiresAt", future.toISOString());

  if (error) {
    console.error("Error fetching expiring waivers:", error);
    return [];
  }

  return data as (Waiver & { user: { id: string; email: string; name: string | null } })[];
}

// Get waiver stats
export async function getWaiverStats(
  supabase: SupabaseClient
): Promise<{ total: number; active: number; expiringSoon: number }> {
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const { count: total } = await supabase
    .from("waivers")
    .select("*", { count: "exact", head: true });

  const { count: active } = await supabase
    .from("waivers")
    .select("*", { count: "exact", head: true })
    .gt("expiresAt", now.toISOString());

  const { count: expiringSoon } = await supabase
    .from("waivers")
    .select("*", { count: "exact", head: true })
    .gte("expiresAt", now.toISOString())
    .lte("expiresAt", thirtyDaysFromNow.toISOString());

  return {
    total: total || 0,
    active: active || 0,
    expiringSoon: expiringSoon || 0,
  };
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

// Get all waivers (Admin)
export async function getAllWaiversAdmin(
  supabase: SupabaseClient,
  options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: "ACTIVE" | "EXPIRED";
  } = {}
) {
  const { page = 1, limit = 20, search, status } = options;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const now = new Date().toISOString();

  let query = supabase
    .from("waivers")
    .select(`
      *,
      user:users (id, name, email),
      waiverVersion:waiver_versions (version)
    `, { count: "exact" });

  if (search) {
    query = query.or(`user.name.ilike.%${search}%,user.email.ilike.%${search}%`);
  }

  if (status === "ACTIVE") {
    query = query.gt("expiresAt", now);
  } else if (status === "EXPIRED") {
    query = query.lte("expiresAt", now);
  }

  query = query
    .range(from, to)
    .order("signedAt", { ascending: false });

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching waivers admin:", error);
    return { waivers: [], count: 0 };
  }

  // Determine status for UI if not filtered
  const waivers = data.map((waiver: any) => ({
    ...waiver,
    status: new Date(waiver.expiresAt) > new Date() ? "ACTIVE" : "EXPIRED"
  }));

  return { waivers, count: count || 0 };
}
