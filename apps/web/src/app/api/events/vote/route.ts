import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { voteOnSuggestion } from "@kaitif/db";
import { z } from "zod";

const voteSchema = z.object({
  suggestionId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { suggestionId } = voteSchema.parse(body);

    const success = await voteOnSuggestion(supabase, user.id, suggestionId);

    if (!success) {
        throw new Error("Failed to vote");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json(
      { error: "Failed to vote" },
      { status: 500 }
    );
  }
}
