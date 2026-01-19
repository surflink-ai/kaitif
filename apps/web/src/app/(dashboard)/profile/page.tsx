import { createClient } from "@/lib/supabase/server";
import { getUserWithRelations } from "@kaitif/db";
import ProfileClientPage from "./client-page";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return null;
  }

  const user = await getUserWithRelations(supabase, authUser.id);

  if (!user) {
    return null;
  }

  // Calculate stats server-side or fetch via API if complex
  // Here we'll fetch basic counts from the relation if possible, or assume simple counts from array lengths if loaded
  // But pass_scans etc are not in UserWithRelations by default unless added.
  // We'll calculate simple stats from loaded relations for now or fetch extra counts.
  
  // Actually, getUserWithRelations includes passes, waivers, badges. 
  // We need counts for visits (pass scans), events attended, challenges completed, listings.
  // We can do parallel queries here or fetch from the API endpoint we made (but we are on server).
  // Let's do parallel queries.
  
  const { count: eventsAttended } = await supabase
    .from("event_attendances")
    .select("*", { count: "exact", head: true })
    .eq("userId", authUser.id);

  const { count: challengesCompleted } = await supabase
    .from("challenge_completions")
    .select("*", { count: "exact", head: true })
    .eq("userId", authUser.id)
    .eq("status", "APPROVED");

  const { count: listings } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("sellerId", authUser.id);

  const { count: visits } = await supabase
    .from("pass_scans")
    .select("id, pass:passes!inner(userId)", { count: "exact", head: true })
    .eq("pass.userId", authUser.id);

  const stats = {
    totalVisits: (visits || 0) + (eventsAttended || 0),
    eventsAttended: eventsAttended || 0,
    challengesCompleted: challengesCompleted || 0,
    badges: user.badges?.length || 0,
    listings: listings || 0,
  };

  return <ProfileClientPage user={user} stats={stats} />;
}
