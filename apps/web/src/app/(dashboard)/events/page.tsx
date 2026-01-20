import { createClient } from "@/lib/supabase/server";
import { getUpcomingEvents, getPastEvents, getTopSuggestions, EventRSVP } from "@kaitif/db";
import EventsClientPage from "./client-page";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [upcomingEvents, pastEvents, topSuggestions] = await Promise.all([
    getUpcomingEvents(supabase),
    getPastEvents(supabase),
    getTopSuggestions(supabase),
  ]);

  // Fetch user's RSVPs
  const { data: rsvpsData } = await supabase
    .from("event_rsvps")
    .select("*")
    .eq("userId", user.id);

  const userRsvps = (rsvpsData || []).reduce((acc, rsvp: any) => {
    acc[rsvp.eventId] = rsvp as EventRSVP;
    return acc;
  }, {} as Record<string, EventRSVP>);

  return (
    <EventsClientPage 
      upcomingEvents={upcomingEvents as any}
      pastEvents={pastEvents as any}
      topSuggestions={topSuggestions as any}
      userRsvps={userRsvps}
      userId={user.id}
    />
  );
}
