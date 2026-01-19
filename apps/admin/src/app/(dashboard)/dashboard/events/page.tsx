import { createClient } from "@/lib/supabase/server";
import { getAllEventsAdmin } from "@kaitif/db";
import EventsClientPage from "./client-page";

export default async function EventsPage() {
  const supabase = await createClient();
  const { events, count } = await getAllEventsAdmin(supabase, { limit: 100 });

  // Calculate total RSVPs
  const totalRsvps = events.reduce((acc, event) => acc + ((event.rsvps as any)?.[0]?.count || (event.rsvps as any[])?.length || 0), 0);

  return (
    <EventsClientPage 
      initialEvents={events} 
      totalEvents={count}
      totalRsvps={totalRsvps}
    />
  );
}
