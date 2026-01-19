import type { SupabaseClient } from "../client";
import type {
  Listing,
  ListingWithRelations,
  Transaction,
  Review,
  ListingCategory,
  ListingCondition,
  ListingStatus,
  TransactionStatus,
} from "../types";
import { MARKETPLACE_FEE_PERCENT } from "../constants";

// Get listing by ID
export async function getListingById(
  supabase: SupabaseClient,
  listingId: string
): Promise<ListingWithRelations | null> {
  const { data, error } = await supabase
    .from("listings")
    .select(`
      *,
      seller:users (id, name, avatarUrl)
    `)
    .eq("id", listingId)
    .single();

  if (error) {
    console.error("Error fetching listing:", error);
    return null;
  }

  return data as ListingWithRelations;
}

// Get listings with filters
export async function getListings(
  supabase: SupabaseClient,
  options?: {
    category?: ListingCategory;
    condition?: ListingCondition;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    status?: ListingStatus;
    sellerId?: string;
    page?: number;
    limit?: number;
  }
): Promise<{ listings: ListingWithRelations[]; total: number }> {
  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("listings")
    .select(`
      *,
      seller:users (id, name, avatarUrl)
    `, { count: "exact" });

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  if (options?.condition) {
    query = query.eq("condition", options.condition);
  }

  if (options?.status) {
    query = query.eq("status", options.status);
  } else {
    query = query.eq("status", "ACTIVE");
  }

  if (options?.sellerId) {
    query = query.eq("sellerId", options.sellerId);
  }

  if (options?.minPrice !== undefined) {
    query = query.gte("price", options.minPrice);
  }

  if (options?.maxPrice !== undefined) {
    query = query.lte("price", options.maxPrice);
  }

  if (options?.search) {
    query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
  }

  query = query
    .order("createdAt", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching listings:", error);
    return { listings: [], total: 0 };
  }

  return { listings: data as ListingWithRelations[], total: count || 0 };
}

// Create listing
export async function createListing(
  supabase: SupabaseClient,
  sellerId: string,
  listingData: {
    title: string;
    description: string;
    price: number;
    category: ListingCategory;
    condition: ListingCondition;
    images: string[];
  }
): Promise<Listing | null> {
  const { data, error } = await (supabase as any)
    .from("listings")
    .insert({
      sellerId,
      ...listingData,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating listing:", error);
    return null;
  }

  return data as Listing;
}

// Update listing
export async function updateListing(
  supabase: SupabaseClient,
  listingId: string,
  sellerId: string,
  updates: Partial<{
    title: string;
    description: string;
    price: number;
    category: ListingCategory;
    condition: ListingCondition;
    images: string[];
    status: ListingStatus;
  }>
): Promise<Listing | null> {
  const { data, error } = await (supabase as any)
    .from("listings")
    .update(updates)
    .eq("id", listingId)
    .eq("sellerId", sellerId) // Ensure only seller can update
    .select()
    .single();

  if (error) {
    console.error("Error updating listing:", error);
    return null;
  }

  return data as Listing;
}

// Delete listing
export async function deleteListing(
  supabase: SupabaseClient,
  listingId: string,
  sellerId: string
): Promise<boolean> {
  const { error } = await (supabase as any)
    .from("listings")
    .update({ status: "REMOVED" })
    .eq("id", listingId)
    .eq("sellerId", sellerId);

  if (error) {
    console.error("Error deleting listing:", error);
    return false;
  }

  return true;
}

// Create transaction
export async function createTransaction(
  supabase: SupabaseClient,
  listingId: string,
  buyerId: string,
  stripePaymentId?: string
): Promise<Transaction | null> {
  // Get listing details
  const listing = await getListingById(supabase, listingId);
  if (!listing || listing.status !== "ACTIVE") {
    return null;
  }

  // Calculate platform fee
  const amount = listing.price;
  const platformFee = Math.round(amount * (MARKETPLACE_FEE_PERCENT / 100));

  // Create transaction
  const { data: transaction, error } = await (supabase as any)
    .from("transactions")
    .insert({
      listingId,
      buyerId,
      sellerId: listing.sellerId,
      amount,
      stripePaymentId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating transaction:", error);
    return null;
  }

  // Mark listing as reserved
  await (supabase as any)
    .from("listings")
    .update({ status: "RESERVED" })
    .eq("id", listingId);

  return transaction;
}

// Complete transaction
export async function completeTransaction(
  supabase: SupabaseClient,
  transactionId: string
): Promise<Transaction | null> {
  const { data, error } = await (supabase as any)
    .from("transactions")
    .update({
      status: "COMPLETED" as TransactionStatus,
      completedAt: new Date().toISOString(),
    })
    .eq("id", transactionId)
    .select()
    .single();

  if (error) {
    console.error("Error completing transaction:", error);
    return null;
  }

  // Mark listing as sold
  await (supabase as any)
    .from("listings")
    .update({ status: "SOLD" })
    .eq("id", (data as Transaction).listingId);

  return data as Transaction;
}

// Cancel transaction
export async function cancelTransaction(
  supabase: SupabaseClient,
  transactionId: string
): Promise<boolean> {
  const { data: transaction, error: fetchError } = await supabase
    .from("transactions")
    .select("listingId")
    .eq("id", transactionId)
    .single();

  if (fetchError || !transaction) {
    return false;
  }

  const { error } = await (supabase as any)
    .from("transactions")
    .update({ status: "CANCELLED" as TransactionStatus })
    .eq("id", transactionId);

  if (error) {
    console.error("Error cancelling transaction:", error);
    return false;
  }

  // Re-activate listing
  await (supabase as any)
    .from("listings")
    .update({ status: "ACTIVE" })
    .eq("id", (transaction as Transaction).listingId);

  return true;
}

// Get user's transactions
export async function getUserTransactions(
  supabase: SupabaseClient,
  userId: string,
  type: "purchases" | "sales"
): Promise<(Transaction & { listing: Listing })[]> {
  const field = type === "purchases" ? "buyerId" : "sellerId";

  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      listing:listings (*)
    `)
    .eq(field, userId)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }

  return data as (Transaction & { listing: Listing })[];
}

// ============================================
// REVIEWS
// ============================================

// Create review
export async function createReview(
  supabase: SupabaseClient,
  transactionId: string,
  reviewerId: string,
  revieweeId: string,
  rating: number,
  comment?: string
): Promise<Review | null> {
  const { data, error } = await (supabase as any)
    .from("reviews")
    .insert({
      transactionId,
      reviewerId,
      revieweeId,
      rating,
      comment,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating review:", error);
    return null;
  }

  return data as Review;
}

// Get user's reviews
export async function getUserReviews(
  supabase: SupabaseClient,
  userId: string
): Promise<(Review & { reviewer: { id: string; name: string | null } })[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      reviewer:users!reviewerId (id, name)
    `)
    .eq("revieweeId", userId)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return data as (Review & { reviewer: { id: string; name: string | null } })[];
}

// Get user's average rating
export async function getUserRating(
  supabase: SupabaseClient,
  userId: string
): Promise<{ average: number; count: number }> {
  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("revieweeId", userId);

  if (error || !data || data.length === 0) {
    return { average: 0, count: 0 };
  }

  const sum = data.reduce((acc: number, review: any) => acc + review.rating, 0);
  return {
    average: Math.round((sum / data.length) * 10) / 10,
    count: data.length,
  };
}

// Get featured listings (for homepage)
export async function getFeaturedListings(
  supabase: SupabaseClient,
  limit: number = 6
): Promise<ListingWithRelations[]> {
  const { data, error } = await supabase
    .from("listings")
    .select(`
      *,
      seller:users (id, name, avatarUrl)
    `)
    .eq("status", "ACTIVE")
    .order("createdAt", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured listings:", error);
    return [];
  }

  return data as ListingWithRelations[];
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

// Remove listing (Admin)
export async function removeListingAdmin(
  supabase: SupabaseClient,
  listingId: string
): Promise<boolean> {
  const { error } = await (supabase as any)
    .from("listings")
    .update({ status: "REMOVED" })
    .eq("id", listingId);

  if (error) {
    console.error("Error removing listing:", error);
    return false;
  }

  return true;
}

// Get listing reports
export async function getListingReports(
  supabase: SupabaseClient,
  options: {
    status?: "PENDING" | "REVIEWED" | "DISMISSED";
    limit?: number;
  } = {}
) {
  let query = supabase
    .from("listing_reports")
    .select(`
      *,
      listing:listings (
        id, 
        title, 
        price, 
        seller:users!sellerId (id, name)
      )
    `)
    .order("createdAt", { ascending: false });

  if (options.status) {
    query = query.eq("status", options.status);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching listing reports:", error);
    return [];
  }

  return data;
}

// Update report status
export async function updateReportStatus(
  supabase: SupabaseClient,
  reportId: string,
  status: "REVIEWED" | "DISMISSED"
): Promise<boolean> {
  const { error } = await (supabase as any)
    .from("listing_reports")
    .update({ status })
    .eq("id", reportId);

  if (error) {
    console.error("Error updating report status:", error);
    return false;
  }

  return true;
}

// Get marketplace stats
export async function getMarketplaceStats(supabase: SupabaseClient) {
  const { count: activeListings } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("status", "ACTIVE");

  const { count: flaggedItems } = await supabase
    .from("listing_reports")
    .select("*", { count: "exact", head: true })
    .eq("status", "PENDING");

  // Calculate volume (approximate)
  const { data: transactions } = await supabase
    .from("transactions")
    .select("amount")
    .eq("status", "COMPLETED");

  const volume = transactions?.reduce((sum: number, t: any) => sum + t.amount, 0) || 0;

  return {
    activeListings: activeListings || 0,
    flaggedItems: flaggedItems || 0,
    volume: volume,
    fees: Math.round(volume * 0.05), // Mock 5% fee
  };
}
