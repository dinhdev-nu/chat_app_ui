"use client"

import React, { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ThumbsUp, Heart, Star, MoreHorizontal, CheckCheck } from "lucide-react"
import { Message, User } from "@/types/chat"

export default function ChatMessages({ messages, currentUser, receiverUser, isTyping, typingUser, messagesEndRef }: {
  messages: Message[],
  currentUser: User,
  receiverUser: User | null,
  isTyping: boolean,
  typingUser: User,
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}) {
  const scrollAreaRef = useRef(null)


  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = (scrollAreaRef.current as HTMLElement).querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        (scrollContainer as HTMLElement).scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, isTyping])

  return (
    <ScrollArea ref={scrollAreaRef} className="h-full px-4 py-4">
      
      { messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <Avatar className="h-16 w-16 border-4 border-purple-500 shadow-lg">
            <img src={receiverUser?.avatar || "/placeholder.svg"} alt={receiverUser?.name} />
          </Avatar>
          <h4 className="text-xl font-semibold text-white">{receiverUser?.name}</h4>
          <p className="text-gray-400 text-center max-w-xs">
            No messages yet. <span className="text-purple-400 font-medium">Start the conversation!</span>
          </p>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-[6px] shadow-[6px]"
            onClick={() => console.log("Start conversation clicked")}
          >
            Start Conversation
          </Button>
        </div>)
        }

      { Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          <div className="flex items-center justify-center my-4">
            <div className="h-px w-full bg-white/5"></div>
            <div className="px-3 text-xs text-gray-500 whitespace-nowrap">{date}</div>
            <div className="h-px w-full bg-white/5"></div>
          </div>

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
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start mt-4"
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
    </ScrollArea>
  )
}

const MessageItem = React.memo(function MessageItem({ message, isCurrentUser }: {
  message: Message
  isCurrentUser: boolean
}) {
  const { content, sender, timestamp, status, isEmote } = message

  // If it's an emote, render it differently
  if (isEmote) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex mb-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}
      >
        <div className={`flex items-end ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
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
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex mb-4 group ${isCurrentUser ? "justify-end" : "justify-start"}`}
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
          <div className="flex items-center justify-between mb-1">
            <p className={`text-xs ${isCurrentUser ? "text-pink-200" : "text-purple-200"}`}>{sender.name}</p>
            <p className="text-xs text-gray-400 ml-4">
              {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <p className="break-words">{content}</p>

          {/* Message actions */}
          <div className="mt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-pink-400">
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-pink-400">
                <Heart className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-pink-400">
                <Star className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-pink-400">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Message status (for current user's messages) */}
          {isCurrentUser && status && (
            <div className="flex items-center justify-end mt-1">
              {status === "sending" && (
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse mr-1"></div>
                  <span className="text-xs text-gray-400">Sending</span>
                </div>
              )}
              {status === "sent" && (
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-400">Sent</span>
                </div>
              )}
              {status === "delivered" && (
                <div className="flex items-center">
                  <CheckCheck className="h-3 w-3 text-indigo-400 mr-1" />
                  <span className="text-xs text-gray-400">Delivered</span>
                </div>
              )}
              {status === "read" && (
                <div className="flex items-center">
                  <CheckCheck className="h-3 w-3 text-green-400 mr-1" />
                  <span className="text-xs text-gray-400">Read</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
})

// Helper function to group messages by date
function groupMessagesByDate(messages: Message[]): Record<string, any[]> {
  return messages.reduce((groups: Record<string, any[]>, message: Message) => {
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
