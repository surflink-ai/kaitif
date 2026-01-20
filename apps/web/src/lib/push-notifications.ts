import webPush from "web-push";

// Configure VAPID keys from environment
// Generate keys using: npx web-push generate-vapid-keys
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:info@kaitifskatepark.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

/**
 * Send a push notification to a single subscription
 */
export async function sendPushNotification(
  subscription: PushSubscription,
  payload: NotificationPayload
): Promise<boolean> {
  try {
    const pushPayload = JSON.stringify({
      ...payload,
      icon: payload.icon || "/icons/icon-192x192.png",
      badge: payload.badge || "/icons/icon-72x72.png",
    });

    await webPush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
      pushPayload
    );

    return true;
  } catch (error: any) {
    console.error("Push notification error:", error);

    // If subscription is invalid (user unsubscribed), return false
    if (error.statusCode === 410 || error.statusCode === 404) {
      console.log("Subscription expired or invalid");
      return false;
    }

    throw error;
  }
}

/**
 * Send push notifications to multiple subscriptions
 */
export async function sendPushNotifications(
  subscriptions: PushSubscription[],
  payload: NotificationPayload
): Promise<{ success: number; failed: number; expired: string[] }> {
  const results = {
    success: 0,
    failed: 0,
    expired: [] as string[],
  };

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        const success = await sendPushNotification(subscription, payload);
        if (success) {
          results.success++;
        } else {
          results.expired.push(subscription.endpoint);
        }
      } catch {
        results.failed++;
      }
    })
  );

  return results;
}

/**
 * Get the public VAPID key for client-side subscription
 */
export function getVapidPublicKey(): string | null {
  return process.env.VAPID_PUBLIC_KEY || null;
}

/**
 * Check if push notifications are configured
 */
export function isPushConfigured(): boolean {
  return !!(
    process.env.VAPID_PUBLIC_KEY &&
    process.env.VAPID_PRIVATE_KEY &&
    process.env.VAPID_SUBJECT
  );
}

// Notification templates for common use cases
export const NotificationTemplates = {
  eventReminder: (eventTitle: string, startTime: string) => ({
    title: "Event Starting Soon!",
    body: `${eventTitle} starts at ${startTime}. Don't forget to check in!`,
    tag: "event-reminder",
    data: { type: "event" },
  }),

  newMessage: (senderName: string) => ({
    title: "New Message",
    body: `${senderName} sent you a message`,
    tag: "message",
    data: { type: "message" },
  }),

  announcement: (title: string, preview: string) => ({
    title: `📢 ${title}`,
    body: preview,
    tag: "announcement",
    data: { type: "announcement" },
  }),

  challengeApproved: (challengeTitle: string, xpAwarded: number) => ({
    title: "Challenge Completed! 🎉",
    body: `Your "${challengeTitle}" submission was approved! +${xpAwarded} XP`,
    tag: "challenge",
    data: { type: "challenge" },
  }),

  badgeEarned: (badgeName: string) => ({
    title: "New Badge Earned! 🏆",
    body: `Congratulations! You've earned the "${badgeName}" badge`,
    tag: "badge",
    data: { type: "badge" },
  }),

  passExpiring: (daysLeft: number) => ({
    title: "Pass Expiring Soon",
    body: `Your park pass expires in ${daysLeft} day${daysLeft > 1 ? "s" : ""}. Renew now to keep skating!`,
    tag: "pass-expiry",
    data: { type: "pass" },
  }),

  marketplaceSale: (itemTitle: string) => ({
    title: "Item Sold! 💰",
    body: `Your listing "${itemTitle}" has been purchased`,
    tag: "marketplace",
    data: { type: "marketplace" },
  }),
};
