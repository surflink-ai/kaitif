import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPassById, getUserById } from "@kaitif/db";
import { generateGoogleWalletPass, isGoogleWalletConfigured, type PassData } from "@/lib/wallet";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ passId: string }> }
) {
  try {
    const { passId } = await params;
    const supabase = await createClient();

    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if Google Wallet is configured
    if (!isGoogleWalletConfigured()) {
      return NextResponse.json(
        { error: "Google Wallet is not configured" },
        { status: 503 }
      );
    }

    // Get pass data
    const pass = await getPassById(supabase, passId);
    if (!pass) {
      return NextResponse.json({ error: "Pass not found" }, { status: 404 });
    }

    // Verify pass belongs to user
    if (pass.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get user details
    const passUser = await getUserById(supabase, pass.userId);
    if (!passUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare pass data
    const passData: PassData = {
      id: pass.id,
      barcodeId: pass.barcodeId,
      type: pass.type,
      userId: pass.userId,
      userName: passUser.name || "",
      userEmail: passUser.email,
      purchasedAt: new Date(pass.purchasedAt),
      expiresAt: new Date(pass.expiresAt),
    };

    // Generate the Google Wallet save link
    const saveUrl = await generateGoogleWalletPass(passData);

    if (!saveUrl) {
      return NextResponse.json(
        { error: "Failed to generate pass" },
        { status: 500 }
      );
    }

    // Return the save URL
    return NextResponse.json({ url: saveUrl });
  } catch (error) {
    console.error("Google Wallet API error:", error);
    return NextResponse.json(
      { error: "Failed to generate Google Wallet pass" },
      { status: 500 }
    );
  }
}
