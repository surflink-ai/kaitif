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

// ============================================
// ROLE MANAGEMENT ACTIONS
// ============================================

export async function updateUserRoleAction(
  targetUserId: string,
  newRole: "USER" | "ADMIN",
  reason?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: "Unauthorized" };
  
  // Verify current user is SUPERADMIN
  const { data: currentUserData } = await supabase
    .from("users")
    .select("role, name, email")
    .eq("id", user.id)
    .single();
  
  const currentUser = currentUserData as { role: string; name: string | null; email: string } | null;
    
  if (currentUser?.role !== "SUPERADMIN") {
    return { success: false, error: "Only SUPERADMIN can change user roles" };
  }
  
  // Get target user details
  const { data: targetUserData } = await supabase
    .from("users")
    .select("role, name, email")
    .eq("id", targetUserId)
    .single();
  
  const targetUser = targetUserData as { role: string; name: string | null; email: string } | null;
    
  if (!targetUser) {
    return { success: false, error: "User not found" };
  }
  
  // Cannot change SUPERADMIN roles via UI
  if (targetUser.role === "SUPERADMIN") {
    return { success: false, error: "Cannot modify SUPERADMIN roles via UI" };
  }
  
  // Cannot change own role
  if (targetUserId === user.id) {
    return { success: false, error: "Cannot change your own role" };
  }
  
  const oldRole = targetUser.role;
  
  // Update the user's role
  const { error: updateError } = await (supabase
    .from("users") as any)
    .update({ role: newRole })
    .eq("id", targetUserId);
    
  if (updateError) {
    console.error("Failed to update user role:", updateError);
    return { success: false, error: "Failed to update user role" };
  }
  
  // Log the role change
  const { error: logError } = await (supabase
    .from("role_change_logs") as any)
    .insert({
      userId: targetUserId,
      oldRole,
      newRole,
      changedBy: user.id,
      reason: reason || null,
    });
    
  if (logError) {
    console.error("Failed to log role change:", logError);
    // Don't fail the action, just log the error
  }
  
  // Send email notification (fire and forget)
  try {
    // Dynamic import to avoid issues if email package isn't installed yet
    const { sendRoleChangeEmail } = await import("@kaitif/email");
    await sendRoleChangeEmail(
      targetUser.email,
      targetUser.name || "User",
      oldRole,
      newRole,
      currentUser.name || "Administrator"
    );
  } catch (emailError) {
    console.error("Failed to send role change email:", emailError);
    // Don't fail the action if email fails
  }
  
  revalidatePath("/dashboard/users");
  return { success: true };
}

export async function getRoleChangeLogsAction(userId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: "Unauthorized", logs: [] };
  
  // Only SUPERADMIN can view role change logs
  const { data: currentUserData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  
  const currentUser = currentUserData as { role: string } | null;
    
  if (currentUser?.role !== "SUPERADMIN") {
    return { success: false, error: "Only SUPERADMIN can view role change logs", logs: [] };
  }
  
  const { data: logs, error } = await supabase
    .from("role_change_logs")
    .select(`
      *,
      changedByUser:users!role_change_logs_changedBy_fkey(name, email)
    `)
    .eq("userId", userId)
    .order("createdAt", { ascending: false });
    
  if (error) {
    console.error("Failed to fetch role change logs:", error);
    return { success: false, error: "Failed to fetch logs", logs: [] };
  }
  
  return { success: true, logs: logs || [] };
}

// ============================================
// INVITE ACTIONS
// ============================================

export async function createInviteAction(
  email: string,
  role: "USER" | "ADMIN"
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: "Unauthorized" };
  
  // Get current user details and role
  const { data: currentUserData } = await supabase
    .from("users")
    .select("role, name")
    .eq("id", user.id)
    .single();
  
  const currentUser = currentUserData as { role: string; name: string | null } | null;
    
  if (!currentUser) {
    return { success: false, error: "User not found" };
  }
  
  // Check permissions
  // ADMIN can only invite USER role
  // SUPERADMIN can invite USER or ADMIN
  if (currentUser.role === "ADMIN" && role !== "USER") {
    return { success: false, error: "Admins can only invite users" };
  }
  
  if (currentUser.role !== "ADMIN" && currentUser.role !== "SUPERADMIN") {
    return { success: false, error: "Only admins can send invites" };
  }
  
  // Check if email already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();
    
  if (existingUser) {
    return { success: false, error: "A user with this email already exists" };
  }
  
  // Check for existing pending invite
  const { data: existingInvite } = await supabase
    .from("user_invites")
    .select("id, status")
    .eq("email", email)
    .eq("status", "PENDING")
    .single();
    
  if (existingInvite) {
    return { success: false, error: "A pending invite already exists for this email" };
  }
  
  // Generate secure token
  const token = crypto.randomUUID();
  
  // Set expiry to 7 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  // Create the invite
  const { error: insertError } = await (supabase
    .from("user_invites") as any)
    .insert({
      email,
      role,
      invitedBy: user.id,
      token,
      expiresAt: expiresAt.toISOString(),
    });
    
  if (insertError) {
    console.error("Failed to create invite:", insertError);
    return { success: false, error: "Failed to create invite" };
  }
  
  // Send invite email
  try {
    const { sendInviteEmail } = await import("@kaitif/email");
    const inviteUrl = `${process.env.NEXT_PUBLIC_WEB_URL || "https://kaitif.com"}/invite/${token}`;
    await sendInviteEmail(
      email,
      currentUser.name || "Kaitif Admin",
      role,
      inviteUrl
    );
  } catch (emailError) {
    console.error("Failed to send invite email:", emailError);
    // Don't fail - invite was created, email just didn't send
  }
  
  revalidatePath("/dashboard/users");
  return { success: true, token };
}

export async function cancelInviteAction(inviteId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: "Unauthorized" };
  
  // Verify user is admin
  const { data: currentUserData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  
  const currentUser = currentUserData as { role: string } | null;
    
  if (currentUser?.role !== "ADMIN" && currentUser?.role !== "SUPERADMIN") {
    return { success: false, error: "Only admins can cancel invites" };
  }
  
  const { error } = await (supabase
    .from("user_invites") as any)
    .update({ status: "CANCELLED" })
    .eq("id", inviteId)
    .eq("status", "PENDING");
    
  if (error) {
    console.error("Failed to cancel invite:", error);
    return { success: false, error: "Failed to cancel invite" };
  }
  
  revalidatePath("/dashboard/users");
  return { success: true };
}

export async function resendInviteAction(inviteId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: "Unauthorized" };
  
  // Get current user
  const { data: currentUserData } = await supabase
    .from("users")
    .select("role, name")
    .eq("id", user.id)
    .single();
  
  const currentUser = currentUserData as { role: string; name: string | null } | null;
    
  if (currentUser?.role !== "ADMIN" && currentUser?.role !== "SUPERADMIN") {
    return { success: false, error: "Only admins can resend invites" };
  }
  
  // Get invite details
  const { data: inviteData } = await supabase
    .from("user_invites")
    .select("*")
    .eq("id", inviteId)
    .eq("status", "PENDING")
    .single();
  
  const invite = inviteData as { email: string; role: string } | null;
    
  if (!invite) {
    return { success: false, error: "Invite not found or already processed" };
  }
  
  // Generate new token and extend expiry
  const newToken = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  const { error: updateError } = await (supabase
    .from("user_invites") as any)
    .update({ 
      token: newToken, 
      expiresAt: expiresAt.toISOString() 
    })
    .eq("id", inviteId);
    
  if (updateError) {
    console.error("Failed to update invite:", updateError);
    return { success: false, error: "Failed to resend invite" };
  }
  
  // Send new email
  try {
    const { sendInviteEmail } = await import("@kaitif/email");
    const inviteUrl = `${process.env.NEXT_PUBLIC_WEB_URL || "https://kaitif.com"}/invite/${newToken}`;
    await sendInviteEmail(
      invite.email,
      currentUser?.name || "Kaitif Admin",
      invite.role as "USER" | "ADMIN",
      inviteUrl
    );
  } catch (emailError) {
    console.error("Failed to send invite email:", emailError);
  }
  
  revalidatePath("/dashboard/users");
  return { success: true };
}

export async function getPendingInvitesAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, error: "Unauthorized", invites: [] };
  
  // Verify user is admin
  const { data: currentUserData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  
  const currentUser = currentUserData as { role: string } | null;
    
  if (currentUser?.role !== "ADMIN" && currentUser?.role !== "SUPERADMIN") {
    return { success: false, error: "Only admins can view invites", invites: [] };
  }
  
  const { data: invites, error } = await supabase
    .from("user_invites")
    .select(`
      *,
      inviter:users!user_invites_invitedBy_fkey(name, email)
    `)
    .eq("status", "PENDING")
    .order("createdAt", { ascending: false });
    
  if (error) {
    console.error("Failed to fetch invites:", error);
    return { success: false, error: "Failed to fetch invites", invites: [] };
  }
  
  return { success: true, invites: invites || [] };
}

// ============================================
// CURRENT USER ACTIONS
// ============================================

export async function getCurrentUserRoleAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { role: null, name: null, email: null };
  
  const { data: profileData } = await supabase
    .from("users")
    .select("role, name, email")
    .eq("id", user.id)
    .single();
  
  const profile = profileData as { role: string; name: string | null; email: string } | null;
    
  return { 
    role: profile?.role || null,
    name: profile?.name || null,
    email: profile?.email || null,
  };
}
