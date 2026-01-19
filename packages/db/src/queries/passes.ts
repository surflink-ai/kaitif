import type { SupabaseClient } from "../client";
import type { Pass, PassWithRelations, PassType, PassStatus } from "../types";
import { PASS_DURATION } from "../constants";

// Generate unique barcode ID
function generateBarcodeId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "KAI-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Get pass by ID
export async function getPassById(
  supabase: SupabaseClient,
  passId: string
): Promise<Pass | null> {
  const { data, error } = await supabase
    .from("passes")
    .select("*")
    .eq("id", passId)
    .single();

  if (error) {
    console.error("Error fetching pass:", error);
    return null;
  }

  return data;
}

// Get pass by barcode
export async function getPassByBarcode(
  supabase: SupabaseClient,
  barcodeId: string
): Promise<PassWithRelations | null> {
  const { data, error } = await supabase
    .from("passes")
    .select(`
      *,
      user:users (*)
    `)
    .eq("barcodeId", barcodeId)
    .single();

  if (error) {
    console.error("Error fetching pass by barcode:", error);
    return null;
  }

  return data as PassWithRelations;
}

// Get user's passes
export async function getUserPasses(
  supabase: SupabaseClient,
  userId: string
): Promise<Pass[]> {
  const { data, error } = await supabase
    .from("passes")
    .select("*")
    .eq("userId", userId)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching user passes:", error);
    return [];
  }

  return data;
}

// Get user's active pass
export async function getUserActivePass(
  supabase: SupabaseClient,
  userId: string
): Promise<Pass | null> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("passes")
    .select("*")
    .eq("userId", userId)
    .eq("status", "ACTIVE")
    .gt("expiresAt", now)
    .order("expiresAt", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching active pass:", error);
    return null;
  }

  return data;
}

// Create a new pass
export async function createPass(
  supabase: SupabaseClient,
  userId: string,
  type: PassType,
  stripePaymentId?: string
): Promise<Pass | null> {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + (PASS_DURATION as Record<string, number>)[type]);

  const { data, error } = await (supabase as any)
    .from("passes")
    .insert({
      userId,
      type,
      status: "ACTIVE" as PassStatus,
      barcodeId: generateBarcodeId(),
      stripePaymentId,
      purchasedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating pass:", error);
    return null;
  }

  return data as Pass;
}

// Update pass status
export async function updatePassStatus(
  supabase: SupabaseClient,
  passId: string,
  status: PassStatus
): Promise<Pass | null> {
  const { data, error } = await (supabase as any)
    .from("passes")
    .update({ status })
    .eq("id", passId)
    .select()
    .single();

  if (error) {
    console.error("Error updating pass status:", error);
    return null;
  }

  return data as Pass;
}

// Scan/validate pass
export async function scanPass(
  supabase: SupabaseClient,
  barcodeId: string,
  scannedBy?: string,
  location?: string
): Promise<{ valid: boolean; pass?: PassWithRelations; error?: string }> {
  const pass = await getPassByBarcode(supabase, barcodeId);

  if (!pass) {
    return { valid: false, error: "Pass not found" };
  }

  if (pass.status !== "ACTIVE") {
    return { valid: false, pass, error: `Pass is ${pass.status.toLowerCase()}` };
  }

  if (new Date(pass.expiresAt) < new Date()) {
    // Auto-expire the pass
    await updatePassStatus(supabase, pass.id, "EXPIRED");
    return { valid: false, pass, error: "Pass has expired" };
  }

  // Record the scan
  const { error } = await (supabase as any).from("pass_scans").insert({
    passId: pass.id,
    scannedAt: new Date().toISOString(),
    scannedBy,
    location,
  });

  if (error) {
    console.error("Error recording scan:", error);
  }

  return { valid: true, pass };
}

// Get pass scans
export async function getPassScans(
  supabase: SupabaseClient,
  passId: string
): Promise<{ id: string; scannedAt: string; scannedBy?: string; location?: string }[]> {
  const { data, error } = await supabase
    .from("pass_scans")
    .select("*")
    .eq("passId", passId)
    .order("scannedAt", { ascending: false });

  if (error) {
    console.error("Error fetching pass scans:", error);
    return [];
  }

  return data;
}

// Get today's check-ins
export async function getTodayCheckIns(
  supabase: SupabaseClient
): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("pass_scans")
    .select("*", { count: "exact", head: true })
    .gte("scannedAt", today.toISOString());

  if (error) {
    console.error("Error fetching today's check-ins:", error);
    return 0;
  }

  return count || 0;
}

// Get passes expiring soon (for notifications)
export async function getExpiringPasses(
  supabase: SupabaseClient,
  daysAhead: number = 3
): Promise<PassWithRelations[]> {
  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + daysAhead);

  const { data, error } = await supabase
    .from("passes")
    .select(`
      *,
      user:users (id, email, name)
    `)
    .eq("status", "ACTIVE")
    .gte("expiresAt", now.toISOString())
    .lte("expiresAt", future.toISOString());

  if (error) {
    console.error("Error fetching expiring passes:", error);
    return [];
  }

  return data as PassWithRelations[];
}

// Get all passes (paginated, searchable)
export async function getAllPasses(
  supabase: SupabaseClient,
  options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  } = {}
): Promise<{ passes: PassWithRelations[]; count: number }> {
  const { page = 1, limit = 10, search, status } = options;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("passes")
    .select(`
      *,
      user:users (id, name, email)
    `, { count: "exact" });

  if (search) {
    query = query.ilike("barcodeId", `%${search}%`);
  }

  if (status) {
    query = query.eq("status", status);
  }

  query = query.range(from, to).order("createdAt", { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching passes:", error);
    return { passes: [], count: 0 };
  }

  return { passes: data as PassWithRelations[], count: count || 0 };
}
