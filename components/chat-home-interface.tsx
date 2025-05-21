"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Hash,
  Volume2,
  Bookmark,
  Settings,
  Plus,
  Smile,
  Send,
  MessageSquare,
  Bell,
  Users,
  Search,
  MoreHorizontal,
  ThumbsUp,
  Heart,
  Star,
  ImageIcon,
  Gift,
  CheckCheck,
  X,
} from "lucide-react"

export default function ChatHomeInterface() {
  const [selectedChannel, setSelectedChannel] = useState<string>("welcome")
  const [selectedDM, setSelectedDM] = useState<string | null>(null)
  const [showNewConversationModal, setShowNewConversationModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Function to handle channel selection
  const handleChannelSelect = (channelName: string) => {
    setSelectedChannel(channelName)
    setSelectedDM(null)
  }

  // Function to handle DM selection
  const handleDMSelect = (userName: string) => {
    setSelectedDM(userName)
    setSelectedChannel("")
  }

  // Function to open new conversation modal
  const openNewConversation = () => {
    setShowNewConversationModal(true)
  }

  // Function to close new conversation modal
  const closeNewConversation = () => {
    setShowNewConversationModal(false)
    setSearchQuery("")
  }

  // Function to start a new conversation
  const startNewConversation = (userName: string) => {
    setSelectedDM(userName)
    setSelectedChannel("")
    closeNewConversation()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
      <Card className="bg-[#1e1f2e]/80 backdrop-blur-md border border-indigo-500/20 overflow-hidden shadow-[0_0_15px_rgba(79,70,229,0.15)] rounded-xl">
        <div className="flex h-[600px]">
          {/* Channels sidebar */}
          <div className="w-64 bg-[#1a1b26] border-r border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-indigo-400" />
                HarmonyHub
              </h3>
              <button className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 overflow-y-auto flex-1">
              <div className="mb-4">
                <div className="text-xs text-gray-400 px-2 py-1 uppercase font-semibold flex items-center justify-between">
                  <span>Text Channels</span>
                  <button className="text-gray-400 hover:text-indigo-400 transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <ChannelItem
                  icon={<Hash />}
                  name="welcome"
                  active={selectedChannel === "welcome"}
                  unread={false}
                  onClick={() => handleChannelSelect("welcome")}
                />
                <ChannelItem
                  icon={<Hash />}
                  name="general"
                  active={selectedChannel === "general"}
                  unread={true}
                  onClick={() => handleChannelSelect("general")}
                />
                <ChannelItem
                  icon={<Hash />}
                  name="introductions"
                  active={selectedChannel === "introductions"}
                  unread={false}
                  onClick={() => handleChannelSelect("introductions")}
                />
                <ChannelItem
                  icon={<Hash />}
                  name="resources"
                  active={selectedChannel === "resources"}
                  unread={false}
                  onClick={() => handleChannelSelect("resources")}
                />
              </div>
              <div className="mb-4">
                <div className="text-xs text-gray-400 px-2 py-1 uppercase font-semibold flex items-center justify-between">
                  <span>Voice Channels</span>
                  <button className="text-gray-400 hover:text-indigo-400 transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <ChannelItem
                  icon={<Volume2 />}
                  name="General Voice"
                  active={selectedChannel === "General Voice"}
                  unread={false}
                  onClick={() => handleChannelSelect("General Voice")}
                />
                <ChannelItem
                  icon={<Volume2 />}
                  name="Chill Lounge"
                  active={selectedChannel === "Chill Lounge"}
                  unread={false}
                  onClick={() => handleChannelSelect("Chill Lounge")}
                />
              </div>
              <div className="mb-4">
                <div className="text-xs text-gray-400 px-2 py-1 uppercase font-semibold flex items-center justify-between">
                  <span>Direct Messages</span>
                  <button
                    className="text-gray-400 hover:text-indigo-400 transition-colors"
                    onClick={openNewConversation}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <DirectMessageItem
                  name="Taylor"
                  status="online"
                  unread={true}
                  active={selectedDM === "Taylor"}
                  onClick={() => handleDMSelect("Taylor")}
                />
                <DirectMessageItem
                  name="Jordan"
                  status="online"
                  unread={false}
                  active={selectedDM === "Jordan"}
                  onClick={() => handleDMSelect("Jordan")}
                />
                <DirectMessageItem
                  name="Alex"
                  status="idle"
                  unread={false}
                  active={selectedDM === "Alex"}
                  onClick={() => handleDMSelect("Alex")}
                />
                <DirectMessageItem
                  name="Sam"
                  status="offline"
                  unread={false}
                  active={selectedDM === "Sam"}
                  onClick={() => handleDMSelect("Sam")}
                />
              </div>
            </div>
            <div className="p-3 border-t border-white/10 bg-[#1a1b26]/80">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2 ring-2 ring-indigo-500/50">
                  <img src="/placeholder.svg?height=32&width=32" alt="User" />
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm text-white font-medium">Username</div>
                  <div className="text-xs text-green-400">Online</div>
                </div>
                <div className="flex space-x-1">
                  <button className="text-gray-400 hover:text-indigo-400 transition-colors">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main chat area */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center">
              {selectedChannel && (
                <>
                  <Hash className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-white font-medium">{selectedChannel}</span>
                  <div className="ml-2 text-gray-400 text-sm">
                    {selectedChannel === "welcome"
                      ? "Welcome to the community!"
                      : selectedChannel === "general"
                        ? "General discussions"
                        : selectedChannel === "introductions"
                          ? "Introduce yourself"
                          : selectedChannel === "resources"
                            ? "Helpful resources"
                            : "Voice channel"}
                  </div>
                </>
              )}
              {selectedDM && (
                <>
                  <div className="h-5 w-5 text-gray-400 mr-2 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-white font-medium">{selectedDM}</span>
                  <div className="ml-2 text-gray-400 text-sm">Online</div>
                </>
              )}
              <div className="ml-auto flex space-x-3">
                <button className="text-gray-400 hover:text-indigo-400 transition-colors">
                  <Bell className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-indigo-400 transition-colors">
                  <Users className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-indigo-400 transition-colors">
                  <Search className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-indigo-400 transition-colors">
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <SystemMessage message="Today, May 10" />
              <ChatMessage
                avatar="/placeholder.svg?height=40&width=40"
                username="HarmonyBot"
                time="10:00 AM"
                message="👋 Welcome to the HarmonyHub community! This is where you can connect with other members, share ideas, and collaborate on projects."
                isBot
                isPinned
              />
              <ChatMessage
                avatar="/placeholder.svg?height=40&width=40"
                username="Alex"
                time="10:05 AM"
                message="Hello everyone! I'm excited to be here. Looking forward to connecting with all of you."
                reactions={[
                  { emoji: "👋", count: 3 },
                  { emoji: "😊", count: 2 },
                ]}
              />
              <ChatMessage
                avatar="/placeholder.svg?height=40&width=40"
                username="Taylor"
                time="10:07 AM"
                message="Welcome Alex! What brings you to our community?"
                reactions={[{ emoji: "❤️", count: 1 }]}
              />
              <ChatMessage
                avatar="/placeholder.svg?height=40&width=40"
                username="Alex"
                time="10:10 AM"
                message="I'm interested in web development and looking for a community to learn and grow with. Anyone working on interesting projects?"
              />
              <ChatMessage
                avatar="/placeholder.svg?height=40&width=40"
                username="Jordan"
                time="10:12 AM"
                message="I'm currently working on a React project. Would love to collaborate if you're interested!"
                hasAttachment
                attachmentType="image"
              />
              <ChatMessage
                avatar="/placeholder.svg?height=40&width=40"
                username="Taylor"
                time="10:15 AM"
                message="That sounds great! I've been working with React for about a year now. Maybe we could set up a time to chat about your project?"
                isDelivered
              />
              <TypingIndicator username="Jordan" />
            </div>
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center bg-[#1a1b26] rounded-lg px-4 py-2 shadow-inner">
                <button className="text-gray-400 hover:text-indigo-400 transition-colors mr-2">
                  <Plus className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  placeholder="Message #welcome"
                  className="bg-transparent border-none outline-none text-white flex-1"
                />
                <div className="flex space-x-3">
                  <button className="text-gray-400 hover:text-indigo-400 transition-colors">
                    <Gift className="h-5 w-5" />
                  </button>
                  <button className="text-gray-400 hover:text-indigo-400 transition-colors">
                    <ImageIcon className="h-5 w-5" />
                  </button>
                  <button className="text-gray-400 hover:text-indigo-400 transition-colors">
                    <Smile className="h-5 w-5" />
                  </button>
                  <button className="text-gray-500 transition-colors">
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 flex items-center justify-between px-2">
                <div>
                  Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-400">Enter</kbd> to send
                </div>
                <div>
                  <button className="text-indigo-400 hover:underline">Upload files</button>
                </div>
              </div>
            </div>
          </div>

          {/* Members sidebar */}
          <div className="w-60 bg-[#1a1b26] border-l border-white/10 hidden lg:block">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-white font-semibold">Members</h3>
              <button className="text-gray-400 hover:text-indigo-400 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            <div className="p-2 overflow-y-auto">
              <div className="mb-2">
                <div className="text-xs text-gray-400 px-2 py-1 uppercase font-semibold">Online — 4</div>
                <MemberItem name="HarmonyBot" status="Bot" isBot />
                <MemberItem name="Alex" status="Online" activity="Web Development" />
                <MemberItem name="Taylor" status="Online" activity="React Developer" />
                <MemberItem name="Jordan" status="Idle" activity="Working on a project" />
              </div>
              <div className="mb-2">
                <div className="text-xs text-gray-400 px-2 py-1 uppercase font-semibold">Offline — 2</div>
                <MemberItem name="Sam" status="Offline" isOffline />
                <MemberItem name="Riley" status="Offline" isOffline />
              </div>
            </div>
          </div>
        </div>
        {/* New Conversation Modal */}
        {showNewConversationModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-[#1e1f2e] rounded-lg border border-indigo-500/20 w-full max-w-md overflow-hidden shadow-lg">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-medium">New Conversation</h3>
                <button
                  onClick={closeNewConversation}
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search for friends..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-black/50 border-white/10 text-white focus:border-purple-500 focus:ring-purple-500/20"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    <FriendItem name="Morgan" status="online" onClick={() => startNewConversation("Morgan")} />
                    <FriendItem name="Casey" status="online" onClick={() => startNewConversation("Casey")} />
                    <FriendItem name="Riley" status="idle" onClick={() => startNewConversation("Riley")} />
                    <FriendItem name="Quinn" status="offline" onClick={() => startNewConversation("Quinn")} />
                    <FriendItem name="Jamie" status="online" onClick={() => startNewConversation("Jamie")} />
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-white/10 bg-[#1a1b26]/50 flex justify-end">
                <Button
                  onClick={closeNewConversation}
                  variant="outline"
                  className="mr-2 border-white/10 text-white hover:bg-white/5"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

function ChannelItem({
  icon,
  name,
  active = false,
  unread = false,
  onClick,
}: {
  icon: React.ReactNode
  name: string
  active?: boolean
  unread?: boolean
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 cursor-pointer transition-colors ${
        active ? "bg-indigo-500/20 text-white" : "text-gray-400"
      }`}
    >
      <div className="flex items-center">
        <div className={`mr-1 ${active ? "text-indigo-400" : "text-gray-400"}`}>{icon}</div>
        <div className="text-sm">{name}</div>
      </div>
      {unread && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
    </div>
  )
}

function DirectMessageItem({
  name,
  status,
  unread = false,
  active = false,
  onClick,
}: {
  name: string
  status: "online" | "idle" | "offline"
  unread?: boolean
  active?: boolean
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 cursor-pointer transition-colors ${
        active ? "bg-indigo-500/20 text-white" : "text-gray-400"
      }`}
    >
      <div className="flex items-center">
        <div className="relative mr-2">
          <div
            className={`w-2 h-2 rounded-full absolute bottom-0 right-0 border border-[#1a1b26] ${
              status === "online" ? "bg-green-500" : status === "idle" ? "bg-yellow-500" : "bg-gray-500"
            }`}
          ></div>
          <div className="text-sm">{name.charAt(0)}</div>
        </div>
        <div className="text-sm">{name}</div>
      </div>
      {unread && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
    </div>
  )
}

function MemberItem({
  name,
  status,
  activity,
  isBot = false,
  isOffline = false,
}: {
  name: string
  status: string
  activity?: string
  isBot?: boolean
  isOffline?: boolean
}) {
  return (
    <div className="flex items-center px-2 py-1 rounded hover:bg-white/5 cursor-pointer transition-colors group">
      <div className="relative mr-2">
        <Avatar className={`h-8 w-8 ${isBot ? "ring-2 ring-indigo-500" : ""}`}>
          <img src="/placeholder.svg?height=32&width=32" alt={name} />
        </Avatar>
        {!isOffline && (
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1a1b26] ${
              status === "Idle" ? "bg-yellow-500" : "bg-green-500"
            }`}
          ></span>
        )}
      </div>
      <div>
        <div className={`text-sm ${isOffline ? "text-gray-500" : "text-white"}`}>{name}</div>
        {isBot ? (
          <Badge variant="secondary" className="text-xs bg-indigo-500 text-white">
            BOT
          </Badge>
        ) : (
          activity && <div className="text-xs text-gray-400">{activity}</div>
        )}
      </div>
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="text-gray-500 hover:text-indigo-400 transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function SystemMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="h-px w-full bg-white/5"></div>
      <div className="px-3 text-xs text-gray-500 whitespace-nowrap">{message}</div>
      <div className="h-px w-full bg-white/5"></div>
    </div>
  )
}

function ChatMessage({
  avatar,
  username,
  time,
  message,
  isBot = false,
  isPinned = false,
  reactions = [],
  hasAttachment = false,
  attachmentType = "",
  isDelivered = false,
}: {
  avatar: string
  username: string
  time: string
  message: string
  isBot?: boolean
  isPinned?: boolean
  reactions?: { emoji: string; count: number }[]
  hasAttachment?: boolean
  attachmentType?: string
  isDelivered?: boolean
}) {
  return (
    <div className="flex group hover:bg-white/5 rounded-lg p-2 -mx-2 transition-colors">
      <Avatar className={`h-10 w-10 mr-3 mt-0.5 ${isBot ? "ring-2 ring-indigo-500" : ""}`}>
        <img src={avatar || "/placeholder.svg"} alt={username} />
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center">
          <span className={`font-medium ${isBot ? "text-indigo-400" : "text-white"}`}>{username}</span>
          <span className="ml-2 text-xs text-gray-500">{time}</span>
          {isPinned && (
            <span className="ml-2 text-xs bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded flex items-center">
              <Bookmark className="h-3 w-3 mr-1" />
              Pinned
            </span>
          )}
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
            <button className="text-gray-500 hover:text-indigo-400 transition-colors">
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button className="text-gray-500 hover:text-indigo-400 transition-colors">
              <Heart className="h-4 w-4" />
            </button>
            <button className="text-gray-500 hover:text-indigo-400 transition-colors">
              <Star className="h-4 w-4" />
            </button>
            <button className="text-gray-500 hover:text-indigo-400 transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="text-gray-300 mt-1">{message}</div>

        {hasAttachment && (
          <div className="mt-2 max-w-sm">
            {attachmentType === "image" && (
              <div className="relative rounded-[6px] overflow-hidden border border-white/10 hover:border-indigo-500/50 transition-colors cursor-pointer group/image">
                <img
                  src="/placeholder.svg?height=200&width=350"
                  alt="Attachment"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-[6px] text-sm transition-colors">
                    View Full Size
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {reactions.length > 0 && (
          <div className="flex mt-2 space-x-2">
            {reactions.map((reaction, index) => (
              <div
                key={index}
                className="flex items-center bg-white/5 hover:bg-indigo-500/20 px-2 py-0.5 rounded-full cursor-pointer transition-colors"
              >
                <span className="mr-1">{reaction.emoji}</span>
                <span className="text-xs text-gray-400">{reaction.count}</span>
              </div>
            ))}
          </div>
        )}

        {isDelivered && (
          <div className="flex items-center mt-1">
            <CheckCheck className="h-3 w-3 text-indigo-400 mr-1" />
            <span className="text-xs text-gray-500">Delivered</span>
          </div>
        )}
      </div>
    </div>
  )
}

function TypingIndicator({ username }: { username: string }) {
  return (
    <div className="flex items-center px-2 py-1">
      <Avatar className="h-8 w-8 mr-2">
        <img src="/placeholder.svg?height=32&width=32" alt={username} />
      </Avatar>
      <div className="text-sm text-gray-400">
        <span className="font-medium text-white">{username}</span> is typing
        <span className="ml-1 inline-flex">
          <span className="w-1 h-1 bg-gray-400 rounded-full mx-0.5 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span
            className="w-1 h-1 bg-gray-400 rounded-full mx-0.5 animate-bounce"
            style={{ animationDelay: "200ms" }}
          />
          <span
            className="w-1 h-1 bg-gray-400 rounded-full mx-0.5 animate-bounce"
            style={{ animationDelay: "400ms" }}
          />
        </span>
      </div>
    </div>
  )
}

function FriendItem({
  name,
  status,
  onClick,
}: {
  name: string
  status: "online" | "idle" | "offline"
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center px-3 py-2 rounded hover:bg-white/5 cursor-pointer transition-colors"
    >
      <Avatar className="h-8 w-8 mr-3">
        <img src="/placeholder.svg?height=32&width=32" alt={name} />
      </Avatar>
      <div className="flex-1">
        <div className="text-sm text-white">{name}</div>
        <div className="text-xs text-gray-400">
          {status === "online" ? "Online" : status === "idle" ? "Idle" : "Offline"}
        </div>
      </div>
      <div
        className={`w-2 h-2 rounded-full ${
          status === "online" ? "bg-green-500" : status === "idle" ? "bg-yellow-500" : "bg-gray-500"
        }`}
      ></div>
    </div>
  )
}
