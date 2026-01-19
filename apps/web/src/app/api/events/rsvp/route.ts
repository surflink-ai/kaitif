import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rsvpToEvent, cancelRsvp } from "@kaitif/db";
import { z } from "zod";

const rsvpSchema = z.object({
  eventId: z.string().uuid(),
  status: z.enum(["GOING", "MAYBE", "CANCELLED"]),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { eventId, status } = rsvpSchema.parse(body);

    if (status === "CANCELLED") {
      await cancelRsvp(supabase, user.id, eventId);
      return NextResponse.json({ success: true });
    }

    const rsvp = await rsvpToEvent(supabase, user.id, eventId, status);
    
    if (!rsvp) {
        throw new Error("Failed to RSVP");
    }

    return NextResponse.json(rsvp);
  } catch (error) {
    console.error("RSVP error:", error);
    return NextResponse.json(
      { error: "Failed to update RSVP" },
      { status: 500 }
    );
  }
}
