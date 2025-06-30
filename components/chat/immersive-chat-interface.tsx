"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useToast } from "@/hooks/use-toast"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { AckMessage, Conversation, CreateRoomRequest, CreateRoomResponse, Message, MessageRequest, MessageResponse, OnMessage, UserStatus } from "@/types/chat"
import { CallApiWithAuth } from "@/config/axios.config"
import { User } from "@/types/chat"
import useInitChat from "@/lib/hooks/use-init-chat"
import ConversationItem from "./conversation-item"
import { UserInfo } from "@/types/user"
import { useRouter } from "next/router"


export default function ImmersiveChatInterface() {
  // State
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentUser, setCurrentUser] = useState<User>(
    () => {
      const userData = localStorage.getItem(process.env.NEXT_PUBLIC_USER_KEY!);
      if (!userData) {
        useRouter().push("");
        return { id: 0, name: "", avatar: "", status: "offline" }; // Default values
      }
      const parsedUser = JSON.parse(userData) as UserInfo;
      return {
        id: parsedUser.user_id,
        name: parsedUser.user_nickname || "",
        avatar: parsedUser.user_avatar || "/placeholder.svg?height=40&width=40",
        status: "online",
      };
    }
  )

  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
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
  const conversationListRef = useRef<Conversation[]>([])
  const acctiveConversationRef = useRef<Conversation | null>(null)

  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")
 
  const ws = useRef<WebSocket>(null)

  useEffect(() => {
    conversationListRef.current = conversations
    acctiveConversationRef.current = activeConversation
  }, [conversations, activeConversation])


  useEffect(() => setIsTyping(false), [activeConversation])

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

    const lastMessage = messages[messages.length - 1]
    if(lastMessage?.sender.id != currentUser.id && lastMessage?.status === "delivered" || lastMessage?.status === "sent") {
      handleSendReadStatus(acctiveConversationRef.current as Conversation)
    }
  }, [messages])


   const handleReceiveMessage = (data: MessageRequest) => {
    // Check if the conversation exists
    const conversation = conversationListRef.current.find((c) => c.id == data.room_id)

    // create a new conversation if it doesn't exist   
    if (!conversation) {
      // get info room 

      // Create a new conversation object
      const newConversation: Conversation = {
        id: data.room_id,
        user: {
          id: data.sender_id,
          name: data.sender_name,
          avatar: data.sender_avatar || "/placeholder.svg?height=48&width=48",
          status: "online", // Assume online for received messages
        } as User,
        messages: [] as Message[],
        lastMessage: {
          id: data.id,
          content: data.content,
          sender: {
            id: data.sender_id,
            name: data.sender_name,
            avatar: data.sender_avatar || "/placeholder.svg?height=48&width=48",
            status: "online",
          } as User,
          timestamp: new Date(data.send_at),
          status: "delivered",
        },
        unreadCount: 1, // Start with 1 unread message
        isTemporary: false, // Temporary conversations will be handled separately
      } as Conversation

      // Add the new conversation to the state
      setConversations((prev) => [newConversation, ...prev])
      handleSendSubscribeTo([data.sender_id])
      handleSendChangeStatus({
        status: "online",
      })
      return
    }

    // if convensation is active and conversation is temporary
    if (acctiveConversationRef.current?.user.id === data.sender_id && acctiveConversationRef.current?.isTemporary) {
      // Update the active conversation with the new message 
      const newMessage: Message = {
          id: data.id,
          content: data.content,
          sender: {
            id: data.sender_id,
            name: data.sender_name,
            avatar: data.sender_avatar || "/placeholder.svg?height=48&width=48",
            status: "online",
          } as User,
          timestamp: new Date(data.send_at),
          status: "read",
        };

        setConversations((prev) => {
          return prev.map((c) => {
            if (c.id === data.room_id) {
              return {
                ...c,
                id: data.room_id,
                lastMessage: newMessage,
                unreadCount: 0, // Reset unread count when sending a message
              }
            }
            return c
          })
        })

        setActiveConversation((prev) => {
          if (!prev || !prev.user) {
            return null; // Ensure the previous state and user exist
          }
          return {
            ...prev,
            id: data.room_id,
            isTemporary: false,
            lastMessage: newMessage,
            messages: [...(prev.messages || []), newMessage],
          };
        });
        
        setMessages((prevMessages) => [...prevMessages, newMessage])
        
      const payload = {
        room_id: data.room_id,
        user_id: currentUser.id,
      }

      // update message status
      CallApiWithAuth.post(`/chat/set-status`, payload)

      handleSendSubscribeTo([data.sender_id])

      return 
    }
    // If conversation exists, update it with the new message
    // conversation is active
    if (acctiveConversationRef.current?.id === conversation.id) {
      // Add the new message to the active conversation
        const newMessage: Message = {
          id: data.id,
          content: data.content,
          sender: {
            id: data.sender_id,
            name: acctiveConversationRef.current?.user.name,
            avatar: acctiveConversationRef.current?.user.avatar || "/placeholder.svg?height=48&width=48",
            status: "online", // Assume online for received messages
          } as User,
          timestamp: new Date(data.send_at),
          status: "delivered",
        }

      setConversations((prev) => {
        return prev.map((c) => {
          if (c.id === conversation.id) {
            return {
              ...c,
              lastMessage: newMessage,
              unreadCount: 0, // Reset unread count when sending a message
            }
          }
          return c
        })
      })

      
      setActiveConversation((prev) => {
        if (!prev) return null // Ensure previous state exists

        return {
          ...prev,
          lastMessage: newMessage,
        } 
      })

      setMessages((prev) => [...prev, newMessage])


      // update message status
      const payload = {
        room_id: conversation.id,
        user_id: currentUser.id,
      }
      CallApiWithAuth.post(`/chat/set-status`, payload)

      return
    }

    // If conversation is not active, increment unread count
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversation.id
          ? {
              ...c,
              unreadCount: c.unreadCount + 1,
              lastMessage: {
                id: data.id,
                content: data.content,
                sender: {
                  id: data.sender_id,
                  name: conversation.user.name,
                  avatar: conversation.user.avatar || "/placeholder.svg?height=48&width=48",
                  status: "online",
                } as User,
                timestamp: new Date(data.send_at),
                status: "delivered",
              },
            }
          : c
      )
    )
  }

  // Handle ack 
  const handleReceiverAckMessage = (data: AckMessage) => {
    if(!data || data.content.event !== "message") return
    const message = data.content.message as MessageRequest
    if(data.status === "success") {
      setTimeout(() => {
        if(message.room_id === acctiveConversationRef.current?.id) {
          setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id === 0) {
                  return {
                    ...msg,
                    id: data.message_id,
                    status: "delivered", 
                  }
                }
                return msg
              }
              )
            )
        }
        }, 500);
    } else {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
      // delete the message from the state
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== 0)
      )
    }
  }

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const handleReceiveTyping = (data: OnMessage) => {
    if (!data || !data.typing?.room_id || !data.sender_id) return
    // Check if the conversation is active
    if (acctiveConversationRef.current?.id === data.typing.room_id) {
      setIsTyping(true)

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
      }, 3000)
      
    }
  }

  const handleReceiveReadStatus = (data: OnMessage) => {
    if (!data || !data.read?.room_id || !data.sender_id) return
    // Check if the conversation is active
    if (acctiveConversationRef.current?.id === data.read.room_id) {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.sender.id === currentUser.id && msg.status === "delivered") {
            return {
              ...msg,
              status: "read",
            }
          }
          return msg
        })
      )
    }
  }

  const handleReceiveUserStatus = (data: OnMessage) => {
    if (!data) return
    
    setConversations((prev) =>
      prev.map((c) => {
        if (c.user.id == data.sender_id) {
          return {
            ...c,
            user: {
              ...c.user,
              status: data.status?.status as UserStatus["status"],
            },
          }
        }
        return c
      }))
      if (acctiveConversationRef.current?.user.id === data.sender_id) {
        setActiveConversation((prev) => {
          if (!prev) return null // Ensure previous state exists
          return {
            ...prev,
            user: {
              ...prev.user,
              status: data.status?.status as UserStatus["status"],
            },
          }
        })
      }
  }

  // Initialize chat page vả
  useInitChat({
    wsRef: ws,
    setCurrentUser,
    setConversations,
    onReceiveMessage: handleReceiveMessage,
    onReceiveAck: handleReceiverAckMessage,
    onTyping: handleReceiveTyping,
    onRead: handleReceiveReadStatus,
    onStatusUpdate: handleReceiveUserStatus,
    toast,
  })

  const handleSendReadStatus = async (conversation: Conversation) => {
    if (!conversation) return
    if(!ws.current || ws.current.readyState !== WebSocket.OPEN) return

    const msgRequest: OnMessage = {
      event: "read",
      sender_id: currentUser.id,
      receiver_id: conversation.user.id,
      type: conversation.isGroup ? "group" : "single",
      read: {
        room_id: conversation.id,
      },
    }

    ws.current.send(JSON.stringify(msgRequest))

  }


  // Handle conversation change
  const handleConversationChange = async(conversation: Conversation) => {

    if (!conversation) return

    setActiveConversation(conversation)

    // check messages 
    if (conversation.messages.length === 0 || conversation.unreadCount > 0) {
      // 1 - 1
      try {
        const response = await CallApiWithAuth.get(`/chat/get-messages/${conversation.id}`)
        const data = response.data.data.messages_direct as MessageResponse[]
        console.log("Fetched messages:", data)
        const messages: Message[] = data.map((msg: MessageResponse) => ({
          id: msg.MessageID,
          content: msg.MessageContent,
          sender: currentUser?.id == msg.MessageReceiverID ? {
            id: conversation.user.id,
            name: conversation.user.name,
            avatar: conversation.user.avatar || "/placeholder.svg?height=48&width=48",
            status: "online", // Assume online for received messages
          }  as User : currentUser,
          timestamp: new Date(msg.MessageSentAt),
          status: msg.MessageIsRead.Bool ? "read" : "delivered",
        }))

        // Update conversation with fetched messages
        const newConversation: Conversation = {
          ...conversation,
          messages: messages.reverse(), 
          unreadCount: 0, // cập nhật lại nếu cần
        }
        // check unread count
        if (conversation.unreadCount > 0) {
          // update state messages
          const data = {
            room_id: conversation.id,
            user_id: currentUser.id,
          }
          CallApiWithAuth.post(`/chat/set-status`, data)
        }

        setConversations((prev) =>
          prev.map((c) => (c.id === conversation.id ? newConversation : c))
        )
        setMessages(messages)

      } catch (error) {
        console.error("Error fetching messages:", error)
        toast({
          title: "Error",
          description: "Failed to load messages. Please try again.",
          variant: "destructive",
        })}
      return
    } else {
      setMessages(conversation.messages)
    }


    // Close panels
    setIsEmotePanelOpen(false)
    setIsNotificationPanelOpen(false)
    setIsUserDiscoveryOpen(false)

    // remove temporary conversation
    setConversations(prev => prev.filter(c => !c.isTemporary));
  }

  
  const handAddConversation = (user: User) => {
    // Check if conversation already exists
    const existingConversation = conversations?.find((c) => c.user.id === user.id)
    if (existingConversation && acctiveConversationRef.current?.user.id === user.id) {
      setIsUserDiscoveryOpen(false)
      return
    }

    if (existingConversation) {
      handleConversationChange(existingConversation)
      setIsUserDiscoveryOpen(false)
      return
    } else {
      // remove temporary conversation
      setConversations(prev =>
        prev.filter(c => !c.isTemporary || c.id === newConversation.id)
      );
    }
    // Create a temporary conversation
    const newConversation: Conversation = {
      id: Date.now(), 
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar || "/placeholder.svg?height=48&width=48",
        status: user.status || "offline",
      },
      messages: [],
      lastMessage: null, 
      unreadCount: 0,
      isTemporary: true, // Mark as temporary
    }

    // Add new conversation to state
    setActiveConversation(newConversation)
    setMessages([])
    setConversations((prev) => [newConversation, ...prev])

    // Close panels
    setIsEmotePanelOpen(false)
    setIsNotificationPanelOpen(false)
    setIsUserDiscoveryOpen(false)
    // Scroll to bottom of messages
    scrollToBottom()

  }

  
  // Scroll to bottom of messages
  const scrollToBottom = () => { 
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleDataRoom = useCallback((): CreateRoomRequest => {
  if (!activeConversation || !currentUser) return {
    room_name: "",
    room_create_by: 0,
    room_is_group: false,
    room_members: [],
  }

  return {
    room_name: activeConversation.user.name + " - " + currentUser.name,
    room_create_by: currentUser.id,
    room_is_group: activeConversation.isGroup || false,
    room_members: [activeConversation.user.id, currentUser.id],
  }
}, [activeConversation, currentUser])


  const handleSendChangeStatus = (s: UserStatus) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN || !activeConversation || !currentUser) return

    const statusMessage: OnMessage = {
      event: "status",
      sender_id: currentUser.id,
      receiver_ids: [conversations.map(c => c.user.id)].flat(),
      status: s,
    }

    ws.current.send(JSON.stringify(statusMessage))
  }

  // Handle sending a message
  const handleSendMessage = async (e: any) => {
    e.preventDefault()
    if (!message.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN || !activeConversation || !currentUser) return

    let roomId = acctiveConversationRef.current?.id || activeConversation.id

    if (acctiveConversationRef.current?.isTemporary) {
      try {
        const room = handleDataRoom()
        const response = await CallApiWithAuth.post("/chat/create-room", room)
        const data = response.data.data as CreateRoomResponse
        roomId = data.room_id

        setConversations((prev) => {
          return prev.map((c) => {
            if (c.id === acctiveConversationRef.current?.id) {
              return {
                ...c,
                id: data.room_id,
                isTemporary: false,
                isGroup: data.room_is_group,
              }
            }
            return c
          })
        })
        setActiveConversation((prev) => prev ? ({
          ...prev,
          id: data.room_id,
          isTemporary: false,
          isGroup: data.room_is_group,
        }) : null)
        handleSendSubscribeTo([acctiveConversationRef.current?.user.id || activeConversation.user.id])
      } catch (error) {
        console.error("Error creating conversation:", error)
        toast({
          title: "Error",
          description: "Failed to create conversation. Please try again.",
          variant: "destructive",
        })
        return
      }
    }

    const currentTime = new Date()
    const msg: OnMessage = {
      event: "message",
      sender_id: currentUser.id,
      receiver_id: activeConversation.user.id,
      type: activeConversation.isGroup ? "group" : "single",
      message: {
        id: 0, // Temporary ID, will be replaced by server
        room_id: roomId,
        sender_id: currentUser.id,
        sender_name: currentUser.name,
        sender_avatar: currentUser.avatar || "/placeholder.svg?height=48&width=48",
        content: message,
        content_type: "text",
        send_at: currentTime.toISOString(),
      } as MessageRequest,
    }

    try {
      ws.current.send(JSON.stringify(msg))
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }

    const newMessage: Message = {
      id: 0, // Temporary ID, will be replaced by server
      content: message,
      sender: currentUser,
      timestamp: currentTime,
      status: "sent", // Initial status before ack
    }

    setMessages((prev) => [
      ...prev,
      newMessage
    ])

    setConversations((prev) => {
      return prev.map((c) => {
        if (c.id === roomId) {
          return {
            ...c,
            lastMessage: newMessage,
            unreadCount: 0, // Reset unread count when sending a message
          }
        }
        return c
      })
    })

    setMessage("")
  }

  const handleSendSubscribeTo = (receiver_ids: number[]) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN || !activeConversation || !currentUser) return
    const subscribeMessage: OnMessage = {
      event: "subscribe",
      sender_id: currentUser.id,
      receiver_ids: receiver_ids,
    }

    ws.current.send(JSON.stringify(subscribeMessage))
  }


  // handle send typing event
  const lastSendTypingTimeRef = useRef<number>(0)
  const handleSendTyping = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN || !activeConversation || !currentUser) return

    const currentTime = Date.now()

    if(currentTime - lastSendTypingTimeRef.current < 1500) return

    lastSendTypingTimeRef.current = currentTime

    const typingMessage: OnMessage = {
      event: "typing",
      sender_id: currentUser.id,
      type: "multi",
      receiver_ids: [acctiveConversationRef.current?.user.id || activeConversation.user.id],
      typing: {
        room_id: acctiveConversationRef.current?.id || activeConversation.id,
      }
    }

    ws.current.send(JSON.stringify(typingMessage))
  }

  // Handle sending an emote
  const handleSendEmote = (emote: any) => {
    if (!emote) return
    // Create new message with emote
    const newMessage = {
      id: Date.now(),
      content: emote,
      sender: currentUser,
      timestamp: new Date(),
      isEmote: true,
    }

    // Add message to state
    setMessages((prev) => [...prev, { ...newMessage, sender: currentUser as User }])

    // Close emote panel
    setIsEmotePanelOpen(false)

    // Simulate reply after a delay
    setTimeout(() => {
      // Create reply message
      const replyMessage = {
        id: Date.now() + 1, // Ensure unique ID
        content: getRandomEmote(),
        sender: activeConversation?.user || currentUser,
        timestamp: new Date(),
        isEmote: true,
      }

      // Add reply to state
      setMessages((prev) => [...prev, { ...replyMessage, sender: currentUser as User }])
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
                      <TabsTrigger value="chats" className="flex-1 rounded-[6px] data-[state=active]:bg-indigo-500">
                        <MessageSquare className="h-4 w-4 mr-2 " />
                        Chats
                      </TabsTrigger>
                      <TabsTrigger value="groups" className="flex-1 rounded-[6px] data-[state=active]:bg-indigo-500">
                        <Users className="h-4 w-4 mr-2" />
                        Groups
                      </TabsTrigger>
                      <TabsTrigger value="saved" className="flex-1 rounded-[6px] data-[state=active]:bg-indigo-500">
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
                      <div className="p-2 space-y-1">
                        {
                          (conversations.length > 0 ? conversations?.map((conversation) => (
                            <ConversationItem
                              key={conversation.id}
                              conversation={conversation}
                              isActive={activeConversation?.id === conversation.id}
                              onClick={() => handleConversationChange(conversation)}
                            />
                          )) : (
                            <div className="text-center text-gray-400 p-4">
                              <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-500" />
                              <h3 className="text-lg font-medium text-white mb-1">No Conversations Yet</h3>
                              <p className="text-sm">Start chatting with someone to see your conversations here.</p>
                            </div>
                          ))

                        }
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
                          <img src="/placeholder.svg?height=40&width=40" alt={currentUser?.name} />
                        </Avatar>
                        <div>
                          <div className="text-white font-medium">{currentUser?.name}</div>
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
                    receiverUser={activeConversation.user}
                    isTyping={isTyping}
                    typingUser={activeConversation.user}
                    messagesEndRef={messagesEndRef}
                  />
                </div>  

                {/* Chat input */}
                <div className="p-4 border-t border-white/10">
                  <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                    <div className="flex-1 bg-[#1e1f2e] rounded-[6px] border border-white/10 overflow-hidden">
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
                        onChange={(e) => {
                          setMessage(e.target.value)
                          handleSendTyping()
                        }}
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
                <UserDiscovery onClose={() => setIsUserDiscoveryOpen(false)} onAddFriend={handleAddFriend} onAddConversation={handAddConversation}/>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  )
}
