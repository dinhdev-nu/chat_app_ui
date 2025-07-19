"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  Heart,
  Star,
  MoreHorizontal,
  CheckCheck
} from "lucide-react";
import { Message, User } from "@/types/chat";
import { cn } from "@/lib/utils";

const MessageItem = React.memo(function MessageItem({
  message,
  isCurrentUser
}: {
  message: Message;
  isCurrentUser: boolean;
}) {
  const { content, sender, timestamp, status, isEmote } = message;

  // If it's an emote, render it differently
  if (isEmote) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex mb-2 ${
          isCurrentUser ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`flex items-end max-w-[75%] ${
            isCurrentUser ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <Avatar
            className={`${isCurrentUser ? "ml-2" : "mr-2"} h-6 w-6 border ${
              isCurrentUser ? "border-pink-500" : "border-purple-500"
            }`}
          >
            <img src={sender.avatar || "/placeholder.svg"} alt={sender.name} />
          </Avatar>
          <div className="text-4xl">{content}</div>
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex mb-2 group ${
        isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[75%] ${
          isCurrentUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <Avatar
          className={`${isCurrentUser ? "ml-2" : "mr-2"} h-7 w-7 border ${
            isCurrentUser ? "border-pink-400/50" : "border-purple-400/50"
          } flex-shrink-0`}
        >
          <img src={sender.avatar || "/placeholder.svg"} alt={sender.name} />
        </Avatar>
        <div className="flex flex-col min-w-0">
          <div
            className={`flex items-center mb-1 ${
              isCurrentUser ? "justify-end" : ""
            }`}
          >
            <p
              className={`text-xs font-medium ${
                isCurrentUser ? "text-pink-300" : "text-purple-300"
              } ${isCurrentUser ? "order-2 ml-2" : "order-1 mr-2"}`}
            >
              {sender.name}
            </p>
            <p
              className={`text-xs text-gray-500 ${
                isCurrentUser ? "order-1" : "order-2"
              }`}
            >
              {new Date(timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </div>
          <div
            className={`px-3 py-2 rounded-xl relative ${
              isCurrentUser
                ? "bg-gradient-to-r from-pink-500/90 to-purple-500/90 text-white ml-auto"
                : "bg-white/8 backdrop-blur-sm text-white border border-white/10"
            }`}
          >
            <p className="text-sm leading-relaxed break-words">{content}</p>

            {/* Message status (for current user's messages) - now more compact */}
            {isCurrentUser && status && (
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
            )}
          </div>
          <div
            className={cn(
              "transition-all duration-500 delay-200 ease-in-out overflow-hidden max-h-0 opacity-0 group-hover:max-h-10 group-hover:opacity-100 mt-1",
              isCurrentUser ? "flex justify-start" : "flex justify-end"
            )}
          >
            <div className="flex space-x-1 bg-black/20 backdrop-blur-sm rounded-[8px] px-2 py-1">
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
                className="h-6 w-6 text-gray-300 hover:text-pink-300 hover:bg-white/10"
              >
                <Star className="h-3 w-3" />
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
      </div>
    </motion.div>
  );
});

// Memoize the TypingIndicator component
const TypingIndicator = React.memo(function TypingIndicator({
  user
}: {
  user: User;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-start mt-4"
    >
      <Avatar className="h-10 w-10 mr-3 border-2 border-purple-500">
        <img src={user.avatar || "/placeholder.svg"} alt={user.name} />
      </Avatar>
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 inline-flex items-center">
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "600ms" }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
});

const DateDivider = React.memo(function DateDivider({
  date
}: {
  date: string;
}) {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="h-px w-full bg-white/5"></div>
      <div className="px-3 text-xs text-gray-500 whitespace-nowrap">{date}</div>
      <div className="h-px w-full bg-white/5"></div>
    </div>
  );
});

interface ChatMessagesProps {
  messages: Message[];
  currentUser: User;
  receiverUser: User | null;
  typingUsers: User[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatMessages({
  messages,
  currentUser,
  receiverUser,
  typingUsers,
  messagesEndRef
}: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Group messages by date
  const groupedMessages = useMemo(() => {
    return messages.reduce((groups: Record<string, Message[]>, message) => {
      const date = new Date(message.timestamp).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric"
      });

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(message);
      return groups;
    }, {});
  }, [messages]);

  // Scroll to bottom when messages change
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
    <ScrollArea
      ref={scrollAreaRef}
      className="h-full px-4 py-4 h-full overflow-y-auto"
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <Avatar className="h-16 w-16 border-4 border-purple-500 shadow-lg">
            <img
              src={receiverUser?.avatar || "/placeholder.svg"}
              alt={receiverUser?.name}
            />
          </Avatar>
          <h4 className="text-xl font-semibold text-white">
            {receiverUser?.name}
          </h4>
          <p className="text-gray-400 text-center max-w-xs">
            No messages yet.{" "}
            <span className="text-purple-400 font-medium">
              Start the conversation!
            </span>
          </p>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-[6px] shadow-[6px]"
            onClick={() => console.log("Start conversation clicked")}
          >
            Start Conversation
          </Button>
        </div>
      )}

      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          <DateDivider date={date} />

          <div className="space-y-4">
            {dateMessages.map((message: Message) => (
              <MessageItem
                key={message.id}
                message={message}
                isCurrentUser={message.sender.id === currentUser?.id}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      <AnimatePresence>
        {typingUsers.length > 0 && <TypingIndicator user={typingUsers[0]} />}
      </AnimatePresence>

      <div ref={messagesEndRef} />
    </ScrollArea>
  );
}
