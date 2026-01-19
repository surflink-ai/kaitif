"use client";

import { useState, useTransition } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Button, 
  Input, 
  Textarea,
  useToast
} from "@kaitif/ui";
import { Send, Megaphone, Search, MessageSquare, Clock, Users } from "lucide-react";
import { sendAnnouncementAction } from "@/app/actions";
import { MessageWithRelations } from "@kaitif/db";

interface MessagesClientPageProps {
  initialAnnouncements: MessageWithRelations[];
}

export default function MessagesClientPage({ 
  initialAnnouncements
}: MessagesClientPageProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAnnouncements = initialAnnouncements.filter(m => 
    m.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = async () => {
    if (!message.trim()) return;

    startTransition(async () => {
      const result = await sendAnnouncementAction(message);
      if (result.success) {
        setMessage("");
        toast({
          title: "Announcement sent",
          description: "Message broadcasted to all users.",
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Messages</h1>
          <p className="text-[#F5F5F0]/60">
            Send park announcements and manage communications.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        {/* Main Content - History */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold uppercase tracking-wider">Announcement History</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#F5F5F0]/40" />
              <Input 
                placeholder="Search history..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredAnnouncements.length === 0 ? (
               <div className="text-center py-12 text-[#F5F5F0]/40">
                 No announcements sent yet.
               </div>
            ) : (
              filteredAnnouncements.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 bg-[#FFCC00]/20 border-2 border-[#FFCC00] flex items-center justify-center shrink-0">
                        <Megaphone className="h-5 w-5 text-[#FFCC00]" />
                      </div>
                      <div className="flex-1">
                        <p className="mb-2 text-lg">{item.content}</p>
                        <div className="flex items-center gap-4 text-xs text-[#F5F5F0]/40">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>Sent by {item.sender?.name || "Admin"}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[#FFCC00]">
                            <MessageSquare className="h-3 w-3" />
                            <span>Broadcast</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Sidebar - New Announcement */}
        <div>
          <Card className="sticky top-8 border-[#FFCC00]">
            <CardHeader className="bg-[#FFCC00]/10 border-b border-[#FFCC00]/20">
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-[#FFCC00]" />
                New Announcement
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-[#F5F5F0]/60">
                  This message will be sent to all users via push notification and in-app message center.
                </p>
              </div>
              <Textarea 
                placeholder="Type your announcement here..." 
                className="min-h-[150px] resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="flex justify-between items-center text-xs text-[#F5F5F0]/40">
                <span>{message.length} characters</span>
              </div>
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleSend} 
                disabled={!message.trim() || isPending}
              >
                <Send className="h-4 w-4 mr-2" />
                {isPending ? "Sending..." : "Send to All Users"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
