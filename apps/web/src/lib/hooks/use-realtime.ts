"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

type PostgresChangeEvent = "INSERT" | "UPDATE" | "DELETE" | "*";

interface RealtimePayload<T> {
  new: T;
  old: Partial<T>;
  eventType: string;
}

interface RealtimeSubscriptionConfig<T> {
  /** The database table to subscribe to */
  table: string;
  /** The schema (defaults to 'public') */
  schema?: string;
  /** The event type to listen for */
  event: PostgresChangeEvent;
  /** Optional filter (e.g., "userId=eq.123") */
  filter?: string;
  /** Callback when the event occurs */
  onData: (payload: RealtimePayload<T>) => void;
  /** Whether the subscription is enabled */
  enabled?: boolean;
}

/**
 * Generic hook for subscribing to Supabase Realtime postgres_changes
 * Handles channel creation and cleanup automatically
 */
export function useRealtimeSubscription<T>({
  table,
  schema = "public",
  event,
  filter,
  onData,
  enabled = true,
}: RealtimeSubscriptionConfig<T>) {
  const supabase = createClient();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const onDataRef = useRef(onData);

  // Keep callback ref up to date
  useEffect(() => {
    onDataRef.current = onData;
  }, [onData]);

  useEffect(() => {
    if (!enabled) {
      // Clean up if disabled
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      return;
    }

    // Create unique channel name
    const channelName = `realtime_${table}_${event}_${filter || "all"}_${Date.now()}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channel = supabase.channel(channelName).on(
      "postgres_changes" as any,
      {
        event,
        schema,
        table,
        filter,
      },
      (payload: unknown) => {
        onDataRef.current(payload as RealtimePayload<T>);
      }
    );

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log(`[Realtime] Subscribed to ${table} (${event})`);
      }
    });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, schema, event, filter, enabled, supabase]);

  return channelRef.current;
}

/**
 * Hook for subscribing to multiple events on the same table
 */
export function useRealtimeTable<T>({
  table,
  schema = "public",
  filter,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
}: {
  table: string;
  schema?: string;
  filter?: string;
  onInsert?: (record: T) => void;
  onUpdate?: (record: T, oldRecord: Partial<T>) => void;
  onDelete?: (oldRecord: Partial<T>) => void;
  enabled?: boolean;
}) {
  const supabase = createClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Keep callbacks in refs
  const callbacksRef = useRef({ onInsert, onUpdate, onDelete });
  useEffect(() => {
    callbacksRef.current = { onInsert, onUpdate, onDelete };
  }, [onInsert, onUpdate, onDelete]);

  useEffect(() => {
    if (!enabled) {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      return;
    }

    const channelName = `realtime_table_${table}_${filter || "all"}_${Date.now()}`;
    const channel = supabase.channel(channelName);

    // Subscribe to all events we have callbacks for
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (callbacksRef.current.onInsert) {
      channel.on(
        "postgres_changes" as any,
        { event: "INSERT", schema, table, filter },
        (payload: unknown) => {
          const p = payload as { new: T };
          callbacksRef.current.onInsert?.(p.new);
        }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (callbacksRef.current.onUpdate) {
      channel.on(
        "postgres_changes" as any,
        { event: "UPDATE", schema, table, filter },
        (payload: unknown) => {
          const p = payload as { new: T; old: Partial<T> };
          callbacksRef.current.onUpdate?.(p.new, p.old);
        }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (callbacksRef.current.onDelete) {
      channel.on(
        "postgres_changes" as any,
        { event: "DELETE", schema, table, filter },
        (payload: unknown) => {
          const p = payload as { old: Partial<T> };
          callbacksRef.current.onDelete?.(p.old);
        }
      );
    }

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log(`[Realtime] Subscribed to ${table} (all events)`);
      }
    });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, schema, filter, enabled, supabase]);

  return channelRef.current;
}
