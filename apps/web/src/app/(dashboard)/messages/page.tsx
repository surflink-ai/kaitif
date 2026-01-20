import { createClient } from "@/lib/supabase/server";
import { getUserConversations } from "@kaitif/db";
import MessagesClientPage from "./client-page";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const conversations = await getUserConversations(supabase, user.id);

  return (
    <MessagesClientPage 
      initialConversations={conversations}
      currentUserId={user.id}
    />
  );
}
