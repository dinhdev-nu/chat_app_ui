"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useToast } from "@/hooks/use-toast"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider, Tooltip } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { generateMockData } from "@/lib/mock-data"
import ChatMessages from "@/components/chat/chat-messages"
import UserDiscovery from "@/components/chat/user-discovery"
import EmotePanel from "@/components/chat/emote-panel"
import NotificationCenter from "@/components/chat/notification-center"
import {
  Menu,
  X,
  Search,
  Users,
  Bell,
  Settings,
  MessageSquare,
  Smile,
  PlusCircle,
  Send,
  ImageIcon,
  Mic,
  Video,
  Phone,
  MoreHorizontal,
  UserPlus,
  Hash,
  Bookmark,
  LogOut,
} from "lucide-react"
import { Conversation } from "@/types/chat"

export default function ImmersiveChatInterface() {
  // Get mock data
  const { conversations, currentUser } = generateMockData()

  // State
  const [activeConversation, setActiveConversation] = useState(conversations[0])
  const [messages, setMessages] = useState(activeConversation.messages)
  const [message, setMessage] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isEmotePanelOpen, setIsEmotePanelOpen] = useState(false)
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false)
  const [isUserDiscoveryOpen, setIsUserDiscoveryOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState("chats")
  const [notifications, setNotifications] = useState<
    {
      id: number
      type: "message" | "friend" | "system"
      user?: string
      content: string
      time: string
      read: boolean
    }[]
  >([
    { id: 1, type: "message", user: "Taylor", content: "Sent you a message", time: "2 min ago", read: false },
    { id: 2, type: "friend", user: "Jordan", content: "Accepted your friend request", time: "1 hour ago", read: false },
    { id: 3, type: "system", content: "Welcome to the new chat experience!", time: "2 hours ago", read: true },
  ])

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Close sidebar on mobile when conversation is selected
  useEffect(() => {
    if (isMobile) {
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

    if (!conversation) return

    setActiveConversation(conversation)
    setMessages(conversation.messages)

    // Close panels
    setIsEmotePanelOpen(false)
    setIsNotificationPanelOpen(false)
    setIsUserDiscoveryOpen(false)
  }

  // Handle sending a message
  const handleSendMessage = (e: any) => {
    e.preventDefault()

    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to send a message.",
        variant: "destructive",
      })
      return
    }

    if (!message || !message.trim()) return

    // Create new message
    const newMessage: typeof messages[number] = {
      id: `msg-${Date.now()}`,
      content: message,
      sender: currentUser,
      timestamp: new Date(),
      status: "sending",
    }

    // Add message to state
    setMessages((prev) => [...prev, newMessage])
    setMessage("")

    // Simulate sending delay
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "sent" } : msg))
      )

      // Simulate delivered status after a delay
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)))
      }, 1000)

      // Simulate typing indicator
      setIsTyping(true)

      // Simulate reply after a delay
      setTimeout(() => {
        setIsTyping(false)

        // Create reply message
        const replyMessage = {
          id: `msg-${Date.now()}`,
          content: getRandomReply(),
          sender: activeConversation.user,
          timestamp: new Date(),
        }

        // Add reply to state
        setMessages((prev) => [...prev, replyMessage])

        // Show notification
        toast({
          title: `New message from ${activeConversation.user.name}`,
          description: replyMessage.content.substring(0, 60) + (replyMessage.content.length > 60 ? "..." : ""),
          variant: "info",
        })
      }, 3000)
    }, 500)
  }

  // Handle sending an emote
  const handleSendEmote = (emote: any) => {
    if (!emote) return
    // Create new message with emote
    const newMessage = {
      id: `msg-${Date.now()}`,
      content: emote,
      sender: currentUser,
      timestamp: new Date(),
      isEmote: true,
    }

    // Add message to state
    setMessages((prev) => [...prev, newMessage])

    // Close emote panel
    setIsEmotePanelOpen(false)

    // Simulate reply after a delay
    setTimeout(() => {
      // Create reply message
      const replyMessage = {
        id: `msg-${Date.now()}`,
        content: getRandomEmote(),
        sender: activeConversation.user,
        timestamp: new Date(),
        isEmote: true,
      }

      // Add reply to state
      setMessages((prev) => [...prev, replyMessage])
    }, 2000)
  }

  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
    toast({
      title: "Notifications cleared",
      description: "All notifications have been marked as read",
      variant: "success",
    })
  }

  // Handle adding a new friend
  const handleAddFriend = (user: { name: string }) => {
    toast({
      title: "Friend request sent",
      description: `Your friend request to ${user.name} has been sent`,
      variant: "success",
    })
    setIsUserDiscoveryOpen(false)
  }

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
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
    if (replies.length === 0) return "No reply available"
    return replies[Math.floor(Math.random() * replies.length)]
  }

  // Get random emote
  const getRandomEmote = () => {
    const emotes = ["😊", "👍", "❤️", "😂", "🎉", "🙌", "👏", "🔥"]
    if (emotes.length === 0) return "👍"
    return emotes[Math.floor(Math.random() * emotes.length)]
  }

  // Count unread notifications
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="h-16 bg-[#1e1f2e]/90 backdrop-blur-md border-b border-white/10 flex items-center px-4 justify-between">
          <div className="flex items-center">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mr-2 text-gray-400 hover:text-white"
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}

            <div className="flex items-center">
              <MessageSquare className="h-6 w-6 text-indigo-500 mr-2" />
              <h1 className="text-white font-medium text-lg">Vizify Chat</h1>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                  onClick={() => {
                    toast({
                      title: "Search",
                      description: "Search functionality coming soon!",
                      variant: "info",
                    })
                  }}
                >
                  <Search className="h-5 w-5"/>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search</TooltipContent>
            </TooltipRoot>

            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white relative"
                  onClick={() => {
                    setIsNotificationPanelOpen(!isNotificationPanelOpen)
                    setIsEmotePanelOpen(false)
                    setIsUserDiscoveryOpen(false)
                  }}
                
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </TooltipRoot>

            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                  onClick={() => {
                    setIsUserDiscoveryOpen(!isUserDiscoveryOpen)
                    setIsEmotePanelOpen(false)
                    setIsNotificationPanelOpen(false)
                  }}
                >
                  <UserPlus className="h-5 w-5" />
                </Button>
        
              </TooltipTrigger>
              <TooltipContent>Discover Users</TooltipContent>
            </TooltipRoot>

            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                  onClick={() => {
                    toast({
                      title: "Settings",
                      description: "Settings panel coming soon!",
                      variant: "info",
                    })
                  }}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </TooltipRoot>

            <div className="ml-2 flex items-center">
              <Avatar className="h-8 w-8 border-2 border-indigo-500/50">
                <img src="/placeholder.svg?height=32&width=32" alt="User" />
              </Avatar>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "320px", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`h-full bg-[#1a1b26]/90 backdrop-blur-md border-r border-white/10 flex flex-col ${
                  isMobile ? "absolute inset-y-0 left-0 z-50 w-full" : "relative"
                }`}
              >
                {/* Sidebar tabs */}
                <Tabs
                  defaultValue="chats"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="h-full flex flex-col"
                >
                  <div className="px-2 pt-2">
                    <TabsList className="w-full bg-[#1e1f2e]">
                      <TabsTrigger value="chats" className="flex-1 data-[state=active]:bg-indigo-500">
                        <MessageSquare className="h-4 w-4 mr-2 " />
                        Chats
                      </TabsTrigger>
                      <TabsTrigger value="groups" className="flex-1 data-[state=active]:bg-indigo-500">
                        <Users className="h-4 w-4 mr-2" />
                        Groups
                      </TabsTrigger>
                      <TabsTrigger value="saved" className="flex-1 data-[state=active]:bg-indigo-500">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Saved
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder={`Search ${activeTab}...`}
                        className="pl-9 bg-[#1e1f2e] border-white/10 text-white"
                      />
                    </div>
                  </div>
 
                  <TabsContent value="chats" className="flex flex-col overflow-auto">
                      <div className="p-2 space-y-1 ">
                        {conversations.map((conversation) => (
                          <ConversationItem
                            key={conversation.id}
                            conversation={conversation}
                            isActive={activeConversation?.id === conversation.id}
                            onClick={() => handleConversationChange(conversation)}
                          />
                        ))}
                      </div>
                  </TabsContent>

                  <TabsContent value="groups" className="flex-1 overflow-hidden flex flex-col mt-0">
                    <ScrollArea className="flex-1 ">
                      <div className="p-4 text-center text-gray-400">
                        <Hash className="h-12 w-12 mx-auto mb-2 text-gray-500" />
                        <h3 className="text-lg font-medium text-white mb-1">No Groups Yet</h3>
                        <p className="text-sm mb-4">
                          Create or join a group to start chatting with multiple people at once.
                        </p>
                        <Button
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                          onClick={() => {
                            toast({
                              title: "Create Group",
                              description: "Group creation coming soon!",
                              variant: "info",
                            })
                          }}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Create Group
                        </Button>
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="saved" className="flex-1 overflow-hidden flex flex-col mt-0">
                    <ScrollArea className="flex-1">
                      <div className="p-4 text-center text-gray-400">
                        <Bookmark className="h-12 w-12 mx-auto mb-2 text-gray-500" />
                        <h3 className="text-lg font-medium text-white mb-1">No Saved Messages</h3>
                        <p className="text-sm">Bookmark important messages to find them easily later.</p>
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* User profile */}
                  <div className="p-3 border-t border-white/10 bg-[#1e1f2e]/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3 border-2 border-indigo-500/50">
                          <img src="/placeholder.svg?height=40&width=40" alt={currentUser.name} />
                        </Avatar>
                        <div>
                          <div className="text-white font-medium">{currentUser.name}</div>
                          <div className="text-xs text-gray-400 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                            Online
                          </div>
                        </div>
                      </div>

                      <TooltipRoot>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-400"
                            onClick={() => {
                              toast({
                                title: "Logout",
                                description: "Logout functionality coming soon!",
                                variant: "info",
                              })
                            }}
                          >
                            <LogOut className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Logout</TooltipContent>
                      </TooltipRoot>
                    </div>
                  </div>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat area */}
          <div className="flex-1 flex flex-col bg-gradient-to-b from-[#1e1f2e]/70 to-[#1a1b26]/70 backdrop-blur-md relative">
            {activeConversation ? (
              <>
                {/* Chat header */}
                <div className="h-16 border-b border-white/10 flex items-center justify-between px-4">
                  <div className="flex items-center">
                    <div className="relative mr-3">
                      <Avatar className="h-10 w-10">
                        <img
                          src={activeConversation.user.avatar || "/placeholder.svg?height=40&width=40"}
                          alt={activeConversation.user.name}
                        />
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1e1f2e] ${
                          activeConversation.user.status === "online"
                            ? "bg-green-500"
                            : activeConversation.user.status === "away"
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                        }`}
                      ></span>
                    </div>
                    <div>
                      <h2 className="text-white font-medium">{activeConversation.user.name}</h2>
                      <p className="text-xs text-gray-400">
                        {activeConversation.user.status === "online"
                          ? "Online"
                          : activeConversation.user.status === "away"
                            ? "Away"
                            : "Offline"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <TooltipRoot>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <Phone className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Voice Call</TooltipContent>
                    </TooltipRoot>

                    <TooltipRoot>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <Video className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Video Call</TooltipContent>
                    </TooltipRoot>

                    <TooltipRoot>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>More Options</TooltipContent>
                    </TooltipRoot>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="flex-1 overflow-hidden relative">
                  <ChatMessages
                    messages={messages}
                    currentUser={currentUser}
                    isTyping={isTyping}
                    typingUser={activeConversation.user}
                    messagesEndRef={messagesEndRef}
                  />
                </div>

                {/* Chat input */}
                <div className="p-4 border-t border-white/10">
                  <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                    <div className="flex-1 bg-[#1e1f2e] rounded-lg border border-white/10 overflow-hidden">
                      <div className="flex items-center px-3 py-2 border-b border-white/5">
                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-white"
                            >
                              <PlusCircle className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Attach File</TooltipContent>
                        </TooltipRoot>

                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-white"
                            >
                              <ImageIcon className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Send Image</TooltipContent>
                        </TooltipRoot>

                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-white"
                            >
                              <Mic className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Voice Message</TooltipContent>
                        </TooltipRoot>

                        <TooltipRoot>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-white"
                              onClick={() => {
                                setIsEmotePanelOpen(!isEmotePanelOpen)
                                setIsNotificationPanelOpen(false)
                                setIsUserDiscoveryOpen(false)
                              }}
                            >
                              <Smile className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Emotes</TooltipContent>
                        </TooltipRoot>
                      </div>

                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={`Message ${activeConversation.user.name}...`}
                        className="w-full bg-transparent border-none px-4 py-3 text-white placeholder-gray-500 focus:outline-none resize-none h-20 "
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={!message.trim()}
                      className={`rounded-full p-3 ${
                        message.trim() ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-600/50 cursor-not-allowed"
                      }`}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-6 max-w-md">
                  <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                    <MessageSquare className="h-10 w-10 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3 glow-text">Select a Conversation</h3>
                  <p className="text-gray-400 mb-6">
                    Choose a conversation from the sidebar or start a new chat to begin messaging
                  </p>
                  {isMobile && !isSidebarOpen && (
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={() => setIsSidebarOpen(true)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Open Conversations
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Emote panel */}
          <AnimatePresence>
            {isEmotePanelOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-24 right-16 z-50"
              >
                <EmotePanel onSelectEmote={handleSendEmote} onClose={() => setIsEmotePanelOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notification panel */}
          <AnimatePresence>
            {isNotificationPanelOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute top-16 right-16 z-50"
              >
                <NotificationCenter
                  notifications={notifications}
                  onClose={() => setIsNotificationPanelOpen(false)}
                  onMarkAllAsRead={handleMarkAllAsRead}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* User discovery panel */}
          <AnimatePresence>
            {isUserDiscoveryOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute top-16 right-16 z-50"
              >
                <UserDiscovery onClose={() => setIsUserDiscoveryOpen(false)} onAddFriend={handleAddFriend} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  )
}

// Conversation item component
function ConversationItem({ conversation, isActive, onClick }: { conversation: Conversation; isActive: boolean; onClick: () => void }) {
  const { user, lastMessage, unreadCount } = conversation

  return (
    <div
      onClick={onClick}
      className={`p-2 rounded-lg cursor-pointer transition-colors ${
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
            {lastMessage && (
              <span className="text-xs text-gray-500 shrink-0">
                {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-400 truncate mt-1">
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
