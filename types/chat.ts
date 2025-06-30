import { number } from "framer-motion"
import { UserInfo } from "./user"

export interface InitChatResponse {
  user: UserInfo
  rooms: InitChatRoomsResponse[]
  followers: number[]
  socket_url: string
}

export interface InitChatRoomsResponse {
  room: RoomInfo
  info: UserInfo
}

interface RoomInfo {
  RoomID:           number
	RoomIsGroup:      boolean
	MessageReceiverID: number
	MessageContent:    string
	MessageType :      {
    GoDbChatMessagesDirectMessageType: string
    Valid: boolean
  }
	MessageID:         number
	MessageSentAt:     string
	MessageIsRead:     {
    Bool: boolean
    Valid: boolean
  }
}

export interface CreateRoomRequest {
  room_name: string
  room_create_by: number
  room_is_group: boolean
  room_members: number[]
}

export interface CreateRoomResponse {
	room_id: number
	room_name: string
	room_create_by: number
	room_is_group: boolean
	room_members: number[]
}

export interface User {
  id: number
  name: string
  avatar: string
  status: "online" | "offline" | "away"
  typing?: boolean
}

export interface Message {
  id: number
  content: string
  sender: User
  timestamp: Date
  status?: "sending" | "sent" | "delivered" | "read"
  isEmote?: boolean
}

export interface MessageResponse {
  MessageContent: string
  MessageID: number
  MessageType: {
    GoDbChatMessagesDirectMessageType: string
    Valid: boolean
  }
  MessageIsRead: {
    Bool: boolean
    Valid: boolean
  }
  MessageReadAt: {
    Time: string
    Valid: boolean
  }
  MessageReceiverID: number
  MessageRoomID: number
  MessageSentAt: string
}

export interface OnMessage {
  event: "message" | "notification" | "reaction" | "typing" | "read" | "subscribe" | "unsubscribe" | "status",
  type?: "group" | "single" | "multi"
  sender_id?: number
  receiver_id?: number
  receiver_ids?: number[]
  message?:  MessageRequest
  status?: UserStatus
  typing?: TypingRequest
  read?: ReadRequest
}

export interface TypingRequest {
  room_id: number
}

export interface ReadRequest {
  room_id: number
}

export interface MessageRequest {
  id: number
  room_id: number
  sender_id: number
  sender_name: string
  sender_avatar: string
  receiver_id?: number
  receiver_ids?: number[]
  content: string
  content_type: "text" | "image" | "video" | "file" | "emote"
  send_at: string
}


export interface Conversation {
  id: number
  user: User
  messages: Message[]
  lastMessage: Message | null
  unreadCount: number
  isGroup?: boolean
  isTemporary?: boolean
}

export interface AckMessage {
  event: "ack"
  receiver_id: number
  status: "error" | "success"
  content: OnMessage
  message_id: number
}

export interface UserStatus {
  status: "online" | "offline" | "away"
}