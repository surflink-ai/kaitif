"use client";

import { useState, useTransition } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Button, 
  Input, 
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea,
  useToast
} from "@kaitif/ui";
import { Search, Trophy, Video, Check, X, Plus, Play, ExternalLink } from "lucide-react";
import { 
  createChallengeAction, 
  reviewChallengeAction, 
  toggleChallengeActiveAction 
} from "@/app/actions";
import { Challenge, ChallengeCompletion, User } from "@kaitif/db";

interface ChallengesClientPageProps {
  initialChallenges: (Challenge & { completions: { count: number }[] })[];
  initialPendingSubmissions: (ChallengeCompletion & { user: User; challenge: Challenge })[];
}

export default function ChallengesClientPage({ 
  initialChallenges,
  initialPendingSubmissions 
}: ChallengesClientPageProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleCreateChallenge = async (formData: FormData) => {
    startTransition(async () => {
      const result = await createChallengeAction(formData);
      if (result.success) {
        setIsCreateOpen(false);
        toast({
          title: "Challenge created",
          description: "New challenge is now active.",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  const handleReview = async (id: string, status: "APPROVED" | "REJECTED", xpAwarded: number = 0) => {
    startTransition(async () => {
      const result = await reviewChallengeAction(id, status, xpAwarded);
      if (result.success) {
        toast({
          title: `Submission ${status.toLowerCase()}`,
          variant: status === "APPROVED" ? "success" : "default",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    startTransition(async () => {
      await toggleChallengeActiveAction(id, isActive);
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Challenges</h1>
          <p className="text-[#F5F5F0]/60">
            Manage challenges and verify video submissions.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Challenge
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Challenge</DialogTitle>
            </DialogHeader>
            <form action={handleCreateChallenge}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" placeholder="e.g., Land a Kickflip" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Challenge requirements..." required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select name="difficulty" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                        <SelectItem value="EXPERT">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="xpReward">XP Reward</Label>
                    <Input id="xpReward" name="xpReward" type="number" required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input id="imageUrl" name="imageUrl" placeholder="https://..." />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending}>Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="submissions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="submissions">
            Pending Reviews
            <Badge variant="accent" className="ml-2 bg-[#FFCC00] text-[#080808]">
              {initialPendingSubmissions.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="challenges">All Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions">
          {initialPendingSubmissions.length === 0 ? (
             <div className="text-center py-12 text-[#F5F5F0]/40">
               No pending submissions to review.
             </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {initialPendingSubmissions.map((submission) => (
                <Card key={submission.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Pending Review</Badge>
                      <span className="text-xs text-[#F5F5F0]/40">
                        {new Date(submission.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <CardTitle className="text-lg mt-2">{submission.challenge.title}</CardTitle>
                    <p className="text-sm text-[#F5F5F0]/60">by {submission.user.name || "Unknown"}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {submission.videoUrl ? (
                      <div className="aspect-video bg-[#000] flex items-center justify-center rounded-md border border-[#F5F5F0]/10 group relative overflow-hidden">
                         <video 
                           src={submission.videoUrl} 
                           controls 
                           className="w-full h-full object-contain"
                         />
                      </div>
                    ) : (
                      <div className="aspect-video bg-[#000] flex items-center justify-center rounded-md border border-[#F5F5F0]/10">
                         <span className="text-[#F5F5F0]/40">No video provided</span>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white border-green-500"
                        onClick={() => handleReview(submission.id, "APPROVED", submission.challenge.xpReward)}
                        disabled={isPending}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white border-red-500"
                        onClick={() => handleReview(submission.id, "REJECTED")}
                        disabled={isPending}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="challenges">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Challenges</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#F5F5F0]/40" />
                  <Input placeholder="Search challenges..." className="pl-10" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-[#F5F5F0]/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#F5F5F0]/10 bg-[#F5F5F0]/5">
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Challenge</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Difficulty</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">XP</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Completions</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Status</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-[#F5F5F0]/60">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {initialChallenges.map((challenge) => (
                      <tr key={challenge.id} className="border-b border-[#F5F5F0]/10 hover:bg-[#F5F5F0]/5 transition-colors">
                        <td className="p-4 align-middle font-bold">{challenge.title}</td>
                        <td className="p-4 align-middle">
                          <Badge variant="outline">{challenge.difficulty}</Badge>
                        </td>
                        <td className="p-4 align-middle text-[#FFCC00] font-bold">+{challenge.xpReward} XP</td>
                        <td className="p-4 align-middle">{challenge.completions?.[0]?.count || 0}</td>
                        <td className="p-4 align-middle">
                          <Badge variant={challenge.isActive ? "success" : "secondary"}>
                            {challenge.isActive ? "ACTIVE" : "INACTIVE"}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleToggleActive(challenge.id, !challenge.isActive)}
                          >
                            {challenge.isActive ? "Deactivate" : "Activate"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
