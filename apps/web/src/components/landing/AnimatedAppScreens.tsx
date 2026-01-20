"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Trophy, Ticket, Zap, ChevronRight, Calendar, Star } from "lucide-react";

// Mini dashboard screen
function DashboardScreen({ isActive }: { isActive: boolean }) {
  return (
    <div className={cn(
      "absolute inset-0 bg-[#0A0A0B] p-4 transition-all duration-500",
      isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-4">
        <div>
          <p className="text-[10px] text-[#9A9AA0] uppercase tracking-wider">Welcome back</p>
          <p className="text-lg font-bold text-white">Alex</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#FFCC00] flex items-center justify-center">
          <span className="text-xs font-bold text-black">12</span>
        </div>
      </div>

      {/* XP Progress */}
      <div className="bg-[#111113] rounded-xl p-3 mb-4 border border-[#252529]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] text-[#9A9AA0] uppercase tracking-wider">Level Progress</span>
          <span className="text-xs font-bold text-[#FFCC00]">2,450 XP</span>
        </div>
        <div className="h-2 bg-[#1A1A1D] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#FFCC00] to-[#FFE066] rounded-full w-[65%] animate-pulse" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "Streak", value: "5 🔥" },
          { label: "Rank", value: "#24" },
          { label: "Badges", value: "12" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#111113] rounded-lg p-2 text-center border border-[#252529]">
            <p className="text-xs font-bold text-white">{stat.value}</p>
            <p className="text-[8px] text-[#5A5A62] uppercase">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Active Challenge */}
      <div className="bg-[#111113] rounded-xl p-3 border border-[#252529]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FFCC00]/10 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-[#FFCC00]" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-white">Kickflip Master</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1.5 flex-1 bg-[#1A1A1D] rounded-full overflow-hidden">
                <div className="h-full bg-[#FFCC00] rounded-full w-[80%]" />
              </div>
              <span className="text-[10px] text-[#FFCC00]">80%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Passes screen
function PassesScreen({ isActive }: { isActive: boolean }) {
  return (
    <div className={cn(
      "absolute inset-0 bg-[#0A0A0B] p-4 transition-all duration-500",
      isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
    )}>
      {/* Header */}
      <div className="pt-4 mb-6">
        <p className="text-lg font-bold text-white">My Passes</p>
        <p className="text-[10px] text-[#9A9AA0]">Manage your park access</p>
      </div>

      {/* Active Pass Card */}
      <div className="bg-gradient-to-br from-[#FFCC00] to-[#E6B800] rounded-xl p-4 mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-black/20 rounded-full text-[8px] font-bold text-black uppercase">Active</span>
          </div>
          <p className="text-lg font-bold text-black">Unlimited Monthly</p>
          <p className="text-[10px] text-black/60 mb-3">Valid until Jan 31, 2026</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-black/60" />
              <span className="text-[10px] text-black/60">Tap to show QR</span>
            </div>
            <ChevronRight className="w-4 h-4 text-black/40" />
          </div>
        </div>
      </div>

      {/* Pass Options */}
      <div className="space-y-2">
        <div className="bg-[#111113] rounded-xl p-3 border border-[#252529] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00E6E6]/10 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#00E6E6]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Day Pass</p>
              <p className="text-[10px] text-[#5A5A62]">$15 / day</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#35353A]" />
        </div>
        
        <div className="bg-[#111113] rounded-xl p-3 border border-[#252529] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FFCC00]/10 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-[#FFCC00]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Annual Pass</p>
              <p className="text-[10px] text-[#5A5A62]">$299 / year</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#35353A]" />
        </div>
      </div>
    </div>
  );
}

// Challenges screen
function ChallengesScreen({ isActive }: { isActive: boolean }) {
  return (
    <div className={cn(
      "absolute inset-0 bg-[#0A0A0B] p-4 transition-all duration-500",
      isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
    )}>
      {/* Header */}
      <div className="pt-4 mb-6">
        <p className="text-lg font-bold text-white">Challenges</p>
        <p className="text-[10px] text-[#9A9AA0]">Complete tricks, earn XP</p>
      </div>

      {/* Challenge Cards */}
      <div className="space-y-3">
        {[
          { title: "Kickflip Master", xp: 500, progress: 80, difficulty: 3, color: "#FFCC00" },
          { title: "Bowl Rider I", xp: 350, progress: 45, difficulty: 2, color: "#00E6E6" },
          { title: "Rail Slide Pro", xp: 750, progress: 20, difficulty: 4, color: "#FF6B6B" },
        ].map((challenge, i) => (
          <div key={i} className="bg-[#111113] rounded-xl p-3 border border-[#252529]">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${challenge.color}15` }}
              >
                <Trophy className="w-5 h-5" style={{ color: challenge.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold text-white">{challenge.title}</p>
                  <span className="text-[10px] font-bold" style={{ color: challenge.color }}>+{challenge.xp} XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((d) => (
                      <div 
                        key={d} 
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: d <= challenge.difficulty ? challenge.color : "#252529" }}
                      />
                    ))}
                  </div>
                  <div className="flex-1 h-1.5 bg-[#1A1A1D] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${challenge.progress}%`, backgroundColor: challenge.color }}
                    />
                  </div>
                  <span className="text-[10px] text-[#5A5A62]">{challenge.progress}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completed Badge */}
      <div className="mt-4 flex items-center justify-center gap-2 py-2">
        <div className="w-6 h-6 bg-[#22C55E]/20 rounded-full flex items-center justify-center">
          <span className="text-[10px]">✓</span>
        </div>
        <span className="text-[10px] text-[#22C55E]">8 challenges completed</span>
      </div>
    </div>
  );
}

export function AnimatedAppScreens() {
  const [activeScreen, setActiveScreen] = useState(0);
  const screens = ["Dashboard", "Passes", "Challenges"];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScreen((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <DashboardScreen isActive={activeScreen === 0} />
      <PassesScreen isActive={activeScreen === 1} />
      <ChallengesScreen isActive={activeScreen === 2} />

      {/* Screen Indicator Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {screens.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveScreen(i)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              activeScreen === i ? "bg-[#FFCC00] w-4" : "bg-white/20"
            )}
          />
        ))}
      </div>
    </div>
  );
}
