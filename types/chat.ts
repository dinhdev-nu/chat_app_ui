export interface User {
  id: string
  name: string
  avatar: string
  status: "online" | "offline" | "away"
  typing?: boolean
}

export interface Message {
  id: string
  content: string
  sender: User
  timestamp: Date
  status?: "sending" | "sent" | "delivered" | "read"
}

export interface Conversation {
  id: string
  user: User
  messages: Message[]
  lastMessage?: Message
  unreadCount: number
}
