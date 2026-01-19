import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { submitChallengeCompletion } from "@kaitif/db";
import { z } from "zod";

const submitSchema = z.object({
  challengeId: z.string().uuid(),
  videoUrl: z.string().url(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { challengeId, videoUrl } = submitSchema.parse(body);

    const completion = await submitChallengeCompletion(supabase, user.id, challengeId, videoUrl);

    if (!completion) {
        throw new Error("Failed to submit challenge");
    }

    return NextResponse.json(completion);
  } catch (error) {
    console.error("Challenge submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit challenge" },
      { status: 500 }
    );
  }
}
