"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Conversation, User } from "@/types/chat"
import { Search, X, Settings, Plus, Users } from "lucide-react"

interface ChatSidebarProps {
  conversations: Conversation[]
  activeConversation: Conversation | null
  onSelectConversation: (conversation: Conversation) => void
  currentUser: User
  onClose: () => void
}

export default function ChatSidebar({
  conversations,
  activeConversation,
  onSelectConversation,
  currentUser,
  onClose,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) =>
    conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="h-full flex flex-col bg-black/70 border-r border-white/10">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center">
          <Users className="h-5 w-5 text-purple-400 mr-2" />
          <h2 className="text-white font-semibold">Conversations</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-gray-400 hover:text-purple-400 transition-colors">
            <Plus className="h-5 w-5" />
          </button>
          <button className="text-gray-400 hover:text-purple-400 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-purple-400 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-black/50 border-white/10 text-white focus:border-purple-500 focus:ring-purple-500/20"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={activeConversation?.id === conversation.id}
              onClick={() => onSelectConversation(conversation)}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-400">No conversations found</div>
        )}
      </div>

      {/* User profile */}
      <div className="p-4 border-t border-white/10 bg-black/50">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3 ring-2 ring-purple-500/50">
            <img src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
          </Avatar>
          <div className="flex-1">
            <div className="text-sm text-white font-medium">{currentUser.name}</div>
            <div className="text-xs text-green-400">Online</div>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-purple-400">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
}

function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const { user, lastMessage, unreadCount } = conversation

  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
      onClick={onClick}
      className={`p-3 cursor-pointer transition-colors ${
        isActive ? "bg-purple-500/20 hover:bg-purple-500/30" : "hover:bg-white/5"
      }`}
    >
      <div className="flex items-start">
        <div className="relative">
          <Avatar className="h-12 w-12 mr-3">
            <img src={user.avatar || "/placeholder.svg"} alt={user.name} />
          </Avatar>
          {user.status === "online" && (
            <span className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></span>
          )}
          {user.status === "offline" && (
            <span className="absolute bottom-0 right-2 w-3 h-3 bg-gray-500 rounded-full border-2 border-black"></span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-medium truncate ${isActive ? "text-white" : "text-gray-300"}`}>{user.name}</h3>
            <span className="text-xs text-gray-500">
              {lastMessage
                ? new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : ""}
            </span>
          </div>
          <p className="text-xs text-gray-400 truncate mt-1">{lastMessage ? lastMessage.content : "No messages yet"}</p>
        </div>
        {unreadCount > 0 && (
          <div className="ml-2 bg-purple-600 text-white text-xs font-medium rounded-full h-5 min-w-5 flex items-center justify-center px-1">
            {unreadCount}
          </div>
        )}
      </div>
    </motion.div>
  )
}
