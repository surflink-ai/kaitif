import Stripe from "stripe";
import { PASS_PRICES } from "@kaitif/db";

// Server-side Stripe client (lazy initialization to avoid build-time errors)
let _stripe: Stripe | null = null;
export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return _stripe;
}

// Keep backward compatibility
export const stripe = {
  get checkout() {
    return getStripe().checkout;
  },
  get billingPortal() {
    return getStripe().billingPortal;
  },
};

type PassType = keyof typeof PASS_PRICES;

const passNames: Record<PassType, string> = {
  DAY: "Day Pass",
  WEEK: "Week Pass",
  MONTH: "Monthly Pass",
  ANNUAL: "Annual Pass",
};

// Create a checkout session for pass purchase
export async function createPassCheckoutSession({
  userId,
  passType,
  customerEmail,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  passType: PassType;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Kaitif ${passNames[passType]}`,
            description: `Access to Kaitif Skatepark`,
            images: [], // Add product images here
          },
          unit_amount: PASS_PRICES[passType],
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      passType,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session.url!;
}

// Create a checkout session for marketplace purchase
export async function createMarketplaceCheckoutSession({
  listingId,
  buyerId,
  sellerId,
  amount,
  title,
  customerEmail,
  successUrl,
  cancelUrl,
}: {
  listingId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  title: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  // In production, you'd use Stripe Connect for marketplace payments
  // This is a simplified version
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: title,
            description: "Marketplace purchase",
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      listingId,
      buyerId,
      sellerId,
      type: "marketplace",
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session.url!;
}

// Get customer portal URL
export async function getCustomerPortalUrl(
  customerId: string,
  returnUrl: string
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
}
