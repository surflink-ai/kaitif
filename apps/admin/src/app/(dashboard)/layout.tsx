"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Ticket, 
  FileText, 
  Calendar, 
  Trophy, 
  ShoppingBag, 
  MessageSquare, 
  BarChart3, 
  LogOut, 
  Menu, 
  X,
  Scan
} from "lucide-react";
import { Button, cn } from "@kaitif/ui";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/users", icon: Users, label: "Users" },
  { href: "/dashboard/passes", icon: Ticket, label: "Passes" },
  { href: "/dashboard/scan", icon: Scan, label: "Scanner" },
  { href: "/dashboard/waivers", icon: FileText, label: "Waivers" },
  { href: "/dashboard/events", icon: Calendar, label: "Events" },
  { href: "/dashboard/challenges", icon: Trophy, label: "Challenges" },
  { href: "/dashboard/marketplace", icon: ShoppingBag, label: "Marketplace" },
  { href: "/dashboard/messages", icon: MessageSquare, label: "Messages" },
  { href: "/dashboard/reports", icon: BarChart3, label: "Reports" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:flex md:w-64 md:flex-col bg-[#080808] border-r border-[#F5F5F0]/10">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-[#F5F5F0]/10 px-6">
          <Link href="/dashboard" className="text-xl font-bold tracking-wider text-[#FFCC00]">
            KAITIF <span className="text-[#F5F5F0] text-sm font-normal opacity-60 ml-2">ADMIN</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-sm",
                      isActive
                        ? "bg-[#FFCC00] text-[#080808]"
                        : "text-[#F5F5F0]/60 hover:bg-[#F5F5F0]/5 hover:text-[#F5F5F0]"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="border-t border-[#F5F5F0]/10 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-red-500/10 hover:text-red-500"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-[#F5F5F0]/10 bg-[#080808] px-4">
        <Link href="/dashboard" className="text-lg font-bold tracking-wider text-[#FFCC00]">
          KAITIF ADMIN
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-[#F5F5F0]"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#080808]">
          <div className="pt-20 px-4 h-full flex flex-col">
            <nav className="flex-1 overflow-y-auto">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 text-lg font-medium transition-colors rounded-sm",
                          isActive
                            ? "bg-[#FFCC00] text-[#080808]"
                            : "text-[#F5F5F0]/60 hover:text-[#F5F5F0]"
                        )}
                      >
                        <item.icon className="h-6 w-6" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="mt-auto py-8 border-t border-[#F5F5F0]/10">
              <Button
                variant="ghost"
                className="w-full justify-start text-[#F5F5F0]/60 hover:text-red-500"
                onClick={handleSignOut}
              >
                <LogOut className="h-6 w-6 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="md:pl-64 pt-16 md:pt-0 min-h-screen">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
