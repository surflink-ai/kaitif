import { createClient } from "@/lib/supabase/server";
import { getActiveWaiverVersion, createWaiverVersion } from "@kaitif/db";
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
  try {
    const supabase = await createClient();
    
    // Check if active version already exists
    const existingVersion = await getActiveWaiverVersion(supabase);
    
    if (existingVersion) {
      return NextResponse.json({ 
        success: true, 
        message: "Active waiver version already exists",
        version: existingVersion.version 
      });
    }
    
    // Create the initial waiver version
    const newVersion = await createWaiverVersion(supabase, DEFAULT_WAIVER_CONTENT);
    
    if (!newVersion) {
      return NextResponse.json({ 
        success: false, 
        error: "Failed to create waiver version" 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Waiver version created successfully",
      version: newVersion.version,
      id: newVersion.id
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
