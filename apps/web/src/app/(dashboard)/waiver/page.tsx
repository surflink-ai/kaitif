import { createClient } from "@/lib/supabase/server";
import { getActiveWaiverVersion, getUserValidWaiver } from "@kaitif/db";
import WaiverClientPage from "./client-page";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WaiverPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [activeVersion, validWaiver] = await Promise.all([
    getActiveWaiverVersion(supabase),
    getUserValidWaiver(supabase, user.id)
  ]);

  return <WaiverClientPage activeVersion={activeVersion} validWaiver={validWaiver} user={user as any} />;
}
