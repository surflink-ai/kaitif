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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Search, MoreVertical, Calendar, Plus, Users, Edit2, Trash2 } from "lucide-react";
import { EVENT_CATEGORIES, EventWithRelations } from "@kaitif/db";
import { createEventAction, deleteEventAction, toggleEventPublishedAction } from "@/app/actions";

interface EventsClientPageProps {
  initialEvents: EventWithRelations[];
  totalEvents: number;
  totalRsvps: number;
}

export default function EventsClientPage({ 
  initialEvents,
  totalEvents,
  totalRsvps
}: EventsClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const filteredEvents = initialEvents.filter((event) => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateEvent = async (formData: FormData) => {
    startTransition(async () => {
      const result = await createEventAction(formData);
      if (result.success) {
        setIsCreateOpen(false);
        toast({
          title: "Event created",
          description: "The event has been successfully created.",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create event",
          variant: "destructive",
        });
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    startTransition(async () => {
      const result = await deleteEventAction(id);
      if (result.success) {
        toast({
          title: "Event deleted",
          description: "The event has been removed.",
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

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const result = await toggleEventPublishedAction(id, !currentStatus);
      if (result.success) {
        toast({
          title: currentStatus ? "Event unpublished" : "Event published",
          description: `The event is now ${currentStatus ? "hidden" : "visible"}.`,
          variant: "success",
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Events</h1>
          <p className="text-[#F5F5F0]/60">
            Manage park events, competitions, and workshops.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <form action={handleCreateEvent}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" name="title" placeholder="e.g., Weekend Session" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Event details..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(EVENT_CATEGORIES).map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {EVENT_CATEGORIES[cat as keyof typeof EVENT_CATEGORIES].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input id="capacity" name="capacity" type="number" min="1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input id="startTime" name="startTime" type="datetime-local" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input id="endTime" name="endTime" type="datetime-local" required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="xpReward">XP Reward</Label>
                  <Input id="xpReward" name="xpReward" type="number" defaultValue="25" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending}>Create Event</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-[#FFCC00]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-[#F5F5F0]/60">Total stored events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total RSVPs</CardTitle>
            <Users className="h-4 w-4 text-[#00E6E6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRsvps}</div>
            <p className="text-xs text-[#F5F5F0]/60">Across all events</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Events List</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#F5F5F0]/40" />
              <Input 
                placeholder="Search events..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-[#F5F5F0]/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F5F5F0]/10 bg-[#F5F5F0]/5">
                  <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Event</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Date & Time</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Category</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Attendance</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[#F5F5F0]/60">Status</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-[#F5F5F0]/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => {
                   const rsvps = (event.rsvps as any)?.[0]?.count || (event.rsvps as any[])?.length || 0;
                   const capacity = event.capacity || 100; // default if not set
                   
                   return (
                    <tr key={event.id} className="border-b border-[#F5F5F0]/10 hover:bg-[#F5F5F0]/5 transition-colors">
                      <td className="p-4 align-middle font-bold">
                        {event.title}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          <span>{new Date(event.startTime).toLocaleDateString()}</span>
                          <span className="text-xs text-[#F5F5F0]/60">
                            {new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge variant="outline">{event.category}</Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <div className="w-full max-w-[100px] h-2 bg-[#F5F5F0]/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#FFCC00]" 
                              style={{ width: `${Math.min((rsvps / capacity) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#F5F5F0]/60">
                            {rsvps}/{capacity}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge variant={event.isPublished ? "success" : "secondary"}>
                          {event.isPublished ? "PUBLISHED" : "DRAFT"}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleTogglePublish(event.id, event.isPublished)}>
                              {event.isPublished ? "Unpublish" : "Publish"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit2 className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(event.id)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
