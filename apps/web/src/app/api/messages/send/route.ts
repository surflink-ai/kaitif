import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendMessage } from "@kaitif/db";
import { z } from "zod";

const messageSchema = z.object({
  conversationId: z.string().uuid(),
  content: z.string().min(1),
  replyToId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, content, replyToId } = messageSchema.parse(body);

    const message = await sendMessage(supabase, conversationId, user.id, content, replyToId);

    if (!message) {
        throw new Error("Failed to send message");
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Message send error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
