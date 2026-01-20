import { createClient } from "@/lib/supabase/server";
import { getListings, getUserById } from "@kaitif/db";
import MarketplaceClientPage from "./client-page";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MarketplacePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [listingsData, userProfile] = await Promise.all([
    getListings(supabase),
    getUserById(supabase, user.id)
  ]);

  return (
    <MarketplaceClientPage 
      listings={listingsData.listings}
      userStripeAccountId={userProfile?.stripeAccountId || null}
      userId={user.id}
    />
  );
}
