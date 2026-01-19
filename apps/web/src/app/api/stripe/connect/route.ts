import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { getUserById } from "@kaitif/db";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get full user profile to check stripeAccountId
    const user = await getUserById(supabase, authUser.id);
    if (!user) {
         return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let accountId = user.stripeAccountId;

    if (!accountId) {
      // Create Stripe Connect Account
      const account = await getStripe().accounts.create({
        type: "express",
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
            userId: user.id
        }
      });
      accountId = account.id;

      // Save to DB
      await (supabase as any).from("users").update({ stripeAccountId: accountId }).eq("id", user.id);
    }

    // Check if account is fully onboarded? 
    // Usually we just generate a link; if they are already onboarded, Stripe handles it or we can check details_submitted.
    const account = await getStripe().accounts.retrieve(accountId);
    
    if (account.details_submitted) {
        // Dashboard login link if already onboarded
        const loginLink = await getStripe().accounts.createLoginLink(accountId);
        return NextResponse.json({ url: loginLink.url, isOnboarded: true });
    }

    // Create Account Link for onboarding
    const origin = request.headers.get("origin");
    const accountLink = await getStripe().accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/marketplace?connect=refresh`,
      return_url: `${origin}/marketplace?connect=return`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url, isOnboarded: false });
  } catch (error) {
    console.error("Stripe Connect error:", error);
    return NextResponse.json(
      { error: "Failed to initiate Connect onboarding" },
      { status: 500 }
    );
  }
}
