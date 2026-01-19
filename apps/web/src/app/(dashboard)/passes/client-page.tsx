"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge, formatPrice, useToast } from "@kaitif/ui";
import { PASS_PRICES, PASS_DURATION, type Pass } from "@kaitif/db";
import { Check, Ticket, Calendar, CreditCard, Wallet, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type PassType = "DAY" | "WEEK" | "MONTH" | "ANNUAL";

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
  const { toast } = useToast();

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
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2">
            Get Your <span className="text-[#FFCC00]">Pass</span>
          </h1>
          <p className="text-[#F5F5F0]/60">
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
                className={`relative cursor-pointer transition-all ${
                  isSelected ? "border-[#FFCC00] shadow-[0_0_20px_rgba(255,204,0,0.3)]" : "hover:border-[#F5F5F0]/30"
                } ${isAnnual ? "md:col-span-2 lg:col-span-1" : ""}`}
                onClick={() => setSelectedPass(type)}
              >
                {isAnnual && (
                  <Badge variant="accent" className="absolute -top-3 left-4">
                    Best Value
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{info.name}</CardTitle>
                  <CardDescription>{info.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-[#FFCC00]">
                      {formatPrice(price)}
                    </span>
                    <span className="text-[#F5F5F0]/40 ml-2">
                      / {duration} {duration === 1 ? "day" : "days"}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {info.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-[#F5F5F0]/60">
                        <Check className="h-4 w-4 text-[#FFCC00] shrink-0" />
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
          <Card className="border-[#FFCC00]">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider mb-2">
                    {passInfo[selectedPass].name}
                  </h3>
                  <p className="text-[#F5F5F0]/60">
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
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2">
          Your <span className="text-[#FFCC00]">Pass</span>
        </h1>
        <p className="text-[#F5F5F0]/60">
          Scan this QR code at the park entrance to check in.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Active Pass Card */}
        <Card className="border-[#FFCC00] overflow-hidden">
          <div className="bg-gradient-to-br from-[#FFCC00]/20 to-[#00E6E6]/20 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <Badge className="mb-2">Active</Badge>
                <h2 className="text-2xl font-bold uppercase tracking-wider">
                  {passInfo[activePass.type as PassType].name}
                </h2>
              </div>
              <Ticket className="h-8 w-8 text-[#FFCC00]" />
            </div>

            <div className="bg-white p-4 inline-block mb-6">
              <QRCodeSVG
                value={activePass.barcodeId}
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>

            <p className="font-mono text-lg text-[#F5F5F0]/60 mb-6">
              {activePass.barcodeId}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#F5F5F0]/40 uppercase tracking-wider mb-1">Expires</p>
                <p className="font-bold">
                  {new Date(activePass.expiresAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#F5F5F0]/40 uppercase tracking-wider mb-1">Days Left</p>
                <p className="font-bold text-[#FFCC00]">{daysRemaining} days</p>
              </div>
            </div>
          </div>

          <CardFooter className="flex gap-3">
            <Button variant="outline" className="flex-1">
              <Wallet className="h-5 w-5 mr-2" />
              Add to Wallet
            </Button>
          </CardFooter>
        </Card>

        {/* Pass Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#FFCC00]" />
                Pass Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b border-[#F5F5F0]/10">
                <span className="text-[#F5F5F0]/60">Type</span>
                <span className="font-bold">{passInfo[activePass.type as PassType].name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F5F5F0]/10">
                <span className="text-[#F5F5F0]/60">Purchased</span>
                <span>
                  {new Date(activePass.purchasedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F5F5F0]/10">
                <span className="text-[#F5F5F0]/60">Valid Until</span>
                <span>
                  {new Date(activePass.expiresAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#F5F5F0]/60">Status</span>
                <Badge>Active</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need a Different Pass?</CardTitle>
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
