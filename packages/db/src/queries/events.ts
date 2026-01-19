import type { SupabaseClient } from "../client";
import type {
  Event,
  EventWithRelations,
  EventRSVP,
  EventAttendance,
  EventMedia,
  EventSuggestion,
  EventCategory,
  RSVPStatus,
} from "../types";
import { XP_VALUES } from "../constants";

// Get event by ID
export async function getEventById(
  supabase: SupabaseClient,
  eventId: string
): Promise<EventWithRelations | null> {
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      rsvps:event_rsvps (
        *,
        user:users (id, name, avatarUrl)
      ),
      attendances:event_attendances (
        *,
        user:users (id, name, avatarUrl)
      ),
      media:event_media (*)
    `)
    .eq("id", eventId)
    .single();

  if (error) {
    console.error("Error fetching event:", error);
    return null;
  }

  return data as EventWithRelations;
}

// Get upcoming events
export async function getUpcomingEvents(
  supabase: SupabaseClient,
  options?: {
    category?: EventCategory;
    limit?: number;
    publishedOnly?: boolean;
  }
): Promise<EventWithRelations[]> {
  const now = new Date().toISOString();
  let query = supabase
    .from("events")
    .select(`
      *,
      rsvps:event_rsvps (
        *,
        user:users (id, name, avatarUrl)
      ),
      attendances:event_attendances (
        *,
        user:users (id, name, avatarUrl)
      ),
      media:event_media (*)
    `)
    .gte("startTime", now)
    .order("startTime", { ascending: true });

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  if (options?.publishedOnly !== false) {
    query = query.eq("isPublished", true);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }

  return data as EventWithRelations[];
}

// Get past events
export async function getPastEvents(
  supabase: SupabaseClient,
  options?: {
    category?: EventCategory;
    limit?: number;
  }
): Promise<Event[]> {
  const now = new Date().toISOString();
  let query = supabase
    .from("events")
    .select("*")
    .lt("endTime", now)
    .eq("isPublished", true)
    .order("startTime", { ascending: false });

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching past events:", error);
    return [];
  }

  return data;
}

// Create event
export async function createEvent(
  supabase: SupabaseClient,
  eventData: {
    title: string;
    description?: string;
    category: EventCategory;
    imageUrl?: string;
    startTime: Date;
    endTime: Date;
    capacity?: number;
    xpReward?: number;
  }
): Promise<Event | null> {
  const { data, error } = await (supabase as any)
    .from("events")
    .insert({
      ...eventData,
      startTime: eventData.startTime.toISOString(),
      endTime: eventData.endTime.toISOString(),
      xpReward: eventData.xpReward || XP_VALUES.EVENT_ATTENDANCE_BASE,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating event:", error);
    return null;
  }

  return data as Event;
}

// Update event
export async function updateEvent(
  supabase: SupabaseClient,
  eventId: string,
  updates: Partial<{
    title: string;
    description: string;
    category: EventCategory;
    imageUrl: string;
    startTime: Date;
    endTime: Date;
    capacity: number;
    xpReward: number;
    hypeLevel: number;
    isPublished: boolean;
  }>
): Promise<Event | null> {
  const { data, error } = await (supabase as any)
    .from("events")
    .update({
      ...updates,
      startTime: updates.startTime?.toISOString(),
      endTime: updates.endTime?.toISOString(),
    })
    .eq("id", eventId)
    .select()
    .single();

  if (error) {
    console.error("Error updating event:", error);
    return null;
  }

  return data as Event;
}

// Delete event
export async function deleteEvent(
  supabase: SupabaseClient,
  eventId: string
): Promise<boolean> {
  const { error } = await supabase.from("events").delete().eq("id", eventId);

  if (error) {
    console.error("Error deleting event:", error);
    return false;
  }

  return true;
}

// RSVP to event
export async function rsvpToEvent(
  supabase: SupabaseClient,
  userId: string,
  eventId: string,
  status: RSVPStatus,
  friendCount: number = 0
): Promise<EventRSVP | null> {
  const { data, error } = await (supabase as any)
    .from("event_rsvps")
    .upsert(
      {
        userId,
        eventId,
        status,
        friendCount,
      },
      { onConflict: "userId,eventId" }
    )
    .select()
    .single();

  if (error) {
    console.error("Error RSVPing to event:", error);
    return null;
  }

  // Update hype level based on RSVPs
  await updateEventHypeLevel(supabase, eventId);

  return data as EventRSVP;
}

// Cancel RSVP
export async function cancelRsvp(
  supabase: SupabaseClient,
  userId: string,
  eventId: string
): Promise<boolean> {
  const { error } = await (supabase as any)
    .from("event_rsvps")
    .update({ status: "CANCELLED" })
    .eq("userId", userId)
    .eq("eventId", eventId);

  if (error) {
    console.error("Error cancelling RSVP:", error);
    return false;
  }

  await updateEventHypeLevel(supabase, eventId);
  return true;
}

// Get user's RSVP for event
export async function getUserRsvp(
  supabase: SupabaseClient,
  userId: string,
  eventId: string
): Promise<EventRSVP | null> {
  const { data, error } = await supabase
    .from("event_rsvps")
    .select("*")
    .eq("userId", userId)
    .eq("eventId", eventId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching RSVP:", error);
    return null;
  }

  return data;
}

// Check in to event
export async function checkInToEvent(
  supabase: SupabaseClient,
  userId: string,
  eventId: string
): Promise<{ success: boolean; xpAwarded: number; error?: string }> {
  // Check if already checked in
  const { data: existing } = await supabase
    .from("event_attendances")
    .select("*")
    .eq("userId", userId)
    .eq("eventId", eventId)
    .single();

  if (existing) {
    return { success: false, xpAwarded: 0, error: "Already checked in" };
  }

  // Get event details
  const event = await getEventById(supabase, eventId);
  if (!event) {
    return { success: false, xpAwarded: 0, error: "Event not found" };
  }

  // Record attendance
  const { error } = await (supabase as any).from("event_attendances").insert({
    userId,
    eventId,
    xpAwarded: event.xpReward,
  });

  if (error) {
    console.error("Error checking in:", error);
    return { success: false, xpAwarded: 0, error: "Failed to check in" };
  }

  return { success: true, xpAwarded: event.xpReward };
}

// Update event hype level based on RSVPs
async function updateEventHypeLevel(
  supabase: SupabaseClient,
  eventId: string
): Promise<void> {
  const { count } = await supabase
    .from("event_rsvps")
    .select("*", { count: "exact", head: true })
    .eq("eventId", eventId)
    .in("status", ["GOING", "MAYBE"]);

  // Simple hype calculation: min of 100, 5 per RSVP
  const hypeLevel = Math.min((count || 0) * 5, 100);

  await (supabase as any).from("events").update({ hypeLevel }).eq("id", eventId);
}

// Get event RSVPs
export async function getEventRsvps(
  supabase: SupabaseClient,
  eventId: string,
  status?: RSVPStatus
): Promise<(EventRSVP & { user: { id: string; name: string | null; avatarUrl: string | null } })[]> {
  let query = supabase
    .from("event_rsvps")
    .select(`
      *,
      user:users (id, name, avatarUrl)
    `)
    .eq("eventId", eventId);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching RSVPs:", error);
    return [];
  }

  return data as (EventRSVP & { user: { id: string; name: string | null; avatarUrl: string | null } })[];
}

// Add event media
export async function addEventMedia(
  supabase: SupabaseClient,
  eventId: string,
  uploaderId: string,
  url: string,
  type: "image" | "video",
  caption?: string
): Promise<EventMedia | null> {
  const { data, error } = await (supabase as any)
    .from("event_media")
    .insert({
      eventId,
      uploaderId,
      url,
      type,
      caption,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding media:", error);
    return null;
  }

  return data as EventMedia;
}

// Approve event media
export async function approveEventMedia(
  supabase: SupabaseClient,
  mediaId: string
): Promise<boolean> {
  const { error } = await (supabase as any)
    .from("event_media")
    .update({ isApproved: true })
    .eq("id", mediaId);

  if (error) {
    console.error("Error approving media:", error);
    return false;
  }

  return true;
}

// Create event suggestion
export async function createEventSuggestion(
  supabase: SupabaseClient,
  userId: string,
  title: string,
  description: string | undefined,
  category: EventCategory
): Promise<EventSuggestion | null> {
  const { data, error } = await (supabase as any)
    .from("event_suggestions")
    .insert({
      userId,
      title,
      description,
      category,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating suggestion:", error);
    return null;
  }

  return data as EventSuggestion;
}

// Vote on event suggestion
export async function voteOnSuggestion(
  supabase: SupabaseClient,
  userId: string,
  suggestionId: string
): Promise<boolean> {
  // Check if already voted
  const { data: existing } = await supabase
    .from("event_suggestion_votes")
    .select("*")
    .eq("userId", userId)
    .eq("suggestionId", suggestionId)
    .single();

  if (existing) {
    // Remove vote
    const { error } = await supabase
      .from("event_suggestion_votes")
      .delete()
      .eq("userId", userId)
      .eq("suggestionId", suggestionId);

    if (error) {
      console.error("Error removing vote:", error);
      return false;
    }

    // Decrement count
    await (supabase as any).rpc("decrement_suggestion_votes", { suggestion_id: suggestionId });
    return true;
  }

  // Add vote
  const { error } = await (supabase as any)
    .from("event_suggestion_votes")
    .insert({ userId, suggestionId });

  if (error) {
    console.error("Error adding vote:", error);
    return false;
  }

  // Increment count
  await (supabase as any).rpc("increment_suggestion_votes", { suggestion_id: suggestionId });
  return true;
}

// Get top suggestions
export async function getTopSuggestions(
  supabase: SupabaseClient,
  limit: number = 10
): Promise<(EventSuggestion & { user: { id: string; name: string | null } })[]> {
  const { data, error } = await supabase
    .from("event_suggestions")
    .select(`
      *,
      user:users (id, name)
    `)
    .order("voteCount", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }

  return data as (EventSuggestion & { user: { id: string; name: string | null } })[];
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

// Get all events for admin (paginated)
export async function getAllEventsAdmin(
  supabase: SupabaseClient,
  options: {
    page?: number;
    limit?: number;
    search?: string;
    category?: EventCategory;
    published?: boolean;
  } = {}
): Promise<{ events: EventWithRelations[]; count: number }> {
  const { page = 1, limit = 20, search, category, published } = options;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("events")
    .select(`
      *,
      rsvps:event_rsvps (count),
      attendances:event_attendances (count)
    `, { count: "exact" });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (category) {
    query = query.eq("category", category);
  }

  if (published !== undefined) {
    query = query.eq("isPublished", published);
  }

  query = query
    .range(from, to)
    .order("startTime", { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching events for admin:", error);
    return { events: [], count: 0 };
  }

  return { events: data as EventWithRelations[], count: count || 0 };
}

// Publish/unpublish event
export async function toggleEventPublished(
  supabase: SupabaseClient,
  eventId: string,
  isPublished: boolean
): Promise<Event | null> {
  const { data, error } = await (supabase as any)
    .from("events")
    .update({ isPublished })
    .eq("id", eventId)
    .select()
    .single();

  if (error) {
    console.error("Error toggling event published:", error);
    return null;
  }

  return data as Event;
}
