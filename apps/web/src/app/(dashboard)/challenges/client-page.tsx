"use client";

import { useState } from "react";
import { Card, CardContent, Button, Badge, Tabs, TabsList, TabsTrigger, TabsContent, Avatar, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label, useToast } from "@kaitif/ui";
import { Trophy, Zap, Video, Check, Medal, Upload, Loader2 } from "lucide-react";
import { Challenge, ChallengeCompletion, User, Badge as BadgeType, UserBadge } from "@kaitif/db";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

const difficultyColors: Record<Difficulty, string> = {
  BEGINNER: "#22C55E",
  INTERMEDIATE: "#3B82F6",
  ADVANCED: "#A855F7",
  EXPERT: "#EF4444",
};

interface ChallengesClientPageProps {
  challenges: (Challenge & { completions: { count: number }[] })[];
  userCompletions: ChallengeCompletion[];
  leaderboard: User[];
  userBadges: (UserBadge & { badge: BadgeType })[];
  userId: string;
}

export default function ChallengesClientPage({
  challenges,
  userCompletions,
  leaderboard,
  userBadges,
  userId,
}: ChallengesClientPageProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "ALL">("ALL");
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedChallengeId) return;

    setUploading(true);
    try {
      // 1. Upload video
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${selectedChallengeId}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('challenges')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('challenges')
        .getPublicUrl(fileName);

      // 2. Submit completion record
      const res = await fetch("/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: selectedChallengeId,
          videoUrl: publicUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit challenge record");

      toast({
        title: "Submission Received!",
        description: "Your video has been uploaded and is pending review.",
      });
      setIsSubmitOpen(false);
      setFile(null);
      setSelectedChallengeId(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Upload Failed",
        description: "Could not upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const openSubmitDialog = (challengeId: string) => {
    setSelectedChallengeId(challengeId);
    setIsSubmitOpen(true);
  };

  const filteredChallenges = selectedDifficulty === "ALL"
    ? challenges
    : challenges.filter(c => c.difficulty === selectedDifficulty);

  const getCompletionStatus = (challengeId: string) => {
    const completion = userCompletions.find(c => c.challengeId === challengeId);
    return completion?.status; // PENDING, APPROVED, REJECTED
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2">
          <span className="text-[#FFCC00]">Challenges</span>
        </h1>
        <p className="text-[#F5F5F0]/60">
          Complete trick challenges to earn XP and unlock badges.
        </p>
      </div>

      <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Challenge Attempt</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video">Video Evidence</Label>
              <div className="border-2 border-dashed border-[#F5F5F0]/20 rounded-lg p-8 text-center hover:border-[#FFCC00]/50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  id="video" 
                  accept="video/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  required
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-[#F5F5F0]/40" />
                  <p className="text-sm font-medium">
                    {file ? file.name : "Click to upload video"}
                  </p>
                  <p className="text-xs text-[#F5F5F0]/40">MP4, MOV up to 50MB</p>
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={uploading || !file}>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Submit Attempt"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="challenges" className="space-y-6">
        <TabsList>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="badges">My Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-6">
          {/* Difficulty Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedDifficulty === "ALL" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedDifficulty("ALL")}
            >
              All
            </Button>
            {(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"] as Difficulty[]).map((diff) => (
              <Button
                key={diff}
                variant={selectedDifficulty === diff ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedDifficulty(diff)}
                style={selectedDifficulty === diff ? { backgroundColor: difficultyColors[diff] } : {}}
              >
                {diff.charAt(0) + diff.slice(1).toLowerCase()}
              </Button>
            ))}
          </div>

          {/* Challenges Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredChallenges.map((challenge) => {
              const status = getCompletionStatus(challenge.id);
              const isCompleted = status === "APPROVED";
              const isPending = status === "PENDING";
              
              return (
                <Card 
                  key={challenge.id} 
                  className={`transition-colors ${isCompleted ? "border-green-500/50" : "hover:border-[#FFCC00]/30"}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge style={{ 
                        backgroundColor: difficultyColors[challenge.difficulty as Difficulty] + "20",
                        color: difficultyColors[challenge.difficulty as Difficulty],
                        borderColor: difficultyColors[challenge.difficulty as Difficulty]
                      }}>
                        {challenge.difficulty}
                      </Badge>
                      {isCompleted && (
                        <div className="h-8 w-8 bg-green-500 flex items-center justify-center rounded-full">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      )}
                      {isPending && (
                        <Badge variant="outline" className="text-yellow-500 border-yellow-500">Under Review</Badge>
                      )}
                    </div>

                    <h3 className="text-xl font-bold uppercase tracking-wider mb-2">
                      {challenge.title}
                    </h3>
                    <p className="text-sm text-[#F5F5F0]/60 mb-4">
                      {challenge.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-[#FFCC00]">
                        <Zap className="h-5 w-5" />
                        <span className="font-bold">+{challenge.xpReward} XP</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#F5F5F0]/40 text-sm">
                        <Trophy className="h-4 w-4" />
                        <span>{challenge.completions?.[0]?.count || 0} completed</span>
                      </div>
                    </div>

                    {challenge.videoRequired && (
                      <div className="flex items-center gap-2 text-xs text-[#F5F5F0]/40 mb-4">
                        <Video className="h-4 w-4" />
                        <span>Video submission required</span>
                      </div>
                    )}

                    <Button 
                      className="w-full" 
                      variant={isCompleted ? "secondary" : "default"}
                      disabled={isCompleted || isPending}
                      onClick={() => openSubmitDialog(challenge.id)}
                    >
                      {isCompleted ? "Completed" : isPending ? "Pending Review" : "Submit Attempt"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <div className="flex gap-2">
            <Button variant="default" size="sm">All Time</Button>
            <Button variant="ghost" size="sm" disabled>This Week</Button>
            <Button variant="ghost" size="sm" disabled>Today</Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {leaderboard.map((entry, index) => {
                const rank = index + 1;
                const isCurrentUser = entry.id === userId;
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-4 p-4 border-b border-[#F5F5F0]/10 last:border-0 ${
                      isCurrentUser ? "bg-[#FFCC00]/10" : ""
                    }`}
                  >
                    <div className={`w-10 text-center font-bold ${
                      rank === 1 ? "text-[#FFCC00]" :
                      rank === 2 ? "text-gray-400" :
                      rank === 3 ? "text-orange-500" :
                      "text-[#F5F5F0]/40"
                    }`}>
                      {rank <= 3 ? (
                        <Medal className="h-6 w-6 mx-auto" />
                      ) : (
                        `#${rank}`
                      )}
                    </div>
                    <Avatar name={entry.name} src={entry.avatarUrl} size="md" />
                    <div className="flex-1">
                      <p className={`font-bold ${isCurrentUser ? "text-[#FFCC00]" : ""}`}>
                        {entry.name || "Anonymous Skater"}
                      </p>
                      <p className="text-sm text-[#F5F5F0]/40">
                        Level {entry.level}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-[#FFCC00] font-bold">
                        <Zap className="h-4 w-4" />
                        {entry.xp.toLocaleString()}
                      </div>
                      <p className="text-xs text-[#F5F5F0]/40">XP</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userBadges.map((userBadge) => {
              const badge = userBadge.badge;
              return (
                <Card 
                  key={badge.id} 
                  className="text-center"
                >
                  <CardContent className="pt-6">
                    <div className={`h-16 w-16 mx-auto mb-4 flex items-center justify-center ${
                      badge.rarity === "COMMON" ? "bg-gray-500/20 border-2 border-gray-500" :
                      badge.rarity === "RARE" ? "bg-blue-500/20 border-2 border-blue-500" :
                      badge.rarity === "EPIC" ? "bg-purple-500/20 border-2 border-purple-500" :
                      "bg-[#FFCC00]/20 border-2 border-[#FFCC00]"
                    }`}>
                      <Trophy className={`h-8 w-8 ${
                        badge.rarity === "COMMON" ? "text-gray-500" :
                        badge.rarity === "RARE" ? "text-blue-500" :
                        badge.rarity === "EPIC" ? "text-purple-500" :
                        "text-[#FFCC00]"
                      }`} />
                    </div>
                    <Badge variant={
                      badge.rarity === "COMMON" ? "common" :
                      badge.rarity === "RARE" ? "rare" :
                      badge.rarity === "EPIC" ? "epic" :
                      "legendary"
                    } className="mb-2">
                      {badge.rarity}
                    </Badge>
                    <h4 className="font-bold uppercase tracking-wider mb-1">{badge.name}</h4>
                    <p className="text-xs text-[#F5F5F0]/40">{badge.description}</p>
                    <p className="text-[10px] text-[#F5F5F0]/30 mt-2">Earned {new Date(userBadge.earnedAt).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              );
            })}
             {userBadges.length === 0 && (
              <div className="col-span-full text-center py-12 text-[#F5F5F0]/60">
                No badges earned yet. Complete challenges to earn them!
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
