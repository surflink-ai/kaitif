import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createEventSuggestion, EVENT_CATEGORIES } from "@kaitif/db";
import { z } from "zod";

const suggestionSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  category: z.enum(Object.keys(EVENT_CATEGORIES) as [string, ...string[]]),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category } = suggestionSchema.parse(body);

    // Cast category to EventCategory (validated by enum check above)
    const suggestion = await createEventSuggestion(supabase, user.id, title, description, category as any);

    if (!suggestion) {
        throw new Error("Failed to create suggestion");
    }

    return NextResponse.json(suggestion);
  } catch (error) {
    console.error("Suggestion error:", error);
    return NextResponse.json(
      { error: "Failed to create suggestion" },
      { status: 500 }
    );
  }
}
