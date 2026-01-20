// Kaitif Wallet Integration
// Handles Apple Wallet (.pkpass) and Google Wallet pass generation

import { PKPass } from "passkit-generator";
import { GoogleAuth } from "google-auth-library";
import { PARK_INFO } from "@kaitif/db";

// Types
export interface PassData {
  id: string;
  barcodeId: string;
  type: string;
  userId: string;
  userName: string;
  userEmail: string;
  purchasedAt: Date;
  expiresAt: Date;
}

// Pass type display names
const PASS_TYPE_NAMES: Record<string, string> = {
  DAY: "Day Pass",
  WEEK: "Week Pass",
  MONTH: "Monthly Pass",
  ANNUAL: "Annual Pass",
};

// ============================================
// APPLE WALLET INTEGRATION
// ============================================

// Apple Wallet pass template
function getApplePassTemplate(passData: PassData) {
  return {
    formatVersion: 1 as const,
    passTypeIdentifier: process.env.APPLE_PASS_TYPE_IDENTIFIER,
    teamIdentifier: process.env.APPLE_TEAM_ID,
    organizationName: PARK_INFO.name,
    description: `${PASS_TYPE_NAMES[passData.type] || passData.type} - ${PARK_INFO.name}`,
    serialNumber: passData.id,
    foregroundColor: "rgb(255, 255, 255)",
    backgroundColor: "rgb(8, 8, 8)",
    labelColor: "rgb(255, 204, 0)",
    logoText: "KAITIF",
    generic: {
      primaryFields: [
        {
          key: "passType",
          label: "PASS TYPE",
          value: PASS_TYPE_NAMES[passData.type] || passData.type,
        },
      ],
      secondaryFields: [
        {
          key: "member",
          label: "MEMBER",
          value: passData.userName || passData.userEmail,
        },
        {
          key: "expires",
          label: "VALID UNTIL",
          value: passData.expiresAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          dateStyle: "PKDateStyleMedium",
        },
      ],
      auxiliaryFields: [
        {
          key: "location",
          label: "LOCATION",
          value: "Barbados",
        },
      ],
      backFields: [
        {
          key: "terms",
          label: "Terms & Conditions",
          value:
            "This pass grants access to Kaitif Skatepark during operating hours. A valid signed waiver is required for entry. Pass is non-transferable.",
        },
        {
          key: "contact",
          label: "Contact",
          value: `${PARK_INFO.email}\n${PARK_INFO.phone}`,
        },
        {
          key: "address",
          label: "Address",
          value: PARK_INFO.address,
        },
      ],
    },
    barcode: {
      format: "PKBarcodeFormatQR",
      message: passData.barcodeId,
      messageEncoding: "iso-8859-1",
    },
    barcodes: [
      {
        format: "PKBarcodeFormatQR",
        message: passData.barcodeId,
        messageEncoding: "iso-8859-1",
      },
    ],
    expirationDate: passData.expiresAt.toISOString(),
    voided: false,
  };
}

/**
 * Generate an Apple Wallet .pkpass file
 * Requires: APPLE_PASS_CERTIFICATE (base64 encoded .p12)
 *           APPLE_PASS_CERTIFICATE_PASSWORD
 *           APPLE_TEAM_ID
 *           APPLE_PASS_TYPE_IDENTIFIER
 */
export async function generateAppleWalletPass(
  passData: PassData
): Promise<Buffer | null> {
  try {
    // Check for required environment variables
    if (
      !process.env.APPLE_PASS_CERTIFICATE ||
      !process.env.APPLE_PASS_CERTIFICATE_PASSWORD ||
      !process.env.APPLE_TEAM_ID ||
      !process.env.APPLE_PASS_TYPE_IDENTIFIER
    ) {
      console.error("Missing Apple Wallet environment variables");
      return null;
    }

    // Decode the certificate from base64
    const certificateBuffer = Buffer.from(
      process.env.APPLE_PASS_CERTIFICATE,
      "base64"
    );

    // Create the pass
    const pass = new PKPass(
      {},
      {
        wwdr: await getAppleWWDRCertificate(),
        signerCert: certificateBuffer,
        signerKey: certificateBuffer,
        signerKeyPassphrase: process.env.APPLE_PASS_CERTIFICATE_PASSWORD,
      },
      getApplePassTemplate(passData)
    );

    // Set pass type
    pass.type = "generic";

    // Add logo images (these should be in your assets)
    // In production, you'd load actual image files
    // pass.addBuffer("icon.png", iconBuffer);
    // pass.addBuffer("icon@2x.png", icon2xBuffer);
    // pass.addBuffer("logo.png", logoBuffer);
    // pass.addBuffer("logo@2x.png", logo2xBuffer);

    // Generate the pass buffer
    const buffer = pass.getAsBuffer();

    return buffer;
  } catch (error) {
    console.error("Error generating Apple Wallet pass:", error);
    return null;
  }
}

/**
 * Get Apple's WWDR (Worldwide Developer Relations) certificate
 * This is Apple's intermediate certificate required for pass signing
 */
async function getAppleWWDRCertificate(): Promise<Buffer> {
  // The WWDR certificate can be downloaded from Apple
  // https://www.apple.com/certificateauthority/
  // For production, store this as an environment variable or file
  if (process.env.APPLE_WWDR_CERTIFICATE) {
    return Buffer.from(process.env.APPLE_WWDR_CERTIFICATE, "base64");
  }

  // Fallback: fetch from Apple (not recommended for production)
  const response = await fetch(
    "https://www.apple.com/certificateauthority/AppleWWDRCAG4.cer"
  );
  return Buffer.from(await response.arrayBuffer());
}

// ============================================
// GOOGLE WALLET INTEGRATION
// ============================================

// Google Wallet class and object definitions
const GOOGLE_WALLET_ISSUER_ID = process.env.GOOGLE_WALLET_ISSUER_ID;
const GOOGLE_WALLET_CLASS_SUFFIX = "kaitif_skatepark_pass";

/**
 * Create or get the Google Wallet pass class
 * This only needs to be done once per pass type
 */
async function ensureGoogleWalletClass(auth: GoogleAuth): Promise<string> {
  const classId = `${GOOGLE_WALLET_ISSUER_ID}.${GOOGLE_WALLET_CLASS_SUFFIX}`;

  const httpClient = await auth.getClient();

  // Check if class exists
  try {
    await httpClient.request({
      url: `https://walletobjects.googleapis.com/walletobjects/v1/genericClass/${classId}`,
      method: "GET",
    });
    return classId;
  } catch (error: any) {
    if (error.response?.status !== 404) {
      throw error;
    }
  }

  // Create the class
  const classDefinition = {
    id: classId,
    classTemplateInfo: {
      cardTemplateOverride: {
        cardRowTemplateInfos: [
          {
            twoItems: {
              startItem: {
                firstValue: {
                  fields: [
                    {
                      fieldPath: "object.textModulesData['pass_type']",
                    },
                  ],
                },
              },
              endItem: {
                firstValue: {
                  fields: [
                    {
                      fieldPath: "object.textModulesData['expires']",
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    imageModulesData: [
      {
        mainImage: {
          sourceUri: {
            uri: "https://kaitif.com/images/logo.png", // Replace with actual logo URL
          },
        },
        id: "logo",
      },
    ],
    textModulesData: [
      {
        header: "Location",
        body: PARK_INFO.address,
        id: "location",
      },
    ],
    linksModuleData: {
      uris: [
        {
          uri: "https://kaitif.com",
          description: "Visit Kaitif",
          id: "website",
        },
      ],
    },
    hexBackgroundColor: "#080808",
  };

  await httpClient.request({
    url: "https://walletobjects.googleapis.com/walletobjects/v1/genericClass",
    method: "POST",
    data: classDefinition,
  });

  return classId;
}

/**
 * Generate a Google Wallet save link
 * Returns a URL that users can click to save the pass to their Google Wallet
 */
export async function generateGoogleWalletPass(
  passData: PassData
): Promise<string | null> {
  try {
    // Check for required environment variables
    if (
      !process.env.GOOGLE_WALLET_ISSUER_ID ||
      !process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL ||
      !process.env.GOOGLE_WALLET_PRIVATE_KEY
    ) {
      console.error("Missing Google Wallet environment variables");
      return null;
    }

    // Initialize Google Auth
    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_WALLET_PRIVATE_KEY.replace(
          /\\n/g,
          "\n"
        ),
      },
      scopes: ["https://www.googleapis.com/auth/wallet_object.issuer"],
    });

    // Ensure the pass class exists
    const classId = await ensureGoogleWalletClass(auth);

    // Create the pass object
    const objectId = `${GOOGLE_WALLET_ISSUER_ID}.${passData.id.replace(/-/g, "_")}`;

    const passObject = {
      id: objectId,
      classId: classId,
      state: "ACTIVE",
      heroImage: {
        sourceUri: {
          uri: "https://kaitif.com/images/hero-bowl-night.png", // Replace with actual image
        },
      },
      textModulesData: [
        {
          header: "PASS TYPE",
          body: PASS_TYPE_NAMES[passData.type] || passData.type,
          id: "pass_type",
        },
        {
          header: "VALID UNTIL",
          body: passData.expiresAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          id: "expires",
        },
        {
          header: "MEMBER",
          body: passData.userName || passData.userEmail,
          id: "member",
        },
      ],
      barcode: {
        type: "QR_CODE",
        value: passData.barcodeId,
      },
      cardTitle: {
        defaultValue: {
          language: "en",
          value: PARK_INFO.name,
        },
      },
      subheader: {
        defaultValue: {
          language: "en",
          value: PASS_TYPE_NAMES[passData.type] || passData.type,
        },
      },
      header: {
        defaultValue: {
          language: "en",
          value: passData.userName || "Skater",
        },
      },
      validTimeInterval: {
        start: {
          date: passData.purchasedAt.toISOString(),
        },
        end: {
          date: passData.expiresAt.toISOString(),
        },
      },
    };

    // Create JWT for the save link
    const claims = {
      iss: process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL,
      aud: "google",
      typ: "savetowallet",
      iat: Math.floor(Date.now() / 1000),
      payload: {
        genericObjects: [passObject],
      },
      origins: ["https://kaitif.com", "http://localhost:3000"],
    };

    // Sign the JWT
    const client = await auth.getClient();
    const jwt = await (client as any).authorize();

    // For a proper implementation, we need to sign our own JWT
    // Using google-auth-library's JWT signing
    const { GoogleAuth: GA } = await import("google-auth-library");
    const jwtClient = new GA({
      credentials: {
        client_email: process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_WALLET_PRIVATE_KEY.replace(
          /\\n/g,
          "\n"
        ),
      },
    });

    // Create the signed JWT using jose or similar
    // For simplicity, we'll use the direct API approach
    const httpClient = await auth.getClient();

    // Try to create the object (or update if exists)
    try {
      await httpClient.request({
        url: `https://walletobjects.googleapis.com/walletobjects/v1/genericObject/${objectId}`,
        method: "GET",
      });

      // Object exists, update it
      await httpClient.request({
        url: `https://walletobjects.googleapis.com/walletobjects/v1/genericObject/${objectId}`,
        method: "PUT",
        data: passObject,
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Object doesn't exist, create it
        await httpClient.request({
          url: "https://walletobjects.googleapis.com/walletobjects/v1/genericObject",
          method: "POST",
          data: passObject,
        });
      } else {
        throw error;
      }
    }

    // Return the save link
    // The actual JWT signing for save links requires additional implementation
    // For now, we return the API-created object link
    return `https://pay.google.com/gp/v/save/${objectId}`;
  } catch (error) {
    console.error("Error generating Google Wallet pass:", error);
    return null;
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if Apple Wallet is configured
 */
export function isAppleWalletConfigured(): boolean {
  return !!(
    process.env.APPLE_PASS_CERTIFICATE &&
    process.env.APPLE_PASS_CERTIFICATE_PASSWORD &&
    process.env.APPLE_TEAM_ID &&
    process.env.APPLE_PASS_TYPE_IDENTIFIER
  );
}

/**
 * Check if Google Wallet is configured
 */
export function isGoogleWalletConfigured(): boolean {
  return !!(
    process.env.GOOGLE_WALLET_ISSUER_ID &&
    process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_WALLET_PRIVATE_KEY
  );
}

/**
 * Detect if the user's device supports Apple Wallet
 */
export function detectAppleDevice(userAgent: string): boolean {
  return /iPhone|iPad|iPod/.test(userAgent);
}

/**
 * Detect if the user's device supports Google Wallet
 */
export function detectAndroidDevice(userAgent: string): boolean {
  return /Android/.test(userAgent);
}
