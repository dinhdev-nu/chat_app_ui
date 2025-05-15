"use client"
import { Button } from "@/components/ui/button"
import type { Conversation } from "@/types/chat"
import { Menu, Phone, Video, Search, MoreHorizontal } from "lucide-react"

interface ChatHeaderProps {
  conversation: Conversation
  onMenuClick: () => void
  isSidebarOpen: boolean
  isMobile: boolean
}

export default function ChatHeader({ conversation, onMenuClick, isSidebarOpen, isMobile }: ChatHeaderProps) {
  const { user } = conversation

  return (
    <div className="p-4 border-b border-white/10 flex items-center">
      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>

      {(!isSidebarOpen || !isMobile) && (
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="mr-2 text-gray-400 hover:text-indigo-400">
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <div className="ml-4 text-white font-medium">NexusChat</div>

      <div className="flex items-center ml-auto space-x-1">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-indigo-400">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-indigo-400">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-indigo-400">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-indigo-400">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
