"use client"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"
import ChatSidebar from "./chat-sidebar"
import ChatHeader from "./chat-header"
import ChatMessages from "./chat-messages"
import ChatInput from "./chat-input"
import type { Message, Conversation } from "@/types/chat"
import { generateMockData } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"

export default function ChatInterface() {
  // Get mock data
  const { conversations, currentUser } = generateMockData()

  // State
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(
    conversations.length > 0 ? conversations[0] : null,
  )
  const [messages, setMessages] = useState<Message[]>(activeConversation?.messages || [])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // Check if mobile
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Close sidebar on mobile when conversation is selected
  useEffect(() => {
    if (isMobile && activeConversation) {
      setIsSidebarOpen(false)
    }
  }, [activeConversation, isMobile])

  // Auto-open sidebar on desktop
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(true)
    }
  }, [isMobile])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle conversation change
  const handleConversationChange = (conversation: Conversation) => {
    setActiveConversation(conversation)
    setMessages(conversation.messages)
  }

  // Handle sending a new message
  const handleSendMessage = (content: string) => {
    if (!content.trim() || !activeConversation) return

    // Create new message
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      sender: currentUser,
      timestamp: new Date(),
      status: "sending",
    }

    // Add message to state
    setMessages((prev) => [...prev, newMessage])

    // Simulate sending delay
    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "sent" } : msg)))

      // Simulate delivered status after a delay
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)))
      }, 1000)

      // Simulate read status after a delay
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "read" } : msg)))
      }, 2000)

      // Simulate typing indicator
      setIsTyping(true)

      // Simulate reply after a delay
      setTimeout(() => {
        setIsTyping(false)

        // Create reply message
        const replyMessage: Message = {
          id: `msg-${Date.now()}`,
          content: getRandomReply(),
          sender: activeConversation.user,
          timestamp: new Date(),
          status: "read",
        }

        // Add reply to state
        setMessages((prev) => [...prev, replyMessage])
      }, 3000)
    }, 500)
  }

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Get random reply
  const getRandomReply = () => {
    const replies = [
      "That sounds great!",
      "I'll think about it and get back to you.",
      "Thanks for letting me know!",
      "Can you tell me more about that?",
      "Interesting! I'd love to hear more.",
      "I'm not sure I understand. Could you explain?",
      "Let's discuss this further when we meet.",
      "I appreciate you sharing that with me.",
    ]
    return replies[Math.floor(Math.random() * replies.length)]
  }

  return (
    <Card className="bg-black/50 backdrop-blur-md border border-purple-500/20 overflow-hidden shadow-[0_0_15px_rgba(79,70,229,0.15)] w-full h-full flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: isMobile ? "100%" : "320px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`h-full ${isMobile ? "absolute inset-0 z-20" : "relative"}`}
          >
            <ChatSidebar
              conversations={conversations}
              activeConversation={activeConversation}
              onSelectConversation={handleConversationChange}
              currentUser={currentUser}
              onClose={() => setIsSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full relative">
        {activeConversation ? (
          <>
            <ChatHeader
              conversation={activeConversation}
              onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
              isSidebarOpen={isSidebarOpen}
              isMobile={isMobile}
            />
            <ChatMessages
              messages={messages}
              currentUser={currentUser}
              isTyping={isTyping}
              typingUser={activeConversation.user}
              messagesEndRef={messagesEndRef}
            />
            <ChatInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Conversation Selected</h3>
              <p className="text-gray-400 mb-4">Select a conversation from the sidebar to start chatting</p>
              {isMobile && !isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-[6px] hover:bg-indigo-700 transition-colors"
                >
                  Open Conversations
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
