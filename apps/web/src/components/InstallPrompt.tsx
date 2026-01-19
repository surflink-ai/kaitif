"use client";

import { useEffect, useState } from "react";
import { Button } from "@kaitif/ui";
import { Download, X } from "lucide-react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, discard it
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:bottom-4 md:left-auto md:right-4 md:w-96">
      <div className="bg-[#1A1A1A] border border-[#F5F5F0]/10 rounded-lg shadow-lg p-4 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
             <div className="h-10 w-10 bg-[#FFCC00] rounded-lg flex items-center justify-center">
                <span className="font-bold text-black text-xl">K</span>
             </div>
             <div>
                <h3 className="font-bold text-white">Install Kaitif App</h3>
                <p className="text-xs text-[#F5F5F0]/60">Get the best experience with our app.</p>
             </div>
          </div>
          <button 
             onClick={() => setShowPrompt(false)}
             className="text-[#F5F5F0]/40 hover:text-white"
          >
             <X className="h-4 w-4" />
          </button>
        </div>
        
        <Button onClick={handleInstallClick} className="w-full bg-[#00E6E6] text-[#080808] hover:bg-[#33EBEB]">
           <Download className="h-4 w-4 mr-2" />
           Install Now
        </Button>
      </div>
    </div>
  );
}
