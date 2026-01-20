"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel, RealtimePresenceState } from "@supabase/supabase-js";

interface PresenceState {
  online: boolean;
  lastSeen?: string;
  [key: string]: unknown;
}

interface UsePresenceConfig {
  /** Unique channel name for the presence room */
  channelName: string;
  /** Current user's ID */
  userId: string;
  /** Current user's display name */
  userName?: string;
  /** Whether presence tracking is enabled */
  enabled?: boolean;
}

interface PresenceUser {
  odolId?: string;
  userId?: string;
  userName?: string;
  online?: boolean;
  lastSeen?: string;
  isTyping?: boolean;
  presence_ref?: string;
  [key: string]: unknown;
}

/**
 * Hook for Supabase Realtime Presence (online status, typing indicators)
 */
export function usePresence({
  channelName,
  userId,
  userName,
  enabled = true,
}: UsePresenceConfig) {
  const supabase = createClient();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [presenceState, setPresenceState] = useState<Record<string, PresenceUser[]>>({});
  const [isConnected, setIsConnected] = useState(false);

  // Track own state
  const trackPresence = useCallback(
    async (state: Partial<PresenceState> = {}) => {
      if (!channelRef.current) return;

      await channelRef.current.track({
        odolng: true,
        userId,
        userName,
        lastSeen: new Date().toISOString(),
        ...state,
      });
    },
    [userId, userName]
  );

  // Send typing indicator
  const setTyping = useCallback(
    (isTyping: boolean) => {
      trackPresence({ isTyping });
    },
    [trackPresence]
  );

  useEffect(() => {
    if (!enabled || !userId) {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    const channel = supabase.channel(`presence_${channelName}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<PresenceUser>();
        setPresenceState(state);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log(`[Presence] ${key} joined`, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log(`[Presence] ${key} left`, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
          // Track our presence when subscribed
          await channel.track({
            online: true,
            userId,
            userName,
            lastSeen: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        channelRef.current.untrack();
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        setIsConnected(false);
      }
    };
  }, [channelName, userId, userName, enabled, supabase]);

  // Get online users (excluding self)
  const onlineUsers = Object.entries(presenceState)
    .filter(([key]) => key !== userId)
    .flatMap(([, presences]) => presences)
    .filter((p) => p.online);

  // Check if specific user is online
  const isUserOnline = useCallback(
    (checkUserId: string): boolean => {
      const userPresences = presenceState[checkUserId] || [];
      return userPresences.some((p) => p.online);
    },
    [presenceState]
  );

  // Check if specific user is typing
  const isUserTyping = useCallback(
    (checkUserId: string): boolean => {
      const userPresences = presenceState[checkUserId] || [];
      return userPresences.some((p) => p.isTyping);
    },
    [presenceState]
  );

  // Get all users who are typing (excluding self)
  const typingUsers = Object.entries(presenceState)
    .filter(([key]) => key !== userId)
    .flatMap(([, presences]) => presences)
    .filter((p) => p.isTyping);

  return {
    presenceState,
    onlineUsers,
    typingUsers,
    isConnected,
    isUserOnline,
    isUserTyping,
    setTyping,
    trackPresence,
  };
}

/**
 * Simplified hook for just tracking online status in a conversation
 */
export function useConversationPresence(conversationId: string, userId: string, userName?: string) {
  return usePresence({
    channelName: `conversation_${conversationId}`,
    userId,
    userName,
    enabled: !!conversationId && !!userId,
  });
}
