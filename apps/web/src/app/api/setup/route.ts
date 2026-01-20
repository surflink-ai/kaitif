import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const DEFAULT_WAIVER_CONTENT = `KAITIF SKATEPARK LIABILITY WAIVER AND RELEASE OF CLAIMS

PLEASE READ CAREFULLY BEFORE SIGNING

I, the undersigned participant (or parent/guardian of a minor participant), hereby acknowledge and agree to the following:

1. ASSUMPTION OF RISK
I understand that skateboarding, BMX riding, scootering, and related activities at Kaitif Skatepark involve inherent risks, including but not limited to:
- Falls and collisions with other participants, equipment, or structures
- Serious injury including broken bones, sprains, concussions, and paralysis
- Equipment malfunction or failure
- Varying skill levels of other participants

2. RELEASE AND WAIVER OF LIABILITY
I hereby release, waive, discharge, and covenant not to sue Kaitif Skatepark, its owners, operators, employees, agents, and representatives from any and all liability, claims, demands, actions, or causes of action arising out of or related to any loss, damage, or injury, including death, that may be sustained by me or my property while participating in activities at Kaitif Skatepark.

3. INDEMNIFICATION
I agree to indemnify and hold harmless Kaitif Skatepark from any loss, liability, damage, or costs, including court costs and attorney fees, that may incur due to my participation in activities at the facility.

4. MEDICAL AUTHORIZATION
I authorize Kaitif Skatepark staff to obtain emergency medical treatment for me (or my minor child) in the event of injury or illness. I understand that I am responsible for any medical expenses incurred.

5. RULES AND REGULATIONS
I agree to abide by all posted rules and regulations of Kaitif Skatepark, including but not limited to:
- Wearing appropriate protective gear (helmet required at all times)
- Respecting other participants and staff
- Not engaging in reckless or dangerous behavior
- Following all instructions from park staff

6. PHOTO/VIDEO RELEASE
I grant Kaitif Skatepark permission to use photographs or video footage of me (or my minor child) for promotional purposes without compensation.

7. ACKNOWLEDGMENT
I have read this waiver and release, fully understand its terms, and understand that I am giving up substantial rights by signing it. I acknowledge that I am signing this agreement freely and voluntarily, and intend by my signature to be a complete and unconditional release of all liability to the greatest extent allowed by law.

This waiver is valid for one (1) year from the date of signing.`;

export async function POST() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json({ 
      success: false, 
      error: "Missing SUPABASE_SERVICE_ROLE_KEY environment variable" 
    }, { status: 500 });
  }

  try {
    // Create admin client with service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    
    // Check if active version already exists
    const { data: existing } = await supabase
      .from("waiver_versions")
      .select("*")
      .eq("isActive", true)
      .limit(1)
      .single();
    
    if (existing) {
      return NextResponse.json({ 
        success: true, 
        message: "Active waiver version already exists",
        version: existing.version 
      });
    }

    // Get latest version number
    const { data: latest } = await supabase
      .from("waiver_versions")
      .select("version")
      .order("version", { ascending: false })
      .limit(1)
      .single();

    const newVersion = (latest?.version || 0) + 1;

    // Deactivate any existing active versions
    await supabase
      .from("waiver_versions")
      .update({ isActive: false })
      .eq("isActive", true);
    
    // Create the initial waiver version
    const { data: newWaiver, error } = await supabase
      .from("waiver_versions")
      .insert({
        version: newVersion,
        content: DEFAULT_WAIVER_CONTENT,
        isActive: true,
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating waiver:", error);
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Waiver version created successfully",
      version: newWaiver.version,
      id: newWaiver.id
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: "POST to this endpoint to create initial waiver version" 
  });
}
