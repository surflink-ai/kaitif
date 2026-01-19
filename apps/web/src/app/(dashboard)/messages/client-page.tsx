"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Input, Avatar, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, useToast } from "@kaitif/ui";
import { Search, Plus, Send, Megaphone, MessageCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Conversation, MessageWithRelations, User } from "@kaitif/db";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Simple relative time helper
function formatRelativeTime(dateString: string | Date) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

interface MessagesClientPageProps {
  initialConversations: (Conversation & { members: any[]; lastMessage?: any; unreadCount: number })[];
  currentUserId: string;
}

export default function MessagesClientPage({
  initialConversations,
  currentUserId,
}: MessagesClientPageProps) {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageWithRelations[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("messages_channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const newMessage = payload.new as any;
          
          // Update conversations list (last message, unread count)
          setConversations((prev) => 
            prev.map((conv) => {
              if (conv.id === newMessage.conversationId) {
                return {
                  ...conv,
                  lastMessage: { content: newMessage.content, createdAt: newMessage.createdAt },
                  updatedAt: new Date(),
                  unreadCount: conv.id !== selectedConversationId ? conv.unreadCount + 1 : conv.unreadCount
                };
              }
              return conv;
            }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          );

          // If looking at this conversation, add message
          if (selectedConversationId === newMessage.conversationId) {
            // Fetch sender info if needed, or optimistic update
            // For simplicity, we might just re-fetch or append if we have sender info
            // Since payload doesn't have sender relations, fetching is safer or we need to look up sender
            // But we can append a partial message
            // Ideally we fetch the full message with relations
            
            // fetch the single message
            const { data: fullMessage } = await supabase
                .from('messages')
                .select('*, sender:users(id, name, avatarUrl), replyTo:messages(*)')
                .eq('id', newMessage.id)
                .single();
            
            if (fullMessage) {
                 setMessages((prev) => [...prev, fullMessage as any]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversationId, supabase]);

  // Fetch messages when conversation selected
  useEffect(() => {
    if (!selectedConversationId) return;

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const res = await fetch(`/api/messages?conversationId=${selectedConversationId}`);
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data);
        
        // Mark as read locally in conversation list
        setConversations(prev => prev.map(c => 
            c.id === selectedConversationId ? { ...c, unreadCount: 0 } : c
        ));
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Could not load messages", variant: "destructive" });
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedConversationId]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversationId) return;
    
    const content = messageInput;
    setMessageInput(""); // Optimistic clear

    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: selectedConversationId, content }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      
      // Message added via realtime subscription usually, but we can optimistically add too?
      // Realtime is fast enough usually.
    } catch (error) {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
      setMessageInput(content); // Restore input
    }
  };

  const filteredConversations = conversations.filter(conv =>
    (conv.name || "Chat").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.id === selectedConversationId);

  // Helper to get other member name/avatar if DM
  const getConversationDisplay = (conv: any) => {
      if (conv.type === "DM") {
          const otherMember = conv.members.find((m: any) => m.userId !== currentUserId)?.user;
          return {
              name: otherMember?.name || "Unknown User",
              avatarUrl: otherMember?.avatarUrl,
              isAnnouncement: false
          };
      }
      return {
          name: conv.name || "Group Chat",
          avatarUrl: null,
          isAnnouncement: conv.isAnnouncement
      };
  };

  return (
    <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)]">
      <div className="grid md:grid-cols-[320px,1fr] h-full border-2 border-[#F5F5F0]/10">
        {/* Conversations List */}
        <div className={`flex flex-col border-r-2 border-[#F5F5F0]/10 ${selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
          {/* Header */}
          <div className="p-4 border-b-2 border-[#F5F5F0]/10">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold uppercase tracking-wider">Messages</h1>
              <Button size="icon" variant="ghost">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#F5F5F0]/40" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredConversations.map((conv) => {
              const display = getConversationDisplay(conv);
              return (
                <button
                    key={conv.id}
                    onClick={() => setSelectedConversationId(conv.id)}
                    className={`w-full flex items-center gap-3 p-4 border-b border-[#F5F5F0]/10 hover:bg-[#F5F5F0]/5 transition-colors text-left ${
                    selectedConversationId === conv.id ? 'bg-[#FFCC00]/10' : ''
                    }`}
                >
                    <div className="relative">
                    {display.isAnnouncement ? (
                        <div className="h-12 w-12 bg-[#FFCC00]/20 border-2 border-[#FFCC00] flex items-center justify-center">
                        <Megaphone className="h-6 w-6 text-[#FFCC00]" />
                        </div>
                    ) : (
                        <Avatar name={display.name} src={display.avatarUrl} size="md" />
                    )}
                    {conv.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 min-w-5 bg-[#FFCC00] flex items-center justify-center text-[10px] font-bold text-[#080808] px-1">
                        {conv.unreadCount}
                        </span>
                    )}
                    </div>
                    <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold truncate ${conv.unreadCount > 0 ? 'text-[#F5F5F0]' : 'text-[#F5F5F0]/80'}`}>
                        {display.name}
                        </span>
                        {conv.lastMessage && (
                            <span className="text-xs text-[#F5F5F0]/40 shrink-0 ml-2">
                                {formatRelativeTime(conv.lastMessage.createdAt)}
                            </span>
                        )}
                    </div>
                    <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-[#F5F5F0]/80' : 'text-[#F5F5F0]/40'}`}>
                        {conv.lastMessage?.content || "No messages yet"}
                    </p>
                    </div>
                </button>
              );
            })}
            {filteredConversations.length === 0 && (
                <div className="p-8 text-center text-[#F5F5F0]/40">
                    No conversations found.
                </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex flex-col ${!selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
          {selectedConversationId ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-4 border-b-2 border-[#F5F5F0]/10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSelectedConversationId(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                {selectedConv && (() => {
                    const display = getConversationDisplay(selectedConv);
                    return (
                        <>
                            {display.isAnnouncement ? (
                            <div className="h-10 w-10 bg-[#FFCC00]/20 border-2 border-[#FFCC00] flex items-center justify-center">
                                <Megaphone className="h-5 w-5 text-[#FFCC00]" />
                            </div>
                            ) : (
                            <Avatar name={display.name} src={display.avatarUrl} size="md" />
                            )}
                            <div className="flex-1">
                            <h2 className="font-bold">{display.name}</h2>
                            {display.isAnnouncement && (
                                <p className="text-xs text-[#F5F5F0]/40">Official announcements from Kaitif</p>
                            )}
                            </div>
                        </>
                    );
                })()}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {isLoadingMessages ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-[#FFCC00]" />
                    </div>
                ) : (
                    messages.map((message) => {
                        const isCurrentUser = message.senderId === currentUserId;
                        return (
                        <div
                            key={message.id}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                            {!isCurrentUser && (
                                <p className="text-xs text-[#F5F5F0]/40 mb-1">{message.sender?.name}</p>
                            )}
                            <div className={`p-3 rounded-lg ${
                                isCurrentUser 
                                ? 'bg-[#FFCC00] text-[#080808]' 
                                : 'bg-[#F5F5F0]/10 text-[#F5F5F0]'
                            }`}>
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                            <p className={`text-[10px] text-[#F5F5F0]/40 mt-1 ${isCurrentUser ? 'text-right' : ''}`}>
                                {formatRelativeTime(message.createdAt)}
                            </p>
                            </div>
                        </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              {selectedConv?.isAnnouncement === false && ( // Only allow reply if not announcement? Actually check logic
                <div className="p-4 border-t-2 border-[#F5F5F0]/10">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}
              {selectedConv?.isAnnouncement && (
                  <div className="p-4 border-t-2 border-[#F5F5F0]/10 text-center text-xs text-[#F5F5F0]/40">
                      Replies are disabled for announcements.
                  </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-[#F5F5F0]/10 mx-auto mb-4" />
                <h3 className="text-lg font-bold uppercase tracking-wider mb-2">Select a Conversation</h3>
                <p className="text-[#F5F5F0]/60">Choose a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
