import { createClient } from "@/lib/supabase/server";
import { getAnnouncements } from "@kaitif/db";
import MessagesClientPage from "./client-page";

export default async function MessagesPage() {
  const supabase = await createClient();
  const announcements = await getAnnouncements(supabase, 50);

  return (
    <MessagesClientPage 
      initialAnnouncements={announcements}
    />
  );
}
