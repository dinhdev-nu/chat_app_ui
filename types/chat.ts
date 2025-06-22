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
  isEmote?: boolean
}

export interface Conversation {
  id: string
  user: User
  messages: Message[]
  lastMessage: Message | null
  unreadCount: number
  isGroup?: boolean
  isTemporary?: boolean
}

export interface MessageRequest {
  // id is default to 0
  id: Number
  room_id: string
  sender_id: string
  sender_name: string
  sender_avatar: string
  receiver_id: string
  type: "group" | "single"
  content: string
  content_type: "text" | "image" | "video" | "file" | "emote",
  event: "message" | "notification" | "reaction" | "typing" | "read",
  send_at: string
}

export interface AckMessage {
  event: "ack"
  receiver_id: string
  status: "error" | "success"
  content: MessageRequest
  message_id: string
}
