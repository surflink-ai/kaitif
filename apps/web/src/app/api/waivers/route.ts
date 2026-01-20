import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { signWaiver } from "@kaitif/db";
import { ensureUserExists } from "@/lib/utils";
import { z } from "zod";

const signWaiverSchema = z.object({
  waiverVersionId: z.string().uuid(),
  signature: z.string(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists in public.users table
    await ensureUserExists(user);

    const body = await request.json();
    const { waiverVersionId, signature } = signWaiverSchema.parse(body);

    const waiver = await signWaiver(supabase, user.id, waiverVersionId, signature);

    if (!waiver) {
        throw new Error("Failed to create waiver record");
    }

    return NextResponse.json(waiver);
  } catch (error) {
    console.error("Waiver sign error:", error);
    return NextResponse.json(
      { error: "Failed to sign waiver" },
      { status: 500 }
    );
  }
}
