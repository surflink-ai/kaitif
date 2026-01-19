"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Ticket, FileText, Calendar, Trophy, ShoppingBag, MessageCircle, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button, BottomDock, BottomDockItem, Avatar, cn } from "@kaitif/ui";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/passes", icon: Ticket, label: "Passes" },
  { href: "/waiver", icon: FileText, label: "Waiver" },
  { href: "/events", icon: Calendar, label: "Events" },
  { href: "/challenges", icon: Trophy, label: "Challenges" },
  { href: "/marketplace", icon: ShoppingBag, label: "Market" },
  { href: "/messages", icon: MessageCircle, label: "Messages" },
  { href: "/profile", icon: User, label: "Profile" },
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
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:flex md:w-64 md:flex-col bg-[#080808] border-r-2 border-[#F5F5F0]/10">
        {/* Logo */}
        <div className="flex h-16 items-center border-b-2 border-[#F5F5F0]/10 px-6">
          <Link href="/home" className="text-2xl font-bold tracking-wider text-[#FFCC00]">
            KAITIF
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors",
                      isActive
                        ? "bg-[#FFCC00]/10 text-[#FFCC00] border-l-2 border-[#FFCC00]"
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
        <div className="border-t-2 border-[#F5F5F0]/10 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-[#F5F5F0]/60 hover:text-[#F5F5F0]"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b-2 border-[#F5F5F0]/10 bg-[#080808] px-4">
        <Link href="/home" className="text-xl font-bold tracking-wider text-[#FFCC00]">
          KAITIF
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
          <div className="pt-20 px-4">
            <nav>
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-4 text-lg font-bold uppercase tracking-wider transition-colors",
                          isActive
                            ? "bg-[#FFCC00]/10 text-[#FFCC00]"
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
            <div className="mt-8 pt-8 border-t-2 border-[#F5F5F0]/10">
              <Button
                variant="ghost"
                className="w-full justify-start text-[#F5F5F0]/60"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="md:pl-64 pb-20 md:pb-0 pt-16 md:pt-0 min-h-screen">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomDock>
        {navItems.slice(0, 5).map((item) => (
          <Link key={item.href} href={item.href} className="flex-1">
            <BottomDockItem
              icon={<item.icon className="h-5 w-5" />}
              label={item.label}
              active={pathname === item.href}
            />
          </Link>
        ))}
      </BottomDock>
    </div>
  );
}
