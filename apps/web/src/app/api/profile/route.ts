import { createClient } from "@/lib/supabase/server";
import { getUserById, updateUserProfile } from "@kaitif/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserById(supabase, authUser.id);
  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, bio } = await req.json();

  const user = await updateUserProfile(supabase, authUser.id, {
    name,
    bio,
  });

  if (!user) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }

  return NextResponse.json(user);
}
