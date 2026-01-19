import { createClient } from "@/lib/supabase/server";
import { getAllChallengesAdmin, getPendingCompletions } from "@kaitif/db";
import ChallengesClientPage from "./client-page";

export default async function ChallengesPage() {
  const supabase = await createClient();
  
  const [challengesData, pendingSubmissions] = await Promise.all([
    getAllChallengesAdmin(supabase, { limit: 100 }),
    getPendingCompletions(supabase)
  ]);

  return (
    <ChallengesClientPage 
      initialChallenges={challengesData.challenges}
      initialPendingSubmissions={pendingSubmissions}
    />
  );
}
