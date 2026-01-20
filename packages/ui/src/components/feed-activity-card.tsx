import { Card, CardContent } from "./card";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Trophy, Calendar, CheckCircle2 } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "BADGE_EARNED" | "CHALLENGE_COMPLETED" | "EVENT_CHECKIN";
  timestamp: Date;
  data: any;
}

export function FeedActivityCard({ item }: { item: ActivityItem }) {
  const { type, data } = item;
  const user = data.user;

  const renderContent = () => {
    switch (type) {
      case "BADGE_EARNED":
        const badge = data.badge;
        return (
          <>
            <div className="flex items-center gap-2 mb-2 text-[#FFCC00]">
              <Trophy className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Badge Earned</span>
            </div>
            <div className="flex gap-4 items-center bg-[#F5F5F0]/5 p-3 rounded-lg border border-[#F5F5F0]/5">
              <div className="relative h-12 w-12 shrink-0">
                <img
                  src={badge.imageUrl}
                  alt={badge.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h4 className="font-bold text-[#F5F5F0]">{badge.name}</h4>
                <p className="text-xs text-[#F5F5F0]/60">{badge.description}</p>
                <Badge variant="outline" className="mt-1 text-[10px] h-5 border-[#F5F5F0]/20 text-[#F5F5F0]/60">
                  {badge.rarity}
                </Badge>
              </div>
            </div>
          </>
        );

      case "CHALLENGE_COMPLETED":
        const challenge = data.challenge;
        return (
          <>
            <div className="flex items-center gap-2 mb-2 text-[#00E6E6]">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Challenge Completed</span>
            </div>
            <div className="bg-[#F5F5F0]/5 p-3 rounded-lg border border-[#F5F5F0]/5">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-[#F5F5F0]">{challenge.title}</h4>
                  <Badge className="mt-1" variant={
                    challenge.difficulty === "BEGINNER" ? "secondary" :
                    challenge.difficulty === "INTERMEDIATE" ? "accent" :
                    "default"
                  }>
                    {challenge.difficulty}
                  </Badge>
                </div>
                <div className="text-[#FFCC00] font-bold text-sm">+{data.xpAwarded} XP</div>
              </div>
            </div>
          </>
        );

      case "EVENT_CHECKIN":
        const event = data.event;
        return (
          <>
            <div className="flex items-center gap-2 mb-2 text-purple-400">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Checked In</span>
            </div>
            <div className="bg-[#F5F5F0]/5 p-3 rounded-lg border border-[#F5F5F0]/5">
              <h4 className="font-bold text-[#F5F5F0]">{event.title}</h4>
              <Badge variant="outline" className="mt-1 border-[#F5F5F0]/20 text-[#F5F5F0]/60">
                {event.category}
              </Badge>
            </div>
          </>
        );
    }
  };

  return (
    <Card className="bg-[#1A1A1A]/50 border-[#F5F5F0]/5">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar
            src={user.avatarUrl}
            alt={user.name || "User"}
            name={user.name}
            size="sm"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-[#F5F5F0] text-sm">{user.name}</span>
              <span className="text-xs text-[#F5F5F0]/40">•</span>
              <span className="text-xs text-[#F5F5F0]/40">
                {new Date(item.timestamp).toLocaleDateString(undefined, {
                  hour: "numeric",
                  minute: "numeric"
                })}
              </span>
            </div>
            {renderContent()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
