"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Badge, Avatar, XPBar, Input, Label, Textarea, Tabs, TabsList, TabsTrigger, TabsContent, Separator, useToast } from "@kaitif/ui";
import { User, Settings, Trophy, Flame, Calendar, ShoppingBag, Edit2, Camera, LogOut, Bell, Shield, CreditCard } from "lucide-react";
import { LEVEL_TITLES, getXPForNextLevel, UserWithRelations } from "@kaitif/db";
import { createBrowserSupabaseClient } from "@kaitif/db";
import { useRouter } from "next/navigation";

interface ProfileClientPageProps {
  user: UserWithRelations;
  stats: {
    totalVisits: number;
    eventsAttended: number;
    challengesCompleted: number;
    badges: number;
    listings: number;
  };
}

export default function ProfileClientPage({ user, stats }: ProfileClientPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  const xpProgress = getXPForNextLevel(user.xp);
  const levelTitle = LEVEL_TITLES[user.level - 1] || "Rookie";

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      toast({
        title: "Profile updated",
        variant: "success",
      });
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload avatar");

      toast({
        title: "Avatar updated",
        variant: "success",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not upload avatar",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#FFCC00]/20 to-[#00E6E6]/20" />
        <CardContent className="relative pt-0">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16">
            <div className="relative group">
              <Avatar name={user.name} src={user.avatarUrl} size="xl" className="ring-4 ring-[#080808]" />
              <label className="absolute bottom-0 right-0 h-8 w-8 bg-[#FFCC00] flex items-center justify-center rounded-full cursor-pointer hover:bg-[#FFCC00]/80 transition-colors">
                <Camera className="h-4 w-4 text-[#080808]" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </label>
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <Badge>Level {user.level}</Badge>
              </div>
              <p className="text-[#FFCC00] font-bold uppercase tracking-wider mb-2">{levelTitle}</p>
              <p className="text-[#F5F5F0]/60 text-sm">
                Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          {/* XP Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <XPBar
                currentXP={xpProgress.current}
                requiredXP={xpProgress.required}
                level={user.level}
                size="md"
              />
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="text-[#F5F5F0]/60">Current Streak</span>
                </div>
                <span className="font-bold text-[#FFCC00]">{user.streak} days</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#00E6E6]" />
                  <span className="text-[#F5F5F0]/60">Total Visits</span>
                </div>
                <span className="font-bold">{stats.totalVisits}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#00E6E6]" />
                  <span className="text-[#F5F5F0]/60">Events Attended</span>
                </div>
                <span className="font-bold">{stats.eventsAttended}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-[#FFCC00]" />
                  <span className="text-[#F5F5F0]/60">Challenges</span>
                </div>
                <span className="font-bold">{stats.challengesCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-[#FFCC00]" />
                  <span className="text-[#F5F5F0]/60">Badges Earned</span>
                </div>
                <span className="font-bold">{stats.badges}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-[#F5F5F0]/40" />
                  <span className="text-[#F5F5F0]/60">Marketplace Listings</span>
                </div>
                <span className="font-bold">{stats.listings}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Profile & Settings */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              {isEditing ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Edit Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Display Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-3">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#F5F5F0]/80">{user.bio || "No bio yet."}</p>
                  </CardContent>
                </Card>
              )}

              {/* Badges */}
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-lg">Badges</CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </CardHeader>
                <CardContent>
                  {(user.badges?.length || 0) === 0 ? (
                    <p className="text-[#F5F5F0]/60">No badges earned yet.</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-4">
                      {(user.badges || []).map((userBadge: any, i: number) => (
                        <div key={i} className="text-center">
                          <div className={`h-14 w-14 mx-auto mb-2 flex items-center justify-center ${
                            userBadge.badge.rarity === "COMMON" ? "bg-gray-500/20 border-2 border-gray-500" :
                            userBadge.badge.rarity === "RARE" ? "bg-blue-500/20 border-2 border-blue-500" :
                            userBadge.badge.rarity === "EPIC" ? "bg-purple-500/20 border-2 border-purple-500" :
                            "bg-[#FFCC00]/20 border-2 border-[#FFCC00]"
                          }`}>
                            <Trophy className={`h-6 w-6 ${
                              userBadge.badge.rarity === "COMMON" ? "text-gray-500" :
                              userBadge.badge.rarity === "RARE" ? "text-blue-500" :
                              userBadge.badge.rarity === "EPIC" ? "text-purple-500" :
                              "text-[#FFCC00]"
                            }`} />
                          </div>
                          <p className="text-xs font-bold truncate">{userBadge.badge.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">Push Notifications</p>
                      <p className="text-sm text-[#F5F5F0]/60">Receive notifications about events and messages</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">Email Updates</p>
                      <p className="text-sm text-[#F5F5F0]/60">Weekly digest of park news and events</p>
                    </div>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">Email</p>
                      <p className="text-sm text-[#F5F5F0]/60">{user.email}</p>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">Password</p>
                      <p className="text-sm text-[#F5F5F0]/60">Last changed 30 days ago</p>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-500/50">
                <CardHeader>
                  <CardTitle className="text-lg text-red-500">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">Sign Out</p>
                      <p className="text-sm text-[#F5F5F0]/60">Sign out of your account</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
