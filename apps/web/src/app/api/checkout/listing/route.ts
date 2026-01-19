import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createTransaction, getListingById, getUserById, MARKETPLACE_FEE_PERCENT } from "@kaitif/db";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId } = await request.json();

    // 1. Get Listing & Seller
    const listing = await getListingById(supabase, listingId);
    if (!listing || listing.status !== "ACTIVE") {
      return NextResponse.json({ error: "Listing not available" }, { status: 400 });
    }

    const seller = await getUserById(supabase, listing.sellerId);
    if (!seller || !seller.stripeAccountId) {
      return NextResponse.json({ error: "Seller cannot accept payments" }, { status: 400 });
    }

    if (seller.id === user.id) {
        return NextResponse.json({ error: "Cannot buy your own listing" }, { status: 400 });
    }

    // 2. Create Transaction Record (Reservations)
    const transaction = await createTransaction(supabase, listingId, user.id);
    if (!transaction) {
      return NextResponse.json({ error: "Failed to initiate transaction" }, { status: 500 });
    }

    // 3. Create Stripe Session
    const amount = listing.price; // in cents
    const applicationFeeAmount = Math.round(amount * (MARKETPLACE_FEE_PERCENT / 100));

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: listing.title,
              description: listing.description,
              images: listing.images.length > 0 ? listing.images : undefined,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: seller.stripeAccountId,
        },
        metadata: {
            transactionId: transaction.id,
            listingId: listing.id
        }
      },
      metadata: {
          transactionId: transaction.id,
          listingId: listing.id
      },
      success_url: `${request.headers.get("origin")}/marketplace?success=true&transactionId=${transaction.id}`,
      cancel_url: `${request.headers.get("origin")}/marketplace?canceled=true&transactionId=${transaction.id}`,
    });

    // Update transaction with payment ID (optional but good for tracking)
    await (supabase as any).from("transactions").update({ stripePaymentId: session.id }).eq("id", transaction.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout listing error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
