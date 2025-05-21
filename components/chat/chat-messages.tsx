"use client"

import type React from "react"

import { useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar } from "@/components/ui/avatar"
import type { Message, User } from "@/types/chat"

interface ChatMessagesProps {
  messages: Message[]
  currentUser: User
  isTyping: boolean
  typingUser: User
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}

export default function ChatMessages({
  messages,
  currentUser,
  isTyping,
  typingUser,
  messagesEndRef,
}: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages)

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
    >
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          <div className="flex items-center justify-center my-4">
            <div className="h-px w-full bg-white/5"></div>
            <div className="px-3 text-xs text-gray-500 whitespace-nowrap">{date}</div>
            <div className="h-px w-full bg-white/5"></div>
          </div>

          <div className="space-y-6">
            {dateMessages.map((message) => (
              <MessageItem key={message.id} message={message} isCurrentUser={message.sender.id === currentUser.id} />
            ))}
          </div>
        </div>
      ))}

      <AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start"
          >
            <Avatar className="h-10 w-10 mr-3 border-2 border-purple-500">
              <img src={typingUser.avatar || "/placeholder.svg"} alt={typingUser.name} />
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
        )}
      </AnimatePresence>

      <div ref={messagesEndRef} />
    </div>
  )
}

interface MessageItemProps {
  message: Message
  isCurrentUser: boolean
}

function MessageItem({ message, isCurrentUser }: MessageItemProps) {
  const { content, sender, timestamp, status } = message

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex mb-6 ${isCurrentUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`flex max-w-[80%] ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
        <Avatar
          className={`${isCurrentUser ? "ml-3" : "mr-3"} h-10 w-10 border-2 ${
            isCurrentUser ? "border-pink-500" : "border-purple-500"
          }`}
        >
          <img src={sender.avatar || "/placeholder.svg"} alt={sender.name} />
        </Avatar>
        <div
          className={`p-4 rounded-2xl ${
            isCurrentUser
              ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
              : "bg-white/10 backdrop-blur-sm text-white"
          }`}
        >
          <p className={`text-xs mb-1 ${isCurrentUser ? "text-pink-200" : "text-purple-200"}`}>{sender.name}</p>
          <p>{content}</p>
        </div>
      </div>
    </motion.div>
  )
}

// Helper function to group messages by date
function groupMessagesByDate(messages: Message[]) {
  return messages.reduce((groups: Record<string, Message[]>, message) => {
    const date = new Date(message.timestamp).toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    })

    if (!groups[date]) {
      groups[date] = []
    }

    groups[date].push(message)
    return groups
  }, {})
}
