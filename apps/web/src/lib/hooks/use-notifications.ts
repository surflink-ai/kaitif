"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRealtimeSubscription } from "./use-realtime";

export interface Notification {
  id: string;
  userId: string;
  type: "like" | "comment" | "rsvp" | "message" | "badge" | "challenge";
  title: string;
  body: string | null;
  resourceId: string | null;
  resourceType: "post" | "event" | "message" | "badge" | null;
  read: boolean;
  createdAt: string;
}

interface UseNotificationsConfig {
  userId: string;
  enabled?: boolean;
  limit?: number;
}

/**
 * Hook for managing real-time notifications
 */
export function useNotifications({
  userId,
  enabled = true,
  limit = 20,
}: UseNotificationsConfig) {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("userId", userId)
        .order("createdAt", { ascending: false })
        .limit(limit);

      if (error) throw error;

      const notificationData = (data || []) as Notification[];
      setNotifications(notificationData);
      setUnreadCount(notificationData.filter((n) => !n.read).length);
    } catch (error) {
      console.error("[Notifications] Failed to fetch:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, limit, supabase]);

  // Initial fetch
  useEffect(() => {
    if (enabled && userId) {
      fetchNotifications();
    }
  }, [enabled, userId, fetchNotifications]);

  // Subscribe to new notifications
  useRealtimeSubscription<Notification>({
    table: "notifications",
    event: "INSERT",
    filter: `userId=eq.${userId}`,
    enabled: enabled && !!userId,
    onData: (payload) => {
      const newNotification = payload.new as Notification;
      setNotifications((prev) => [newNotification, ...prev].slice(0, limit));
      setUnreadCount((prev) => prev + 1);
    },
  });

  // Subscribe to notification updates (read status)
  useRealtimeSubscription<Notification>({
    table: "notifications",
    event: "UPDATE",
    filter: `userId=eq.${userId}`,
    enabled: enabled && !!userId,
    onData: (payload) => {
      const updatedNotification = payload.new as Notification;
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === updatedNotification.id ? updatedNotification : n
        )
      );
      // Recalculate unread count
      setNotifications((prev) => {
        setUnreadCount(prev.filter((n) => !n.read).length);
        return prev;
      });
    },
  });

  // Mark single notification as read
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from("notifications")
          .update({ read: true })
          .eq("id", notificationId);

        if (error) throw error;

        // Optimistic update
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("[Notifications] Failed to mark as read:", error);
      }
    },
    [supabase]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!userId) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("notifications")
        .update({ read: true })
        .eq("userId", userId)
        .eq("read", false);

      if (error) throw error;

      // Optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("[Notifications] Failed to mark all as read:", error);
    }
  }, [userId, supabase]);

  // Delete a notification
  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        const notification = notifications.find((n) => n.id === notificationId);
        const { error } = await supabase
          .from("notifications")
          .delete()
          .eq("id", notificationId);

        if (error) throw error;

        // Optimistic update
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        if (notification && !notification.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } catch (error) {
        console.error("[Notifications] Failed to delete:", error);
      }
    },
    [notifications, supabase]
  );

  // Clear all notifications
  const clearAll = useCallback(async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("userId", userId);

      if (error) throw error;

      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("[Notifications] Failed to clear all:", error);
    }
  }, [userId, supabase]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    refresh: fetchNotifications,
  };
}
