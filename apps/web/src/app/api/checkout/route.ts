import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPassCheckoutSession } from "@/lib/stripe";
import { purchasePassSchema } from "@kaitif/db";
import { ensureUserExists } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists in public.users table
    await ensureUserExists(user);

    const body = await request.json();
    const { type } = purchasePassSchema.parse(body);

    const checkoutUrl = await createPassCheckoutSession({
      userId: user.id,
      passType: type,
      customerEmail: user.email!,
      successUrl: `${request.headers.get("origin")}/passes?success=true`,
      cancelUrl: `${request.headers.get("origin")}/passes?canceled=true`,
    });

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
