import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/sessions - List user's active sessions
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: sessions, error } = await (supabase
      .from("user_sessions") as any)
      .select("*")
      .eq("userId", user.id)
      .eq("isRevoked", false)
      .order("lastActiveAt", { ascending: false });

    if (error) {
      console.error("Error fetching sessions:", error);
      return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
    }

    return NextResponse.json({ sessions: sessions || [] });
  } catch (error) {
    console.error("Sessions API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/sessions - Create a new session (called on login)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sessionToken, deviceInfo, ipAddress, location } = body;

    if (!sessionToken) {
      return NextResponse.json({ error: "Session token required" }, { status: 400 });
    }

    // Create session record
    const { data: session, error } = await (supabase
      .from("user_sessions") as any)
      .insert({
        userId: user.id,
        sessionToken,
        deviceInfo: deviceInfo || null,
        ipAddress: ipAddress || null,
        location: location || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating session:", error);
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error("Sessions API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
