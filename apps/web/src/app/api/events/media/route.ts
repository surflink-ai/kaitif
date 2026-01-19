import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { addEventMedia } from "@kaitif/db";
import { z } from "zod";

const mediaSchema = z.object({
  eventId: z.string().uuid(),
  url: z.string().url(),
  type: z.enum(["image", "video"]),
  caption: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { eventId, url, type, caption } = mediaSchema.parse(body);

    const media = await addEventMedia(supabase, eventId, user.id, url, type, caption);

    if (!media) {
        throw new Error("Failed to add media");
    }

    return NextResponse.json(media);
  } catch (error) {
    console.error("Media upload error:", error);
    return NextResponse.json(
      { error: "Failed to add media" },
      { status: 500 }
    );
  }
}
