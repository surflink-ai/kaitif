import { createClient } from "@/lib/supabase/server";
import { getAllWaiversAdmin, getWaiverStats } from "@kaitif/db";
import WaiversClientPage from "./client-page";

export default async function WaiversPage() {
  const supabase = await createClient();
  
  const [waiversData, stats] = await Promise.all([
    getAllWaiversAdmin(supabase, { limit: 100 }),
    getWaiverStats(supabase)
  ]);

  return (
    <WaiversClientPage 
      initialWaivers={waiversData.waivers}
      stats={stats}
    />
  );
}
