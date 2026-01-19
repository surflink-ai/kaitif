import { createClient } from "@/lib/supabase/server";
import { getUserById } from "@kaitif/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserById(supabase, authUser.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Fetch stats (counts)
  const { count: totalVisits } = await supabase
    .from("pass_scans")
    .select("*", { count: "exact", head: true })
    .eq("passId", authUser.id); // Note: scans are linked to passes, which are linked to users. Need join or careful query.
    // Simplified: assuming pass scans table might not have userId directly if normalized.
    // Actually, pass_scans has passId. passes has userId.
    // Let's do a join query.
  
  const { count: visits } = await supabase
    .from("pass_scans")
    .select("id, pass:passes!inner(userId)", { count: "exact", head: true })
    .eq("pass.userId", authUser.id);

  const { count: eventsAttended } = await supabase
    .from("event_attendances")
    .select("*", { count: "exact", head: true })
    .eq("userId", authUser.id);

  const { count: challengesCompleted } = await supabase
    .from("challenge_completions")
    .select("*", { count: "exact", head: true })
    .eq("userId", authUser.id)
    .eq("status", "APPROVED");

  const { count: badges } = await supabase
    .from("user_badges")
    .select("*", { count: "exact", head: true })
    .eq("userId", authUser.id);

  const { count: listings } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("sellerId", authUser.id);

  return NextResponse.json({
    user,
    stats: {
      totalVisits: (visits || 0) + (eventsAttended || 0), // Rough approximation
      eventsAttended: eventsAttended || 0,
      challengesCompleted: challengesCompleted || 0,
      badges: badges || 0,
      listings: listings || 0,
    }
  });
}
