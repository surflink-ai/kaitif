import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// DELETE /api/sessions/[id] - Revoke a specific session
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify session belongs to user
    const { data: sessionData } = await (supabase
      .from("user_sessions") as any)
      .select("userId")
      .eq("id", sessionId)
      .single();

    const session = sessionData as { userId: string } | null;

    if (!session || session.userId !== user.id) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Revoke the session
    const { error } = await (supabase
      .from("user_sessions") as any)
      .update({
        isRevoked: true,
        revokedAt: new Date().toISOString(),
      })
      .eq("id", sessionId);

    if (error) {
      console.error("Error revoking session:", error);
      return NextResponse.json({ error: "Failed to revoke session" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sessions API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
