import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPassById, getUserById } from "@kaitif/db";
import { generateAppleWalletPass, isAppleWalletConfigured, type PassData } from "@/lib/wallet";

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

    // Check if Apple Wallet is configured
    if (!isAppleWalletConfigured()) {
      return NextResponse.json(
        { error: "Apple Wallet is not configured" },
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

    // Generate the .pkpass file
    const passBuffer = await generateAppleWalletPass(passData);

    if (!passBuffer) {
      return NextResponse.json(
        { error: "Failed to generate pass" },
        { status: 500 }
      );
    }

    // Return the .pkpass file
    return new NextResponse(new Uint8Array(passBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="kaitif-pass-${pass.barcodeId}.pkpass"`,
      },
    });
  } catch (error) {
    console.error("Apple Wallet API error:", error);
    return NextResponse.json(
      { error: "Failed to generate Apple Wallet pass" },
      { status: 500 }
    );
  }
}
