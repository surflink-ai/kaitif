import { createClient } from "@/lib/supabase/server";
import { getChallenges, getUserChallengeCompletions, getLeaderboard, getUserBadges } from "@kaitif/db";
import ChallengesClientPage from "./client-page";
import { redirect } from "next/navigation";

export default async function ChallengesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [challenges, userCompletions, leaderboard, userBadges] = await Promise.all([
    getChallenges(supabase),
    getUserChallengeCompletions(supabase, user.id),
    getLeaderboard(supabase, 50),
    getUserBadges(supabase, user.id),
  ]);

  return (
    <ChallengesClientPage 
      challenges={challenges}
      userCompletions={userCompletions}
      leaderboard={leaderboard}
      userBadges={userBadges}
      userId={user.id}
    />
  );
}
