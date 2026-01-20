"use client";

import { useState } from "react";
import { Card, CardContent, Button, Badge, HypeMeter, AvatarStack, Tabs, TabsList, TabsTrigger, TabsContent, CountdownTimer, Input, Textarea, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, useToast } from "@kaitif/ui";
import { Calendar, MapPin, Users, Clock, Plus, ThumbsUp, CheckCircle, Video, Image as ImageIcon, Camera } from "lucide-react";
import { EVENT_CATEGORIES, Event, EventSuggestion, EventRSVP, EventCategory } from "@kaitif/db";
import { useRouter } from "next/navigation";
import { useRealtimeTable } from "@/lib/hooks/use-realtime";
import { createClient } from "@/lib/supabase/client";

interface EventRSVPRealtime {
  id: string;
  userId: string;
  eventId: string;
  status: string;
  friendCount: number;
  createdAt: string;
  updatedAt: string;
}

interface EventRealtime {
  id: string;
  hypeLevel: number;
  [key: string]: unknown;
}

interface EventsClientPageProps {
  upcomingEvents: (Event & { rsvps: any[]; attendances: any[]; media: any[] })[];
  pastEvents: Event[];
  topSuggestions: (EventSuggestion & { user: { id: string; name: string | null } })[];
  userRsvps: Record<string, EventRSVP>;
  userId: string;
}

export default function EventsClientPage({
  upcomingEvents: initialUpcomingEvents,
  pastEvents,
  topSuggestions,
  userRsvps: initialUserRsvps,
  userId,
}: EventsClientPageProps) {
  const [upcomingEvents, setUpcomingEvents] = useState(initialUpcomingEvents);
  const [userRsvps, setUserRsvps] = useState(initialUserRsvps);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [suggestionForm, setSuggestionForm] = useState({ title: "", description: "", category: "OPEN_SESSION" });
  
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [mediaTargetEventId, setMediaTargetEventId] = useState<string | null>(null);
  const [mediaForm, setMediaForm] = useState({ url: "", type: "image", caption: "" });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  // Realtime: Subscribe to RSVP changes
  useRealtimeTable<EventRSVPRealtime>({
    table: "event_rsvps",
    onInsert: async (newRsvp) => {
      // Fetch user info for the RSVP
      const { data: userData } = await supabase
        .from("users")
        .select("id, name, avatar")
        .eq("id", newRsvp.userId)
        .single();
      
      const user = userData as { id: string; name?: string; avatar?: string } | null;

      // Update the event's RSVP list
      setUpcomingEvents(prev => prev.map(event => {
        if (event.id === newRsvp.eventId) {
          const existingRsvpIndex = event.rsvps.findIndex((r: any) => r.userId === newRsvp.userId);
          if (existingRsvpIndex >= 0) {
            // Update existing RSVP
            const updatedRsvps = [...event.rsvps];
            updatedRsvps[existingRsvpIndex] = { ...newRsvp, user };
            return { ...event, rsvps: updatedRsvps };
          } else {
            // Add new RSVP
            return { ...event, rsvps: [...event.rsvps, { ...newRsvp, user }] };
          }
        }
        return event;
      }));

      // Update user's own RSVPs
      if (newRsvp.userId === userId) {
        setUserRsvps(prev => ({ ...prev, [newRsvp.eventId]: newRsvp as unknown as EventRSVP }));
      }

      // Show toast for other users' RSVPs
      if (newRsvp.userId !== userId && newRsvp.status === "GOING") {
        toast({
          title: "New RSVP",
          description: `${user?.name || "Someone"} just RSVP'd to an event!`,
        });
      }
    },
    onUpdate: async (updatedRsvp) => {
      const { data: userData } = await supabase
        .from("users")
        .select("id, name, avatar")
        .eq("id", updatedRsvp.userId)
        .single();
      
      const user = userData as { id: string; name?: string; avatar?: string } | null;

      setUpcomingEvents(prev => prev.map(event => {
        if (event.id === updatedRsvp.eventId) {
          if (updatedRsvp.status === "CANCELLED") {
            // Remove RSVP if cancelled
            return { ...event, rsvps: event.rsvps.filter((r: any) => r.userId !== updatedRsvp.userId) };
          }
          // Update RSVP
          const updatedRsvps = event.rsvps.map((r: any) =>
            r.userId === updatedRsvp.userId ? { ...updatedRsvp, user } : r
          );
          return { ...event, rsvps: updatedRsvps };
        }
        return event;
      }));

      if (updatedRsvp.userId === userId) {
        if (updatedRsvp.status === "CANCELLED") {
          setUserRsvps(prev => {
            const next = { ...prev };
            delete next[updatedRsvp.eventId];
            return next;
          });
        } else {
          setUserRsvps(prev => ({ ...prev, [updatedRsvp.eventId]: updatedRsvp as unknown as EventRSVP }));
        }
      }
    },
    onDelete: (oldRsvp) => {
      setUpcomingEvents(prev => prev.map(event => {
        if (event.id === oldRsvp.eventId) {
          return { ...event, rsvps: event.rsvps.filter((r: any) => r.userId !== oldRsvp.userId) };
        }
        return event;
      }));

      if (oldRsvp.userId === userId) {
        setUserRsvps(prev => {
          const next = { ...prev };
          delete next[oldRsvp.eventId!];
          return next;
        });
      }
    },
  });

  // Realtime: Subscribe to event updates (hype meter)
  useRealtimeTable<EventRealtime>({
    table: "events",
    onUpdate: (updatedEvent) => {
      setUpcomingEvents(prev => prev.map(event => {
        if (event.id === updatedEvent.id) {
          return { ...event, hypeLevel: updatedEvent.hypeLevel };
        }
        return event;
      }));
    },
  });

  const handleRsvp = async (eventId: string, status: "GOING" | "MAYBE" | "CANCELLED") => {
    try {
      const res = await fetch("/api/events/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, status }),
      });

      if (!res.ok) throw new Error("Failed to update RSVP");

      toast({
        title: status === "CANCELLED" ? "RSVP Cancelled" : "RSVP Updated",
        description: status === "CANCELLED" ? "You are no longer attending." : `You are now marked as ${status.toLowerCase()}.`,
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update RSVP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCheckIn = async (eventId: string) => {
    try {
      const res = await fetch("/api/events/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast({
        title: "Checked In!",
        description: `You earned ${data.xpAwarded} XP!`,
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Check-in Failed",
        description: error instanceof Error ? error.message : "Could not check in.",
        variant: "destructive",
      });
    }
  };

  const handleSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/events/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(suggestionForm),
      });

      if (!res.ok) throw new Error("Failed to submit suggestion");

      toast({
        title: "Suggestion Submitted",
        description: "Thanks for your idea! Others can now vote on it.",
      });
      setIsSuggestOpen(false);
      setSuggestionForm({ title: "", description: "", category: "OPEN_SESSION" });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit suggestion.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTargetEventId) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/events/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...mediaForm, eventId: mediaTargetEventId }),
      });

      if (!res.ok) throw new Error("Failed to upload media");

      toast({
        title: "Media Added",
        description: "Your photo/video has been added to the event gallery.",
      });
      setIsMediaOpen(false);
      setMediaForm({ url: "", type: "image", caption: "" });
      setMediaTargetEventId(null);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add media.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openMediaDialog = (eventId: string) => {
    setMediaTargetEventId(eventId);
    setIsMediaOpen(true);
  };

  const handleVote = async (suggestionId: string) => {
    try {
      const res = await fetch("/api/events/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestionId }),
      });

      if (!res.ok) throw new Error("Failed to vote");

      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to vote.",
        variant: "destructive",
      });
    }
  };

  const filteredEvents = selectedCategory === "ALL" 
    ? upcomingEvents 
    : upcomingEvents.filter(e => e.category === selectedCategory);

  const formatEventTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2">
            <span className="text-[#FFCC00]">Events</span>
          </h1>
          <p className="text-[#F5F5F0]/60">
            Discover upcoming events, competitions, and workshops.
          </p>
        </div>
        
        <div className="flex gap-2">
            <Dialog open={isSuggestOpen} onOpenChange={setIsSuggestOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                <Plus className="h-5 w-5 mr-2" />
                Suggest Event
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Suggest an Event</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSuggestionSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                    id="title" 
                    value={suggestionForm.title} 
                    onChange={e => setSuggestionForm({...suggestionForm, title: e.target.value})}
                    required 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                    value={suggestionForm.category} 
                    onValueChange={v => setSuggestionForm({...suggestionForm, category: v})}
                    >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(EVENT_CATEGORIES).map(([key, info]) => (
                        <SelectItem key={key} value={key}>{info.label}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                    id="description"
                    value={suggestionForm.description}
                    onChange={e => setSuggestionForm({...suggestionForm, description: e.target.value})}
                    />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Suggestion"}
                </Button>
                </form>
            </DialogContent>
            </Dialog>

            <Dialog open={isMediaOpen} onOpenChange={setIsMediaOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Add Event Media</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleMediaSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="url">Media URL</Label>
                        <Input 
                        id="url" 
                        type="url"
                        placeholder="https://..."
                        value={mediaForm.url} 
                        onChange={e => setMediaForm({...mediaForm, url: e.target.value})}
                        required 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select 
                        value={mediaForm.type} 
                        onValueChange={v => setMediaForm({...mediaForm, type: v})}
                        >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="caption">Caption</Label>
                        <Input 
                        id="caption"
                        value={mediaForm.caption}
                        onChange={e => setMediaForm({...mediaForm, caption: e.target.value})}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Add Media"}
                    </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="suggestions">Community Suggestions</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-8 mt-6">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "ALL" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory("ALL")}
            >
              All
            </Button>
            {Object.entries(EVENT_CATEGORIES).map(([key, info]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(key)}
              >
                {info.label}
              </Button>
            ))}
          </div>

          {/* Events List */}
          <div className="space-y-6">
            {filteredEvents.map((event) => {
              const categoryInfo = EVENT_CATEGORIES[event.category as keyof typeof EVENT_CATEGORIES];
              const rsvpCount = event.rsvps?.length || 0;
              const userRsvp = userRsvps[event.id];
              const isCheckedIn = event.attendances?.some((a: any) => a.userId === userId);
              
              // Basic check for "Live Now" (within event time)
              const now = new Date();
              const start = new Date(event.startTime);
              const end = new Date(event.endTime);
              const isLive = now >= start && now <= end;

              return (
                <Card key={event.id} className="hover:border-[#FFCC00]/30 transition-colors overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-[1fr,auto] gap-6">
                      {/* Event Info */}
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="text-center min-w-[60px]">
                            <div className="text-3xl font-bold text-[#FFCC00]">
                              {new Date(event.startTime).getDate()}
                            </div>
                            <div className="text-xs text-[#F5F5F0]/40 uppercase">
                              {new Date(event.startTime).toLocaleDateString("en-US", { month: "short" })}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge style={{ backgroundColor: categoryInfo.color + "20", color: categoryInfo.color, borderColor: categoryInfo.color }}>
                                {categoryInfo.label}
                              </Badge>
                              {isLive && <Badge variant="default" className="bg-red-500 hover:bg-red-600 animate-pulse">LIVE NOW</Badge>}
                              {userRsvp && <Badge variant="outline" className="border-green-500 text-green-500">{userRsvp.status}</Badge>}
                              {isCheckedIn && <Badge variant="outline" className="border-blue-500 text-blue-500">CHECKED IN</Badge>}
                            </div>
                            <h3 className="text-xl font-bold uppercase tracking-wider mb-2">
                              {event.title}
                            </h3>
                            <p className="text-[#F5F5F0]/60 text-sm mb-4">
                              {event.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-[#F5F5F0]/40">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatEventTime(event.startTime)} - {formatEventTime(event.endTime)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{rsvpCount} / {event.capacity || "∞"} spots</span>
                              </div>
                            </div>
                            {/* Media Preview (if any) */}
                            {event.media && event.media.length > 0 && (
                                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                                    {event.media.slice(0, 4).map((m: any, idx: number) => (
                                        <div key={idx} className="w-16 h-16 bg-gray-800 rounded-md flex-shrink-0 overflow-hidden relative">
                                            {m.type === 'image' ? (
                                                <img src={m.url} alt={m.caption} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full"><Video className="w-6 h-6" /></div>
                                            )}
                                        </div>
                                    ))}
                                    {event.media.length > 4 && (
                                        <div className="w-16 h-16 bg-gray-800 rounded-md flex-shrink-0 flex items-center justify-center text-xs">
                                            +{event.media.length - 4}
                                        </div>
                                    )}
                                </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <AvatarStack users={event.rsvps?.map((r: any) => r.user) || []} max={4} size="sm" />
                            <span className="text-sm text-[#F5F5F0]/40">
                              {rsvpCount} attending
                            </span>
                          </div>
                          <HypeMeter value={event.hypeLevel} size="sm" showLabel={false} />
                        </div>
                      </div>

                      {/* Action Section */}
                      <div className="bg-[#0A0A0A] p-6 flex flex-col justify-center min-w-[200px]">
                        {!isLive && (
                          <>
                            <p className="text-xs text-[#F5F5F0]/40 uppercase tracking-wider mb-2">Starts In</p>
                            <CountdownTimer targetDate={event.startTime} size="sm" showDays={true} />
                          </>
                        )}
                        
                        <div className="mt-4 space-y-2">
                          {isLive && !isCheckedIn ? (
                             <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleCheckIn(event.id)}>
                               <CheckCircle className="h-4 w-4 mr-2" />
                               Check In (+XP)
                             </Button>
                          ) : isLive && isCheckedIn ? (
                             <Button className="w-full" disabled variant="outline">Checked In</Button>
                          ) : (
                            <>
                              <Button 
                                className={`w-full ${userRsvp?.status === "GOING" ? "bg-green-600 hover:bg-green-700" : ""}`}
                                onClick={() => handleRsvp(event.id, "GOING")}
                              >
                                {userRsvp?.status === "GOING" ? "Going" : "RSVP Going"}
                              </Button>
                              <Button 
                                variant="ghost" 
                                className={`w-full ${userRsvp?.status === "MAYBE" ? "text-yellow-500" : ""}`}
                                onClick={() => handleRsvp(event.id, "MAYBE")}
                              >
                                Maybe
                              </Button>
                              {userRsvp && (
                                <Button variant="link" className="w-full text-red-500 h-auto p-0" onClick={() => handleRsvp(event.id, "CANCELLED")}>
                                  Cancel RSVP
                                </Button>
                              )}
                            </>
                          )}
                          <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => openMediaDialog(event.id)}>
                            <Camera className="h-4 w-4 mr-2" />
                            Add Photo
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {filteredEvents.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-[#F5F5F0]/20 mx-auto mb-4" />
                  <h3 className="text-lg font-bold uppercase tracking-wider mb-2">No Events Found</h3>
                  <p className="text-[#F5F5F0]/60">
                    There are no upcoming events in this category.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="suggestions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topSuggestions.map((suggestion) => {
               const categoryInfo = EVENT_CATEGORIES[suggestion.category as keyof typeof EVENT_CATEGORIES];
               return (
                <Card key={suggestion.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge style={{ backgroundColor: categoryInfo.color + "20", color: categoryInfo.color, borderColor: categoryInfo.color }}>
                        {categoryInfo.label}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleVote(suggestion.id)}>
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        {suggestion.voteCount}
                      </Button>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{suggestion.title}</h3>
                    <p className="text-sm text-[#F5F5F0]/60 mb-4">{suggestion.description}</p>
                    <div className="text-xs text-[#F5F5F0]/40">
                      Suggested by {suggestion.user?.name || "Anonymous"}
                    </div>
                  </CardContent>
                </Card>
               );
            })}
             {topSuggestions.length === 0 && (
              <div className="col-span-full text-center py-12 text-[#F5F5F0]/60">
                No suggestions yet. Be the first to suggest an event!
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="past">
           <div className="space-y-6">
            {pastEvents.map((event) => (
              <Card key={event.id} className="opacity-60 hover:opacity-100 transition-opacity">
                 <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <p className="text-sm text-[#F5F5F0]/60">{new Date(event.startTime).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="outline">Ended</Badge>
                 </CardContent>
              </Card>
            ))}
             {pastEvents.length === 0 && (
              <div className="text-center py-12 text-[#F5F5F0]/60">
                No past events found.
              </div>
            )}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
