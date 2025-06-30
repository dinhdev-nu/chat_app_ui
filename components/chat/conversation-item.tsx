"use client"
import { Conversation } from "@/types/chat"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import React from "react"
 

interface ConversationItemProps {
    conversation: Conversation
    isActive: boolean
    onClick: () => void
}

function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps ) {
  const { user, lastMessage, unreadCount } = conversation

  return (
    <div
      onClick={onClick}
      className={`p-2 rounded-[6px] cursor-pointer transition-colors ${
        isActive ? "bg-indigo-500/20" : "hover:bg-white/5"
      }`}
    >
      <div className="flex items-start space-x-3 w-full">
        {/* Avatar + status */}
        <div className="relative shrink-0">
          <Avatar className="h-12 w-12">
            <img src={user.avatar || "/placeholder.svg?height=48&width=48"} alt={user.name} />
          </Avatar>
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1a1b26] ${
              user.status === "online" ? "bg-green-500" : user.status === "away" ? "bg-yellow-500" : "bg-gray-500"
            }`}
          ></span>
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className={`text-sm font-medium truncate ${isActive ? "text-white" : "text-gray-300"}`}>
              {user.name}
            </h3>
              <span className="text-xs text-gray-500 shrink-0">
                {
                  new Date(
                    lastMessage?.timestamp ?? new Date().getTime()
                  ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
              </span>
          </div>


          {/* If unreadCount highlight text and change size */}
          <p className={`text-sm text-gray-400 truncate ${
            unreadCount > 0 ? "font-semibold text-white" : ""
          }`}>
            {lastMessage ? lastMessage.content : "No messages yet"}
          </p>
        </div>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <Badge className="ml-2 bg-indigo-600 hover:bg-indigo-700 shrink-0">{unreadCount}</Badge>
        )}
      </div>
    </div>
  )
}

export default React.memo(ConversationItem)

