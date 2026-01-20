import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getVapidPublicKey, isPushConfigured } from "@/lib/push-notifications";
import { z } from "zod";

const subscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

// GET: Return VAPID public key for client subscription
export async function GET() {
  if (!isPushConfigured()) {
    return NextResponse.json(
      { error: "Push notifications not configured" },
      { status: 503 }
    );
  }

  const publicKey = getVapidPublicKey();
  return NextResponse.json({ publicKey });
}

// POST: Save push subscription
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isPushConfigured()) {
      return NextResponse.json(
        { error: "Push notifications not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const subscription = subscriptionSchema.parse(body);

    // Check if this subscription already exists
    const { data: existingData } = await supabase
      .from("push_subscriptions")
      .select("id")
      .eq("endpoint", subscription.endpoint)
      .single();

    const existing = existingData as { id: string } | null;

    if (existing) {
      // Update existing subscription
      await (supabase as any)
        .from("push_subscriptions")
        .update({
          keys: subscription.keys,
          userId: user.id,
        })
        .eq("id", existing.id);
    } else {
      // Create new subscription
      await (supabase as any).from("push_subscriptions").insert({
        userId: user.id,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push subscription error:", error);
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 }
    );
  }
}

// DELETE: Remove push subscription
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { endpoint } = await request.json();

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint is required" },
        { status: 400 }
      );
    }

    await supabase
      .from("push_subscriptions")
      .delete()
      .eq("userId", user.id)
      .eq("endpoint", endpoint);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push unsubscribe error:", error);
    return NextResponse.json(
      { error: "Failed to remove subscription" },
      { status: 500 }
    );
  }
}
