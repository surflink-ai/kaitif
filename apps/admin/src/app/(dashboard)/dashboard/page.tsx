import { createClient } from "@/lib/supabase/server";
import { 
  getDashboardStats, 
  getRevenueByPeriod, 
  getAttendanceByPeriod, 
  getRecentActivity 
} from "@kaitif/db";
import DashboardClientPage from "./client-page";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const [stats, revenueData, attendanceData, recentActivity] = await Promise.all([
    getDashboardStats(supabase),
    getRevenueByPeriod(supabase),
    getAttendanceByPeriod(supabase),
    getRecentActivity(supabase)
  ]);

  return (
    <DashboardClientPage 
      stats={stats}
      revenueData={revenueData}
      attendanceData={attendanceData}
      recentActivity={recentActivity}
    />
  );
}
