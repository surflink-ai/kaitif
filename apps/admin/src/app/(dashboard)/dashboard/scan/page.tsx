"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@kaitif/ui";
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { validatePassAction } from "@/app/actions";

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState<{
    status: "idle" | "loading" | "success" | "error";
    data?: any;
    error?: string;
  }>({ status: "idle" });
  
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Initialize scanner
    // Only run on client side
    if (typeof window !== "undefined") {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        false
      );

      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;
    }

    return () => {
      scannerRef.current?.clear().catch(console.error);
    };
  }, []);

  const onScanSuccess = async (decodedText: string) => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.pause(true);
      } catch (e) {
        console.error("Failed to pause scanner", e);
      }
    }

    setScanResult({ status: "loading" });

    try {
      const result = await validatePassAction(decodedText);
      
      if (result.valid && result.pass) {
        setScanResult({ status: "success", data: result.pass });
        // Play success sound
        new Audio("/sounds/success.mp3").play().catch(() => {});
      } else {
        setScanResult({ status: "error", error: result.error || "Invalid Pass" });
        // Play error sound
        new Audio("/sounds/error.mp3").play().catch(() => {});
      }
    } catch (error) {
      setScanResult({ status: "error", error: "Failed to validate pass" });
    }
  };

  const onScanFailure = (error: any) => {
    // Handle scan failure, usually better to ignore frame errors
    // console.warn(`Code scan error = ${error}`);
  };

  const resetScanner = async () => {
    setScanResult({ status: "idle" });
    if (scannerRef.current) {
      try {
        await scannerRef.current.resume();
      } catch (e) {
        console.error("Failed to resume scanner", e);
        // If resume fails, reload the page might be the safest option
        window.location.reload();
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/passes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Pass Scanner</h1>
      </div>

      <div className="grid gap-8">
        <Card className="overflow-hidden bg-[#000]">
          <CardContent className="p-0">
            <div id="reader" className="w-full" />
          </CardContent>
        </Card>

        {scanResult.status !== "idle" && (
          <Card className={`border-2 ${
            scanResult.status === "success" ? "border-green-500" :
            scanResult.status === "error" ? "border-red-500" :
            "border-[#FFCC00]"
          }`}>
            <CardContent className="p-6 text-center">
              {scanResult.status === "loading" && (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-12 w-12 text-[#FFCC00] animate-spin" />
                  <p className="text-xl font-bold">Validating...</p>
                </div>
              )}

              {scanResult.status === "success" && scanResult.data && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                    <h2 className="text-3xl font-bold text-green-500">Access Granted</h2>
                  </div>
                  
                  <div className="p-6 bg-[#F5F5F0]/5 rounded-lg text-left space-y-4">
                    <div className="flex justify-between items-center border-b border-[#F5F5F0]/10 pb-4">
                      <span className="text-[#F5F5F0]/60">User</span>
                      <span className="text-xl font-bold">{scanResult.data.user.name || scanResult.data.user.email}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#F5F5F0]/10 pb-4">
                      <span className="text-[#F5F5F0]/60">Pass Type</span>
                      <Badge variant="outline" className="text-lg py-1 px-3">
                        {scanResult.data.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#F5F5F0]/10 pb-4">
                      <span className="text-[#F5F5F0]/60">Expires</span>
                      <span className="font-mono">
                        {new Date(scanResult.data.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Button size="lg" className="w-full" onClick={resetScanner}>
                    Scan Next Pass
                  </Button>
                </div>
              )}

              {scanResult.status === "error" && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center gap-2">
                    <XCircle className="h-16 w-16 text-red-500" />
                    <h2 className="text-3xl font-bold text-red-500">Access Denied</h2>
                  </div>
                  
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-xl text-red-500">{scanResult.error}</p>
                  </div>

                  <Button variant="outline" size="lg" className="w-full" onClick={resetScanner}>
                    Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
