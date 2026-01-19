import type { SupabaseClient } from "../client";
import type {
  Conversation,
  ConversationWithRelations,
  ConversationMember,
  Message,
  MessageWithRelations,
  ConversationType,
} from "../types";

// Get conversation by ID
export async function getConversationById(
  supabase: SupabaseClient,
  conversationId: string
): Promise<ConversationWithRelations | null> {
  const { data, error } = await supabase
    .from("conversations")
    .select(`
      *,
      members:conversation_members (
        *,
        user:users (id, name, avatarUrl)
      )
    `)
    .eq("id", conversationId)
    .single();

  if (error) {
    console.error("Error fetching conversation:", error);
    return null;
  }

  return data as ConversationWithRelations;
}

// Get user's conversations
export async function getUserConversations(
  supabase: SupabaseClient,
  userId: string
): Promise<(Conversation & {
  members: (ConversationMember & { user: { id: string; name: string | null; avatarUrl: string | null } })[];
  lastMessage?: Message;
  unreadCount: number;
})[]> {
  // Get all conversations user is a member of
  const { data: memberData, error: memberError } = await supabase
    .from("conversation_members")
    .select("conversationId, lastReadAt")
    .eq("userId", userId);

  if (memberError || !memberData) {
    console.error("Error fetching member data:", memberError);
    return [];
  }

  const conversationIds = (memberData as any[]).map((m) => m.conversationId);
  if (conversationIds.length === 0) return [];

  // Get conversations with members
  const { data, error } = await supabase
    .from("conversations")
    .select(`
      *,
      members:conversation_members (
        *,
        user:users (id, name, avatarUrl)
      )
    `)
    .in("id", conversationIds)
    .order("updatedAt", { ascending: false });

  if (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }

  // Get last message and unread count for each conversation
  const result = await Promise.all(
    (data as any[]).map(async (conversation) => {
      const memberInfo = (memberData as any[]).find((m) => m.conversationId === conversation.id);

      // Get last message
      const { data: messages } = await supabase
        .from("messages")
        .select("*")
        .eq("conversationId", conversation.id)
        .order("createdAt", { ascending: false })
        .limit(1);

      // Get unread count
      let unreadCount = 0;
      if (memberInfo?.lastReadAt) {
        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("conversationId", conversation.id)
          .gt("createdAt", memberInfo.lastReadAt)
          .neq("senderId", userId);
        unreadCount = count || 0;
      }

      return {
        ...conversation,
        lastMessage: messages?.[0],
        unreadCount,
      };
    })
  );

  return result as (Conversation & {
    members: (ConversationMember & { user: { id: string; name: string | null; avatarUrl: string | null } })[];
    lastMessage?: Message;
    unreadCount: number;
  })[];
}

// Create conversation
export async function createConversation(
  supabase: SupabaseClient,
  creatorId: string,
  memberIds: string[],
  type: ConversationType = "DM",
  name?: string
): Promise<Conversation | null> {
  // For DMs, check if conversation already exists
  if (type === "DM" && memberIds.length === 1) {
    const existingConversation = await findDMConversation(supabase, creatorId, memberIds[0]);
    if (existingConversation) {
      return existingConversation;
    }
  }

  // Create conversation
  const { data: conversation, error: convError } = await (supabase as any)
    .from("conversations")
    .insert({
      type,
      name: type === "GROUP" ? name : null,
    })
    .select()
    .single();

  if (convError || !conversation) {
    console.error("Error creating conversation:", convError);
    return null;
  }

  // Add all members including creator
  const allMemberIds = [creatorId, ...memberIds.filter((id) => id !== creatorId)];

  const { error: memberError } = await (supabase as any).from("conversation_members").insert(
    allMemberIds.map((userId) => ({
      conversationId: (conversation as Conversation).id,
      userId,
    }))
  );

  if (memberError) {
    console.error("Error adding members:", memberError);
    // Cleanup conversation
    await supabase.from("conversations").delete().eq("id", conversation.id);
    return null;
  }

  return conversation;
}

// Find existing DM conversation between two users
async function findDMConversation(
  supabase: SupabaseClient,
  userId1: string,
  userId2: string
): Promise<Conversation | null> {
  // Get all DM conversations for user1
  const { data: user1Convs } = await supabase
    .from("conversation_members")
    .select("conversationId")
    .eq("userId", userId1);

  if (!user1Convs || (user1Convs as any[]).length === 0) return null;

  // Check if user2 is in any of those conversations
  for (const conv of user1Convs as any[]) {
    const { data: conversation } = await supabase
      .from("conversations")
      .select(`
        *,
        members:conversation_members (userId)
      `)
      .eq("id", conv.conversationId)
      .eq("type", "DM")
      .single();

    if (conversation) {
      const members = (conversation as any).members as { userId: string }[];
      if (members.length === 2 && members.some((m) => m.userId === userId2)) {
        return conversation as Conversation;
      }
    }
  }

  return null;
}

// Send message
export async function sendMessage(
  supabase: SupabaseClient,
  conversationId: string,
  senderId: string,
  content: string,
  replyToId?: string
): Promise<Message | null> {
  const { data, error } = await (supabase as any)
    .from("messages")
    .insert({
      conversationId,
      senderId,
      content,
      replyToId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error sending message:", error);
    return null;
  }

  // Update conversation's updatedAt
  await (supabase as any)
    .from("conversations")
    .update({ updatedAt: new Date().toISOString() })
    .eq("id", conversationId);

  return data as Message;
}

// Get messages in conversation
export async function getMessages(
  supabase: SupabaseClient,
  conversationId: string,
  options?: {
    limit?: number;
    before?: string;
  }
): Promise<MessageWithRelations[]> {
  let query = supabase
    .from("messages")
    .select(`
      *,
      sender:users (id, name, avatarUrl),
      replyTo:messages (
        id,
        content,
        sender:users (id, name)
      )
    `)
    .eq("conversationId", conversationId)
    .order("createdAt", { ascending: false });

  if (options?.before) {
    query = query.lt("createdAt", options.before);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  } else {
    query = query.limit(50);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  // Return in chronological order
  return (data as MessageWithRelations[]).reverse();
}

// Mark messages as read
export async function markAsRead(
  supabase: SupabaseClient,
  conversationId: string,
  userId: string
): Promise<boolean> {
  const { error } = await (supabase as any)
    .from("conversation_members")
    .update({ lastReadAt: new Date().toISOString() })
    .eq("conversationId", conversationId)
    .eq("userId", userId);

  if (error) {
    console.error("Error marking as read:", error);
    return false;
  }

  return true;
}

// Create announcement (admin/staff only)
export async function createAnnouncement(
  supabase: SupabaseClient,
  senderId: string,
  content: string
): Promise<{ conversation: Conversation; message: Message } | null> {
  // Create or get announcement conversation
  let conversation: Conversation | null = null;

  const { data: existing } = await supabase
    .from("conversations")
    .select("*")
    .eq("isAnnouncement", true)
    .single();

  if (existing) {
    conversation = existing;
  } else {
    const { data: newConv, error } = await (supabase as any)
      .from("conversations")
      .insert({
        type: "GROUP" as ConversationType,
        name: "Park Announcements",
        isAnnouncement: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating announcement conversation:", error);
      return null;
    }

    conversation = newConv;
  }

  if (!conversation) {
    return null;
  }

  // Send the announcement message
  const message = await sendMessage(supabase, conversation.id, senderId, content);

  if (!message) {
    return null;
  }

  return { conversation, message };
}

// Get announcements
export async function getAnnouncements(
  supabase: SupabaseClient,
  limit: number = 10
): Promise<MessageWithRelations[]> {
  const { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("isAnnouncement", true)
    .single();

  if (!conversation) {
    return [];
  }

  return getMessages(supabase, (conversation as any).id, { limit });
}

// Add member to conversation
export async function addMemberToConversation(
  supabase: SupabaseClient,
  conversationId: string,
  userId: string
): Promise<boolean> {
  const { error } = await (supabase as any).from("conversation_members").insert({
    conversationId,
    userId,
  });

  if (error) {
    console.error("Error adding member:", error);
    return false;
  }

  return true;
}

// Remove member from conversation
export async function removeMemberFromConversation(
  supabase: SupabaseClient,
  conversationId: string,
  userId: string
): Promise<boolean> {
  const { error } = await supabase
    .from("conversation_members")
    .delete()
    .eq("conversationId", conversationId)
    .eq("userId", userId);

  if (error) {
    console.error("Error removing member:", error);
    return false;
  }

  return true;
}

// Get total unread count for user
export async function getTotalUnreadCount(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const conversations = await getUserConversations(supabase, userId);
  return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
}
