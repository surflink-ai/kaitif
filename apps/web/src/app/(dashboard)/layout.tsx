"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Ticket, FileText, Calendar, Trophy, ShoppingBag, MessageCircle, User, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button, BottomDock, BottomDockItem, Avatar, cn } from "@kaitif/ui";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { NotificationBell } from "@/components/notification-bell";

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
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  // Get current user ID for notifications
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Desktop Sidebar - Glass style */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:flex md:w-64 md:flex-col bg-[#0A0A0F]/80 backdrop-blur-2xl border-r border-white/[0.08]">
        {/* Inner highlight */}
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-white/10 via-white/5 to-white/10" />
        
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-white/[0.08] px-6">
          <Link href="/home" className="text-2xl font-bold tracking-tight text-[#FFE500]">
            KAITIF
          </Link>
          {userId && <NotificationBell userId={userId} />}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl relative",
                      isActive
                        ? "bg-[#FFE500]/10 text-[#FFE500]"
                        : "text-white/50 hover:bg-white/[0.05] hover:text-white/80"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FFE500] rounded-r-full shadow-[0_0_10px_rgba(255,229,0,0.5)]" />
                    )}
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="border-t border-white/[0.08] p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-white/50 hover:text-white hover:bg-white/[0.05]"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header - Glass style */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-[#0A0A0F]/80 backdrop-blur-2xl border-b border-white/[0.08] px-4 safe-area-inset-top">
        {/* Bottom highlight line */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <Link href="/home" className="text-xl font-bold tracking-tight text-[#FFE500]">
          KAITIF
        </Link>
        <div className="flex items-center gap-2">
          {userId && <NotificationBell userId={userId} />}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/[0.05] transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - Glass style */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#0A0A0F]/95 backdrop-blur-xl animate-fade-in">
          <div className="pt-20 px-4 safe-area-inset-top">
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
                          "flex items-center gap-3 px-4 py-4 text-lg font-medium transition-all duration-200 rounded-2xl",
                          isActive
                            ? "bg-[#FFE500]/10 text-[#FFE500]"
                            : "text-white/60 hover:bg-white/[0.05] hover:text-white"
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
            <div className="mt-8 pt-8 border-t border-white/[0.08]">
              <Button
                variant="ghost"
                className="w-full justify-start text-white/50 hover:text-white text-lg py-4"
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
      <main className="md:pl-64 min-h-screen dashboard-content-padding">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomDock>
        {navItems.slice(0, 5).map((item) => (
          <Link key={item.href} href={item.href}>
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
