import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/sessions/revoke-all - Revoke all sessions except current
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { currentSessionToken } = body;

    // Revoke all sessions except the current one
    let query = (supabase
      .from("user_sessions") as any)
      .update({
        isRevoked: true,
        revokedAt: new Date().toISOString(),
      })
      .eq("userId", user.id)
      .eq("isRevoked", false);

    // If current session token provided, exclude it
    if (currentSessionToken) {
      query = query.neq("sessionToken", currentSessionToken);
    }

    const { error, count } = await query;

    if (error) {
      console.error("Error revoking sessions:", error);
      return NextResponse.json({ error: "Failed to revoke sessions" }, { status: 500 });
    }

    // Optionally send security alert email
    try {
      const { data: profileData } = await supabase
        .from("users")
        .select("name, email")
        .eq("id", user.id)
        .single();

      const profile = profileData as { name: string | null; email: string } | null;

      if (profile) {
        const { sendSecurityAlertEmail } = await import("@kaitif/email");
        await sendSecurityAlertEmail(
          profile.email,
          profile.name || "User",
          "password_changed", // Using this as a generic security event
          {},
          `${process.env.NEXT_PUBLIC_APP_URL || ""}/profile`
        );
      }
    } catch (emailError) {
      console.error("Failed to send security alert:", emailError);
    }

    return NextResponse.json({ success: true, revokedCount: count });
  } catch (error) {
    console.error("Sessions API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
