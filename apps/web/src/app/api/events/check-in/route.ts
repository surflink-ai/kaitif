import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkInToEvent } from "@kaitif/db";
import { z } from "zod";

const checkInSchema = z.object({
  eventId: z.string().uuid(),
  // In a real app, we might include geolocation or a unique code here
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { eventId } = checkInSchema.parse(body);

    const result = await checkInToEvent(supabase, user.id, eventId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to check in" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "Failed to check in" },
      { status: 500 }
    );
  }
}
