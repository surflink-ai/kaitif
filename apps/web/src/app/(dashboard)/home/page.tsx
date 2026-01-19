import { Card, CardContent, Badge, XPBar, Button, HypeMeter } from "@kaitif/ui";
import { Zap, Flame, Calendar, Trophy, Ticket, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getXPForNextLevel, LEVEL_TITLES, getUserById, getUpcomingEvents, getActiveChallenges } from "@kaitif/db";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    // Should be redirected by middleware, but safe fallback
    return null;
  }

  const [user, upcomingEvents, activeChallenges] = await Promise.all([
    getUserById(supabase, authUser.id),
    getUpcomingEvents(supabase, { limit: 2, publishedOnly: true }),
    getActiveChallenges(supabase)
  ]);

  const userStats = {
    xp: user?.xp || 0,
    level: user?.level || 1,
    streak: user?.streak || 0,
    name: user?.name || "Skater",
  };

  const xpProgress = getXPForNextLevel(userStats.xp);
  const levelTitle = LEVEL_TITLES[userStats.level - 1] || "Rookie";

  // Take top 3 challenges
  const topChallenges = activeChallenges.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2">
          Welcome back, <span className="text-[#FFCC00]">{userStats.name}</span>
        </h1>
        <p className="text-[#F5F5F0]/60">
          Level {userStats.level} {levelTitle} • {userStats.streak} day streak
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* XP Card */}
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-[#FFCC00]" />
              <span className="text-sm font-bold uppercase tracking-wider text-[#F5F5F0]/60">Experience</span>
            </div>
            <XPBar
              currentXP={xpProgress.current}
              requiredXP={xpProgress.required}
              level={userStats.level}
              size="lg"
            />
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-bold uppercase tracking-wider text-[#F5F5F0]/60">Streak</span>
            </div>
            <p className="text-5xl font-bold text-[#FFCC00]">{userStats.streak}</p>
            <p className="text-sm text-[#F5F5F0]/40 mt-2">consecutive days</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/passes">
          <Card className="hover:border-[#FFCC00]/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6 text-center">
              <Ticket className="h-8 w-8 text-[#FFCC00] mx-auto mb-3" />
              <p className="font-bold uppercase tracking-wider text-sm">Buy Pass</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/events">
          <Card className="hover:border-[#00E6E6]/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6 text-center">
              <Calendar className="h-8 w-8 text-[#00E6E6] mx-auto mb-3" />
              <p className="font-bold uppercase tracking-wider text-sm">Events</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/challenges">
          <Card className="hover:border-[#FFCC00]/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6 text-center">
              <Trophy className="h-8 w-8 text-[#FFCC00] mx-auto mb-3" />
              <p className="font-bold uppercase tracking-wider text-sm">Challenges</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/waiver">
          <Card className="hover:border-[#00E6E6]/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6 text-center">
              <div className="h-8 w-8 bg-[#00E6E6]/20 border-2 border-[#00E6E6] mx-auto mb-3 flex items-center justify-center">
                <span className="text-[#00E6E6] text-lg">✓</span>
              </div>
              <p className="font-bold uppercase tracking-wider text-sm">Waiver</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Upcoming Events */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold uppercase tracking-wider">Upcoming Events</h2>
          <Link href="/events">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {upcomingEvents.length === 0 ? (
          <p className="text-[#F5F5F0]/60">No upcoming events.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:border-[#FFCC00]/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge>{event.category}</Badge>
                    <span className="text-sm text-[#FFCC00]">
                      {new Date(event.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-wider mb-4">{event.title}</h3>
                  <HypeMeter value={event.hypeLevel} size="sm" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Active Challenges */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold uppercase tracking-wider">Active Challenges</h2>
          <Link href="/challenges">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {topChallenges.length === 0 ? (
          <p className="text-[#F5F5F0]/60">No active challenges.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {topChallenges.map((challenge) => (
              <Card key={challenge.id} className="hover:border-[#FFCC00]/30 transition-colors">
                <CardContent className="pt-6">
                  <Badge variant={
                    challenge.difficulty === "BEGINNER" ? "secondary" :
                    challenge.difficulty === "INTERMEDIATE" ? "accent" :
                    "default"
                  } className="mb-3">
                    {challenge.difficulty}
                  </Badge>
                  <h3 className="font-bold uppercase tracking-wider mb-2">{challenge.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-[#FFCC00]">
                    <Zap className="h-4 w-4" />
                    <span>+{challenge.xpReward} XP</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
