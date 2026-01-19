"use client";

import { Bell, Search, Zap, Ticket, Calendar, Trophy, ChevronRight, User, Settings, LogOut, Grid, Home, MessageSquare, ShoppingCart, Activity, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

// --- Components for this design ---

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "bg-[#111113] rounded-2xl border border-[#252529] shadow-sm",
      className
    )}>
      {children}
    </div>
  );
}

function Badge({ children, variant = "default", className }: { children: React.ReactNode; variant?: "default" | "electric" | "success" | "warning"; className?: string }) {
  const variants = {
    default: "bg-[#252529] text-[#9A9AA0]",
    electric: "bg-[#FFE500]/15 text-[#FFE500] border border-[#FFE500]/20",
    success: "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/20",
    warning: "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/20",
  };
  
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-2 bg-[#1A1A1D] rounded-full overflow-hidden w-full">
      <div 
        className="h-full bg-[#FFE500] rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

// --- Main Design Component ---

export default function UserDashboardDesign() {
  const user = {
    name: "Alex",
    level: 12,
    xp: 2450,
    xpToNext: 3000,
    streak: 5,
    rank: 24
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans flex">
      
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#252529] bg-[#0A0A0B] fixed h-full z-20">
        <div className="p-6">
          <div className="text-2xl font-bold tracking-tighter text-white">
            KAITIF<span className="text-[#FFE500]">.</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { icon: Home, label: "Dashboard", active: true },
            { icon: Ticket, label: "My Passes" },
            { icon: Calendar, label: "Events" },
            { icon: Trophy, label: "Challenges" },
            { icon: ShoppingCart, label: "Marketplace" },
            { icon: MessageSquare, label: "Community" },
          ].map((item) => (
            <a 
              key={item.label} 
              href="#" 
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                item.active 
                  ? "bg-[#FFE500]/10 text-[#FFE500]" 
                  : "text-[#9A9AA0] hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-[#252529]">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#9A9AA0] hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-[#252529] px-6 py-4 flex items-center justify-between">
          <div className="lg:hidden text-xl font-bold">KAITIF.</div>
          
          <div className="hidden md:flex items-center bg-[#1A1A1D] rounded-full px-4 py-2 w-96 border border-[#252529] focus-within:border-[#5A5A62] transition-colors">
            <Search className="w-4 h-4 text-[#5A5A62] mr-3" />
            <input 
              type="text" 
              placeholder="Search events, skaters, gear..." 
              className="bg-transparent border-none outline-none text-sm text-white placeholder-[#5A5A62] w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-[#9A9AA0] hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#FFE500] rounded-full border border-[#0A0A0B]" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#252529] border border-[#35353A] flex items-center justify-center overflow-hidden">
               <User className="w-4 h-4 text-[#9A9AA0]" />
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Welcome & Stats */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user.name}
              </h1>
              <div className="flex items-center gap-3 text-sm text-[#9A9AA0]">
                <span>Level {user.level} Pro</span>
                <span className="w-1 h-1 bg-[#35353A] rounded-full" />
                <span className="text-[#FFE500] font-medium">{user.streak} Day Streak 🔥</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="bg-[#111113] border border-[#252529] rounded-xl px-4 py-2 flex flex-col items-center min-w-[100px]">
                <span className="text-[10px] uppercase tracking-wider text-[#5A5A62] font-semibold">Rank</span>
                <span className="text-xl font-bold text-white">#{user.rank}</span>
              </div>
              <div className="bg-[#111113] border border-[#252529] rounded-xl px-4 py-2 flex flex-col items-center min-w-[100px]">
                <span className="text-[10px] uppercase tracking-wider text-[#5A5A62] font-semibold">Total XP</span>
                <span className="text-xl font-bold text-white">2.4k</span>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <Card className="p-6 bg-gradient-to-r from-[#111113] to-[#1A1A1D]">
            <div className="flex justify-between items-end mb-3">
              <div>
                <h3 className="text-sm font-medium text-white">Level Progress</h3>
                <p className="text-xs text-[#9A9AA0] mt-1">Keep riding to unlock Level {user.level + 1}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-[#FFE500]">{user.xp}</span>
                <span className="text-xs text-[#5A5A62]"> / {user.xpToNext} XP</span>
              </div>
            </div>
            <ProgressBar value={user.xp} max={user.xpToNext} />
          </Card>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (2/3) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Active Pass */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">Active Pass</h2>
                  <button className="text-xs font-medium text-[#9A9AA0] hover:text-white">Manage</button>
                </div>
                <Card className="overflow-hidden relative group cursor-pointer hover:border-[#35353A] transition-colors">
                  <div className="p-6 flex flex-col sm:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="success">Active</Badge>
                        <span className="text-xs text-[#5A5A62]">Expires in 12 days</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Unlimited Monthly</h3>
                      <p className="text-sm text-[#9A9AA0]">Valid for all sessions and events.</p>
                      
                      <div className="mt-6 flex gap-3">
                        <button className="px-4 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-gray-200 transition-colors">
                          Show QR Code
                        </button>
                        <button className="px-4 py-2 bg-transparent text-white border border-[#35353A] text-xs font-bold rounded-full hover:bg-white/5 transition-colors">
                          Add to Wallet
                        </button>
                      </div>
                    </div>
                    
                    {/* Visual QR Placeholder */}
                    <div className="flex-shrink-0 flex items-center justify-center">
                      <div className="w-24 h-24 bg-white rounded-xl p-2 ring-4 ring-[#FFE500]/10">
                         <div className="w-full h-full bg-black pattern-grid-lg" /> 
                      </div>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-[#252529] mt-4">
                    <div className="h-full bg-[#22C55E] w-[60%]" />
                  </div>
                </Card>
              </section>

              {/* Quick Actions */}
              <section>
                <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { icon: Ticket, label: "Buy Pass", color: "text-[#FFE500]" },
                    { icon: Calendar, label: "Book Event", color: "text-[#3B82F6]" },
                    { icon: Trophy, label: "Leaderboard", color: "text-[#F59E0B]" },
                    { icon: ShoppingCart, label: "Shop", color: "text-[#EC4899]" },
                  ].map((action) => (
                    <Card key={action.label} className="p-4 hover:bg-[#1A1A1D] transition-colors cursor-pointer group flex flex-col items-center text-center gap-3">
                      <div className={cn("w-10 h-10 rounded-full bg-[#1A1A1D] border border-[#252529] flex items-center justify-center group-hover:scale-110 transition-transform", action.color)}>
                        <action.icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-white">{action.label}</span>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Active Challenges */}
              <section>
                 <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">Active Challenges</h2>
                  <button className="text-xs font-medium text-[#9A9AA0] hover:text-white">View All</button>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "Kickflip Master", progress: 80, xp: 500, diff: 3 },
                    { title: "Bowl Rider I", progress: 45, xp: 350, diff: 2 },
                  ].map((challenge) => (
                    <Card key={challenge.title} className="p-4 flex items-center gap-4 hover:border-[#35353A] transition-colors cursor-pointer">
                      <div className="w-12 h-12 bg-[#1A1A1D] rounded-lg flex items-center justify-center flex-shrink-0 border border-[#252529]">
                        <Trophy className="w-5 h-5 text-[#FFE500]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                          <h4 className="font-bold text-white text-sm truncate">{challenge.title}</h4>
                          <span className="text-xs font-bold text-[#FFE500]">+{challenge.xp} XP</span>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                           <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} className={cn("w-1.5 h-1.5 rounded-full", i <= challenge.diff ? "bg-[#FFE500]" : "bg-[#252529]")} />
                            ))}
                          </div>
                          <span className="text-[10px] text-[#5A5A62] uppercase tracking-wider">Intermediate</span>
                        </div>
                        <div className="h-1.5 bg-[#1A1A1D] rounded-full overflow-hidden w-full max-w-[200px]">
                          <div className="h-full bg-[#FFE500] rounded-full" style={{ width: `${challenge.progress}%` }} />
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#35353A]" />
                    </Card>
                  ))}
                </div>
              </section>

            </div>

            {/* Right Column (1/3) */}
            <div className="space-y-8">
              
              {/* Upcoming Events */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">Upcoming</h2>
                </div>
                <Card className="divide-y divide-[#252529]">
                  {[
                    { title: "Pro Demo Night", date: "Tonight, 7PM", type: "Event" },
                    { title: "Skate School", date: "Tomorrow, 10AM", type: "Class" },
                    { title: "Park Maintenance", date: "Aug 24", type: "Notice" },
                  ].map((item, i) => (
                    <div key={i} className="p-4 hover:bg-[#1A1A1D] transition-colors cursor-pointer flex gap-4">
                      <div className="w-10 h-10 bg-[#1A1A1D] rounded-lg border border-[#252529] flex flex-col items-center justify-center text-xs flex-shrink-0">
                        <span className="text-[#9A9AA0] font-bold uppercase">{item.date.split(' ')[0].substring(0,3)}</span>
                        <span className="text-white font-bold">{item.date.match(/\d+/)?.[0] || '12'}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight mb-1">{item.title}</h4>
                        <p className="text-xs text-[#9A9AA0]">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </Card>
              </section>

              {/* Leaderboard Preview */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">Top Riders</h2>
                  <button className="text-xs font-medium text-[#9A9AA0] hover:text-white">Full Board</button>
                </div>
                <Card className="p-4 space-y-4">
                  {[
                    { name: "Kai R.", xp: "12.5k", rank: 1 },
                    { name: "Sarah J.", xp: "10.2k", rank: 2 },
                    { name: "Mike T.", xp: "9.8k", rank: 3 },
                  ].map((rider) => (
                    <div key={rider.rank} className="flex items-center gap-3">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                        rider.rank === 1 ? "bg-[#FFE500] text-black" : "bg-[#252529] text-[#9A9AA0]"
                      )}>
                        {rider.rank}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#252529] border border-[#35353A]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{rider.name}</p>
                      </div>
                      <span className="text-xs font-medium text-[#FFE500]">{rider.xp}</span>
                    </div>
                  ))}
                  
                  <div className="pt-3 border-t border-[#252529] flex items-center gap-3 opacity-60">
                     <div className="w-6 h-6 rounded-full bg-[#252529] text-[#9A9AA0] flex items-center justify-center text-xs font-bold">24</div>
                     <div className="w-8 h-8 rounded-full bg-[#252529] border border-[#35353A]" />
                     <p className="text-sm font-bold text-white">You</p>
                     <span className="ml-auto text-xs font-medium text-[#9A9AA0]">2.4k</span>
                  </div>
                </Card>
              </section>

              {/* Advertisement / Promo */}
              <div className="rounded-2xl bg-gradient-to-br from-[#FFE500] to-[#FFD600] p-6 text-black relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-bold text-xl mb-2">Summer Sale</h3>
                  <p className="text-sm font-medium mb-4 opacity-80">Get 20% off all decks in the pro shop.</p>
                  <button className="px-4 py-2 bg-black text-white text-xs font-bold rounded-full">Shop Now</button>
                </div>
                <ShoppingBag className="absolute -bottom-4 -right-4 w-32 h-32 text-black/5 rotate-12" />
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
