"use client";

import { useState } from "react";
import { Bell, Check, Trash2, Heart, MessageCircle, Calendar, Award, Trophy, X } from "lucide-react";
import { Button, Avatar } from "@kaitif/ui";
import { useNotifications, type Notification } from "@/lib/hooks/use-notifications";
import { formatDistanceToNow } from "@/lib/utils";

interface NotificationBellProps {
  userId: string;
}

const notificationIcons: Record<string, React.ReactNode> = {
  like: <Heart className="h-4 w-4 text-red-500" />,
  comment: <MessageCircle className="h-4 w-4 text-blue-500" />,
  rsvp: <Calendar className="h-4 w-4 text-green-500" />,
  message: <MessageCircle className="h-4 w-4 text-purple-500" />,
  badge: <Award className="h-4 w-4 text-yellow-500" />,
  challenge: <Trophy className="h-4 w-4 text-orange-500" />,
};

export function NotificationBell({ userId }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications({ userId, enabled: !!userId });

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    if (notification.resourceType && notification.resourceId) {
      switch (notification.resourceType) {
        case "post":
          window.location.href = `/home#post-${notification.resourceId}`;
          break;
        case "event":
          window.location.href = `/events`;
          break;
        case "message":
          window.location.href = `/messages`;
          break;
        case "badge":
          window.location.href = `/profile`;
          break;
      }
    }
    
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 min-w-5 bg-[#FFCC00] text-[#080808] text-xs font-bold flex items-center justify-center rounded-full px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 mt-2 w-80 md:w-96 bg-[#0A0A0A] border-2 border-[#F5F5F0]/10 shadow-xl z-50 max-h-[70vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#F5F5F0]/10">
              <h3 className="font-bold uppercase tracking-wider text-sm">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="p-8 text-center text-[#F5F5F0]/40">
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-[#F5F5F0]/10 mx-auto mb-3" />
                  <p className="text-[#F5F5F0]/40 text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-[#F5F5F0]/10">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-[#F5F5F0]/5 cursor-pointer transition-colors ${
                        !notification.read ? "bg-[#FFCC00]/5" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {notificationIcons[notification.type] || (
                            <Bell className="h-4 w-4 text-[#F5F5F0]/40" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notification.read ? "font-medium" : "text-[#F5F5F0]/80"}`}>
                            {notification.title}
                          </p>
                          {notification.body && (
                            <p className="text-xs text-[#F5F5F0]/60 mt-0.5 truncate">
                              {notification.body}
                            </p>
                          )}
                          <p className="text-xs text-[#F5F5F0]/40 mt-1">
                            {formatDistanceToNow(notification.createdAt)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-[#F5F5F0]/10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-[#F5F5F0]/60"
                  onClick={clearAll}
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Clear all notifications
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
