"use server";

import { createClient } from "@/lib/supabase/server";
import { 
  scanPass, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  toggleEventPublished,
  reviewChallengeCompletion,
  createChallenge,
  updateChallenge,
  toggleChallengeActive,
  removeListingAdmin,
  updateReportStatus,
  createWaiverVersion,
  createAnnouncement,
  EventCategory,
  ChallengeDifficulty
} from "@kaitif/db";
import { revalidatePath } from "next/cache";

// ============================================
// PASS ACTIONS
// ============================================

export async function validatePassAction(barcodeId: string) {
  const supabase = await createClient();
  // Get current user for 'scannedBy'
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { valid: false, error: "Unauthorized" };
  }

  const result = await scanPass(supabase, barcodeId, user.id, "Admin Dashboard");
  
  if (result.pass) {
    // Ensure pass dates are serialized if they are Date objects
    const pass = result.pass as any;
    return {
      ...result,
      pass: {
        ...pass,
        purchasedAt: new Date(pass.purchasedAt).toISOString(),
        expiresAt: new Date(pass.expiresAt).toISOString(),
        createdAt: new Date(pass.createdAt).toISOString(),
        updatedAt: new Date(pass.updatedAt).toISOString(),
      }
    };
  }
  
  return result;
}

// ============================================
// EVENT ACTIONS
// ============================================

export async function createEventAction(formData: FormData) {
  const supabase = await createClient();
  
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as EventCategory;
  const startTime = new Date(formData.get("startTime") as string);
  const endTime = new Date(formData.get("endTime") as string);
  const capacity = Number(formData.get("capacity")) || undefined;
  const xpReward = Number(formData.get("xpReward")) || undefined;
  const imageUrl = formData.get("imageUrl") as string || undefined;

  const event = await createEvent(supabase, {
    title,
    description,
    category,
    startTime,
    endTime,
    capacity,
    xpReward,
    imageUrl
  });

  if (event) {
    revalidatePath("/dashboard/events");
    return { success: true };
  }
  
  return { success: false, error: "Failed to create event" };
}

export async function updateEventAction(eventId: string, updates: any) {
  const supabase = await createClient();
  
  if (updates.startTime) updates.startTime = new Date(updates.startTime);
  if (updates.endTime) updates.endTime = new Date(updates.endTime);

  const event = await updateEvent(supabase, eventId, updates);

  if (event) {
    revalidatePath("/dashboard/events");
    return { success: true };
  }
  
  return { success: false, error: "Failed to update event" };
}

export async function deleteEventAction(eventId: string) {
  const supabase = await createClient();
  const success = await deleteEvent(supabase, eventId);

  if (success) {
    revalidatePath("/dashboard/events");
    return { success: true };
  }
  
  return { success: false, error: "Failed to delete event" };
}

export async function toggleEventPublishedAction(eventId: string, isPublished: boolean) {
  const supabase = await createClient();
  const event = await toggleEventPublished(supabase, eventId, isPublished);

  if (event) {
    revalidatePath("/dashboard/events");
    return { success: true };
  }
  
  return { success: false, error: "Failed to update event" };
}

// ============================================
// CHALLENGE ACTIONS
// ============================================

export async function createChallengeAction(formData: FormData) {
  const supabase = await createClient();
  
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const difficulty = formData.get("difficulty") as ChallengeDifficulty;
  const xpReward = Number(formData.get("xpReward"));
  const imageUrl = formData.get("imageUrl") as string || null;

  const challenge = await createChallenge(supabase, {
    title,
    description,
    difficulty,
    xpReward,
    imageUrl,
    isActive: true,
    videoRequired: true
  } as any);

  if (challenge) {
    revalidatePath("/dashboard/challenges");
    return { success: true };
  }
  
  return { success: false, error: "Failed to create challenge" };
}

export async function reviewChallengeAction(
  completionId: string, 
  status: "APPROVED" | "REJECTED",
  xpAwarded: number = 0
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: "Unauthorized" };

  const completion = await reviewChallengeCompletion(
    supabase, 
    completionId, 
    status, 
    user.id, 
    xpAwarded
  );

  if (completion) {
    revalidatePath("/dashboard/challenges");
    return { success: true };
  }
  
  return { success: false, error: "Failed to review challenge" };
}

export async function toggleChallengeActiveAction(challengeId: string, isActive: boolean) {
  const supabase = await createClient();
  const challenge = await toggleChallengeActive(supabase, challengeId, isActive);

  if (challenge) {
    revalidatePath("/dashboard/challenges");
    return { success: true };
  }
  
  return { success: false, error: "Failed to update challenge" };
}

// ============================================
// MARKETPLACE ACTIONS
// ============================================

export async function removeListingAdminAction(listingId: string) {
  const supabase = await createClient();
  const success = await removeListingAdmin(supabase, listingId);

  if (success) {
    revalidatePath("/dashboard/marketplace");
    return { success: true };
  }
  
  return { success: false, error: "Failed to remove listing" };
}

export async function updateReportStatusAction(reportId: string, status: "REVIEWED" | "DISMISSED") {
  const supabase = await createClient();
  const success = await updateReportStatus(supabase, reportId, status);

  if (success) {
    revalidatePath("/dashboard/marketplace");
    return { success: true };
  }
  
  return { success: false, error: "Failed to update report" };
}

// ============================================
// WAIVER ACTIONS
// ============================================

export async function createWaiverVersionAction(content: string) {
  const supabase = await createClient();
  const version = await createWaiverVersion(supabase, content);

  if (version) {
    revalidatePath("/dashboard/waivers");
    return { success: true };
  }
  
  return { success: false, error: "Failed to create waiver version" };
}

// ============================================
// ANNOUNCEMENT ACTIONS
// ============================================

export async function sendAnnouncementAction(content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: "Unauthorized" };

  const result = await createAnnouncement(supabase, user.id, content);

  if (result) {
    revalidatePath("/dashboard/messages");
    return { success: true };
  }
  
  return { success: false, error: "Failed to send announcement" };
}
