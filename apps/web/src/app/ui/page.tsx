"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import LandingPageDesign from "./designs/LandingPageDesign";
import UserDashboardDesign from "./designs/UserDashboardDesign";
import AdminDashboardDesign from "./designs/AdminDashboardDesign";
import { DesignFrame } from "./components/DesignFrame";
import { ColorPalette } from "./components/ColorPalette";
import { TypographyScale } from "./components/TypographyScale";
import { Palette, Type, Layout, ArrowRight } from "lucide-react";

export default function UIShowcasePage() {
  const [activeTab, setActiveTab] = useState<"landing" | "app" | "admin">("landing");

  const tabs = [
    { id: "landing", label: "Landing Page", desc: "Marketing & Conversion" },
    { id: "app", label: "User App", desc: "Gamified Dashboard" },
    { id: "admin", label: "Admin Console", desc: "Operations & Data" },
  ] as const;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      
      {/* Header */}
      <header className="border-b border-[#252529] bg-[#0A0A0B]">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-[1px] w-12 bg-[#FFE500]" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFE500]">
                  Design System
                </p>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                Storm Cloud UI
              </h1>
              <p className="text-xl text-[#9A9AA0] max-w-2xl">
                A moody, athletic aesthetic for the Kaitif ecosystem. Deep grays, electric yellow accents, and editorial typography.
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-start px-6 py-4 rounded-xl border transition-all duration-300 min-w-[200px]",
                  activeTab === tab.id
                    ? "bg-[#1A1A1D] border-[#FFE500] shadow-[0_0_24px_-8px_rgba(255,229,0,0.3)]"
                    : "bg-[#0A0A0B] border-[#252529] hover:border-[#35353A] hover:bg-[#111113]"
                )}
              >
                <span className={cn(
                  "font-bold text-lg mb-1",
                  activeTab === tab.id ? "text-white" : "text-[#9A9AA0]"
                )}>
                  {tab.label}
                </span>
                <span className="text-xs text-[#5A5A62] uppercase tracking-wider font-medium">
                  {tab.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 space-y-24">
        
        {/* Design Preview */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Layout className="w-6 h-6 text-[#FFE500]" />
              Interface Preview
            </h2>
            <div className="flex items-center gap-2 text-sm text-[#5A5A62]">
               <span className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
               Interactive Prototype
            </div>
          </div>
          
          <DesignFrame 
            device={activeTab === "app" ? "mobile" : "desktop"} 
            className="h-[800px]"
          >
            {activeTab === "landing" && <LandingPageDesign />}
            {activeTab === "app" && <UserDashboardDesign />}
            {activeTab === "admin" && <AdminDashboardDesign />}
          </DesignFrame>
        </section>

        {/* Design Tokens Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-[#252529] pt-24">
          
          {/* Colors */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Palette className="w-6 h-6 text-[#FFE500]" />
              Color System
            </h2>
            <ColorPalette />
          </div>

          {/* Typography */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Type className="w-6 h-6 text-[#FFE500]" />
              Typography
            </h2>
            <TypographyScale />
          </div>

        </section>

      </main>
    </div>
  );
}
