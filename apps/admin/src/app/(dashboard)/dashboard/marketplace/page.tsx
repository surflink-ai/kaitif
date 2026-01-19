import { createClient } from "@/lib/supabase/server";
import { getListings, getListingReports, getMarketplaceStats } from "@kaitif/db";
import MarketplaceClientPage from "./client-page";

export default async function MarketplacePage() {
  const supabase = await createClient();
  
  const [listingsData, reports, stats] = await Promise.all([
    getListings(supabase, { limit: 100 }),
    getListingReports(supabase, { status: "PENDING" }),
    getMarketplaceStats(supabase)
  ]);

  return (
    <MarketplaceClientPage 
      initialListings={listingsData.listings}
      initialReports={reports}
      stats={stats}
    />
  );
}
