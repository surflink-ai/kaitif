import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createListing, deleteListing } from "@kaitif/db";
import { z } from "zod";

const listingSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(), // in cents
  category: z.enum(["SKATEBOARD", "SCOOTER", "BMX", "PROTECTIVE_GEAR", "APPAREL", "ACCESSORIES", "OTHER"]),
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"]),
  images: z.array(z.string().url()).optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = listingSchema.parse(body);

    const listing = await createListing(
        supabase, 
        user.id, 
        {
            ...validatedData,
            images: validatedData.images || []
        }
    );

    if (!listing) {
        throw new Error("Failed to create listing");
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Create listing error:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

        const success = await deleteListing(supabase, id, user.id);

        if (!success) return NextResponse.json({ error: "Failed to delete" }, { status: 500 });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
