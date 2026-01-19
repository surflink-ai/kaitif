import { cn } from "@/lib/utils";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import React from "react";

interface DesignFrameProps {
  children: React.ReactNode;
  title?: string;
  device?: "desktop" | "tablet" | "mobile";
  className?: string;
}

export function DesignFrame({ children, title = "Preview", device = "desktop", className }: DesignFrameProps) {
  const [activeDevice, setActiveDevice] = React.useState(device);

  const containerWidths = {
    desktop: "w-full",
    tablet: "max-w-[768px]",
    mobile: "max-w-[375px]",
  };

  return (
    <div className={cn("flex flex-col bg-[#0A0A0B] border border-[#252529] rounded-xl overflow-hidden shadow-2xl", className)}>
      {/* Browser Chrome / Header */}
      <div className="bg-[#111113] border-b border-[#252529] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-[#0A0A0B] px-1 py-1 rounded-lg border border-[#252529]">
          <button 
            onClick={() => setActiveDevice("desktop")}
            className={cn("p-1.5 rounded transition-colors", activeDevice === "desktop" ? "bg-[#252529] text-white" : "text-[#5A5A62] hover:text-white")}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveDevice("tablet")}
            className={cn("p-1.5 rounded transition-colors", activeDevice === "tablet" ? "bg-[#252529] text-white" : "text-[#5A5A62] hover:text-white")}
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveDevice("mobile")}
            className={cn("p-1.5 rounded transition-colors", activeDevice === "mobile" ? "bg-[#252529] text-white" : "text-[#5A5A62] hover:text-white")}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs font-medium text-[#5A5A62] w-12 text-right">
          {activeDevice === "desktop" ? "100%" : activeDevice === "tablet" ? "768px" : "375px"}
        </div>
      </div>

      {/* Viewport */}
      <div className="flex-1 bg-[#050505] p-8 overflow-auto min-h-[600px] flex justify-center">
        <div className={cn(
          "bg-white transition-all duration-300 shadow-2xl overflow-hidden origin-top", 
          containerWidths[activeDevice],
          activeDevice !== "desktop" && "rounded-[2rem] border-[8px] border-[#1A1A1D] min-h-[800px]",
          "relative"
        )}>
          <div className="h-full w-full overflow-y-auto overflow-x-hidden max-h-[800px] scrollbar-thin scrollbar-thumb-[#252529] scrollbar-track-transparent">
             {children}
          </div>
        </div>
      </div>
    </div>
  );
}
