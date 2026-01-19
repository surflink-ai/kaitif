"use client";

import { Bell, Search, Settings, Home, Users, BarChart2, Ticket, Shield, DollarSign, TrendingUp, Download, Filter, MoreHorizontal, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

// --- Components for this design ---

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "bg-[#111113] rounded-xl border border-[#252529] shadow-sm",
      className
    )}>
      {children}
    </div>
  );
}

function Badge({ children, variant = "default", className }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "error" | "neutral"; className?: string }) {
  const variants = {
    default: "bg-[#252529] text-[#9A9AA0]",
    neutral: "bg-[#252529] text-white",
    success: "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20",
    warning: "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20",
    error: "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20",
  };
  
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}

function StatCard({ label, value, change, trend = "up", highlight = false }: { label: string; value: string; change?: string; trend?: "up" | "down"; highlight?: boolean }) {
  return (
    <Card className={cn("p-5", highlight && "border-[#FFE500]/30 bg-[#FFE500]/5")}>
      <p className="text-xs font-medium uppercase tracking-wider text-[#5A5A62] mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <h3 className={cn("text-2xl font-bold tracking-tight", highlight ? "text-[#FFE500]" : "text-white")}>{value}</h3>
        {change && (
          <div className={cn(
            "flex items-center text-xs font-medium px-1.5 py-0.5 rounded",
            trend === "up" ? "text-[#22C55E] bg-[#22C55E]/10" : "text-[#EF4444] bg-[#EF4444]/10"
          )}>
            <TrendingUp className={cn("w-3 h-3 mr-1", trend === "down" && "rotate-180")} />
            {change}
          </div>
        )}
      </div>
    </Card>
  );
}

// --- Main Design Component ---

export default function AdminDashboardDesign() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans flex">
      
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#252529] bg-[#0A0A0B] fixed h-full z-20">
        <div className="p-6 border-b border-[#252529]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FFE500] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-lg tracking-tight">Kaitif Admin</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          <div className="px-3 mb-2 text-xs font-semibold text-[#5A5A62] uppercase tracking-wider">Overview</div>
          {[
            { icon: Home, label: "Dashboard", active: true },
            { icon: BarChart2, label: "Analytics" },
            { icon: DollarSign, label: "Finance" },
          ].map((item) => (
            <a 
              key={item.label} 
              href="#" 
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                item.active 
                  ? "bg-[#252529] text-white" 
                  : "text-[#9A9AA0] hover:text-white hover:bg-[#1A1A1D]"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </a>
          ))}

          <div className="px-3 mt-8 mb-2 text-xs font-semibold text-[#5A5A62] uppercase tracking-wider">Operations</div>
          {[
            { icon: Users, label: "Members" },
            { icon: Ticket, label: "Passes" },
            { icon: Shield, label: "Waivers", badge: "8" },
          ].map((item) => (
            <a 
              key={item.label} 
              href="#" 
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                "text-[#9A9AA0] hover:text-white hover:bg-[#1A1A1D]"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-[#FFE500] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-md">{item.badge}</span>
              )}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-[#252529]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#252529] border border-[#35353A]" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-[#5A5A62]">admin@kaitif.com</p>
            </div>
            <Settings className="w-4 h-4 text-[#5A5A62]" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64 min-h-screen flex flex-col bg-[#0A0A0B]">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#0A0A0B]/95 backdrop-blur-sm border-b border-[#252529] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <h1 className="text-xl font-bold text-white">Dashboard Overview</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-[#111113] rounded-lg px-3 py-1.5 border border-[#252529] focus-within:border-[#5A5A62] transition-colors w-64">
              <Search className="w-4 h-4 text-[#5A5A62] mr-2" />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="bg-transparent border-none outline-none text-sm text-white placeholder-[#5A5A62] w-full"
              />
            </div>
            <button className="p-2 text-[#9A9AA0] hover:text-white border border-[#252529] rounded-lg bg-[#111113]">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div className="flex items-center gap-2">
               <button className="px-3 py-1.5 text-sm font-medium text-white bg-[#252529] rounded-lg border border-[#35353A]">Today</button>
               <button className="px-3 py-1.5 text-sm font-medium text-[#9A9AA0] hover:text-white hover:bg-[#1A1A1D] rounded-lg">Last 7 Days</button>
               <button className="px-3 py-1.5 text-sm font-medium text-[#9A9AA0] hover:text-white hover:bg-[#1A1A1D] rounded-lg">Last 30 Days</button>
             </div>
             
             <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#9A9AA0] hover:text-white bg-[#111113] border border-[#252529] rounded-lg">
                  <Filter className="w-4 h-4" /> Filter
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-black bg-white hover:bg-gray-200 border border-transparent rounded-lg">
                  <Download className="w-4 h-4" /> Export Report
                </button>
             </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Revenue" value="$24,500" change="+12.5%" trend="up" highlight />
            <StatCard label="Active Passes" value="1,245" change="+3.2%" trend="up" />
            <StatCard label="Daily Check-ins" value="142" change="-2.1%" trend="down" />
            <StatCard label="New Members" value="48" change="+8.4%" trend="up" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Chart Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                 <div className="flex items-center justify-between mb-6">
                   <div>
                     <h3 className="text-lg font-bold text-white">Revenue & Traffic</h3>
                     <p className="text-sm text-[#5A5A62]">Comparative analysis for current period</p>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="flex items-center text-xs text-[#9A9AA0]"><div className="w-2 h-2 rounded-full bg-[#FFE500] mr-1" /> Revenue</span>
                     <span className="flex items-center text-xs text-[#9A9AA0]"><div className="w-2 h-2 rounded-full bg-[#35353A] mr-1" /> Traffic</span>
                   </div>
                 </div>
                 
                 {/* Chart Placeholder */}
                 <div className="h-64 w-full flex items-end justify-between gap-2 px-2">
                    {[35, 45, 30, 60, 75, 50, 65, 80, 70, 55, 60, 75].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end gap-1 group relative">
                        <div className="w-full bg-[#35353A] rounded-sm transition-all hover:bg-[#5A5A62]" style={{ height: `${h * 0.6}%` }} />
                        <div className="w-full bg-[#FFE500] rounded-sm transition-all opacity-80 group-hover:opacity-100" style={{ height: `${h}%` }} />
                        {/* Tooltip hint */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#252529] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          ${h * 120}
                        </div>
                      </div>
                    ))}
                 </div>
                 <div className="flex justify-between mt-4 text-xs text-[#5A5A62] px-2 font-mono">
                   <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                 </div>
              </Card>

              {/* Data Table */}
              <Card className="overflow-hidden">
                <div className="px-6 py-4 border-b border-[#252529] flex items-center justify-between">
                  <h3 className="font-bold text-white">Recent Transactions</h3>
                  <button className="text-xs font-medium text-[#FFE500]">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#1A1A1D] text-[#9A9AA0] font-medium uppercase text-xs">
                      <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Item</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Amount</th>
                        <th className="px-6 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#252529]">
                      {[
                        { id: "#TRX-9821", user: "Alex M.", item: "Monthly Pass", status: "completed", amount: "$45.00" },
                        { id: "#TRX-9820", user: "Sarah K.", item: "Day Pass", status: "completed", amount: "$15.00" },
                        { id: "#TRX-9819", user: "Mike R.", item: "Pro Shop", status: "pending", amount: "$120.00" },
                        { id: "#TRX-9818", user: "Jenny L.", item: "Event Entry", status: "failed", amount: "$25.00" },
                      ].map((row) => (
                        <tr key={row.id} className="hover:bg-[#1A1A1D] transition-colors">
                          <td className="px-6 py-4 font-mono text-[#5A5A62]">{row.id}</td>
                          <td className="px-6 py-4 font-medium text-white">{row.user}</td>
                          <td className="px-6 py-4 text-[#9A9AA0]">{row.item}</td>
                          <td className="px-6 py-4">
                            <Badge variant={
                              row.status === "completed" ? "success" : 
                              row.status === "pending" ? "warning" : "error"
                            }>
                              {row.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-white">{row.amount}</td>
                          <td className="px-6 py-4 text-right">
                             <button className="text-[#9A9AA0] hover:text-white"><MoreHorizontal className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              
              {/* Pending Actions */}
              <Card>
                <div className="px-5 py-4 border-b border-[#252529] flex items-center justify-between">
                  <h3 className="font-bold text-white">Pending Actions</h3>
                  <Badge variant="warning">8</Badge>
                </div>
                <div className="divide-y divide-[#252529]">
                  {[
                     { title: "Review Waiver", user: "New User 123", time: "2m ago", urgent: true },
                     { title: "Refund Request", user: "Ticket #992", time: "15m ago", urgent: true },
                     { title: "Identify Verification", user: "Sam T.", time: "1h ago", urgent: false },
                  ].map((item, i) => (
                    <div key={i} className="p-4 hover:bg-[#1A1A1D] transition-colors flex gap-3">
                       <div className={cn("mt-1 w-2 h-2 rounded-full flex-shrink-0", item.urgent ? "bg-[#EF4444]" : "bg-[#3B82F6]")} />
                       <div className="flex-1">
                         <h4 className="text-sm font-medium text-white">{item.title}</h4>
                         <p className="text-xs text-[#9A9AA0] mt-0.5">{item.user} • {item.time}</p>
                       </div>
                       <button className="text-xs font-medium text-white bg-[#252529] px-2 py-1 rounded hover:bg-[#35353A] h-fit">
                         Review
                       </button>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-[#252529] text-center">
                  <button className="text-xs font-medium text-[#9A9AA0] hover:text-white w-full py-1">View All Queue</button>
                </div>
              </Card>

              {/* System Status */}
              <Card className="p-5">
                 <h3 className="font-bold text-white mb-4">System Status</h3>
                 <div className="space-y-3">
                   {[
                     { label: "API Uptime", status: "Operational", color: "text-[#22C55E]" },
                     { label: "Payment Gateway", status: "Operational", color: "text-[#22C55E]" },
                     { label: "Door Access", status: "Maintenance", color: "text-[#F59E0B]" },
                   ].map((item) => (
                     <div key={item.label} className="flex items-center justify-between text-sm">
                       <span className="text-[#9A9AA0]">{item.label}</span>
                       <span className={cn("flex items-center font-medium", item.color)}>
                         {item.status === "Operational" ? <CheckCircle className="w-3 h-3 mr-1.5" /> : <AlertCircle className="w-3 h-3 mr-1.5" />}
                         {item.status}
                       </span>
                     </div>
                   ))}
                 </div>
                 
                 <div className="mt-6 pt-4 border-t border-[#252529]">
                    <div className="flex items-center gap-2 mb-2">
                       <Clock className="w-4 h-4 text-[#5A5A62]" />
                       <span className="text-xs font-medium text-[#9A9AA0]">Last Backup</span>
                    </div>
                    <p className="text-sm text-white pl-6">Today, 04:00 AM</p>
                 </div>
              </Card>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
