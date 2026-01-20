import React from "react";
import { cn } from "@/lib/utils";

interface PhoneMockupProps {
  children?: React.ReactNode;
  className?: string;
  showNotch?: boolean;
  showHomeIndicator?: boolean;
  borderColor?: string;
}

export function PhoneMockup({ 
  children, 
  className,
  showNotch = true,
  showHomeIndicator = true,
  borderColor = "border-[#252529]" 
}: PhoneMockupProps) {
  return (
    <div className={cn(
      "relative mx-auto border-[14px] rounded-[2.5rem] shadow-xl overflow-hidden bg-[#080808]",
      "w-[300px] h-[600px] md:w-[320px] md:h-[650px]", 
      borderColor,
      className
    )}>
      {/* Screen Content */}
      <div className="relative h-full w-full bg-[#080808] overflow-hidden">
        {children}
      </div>

      {/* Notch */}
      {showNotch && (
        <div className="absolute top-0 inset-x-0 h-6 bg-[#080808] z-50 rounded-b-[1rem] w-1/2 mx-auto" />
      )}

      {/* Home Indicator */}
      {showHomeIndicator && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/20 rounded-full z-50" />
      )}
      
      {/* Side Buttons */}
      <div className="absolute top-24 -right-[17px] w-[3px] h-12 bg-[#333] rounded-r-md" />
      <div className="absolute top-24 -left-[17px] w-[3px] h-8 bg-[#333] rounded-l-md" />
      <div className="absolute top-36 -left-[17px] w-[3px] h-12 bg-[#333] rounded-l-md" />
    </div>
  );
}
