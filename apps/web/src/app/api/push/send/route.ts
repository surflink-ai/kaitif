import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  sendPushNotifications,
  isPushConfigured,
  type PushSubscription,
  type NotificationPayload,
} from "@/lib/push-notifications";
import { z } from "zod";

const sendSchema = z.object({
  userIds: z.array(z.string()).optional(),
  all: z.boolean().optional(),
  payload: z.object({
    title: z.string(),
    body: z.string(),
    icon: z.string().optional(),
    badge: z.string().optional(),
    image: z.string().optional(),
    tag: z.string().optional(),
    data: z.record(z.any()).optional(),
  }),
});

// POST: Send push notifications (admin only)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin/staff
    const { data: dbUserData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const dbUser = dbUserData as { role: string } | null;

    if (!dbUser || !["ADMIN", "SUPERADMIN"].includes(dbUser.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!isPushConfigured()) {
      return NextResponse.json(
        { error: "Push notifications not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { userIds, all, payload } = sendSchema.parse(body);

    // Get subscriptions based on targeting
    let query = supabase.from("push_subscriptions").select("endpoint, keys");

    if (!all && userIds && userIds.length > 0) {
      query = query.in("userId", userIds);
    }

    const { data: subscriptions, error } = await query;

    if (error || !subscriptions) {
      console.error("Error fetching subscriptions:", error);
      return NextResponse.json(
        { error: "Failed to fetch subscriptions" },
        { status: 500 }
      );
    }

    if (subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        message: "No active subscriptions found",
      });
    }

    // Send notifications
    const results = await sendPushNotifications(
      subscriptions as PushSubscription[],
      payload as NotificationPayload
    );

    // Clean up expired subscriptions
    if (results.expired.length > 0) {
      await supabase
        .from("push_subscriptions")
        .delete()
        .in("endpoint", results.expired);
    }

    return NextResponse.json({
      success: true,
      sent: results.success,
      failed: results.failed,
      expired: results.expired.length,
    });
  } catch (error) {
    console.error("Push send error:", error);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}
