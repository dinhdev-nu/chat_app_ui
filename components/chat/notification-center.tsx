"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, User, Info, X, Check } from "lucide-react";

interface Notification {
  id: number;
  type: "message" | "friend" | "system";
  user?: string;
  content: string;
  time: string;
  read: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
}

export default function NotificationCenter({
  notifications,
  onClose,
  onMarkAllAsRead
}: NotificationCenterProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Card className="w-80 bg-[#1e1f2e]/95 backdrop-blur-md border border-indigo-500/20 shadow-lg overflow-hidden">
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="h-4 w-4 text-indigo-400 mr-2" />
          <h3 className="text-white font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <span className="ml-2 bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-80">
        {notifications.length > 0 ? (
          <div className="p-2">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg mb-2 ${
                  notification.read
                    ? "bg-[#1a1b26]/50"
                    : "bg-indigo-500/10 border border-indigo-500/20"
                }`}
              >
                <div className="flex">
                  <div className="mr-3 mt-0.5">
                    {notification.type === "message" && (
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <Bell className="h-4 w-4 text-indigo-400" />
                      </div>
                    )}
                    {notification.type === "friend" && (
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <User className="h-4 w-4 text-green-400" />
                      </div>
                    )}
                    {notification.type === "system" && (
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Info className="h-4 w-4 text-blue-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="font-medium text-white text-sm">
                        {notification.user ? notification.user : "System"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {notification.time}
                      </div>
                    </div>
                    <div className="text-sm text-gray-300 mt-1">
                      {notification.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            <Bell className="h-12 w-12 mx-auto mb-2 text-gray-500" />
            <h3 className="text-lg font-medium text-white mb-1">
              No Notifications
            </h3>
            <p className="text-sm">You're all caught up!</p>
          </div>
        )}
      </ScrollArea>

      {unreadCount > 0 && (
        <div className="p-3 border-t border-white/10">
          <Button
            onClick={onMarkAllAsRead}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Check className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        </div>
      )}
    </Card>
  );
}
