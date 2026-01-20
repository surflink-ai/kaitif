import { createClient } from "@/lib/supabase/server";
import { getUserActivePass } from "@kaitif/db";
import PassesClientPage from "./client-page";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PassesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const activePass = await getUserActivePass(supabase, user.id);

  return <PassesClientPage activePass={activePass} />;
}
