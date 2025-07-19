"use client";

import type React from "react";

import { useRef, useEffect, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import type { Message, User } from "@/types/chat";
import {
  ThumbsUp,
  Heart,
  MoreHorizontal,
  Crown,
  Shield,
  Reply,
  Plus
} from "lucide-react";

// Update the GroupMessageItem component to include thread functionality
const GroupMessageItem = memo(function GroupMessageItem({
  message,
  currentUser,
  showAvatar = true,
  isConsecutive = false
}: {
  message: Message;
  currentUser: User;
  showAvatar?: boolean;
  isConsecutive?: boolean;
}) {
  const { content, sender, timestamp, type, reactions } = message;
  const isCurrentUser = sender.id === currentUser.id;
  // System message
  if (type === "system" || content.startsWith("[system]")) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center my-3"
      >
        <div className="bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 text-xs text-gray-400 border border-white/10">
          {content.replace("[system]", "").trim()}
        </div>
      </motion.div>
    );
  }

  // Emote message
  if (type === "emote") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex mb-2 ${
          isCurrentUser ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`flex items-end ${
            isCurrentUser ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {showAvatar && (
            <Avatar
              className={`${
                isCurrentUser ? "ml-2" : "mr-2"
              } h-6 w-6 border border-indigo-500/50`}
            >
              <img
                src={sender.avatar || "/placeholder.svg"}
                alt={sender.name}
              />
            </Avatar>
          )}
          <div className="text-4xl">{content}</div>
        </div>
      </motion.div>
    );
  }

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-3 w-3 text-yellow-500 ml-1" />;
      case "moderator":
        return <Shield className="h-3 w-3 text-blue-500 ml-1" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex mb-1 group ${
        isCurrentUser ? "justify-end" : "justify-start"
      } ${isConsecutive ? "mt-1" : "mt-3"}`}
    >
      <div
        className={`flex max-w-[75%] ${
          isCurrentUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`${
            isCurrentUser ? "ml-2" : "mr-2"
          } flex flex-col items-center`}
        >
          {showAvatar ? (
            <Avatar className="h-8 w-8 border border-indigo-500/30">
              <img
                src={sender.avatar || "/placeholder.svg"}
                alt={sender.name}
              />
            </Avatar>
          ) : (
            <div className="h-8 w-8" />
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col min-w-0">
          {/* Name and timestamp */}
          {showAvatar && (
            <div
              className={`flex items-center mb-1 ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-center ${
                  isCurrentUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    isCurrentUser
                      ? "text-pink-300 ml-2"
                      : "text-purple-300 mr-2"
                  }`}
                >
                  {sender.name}
                </span>
                {getRoleIcon(sender.role)}
                <span
                  className={`text-xs text-gray-500 ${
                    isCurrentUser ? "mr-2" : "ml-2"
                  }`}
                >
                  {new Date(timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Message bubble */}
          <div className="relative">
            <div
              className={`px-3 py-2 rounded-xl relative min-w-[120px] ${
                isCurrentUser
                  ? "bg-gradient-to-r from-pink-500/90 to-purple-500/90 text-white ml-auto"
                  : "bg-white/8 backdrop-blur-sm text-white border border-white/10"
              }`}
            >
              <p className="text-sm leading-relaxed break-words">{content}</p>

              {/* Message status for current user */}
              {/* {isCurrentUser && status && (
                <div className="flex items-center justify-end mt-1">
                  {status === "sending" && (
                    <div className="flex items-center">
                      <div className="w-1 h-1 bg-gray-300 rounded-full animate-pulse mr-1"></div>
                      <span className="text-xs text-gray-300 opacity-70">
                        Sending
                      </span>
                    </div>
                  )}
                  {status === "sent" && (
                    <div className="flex items-center">
                      <div className="w-1 h-1 bg-gray-300 rounded-full mr-1"></div>
                      <span className="text-xs text-gray-300 opacity-70">
                        Sent
                      </span>
                    </div>
                  )}
                  {status === "delivered" && (
                    <div className="flex items-center">
                      <CheckCheck className="h-3 w-3 text-indigo-300 mr-1" />
                      <span className="text-xs text-gray-300 opacity-70">
                        Delivered
                      </span>
                    </div>
                  )}
                  {status === "read" && (
                    <div className="flex items-center">
                      <CheckCheck className="h-3 w-3 text-green-300 mr-1" />
                      <span className="text-xs text-gray-300 opacity-70">
                        Read
                      </span>
                    </div>
                  )}
                </div>
              )} */}
            </div>

            {/* Message actions */}
            <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
              <div className="flex space-x-1 bg-black/20 backdrop-blur-sm rounded-lg px-2 py-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-300 hover:text-pink-300 hover:bg-white/10"
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-300 hover:text-pink-300 hover:bg-white/10"
                >
                  <Heart className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-300 hover:text-indigo-300 hover:bg-white/10"
                >
                  <Reply className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-300 hover:text-pink-300 hover:bg-white/10"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Reactions */}
          {reactions && reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {reactions.map((reaction, index) => (
                <motion.button
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center bg-white/10 hover:bg-indigo-500/20 px-2 py-1 rounded-full text-xs transition-colors border border-white/10"
                >
                  <span className="mr-1">{reaction.emoji}</span>
                  <span className="text-gray-300">{reaction.count}</span>
                </motion.button>
              ))}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

// Update the GroupChatMessages component interface and implementation
interface GroupChatMessagesProps {
  messages: Message[];
  currentUser: User;
  typingUsers: User[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

function GroupChatMessages({
  messages,
  currentUser,
  typingUsers,
  messagesEndRef
}: GroupChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  // Group messages by date and consecutive senders
  const processedMessages = useMemo(() => {
    const grouped = messages.reduce((groups: any, message, index) => {
      const messageDate = new Date(message.timestamp);
      const dateStr = messageDate.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric"
      });

      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }

      const prevMessage = messages[index - 1];

      const isSameDay =
        prevMessage &&
        new Date(prevMessage.timestamp).toDateString() ===
          messageDate.toDateString();

      const isSameSender =
        prevMessage &&
        prevMessage.sender.id === message.sender.id &&
        !prevMessage.content.startsWith("[system]");

      const isConsecutive = isSameDay && isSameSender;

      groups[dateStr].push({
        ...message,
        showAvatar: !isConsecutive,
        isConsecutive
      });

      return groups;
    }, {});

    return grouped;
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        requestAnimationFrame(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        });
      }
    }
  }, [messages, typingUsers]);

  return (
    <ScrollArea ref={scrollAreaRef} className="h-full px-4 py-4">
      {Object.entries(processedMessages).map(
        ([date, dateMessages]: [string, any]) => (
          <div key={date}>
            <DateDivider date={date} />
            <div className="space-y-1">
              {dateMessages.map((message: any) => (
                <GroupMessageItem
                  key={message.id}
                  message={message}
                  currentUser={currentUser}
                  showAvatar={message.showAvatar}
                  isConsecutive={message.isConsecutive}
                />
              ))}
            </div>
          </div>
        )
      )}

      <AnimatePresence>
        {typingUsers.length > 0 && (
          <GroupTypingIndicator typingUsers={typingUsers} />
        )}
      </AnimatePresence>

      <div ref={messagesEndRef} />
    </ScrollArea>
  );
}

// Keep the other components (GroupTypingIndicator, DateDivider) unchanged
const GroupTypingIndicator = memo(function GroupTypingIndicator({
  typingUsers
}: {
  typingUsers: User[];
}) {
  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].name} is typing`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].name} and ${typingUsers[1].name} are typing`;
    } else {
      return `${typingUsers[0].name} and ${
        typingUsers.length - 1
      } others are typing`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-start mt-4"
    >
      <div className="flex -space-x-2 mr-3">
        {typingUsers.slice(0, 3).map((user, index) => (
          <Avatar key={user.id} className="h-6 w-6 border-2 border-[#1a1b26]">
            <img src={user.avatar || "/placeholder.svg"} alt={user.name} />
          </Avatar>
        ))}
      </div>
      <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 inline-flex items-center">
        <span className="text-xs text-gray-300 mr-2">{getTypingText()}</span>
        <div className="flex space-x-1">
          <div
            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
          <div
            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "600ms" }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
});

const DateDivider = memo(function DateDivider({ date }: { date: string }) {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="h-px w-full bg-white/5"></div>
      <div className="px-3 text-xs text-gray-500 whitespace-nowrap">{date}</div>
      <div className="h-px w-full bg-white/5"></div>
    </div>
  );
});

export default memo(GroupChatMessages);
