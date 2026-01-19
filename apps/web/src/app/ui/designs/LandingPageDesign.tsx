"use client";

import { ArrowRight, Calendar, Trophy, ShoppingBag, Users, MapPin, Clock, Shield, Zap, ChevronRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// --- Components for this design ---

function ButtonPrimary({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <button className={cn(
      "px-8 py-4",
      "bg-[#FFE500] text-[#0A0A0B]",
      "font-semibold text-sm tracking-wide",
      "rounded-full",
      "transition-all duration-300",
      "hover:bg-[#FFF040] hover:scale-[1.02]",
      "hover:shadow-[0_0_24px_rgba(255,229,0,0.4)]",
      "active:scale-[0.98]",
      className
    )}>
      {children}
    </button>
  );
}

function ButtonSecondary({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <button className={cn(
      "px-8 py-4",
      "bg-transparent text-white",
      "font-semibold text-sm tracking-wide",
      "rounded-full",
      "border border-[#35353A]",
      "transition-all duration-300",
      "hover:bg-white/5 hover:border-[#5A5A62]",
      className
    )}>
      {children}
    </button>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1",
      "text-xs font-medium uppercase tracking-wider",
      "bg-[#252529] text-[#9A9AA0] rounded-full",
      className
    )}>
      {children}
    </span>
  );
}

function ElectricBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFE500]/10 border border-[#FFE500]/20 rounded-full">
      <span className="w-1.5 h-1.5 bg-[#FFE500] rounded-full animate-pulse shadow-[0_0_8px_rgba(255,229,0,0.6)]" />
      <span className="text-xs font-bold uppercase tracking-wider text-[#FFE500]">{children}</span>
    </span>
  );
}

// --- Main Design Component ---

export default function LandingPageDesign() {
  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#FFE500] selection:text-black">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#1A1A1D]">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter text-white">
            KAITIF<span className="text-[#FFE500]">.</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {["Passes", "Events", "Park Rules", "About"].map((item) => (
              <a key={item} href="#" className="text-sm font-medium text-[#9A9AA0] hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="text-sm font-medium text-white hover:text-[#FFE500] transition-colors hidden sm:block">
              Log In
            </a>
            <button className="px-6 py-2.5 bg-[#FFE500] text-black text-sm font-bold rounded-full hover:bg-[#FFF040] transition-colors">
              Get Pass
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background - simulating image with gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#111113]" /> {/* Placeholder for image */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-10" />
          
          {/* Electric Glow */}
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-[#FFE500]/10 blur-[150px] rounded-full opacity-60 pointer-events-none" />
        </div>

        <div className="relative z-20 container mx-auto px-6 pt-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8 animate-fade-in">
              <span className="h-[1px] w-12 bg-[#FFE500]" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFE500]">
                Barbados Premier Skatepark
              </p>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-[-0.03em] leading-[0.9] text-white mb-8">
              SKATE.<br />
              RIDE.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE500] to-[#FFF040]">REPEAT.</span>
            </h1>

            <p className="text-xl text-[#9A9AA0] max-w-lg leading-relaxed mb-12">
              The Caribbean's largest indoor facility. 25,000 sq ft of professional-grade ramps, rails, and bowls.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <ButtonPrimary>
                Start Riding
              </ButtonPrimary>
              <ButtonSecondary>
                View Park Map
              </ButtonSecondary>
            </div>

            <div className="mt-20 flex items-center gap-12 border-t border-[#1A1A1D] pt-8">
              <div>
                <p className="text-3xl font-bold text-white">25k+</p>
                <p className="text-xs uppercase tracking-wider text-[#5A5A62] mt-1">Square Feet</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">7</p>
                <p className="text-xs uppercase tracking-wider text-[#5A5A62] mt-1">Days Open</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#FFE500]">#1</p>
                <p className="text-xs uppercase tracking-wider text-[#5A5A62] mt-1">Rated Park</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-[#0A0A0B] relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFE500] mb-4">
                The Experience
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] text-white">
                Everything needed for the ultimate session.
              </h2>
            </div>
            <a href="#" className="text-sm font-medium text-white border-b border-[#35353A] pb-1 hover:border-[#FFE500] transition-colors">
              Explore Amenities
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 - Large */}
            <div className="lg:col-span-2 bg-[#111113] rounded-2xl p-8 md:p-12 border border-[#252529] hover:border-[#35353A] transition-colors group relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-[#252529] rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-[#FFE500]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Digital Progression</h3>
                <p className="text-[#9A9AA0] text-lg max-w-md">
                  Track your stats, complete challenges, and level up your profile. Your skate career starts here.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#FFE500]/5 to-transparent rounded-bl-full pointer-events-none" />
            </div>

            {/* Feature 2 */}
            <div className="bg-[#111113] rounded-2xl p-8 border border-[#252529] hover:border-[#35353A] transition-colors group">
              <div className="w-12 h-12 bg-[#252529] rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Events & Comps</h3>
              <p className="text-[#9A9AA0]">
                Weekly jams, monthly competitions, and pro workshops.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#111113] rounded-2xl p-8 border border-[#252529] hover:border-[#35353A] transition-colors group">
              <div className="w-12 h-12 bg-[#252529] rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Pro Shop</h3>
              <p className="text-[#9A9AA0]">
                Top-tier decks, wheels, and apparel. Member discounts apply.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="lg:col-span-2 bg-[#111113] rounded-2xl p-8 md:p-12 border border-[#252529] hover:border-[#35353A] transition-colors group flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="w-12 h-12 bg-[#252529] rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Community First</h3>
                <p className="text-[#9A9AA0] text-lg">
                  Join a thriving community of riders. Connect, share clips, and push each other to new heights.
                </p>
              </div>
              <div className="w-full md:w-1/3 aspect-square bg-[#1A1A1D] rounded-xl border border-[#252529] relative overflow-hidden flex items-center justify-center">
                 <span className="text-[#35353A] font-bold">Community Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="py-32 bg-black border-y border-[#1A1A1D]">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Upcoming Events</h2>
            <ButtonSecondary className="hidden md:block">View All Calendar</ButtonSecondary>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Summer Jam '26", date: "AUG 12", category: "Competition", live: true },
              { title: "Grom Session", date: "AUG 15", category: "Workshop", live: false },
              { title: "Night Skate", date: "AUG 18", category: "Social", live: false },
            ].map((event, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-[4/3] bg-[#111113] rounded-2xl overflow-hidden mb-6 border border-[#252529] group-hover:border-[#35353A] transition-colors">
                  {/* Image Placeholder */}
                  <div className="absolute inset-0 bg-[#1A1A1D] group-hover:scale-105 transition-transform duration-500" />
                  
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/50 backdrop-blur-md text-white border border-white/10">
                      {event.category}
                    </Badge>
                  </div>
                  
                  {event.live && (
                    <div className="absolute top-4 right-4">
                      <ElectricBadge>Live Now</ElectricBadge>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-bold text-lg">{event.date}</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FFE500] transition-colors">
                  {event.title}
                </h3>
                <p className="text-[#9A9AA0] text-sm">
                  Join the biggest session of the summer with special guests.
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 md:hidden">
            <ButtonSecondary className="w-full">View All Calendar</ButtonSecondary>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[#FFE500] text-black overflow-hidden relative">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            READY TO RIDE?
          </h2>
          <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-12 opacity-80">
            Get your digital pass today and start earning XP for every session.
          </p>
          <button className="px-10 py-5 bg-black text-white text-lg font-bold rounded-full hover:bg-[#1A1A1D] hover:scale-105 transition-all duration-300 shadow-2xl">
            Get Your Pass
          </button>
        </div>
        
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-[#050505] border-t border-[#1A1A1D]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-6">KAITIF<span className="text-[#FFE500]">.</span></h3>
              <p className="text-[#5A5A62] max-w-xs">
                The future of action sports in the Caribbean. Built for riders, by riders.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">Park</h4>
              <ul className="space-y-4 text-[#9A9AA0]">
                <li><a href="#" className="hover:text-[#FFE500] transition-colors">Hours & Location</a></li>
                <li><a href="#" className="hover:text-[#FFE500] transition-colors">Rules & Safety</a></li>
                <li><a href="#" className="hover:text-[#FFE500] transition-colors">Waiver</a></li>
                <li><a href="#" className="hover:text-[#FFE500] transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Social</h4>
              <ul className="space-y-4 text-[#9A9AA0]">
                <li><a href="#" className="hover:text-[#FFE500] transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-[#FFE500] transition-colors">TikTok</a></li>
                <li><a href="#" className="hover:text-[#FFE500] transition-colors">YouTube</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#1A1A1D] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#35353A] text-sm">
              © 2026 Kaitif Skatepark. All rights reserved.
            </p>
            <div className="flex gap-6">
               <span className="text-[#35353A] text-sm cursor-pointer hover:text-[#5A5A62]">Privacy</span>
               <span className="text-[#35353A] text-sm cursor-pointer hover:text-[#5A5A62]">Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
