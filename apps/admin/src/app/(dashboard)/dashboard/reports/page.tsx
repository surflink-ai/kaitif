import { createClient } from "@/lib/supabase/server";
import { 
  getRevenueAnalytics, 
  getPassDistribution, 
  getHourlyTraffic,
  getDashboardStats 
} from "@kaitif/db";
import ReportsClientPage from "./client-page";

export default async function ReportsPage() {
  const supabase = await createClient();
  
  const [revenueData, passDistribution, hourlyTraffic, stats] = await Promise.all([
    getRevenueAnalytics(supabase),
    getPassDistribution(supabase),
    getHourlyTraffic(supabase),
    getDashboardStats(supabase)
  ]);

  return (
    <ReportsClientPage 
      revenueData={revenueData}
      passDistribution={passDistribution}
      hourlyTraffic={hourlyTraffic}
      stats={stats}
    />
  );
}
