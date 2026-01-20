"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge, formatPrice, useToast, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@kaitif/ui";
import { PASS_PRICES, PASS_DURATION, type Pass } from "@kaitif/db";
import { Check, Ticket, Calendar, CreditCard, Wallet, Loader2, Apple, Smartphone, ChevronDown } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type PassType = "DAY" | "WEEK" | "MONTH" | "ANNUAL";
type WalletType = "apple" | "google" | null;

const passInfo: Record<PassType, { name: string; description: string; features: string[] }> = {
  DAY: {
    name: "Day Pass",
    description: "Perfect for a single visit",
    features: ["Full park access", "Valid for 24 hours", "Earn XP on check-in"],
  },
  WEEK: {
    name: "Week Pass",
    description: "Great for a week of skating",
    features: ["Full park access", "Valid for 7 days", "Build your streak", "Earn bonus XP"],
  },
  MONTH: {
    name: "Monthly Pass",
    description: "Best value for regulars",
    features: ["Unlimited access", "Valid for 30 days", "Priority event RSVP", "2x XP multiplier"],
  },
  ANNUAL: {
    name: "Annual Pass",
    description: "The ultimate commitment",
    features: ["Unlimited access", "Valid for 365 days", "VIP event access", "3x XP multiplier", "Exclusive badges", "Founding member perks"],
  },
};

interface PassesClientPageProps {
  activePass: Pass | null;
}

export default function PassesClientPage({ activePass }: PassesClientPageProps) {
  const [selectedPass, setSelectedPass] = useState<PassType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState<WalletType>(null);
  const [deviceType, setDeviceType] = useState<"ios" | "android" | "other">("other");
  const { toast } = useToast();

  // Detect device type for wallet button
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua)) {
      setDeviceType("ios");
    } else if (/Android/.test(ua)) {
      setDeviceType("android");
    } else {
      setDeviceType("other");
    }
  }, []);

  const handleAddToAppleWallet = async () => {
    if (!activePass) return;
    
    setWalletLoading("apple");
    try {
      // Download the .pkpass file
      const response = await fetch(`/api/wallet/apple/${activePass.id}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate pass");
      }

      // Create a blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kaitif-pass-${activePass.barcodeId}.pkpass`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Pass Downloaded",
        description: "Open the file to add it to your Apple Wallet.",
      });
    } catch (error) {
      console.error("Apple Wallet error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add to Apple Wallet",
        variant: "destructive",
      });
    } finally {
      setWalletLoading(null);
    }
  };

  const handleAddToGoogleWallet = async () => {
    if (!activePass) return;
    
    setWalletLoading("google");
    try {
      const response = await fetch(`/api/wallet/google/${activePass.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate pass");
      }

      // Open Google Wallet save link
      window.open(data.url, "_blank");

      toast({
        title: "Google Wallet",
        description: "Follow the prompts to add your pass.",
      });
    } catch (error) {
      console.error("Google Wallet error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add to Google Wallet",
        variant: "destructive",
      });
    } finally {
      setWalletLoading(null);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPass) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selectedPass }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to initiate checkout");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!activePass) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2 text-white">
            Get Your <span className="text-[#FFE500]">Pass</span>
          </h1>
          <p className="text-white/60">
            Choose a pass type to get started. All passes include full park access.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(Object.keys(PASS_PRICES) as PassType[]).map((type) => {
            const info = passInfo[type];
            const price = PASS_PRICES[type];
            const duration = PASS_DURATION[type];
            const isSelected = selectedPass === type;
            const isAnnual = type === "ANNUAL";

            return (
              <Card
                key={type}
                variant="interactive"
                className={`relative cursor-pointer ${
                  isSelected ? "border-[#FFE500]/50 shadow-[0_0_30px_rgba(255,229,0,0.15)]" : ""
                } ${isAnnual ? "md:col-span-2 lg:col-span-1" : ""}`}
                onClick={() => setSelectedPass(type)}
              >
                {isAnnual && (
                  <Badge variant="accent" className="absolute -top-3 left-4">
                    Best Value
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle>{info.name}</CardTitle>
                  <CardDescription>{info.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-semibold text-[#FFE500]">
                      {formatPrice(price)}
                    </span>
                    <span className="text-white/40 ml-2">
                      / {duration} {duration === 1 ? "day" : "days"}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {info.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/60">
                        <Check className="h-4 w-4 text-[#FFE500] shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className="w-full"
                  >
                    {isSelected ? "Selected" : "Select"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {selectedPass && (
          <Card className="border-[#FFE500]/30 shadow-[0_0_30px_rgba(255,229,0,0.1)]">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {passInfo[selectedPass].name}
                  </h3>
                  <p className="text-white/60">
                    {formatPrice(PASS_PRICES[selectedPass])} • Valid for {PASS_DURATION[selectedPass]} days
                  </p>
                </div>
                <Button size="lg" className="md:w-auto" onClick={handlePurchase} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <CreditCard className="h-5 w-5 mr-2" />}
                  {isLoading ? "Processing..." : "Proceed to Checkout"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Active pass view
  const daysRemaining = Math.ceil(
    (new Date(activePass.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2 text-white">
          Your <span className="text-[#FFE500]">Pass</span>
        </h1>
        <p className="text-white/60">
          Scan this QR code at the park entrance to check in.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Active Pass Card */}
        <Card className="border-[#FFE500]/30 overflow-hidden shadow-[0_0_40px_rgba(255,229,0,0.1)]">
          <div className="bg-gradient-to-br from-[#FFE500]/10 via-[#FFE500]/5 to-[#00E6E6]/10 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <Badge className="mb-2">Active</Badge>
                <h2 className="text-2xl font-semibold text-white">
                  {passInfo[activePass.type as PassType].name}
                </h2>
              </div>
              <Ticket className="h-8 w-8 text-[#FFE500]" />
            </div>

            <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <QRCodeSVG
                value={activePass.barcodeId}
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>

            <p className="font-mono text-lg text-white/50 mb-6">
              {activePass.barcodeId}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Expires</p>
                <p className="font-medium text-white">
                  {new Date(activePass.expiresAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Days Left</p>
                <p className="font-medium text-[#FFE500]">{daysRemaining} days</p>
              </div>
            </div>
          </div>

          <CardFooter className="flex gap-3">
            {deviceType === "ios" ? (
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={handleAddToAppleWallet}
                disabled={walletLoading === "apple"}
              >
                {walletLoading === "apple" ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Apple className="h-5 w-5 mr-2" />
                )}
                Add to Apple Wallet
              </Button>
            ) : deviceType === "android" ? (
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={handleAddToGoogleWallet}
                disabled={walletLoading === "google"}
              >
                {walletLoading === "google" ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Wallet className="h-5 w-5 mr-2" />
                )}
                Add to Google Wallet
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="flex-1" disabled={!!walletLoading}>
                    {walletLoading ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Wallet className="h-5 w-5 mr-2" />
                    )}
                    Add to Wallet
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleAddToAppleWallet}>
                    <Apple className="h-4 w-4 mr-2" />
                    Apple Wallet
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleAddToGoogleWallet}>
                    <Smartphone className="h-4 w-4 mr-2" />
                    Google Wallet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </CardFooter>
        </Card>

        {/* Pass Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#FFE500]" />
                Pass Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b border-white/[0.08]">
                <span className="text-white/60">Type</span>
                <span className="font-medium text-white">{passInfo[activePass.type as PassType].name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.08]">
                <span className="text-white/60">Purchased</span>
                <span className="text-white">
                  {new Date(activePass.purchasedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.08]">
                <span className="text-white/60">Valid Until</span>
                <span className="text-white">
                  {new Date(activePass.expiresAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-white/60">Status</span>
                <Badge>Active</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need a Different Pass?</CardTitle>
              <CardDescription>
                Browse other pass options or extend your current pass.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setSelectedPass(null)}>
                View All Passes
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
