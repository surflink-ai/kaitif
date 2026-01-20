import { createClient } from "@/lib/supabase/server";
import { getUserById, getXPForNextLevel, LEVEL_TITLES } from "@kaitif/db";
import { Card, CardContent, XPBar, Button, FeedPostCard, FeedActivityCard, CreatePostForm } from "@kaitif/ui";
import { Zap, Flame, Loader2 } from "lucide-react";
import ClientFeed from "./client-page";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return null;
  }

  const user = await getUserById(supabase, authUser.id);
  
  const userStats = {
    xp: user?.xp || 0,
    level: user?.level || 1,
    streak: user?.streak || 0,
    name: user?.name || "Skater",
    id: user?.id || "",
    avatarUrl: user?.avatarUrl
  };

  const xpProgress = getXPForNextLevel(userStats.xp);
  const levelTitle = LEVEL_TITLES[userStats.level - 1] || "Rookie";

  // Initial feed data is fetched by the client component to support infinite scroll easier
  // or we could pre-fetch here and pass initial data. 
  // For simplicity with the mixed feed logic in API, we'll let the client fetch.

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-20">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">
            <span className="text-[#FFCC00]">{userStats.name}</span>
          </h1>
          <p className="text-xs text-[#F5F5F0]/60">
            Lvl {userStats.level} {levelTitle}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-lg font-bold text-[#F5F5F0]">{userStats.streak}</span>
            </div>
            <p className="text-[10px] text-[#F5F5F0]/40 uppercase tracking-wider">Streak</p>
          </div>
        </div>
      </div>

      {/* XP Bar - Compact */}
      <Card className="bg-[#1A1A1A] border-[#F5F5F0]/5">
        <CardContent className="py-3 px-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#F5F5F0]/60 uppercase tracking-wider font-bold">Progress</span>
            <span className="text-[#FFCC00]">{Math.round(xpProgress.progress)}%</span>
          </div>
          <XPBar
            currentXP={xpProgress.current}
            requiredXP={xpProgress.required}
            level={userStats.level}
            size="sm"
          />
        </CardContent>
      </Card>

      {/* Feed Client Component */}
      <ClientFeed userId={userStats.id} />
    </div>
  );
}
