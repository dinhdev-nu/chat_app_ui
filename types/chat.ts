import { UserInfo } from "./user";

export interface InitChatResponse {
    user: UserInfo;
    rooms: InitChatRoomsResponse[];
    followers: number[];
    socket_url: string;
}

export interface InitChatRoomsResponse {
    room: RoomInfo;
    info: UserInfo;
}

interface RoomInfo {
    RoomID: number;
    RoomIsGroup: boolean;
    MessageReceiverID: number;
    MessageContent: string;
    MessageType: {
        GoDbChatMessagesDirectMessageType: string;
        Valid: boolean;
    };
    MessageID: number;
    MessageSentAt: string;
    MemberUserID: number;
    MemberLastSeen: {
        Int64: number;
        Valid: boolean;
    };
    CurrentUserID: number;
    CurrentUserLastSeen: {
        Int64: number;
        Valid: boolean;
    };
}

export interface CreateRoom {
    room_id: number;
    room_name: string;
    room_avatar: string;
    room_description: string;
    room_create_by: number;
    room_is_group: boolean;
    room_message_id?: number;
    room_members: number[];
}

export interface MessagePrivateResponse {
    MessageContent: string;
    MessageID: number;
    MessageType: {
        GoDbChatMessagesDirectMessageType: string;
        Valid: boolean;
    };
    MessageIsRead: {
        Bool: boolean;
        Valid: boolean;
    };
    MessageReadAt: {
        Time: string;
        Valid: boolean;
    };
    MessageReceiverID: number;
    MessageRoomID: number;
    MessageSentAt: string;
}

export interface MessageGroupResponse {
    MessageID: number;
    MessageContent: string;
    MessageReader: {
        UserID: number;
        ReadAt: string;
    }[];
    MessageRoomID: number;
    MessageSenderID: number;
    MessageSentAt: string;
    MessageType: {
        GoDbChatMessagesDirectMessageType: string;
        Valid: boolean;
    };
}

type GroupMessage = {
    message_id: number;
    message_content: string;
    message_sender_id: number;
    message_sender_name: string;
    message_sender_avatar: string;
    message_sent_at: string;
    message_type: {
        GoDbChatMessagesGroupMessageType: string;
        valid: boolean;
    };
};

export interface OnMessage {
    event:
        | "message"
        | "notification"
        | "reaction"
        | "typing"
        | "read"
        | "subscribe"
        | "unsubscribe"
        | "status"
        | "room_created";
    type?: "group" | "single" | "multi";
    sender_id?: number;
    receiver_id?: number;
    receiver_ids?: number[];
    message?: MessageRequest;
    status?: UserStatus;
    typing?: TypingRequest;
    read?: ReadRequest;
    room?: GroupConversation;
}

export interface TypingRequest {
    room_id: number;
}

export interface ReadRequest {
    room_id: number;
}

export interface MessageRequest {
    id: number;
    room_id: number;
    sender_id: number;
    sender_name: string;
    sender_avatar: string;
    receiver_id?: number;
    receiver_ids?: number[];
    content: string;
    content_type: "text" | "image" | "video" | "file" | "emote";
    send_at: string;
}

export interface AckMessage {
    event: "ack";
    receiver_id: number;
    status: "error" | "success";
    content: OnMessage;
    message_id: number;
}

export interface UserStatus {
    status: "online" | "offline" | "away";
}

export interface User {
    id: number;
    name: string;
    avatar: string;
    status: "online" | "offline" | "away";
    typing?: boolean;
    nickname?: string;
    last_seen?: number;
    role?: "member" | "admin" | "moderator";
}

export interface Reaction {
    emoji: string;
    users: User[];
    count: number;
}

export interface RoomGroupChatResponse {
    room_id: number;
    room_name: string;
    room_avatar: string;
    room_description: string;
    room_is_group: boolean;
    room_create_by: number;
    room_created_at: string;
    room_last_message: GroupMessage;
    room_members: User[];
    current_last_seen: number;
}

export interface Message {
    id: number;
    content: string;
    sender: User;
    timestamp: Date;
    status?: "sending" | "sent" | "delivered" | "read";
    isEmote?: boolean;
    type?: "text" | "image" | "video" | "file" | "emote" | "system";
    reactions?: Reaction[];
}

export interface MemberLastSeen {
    UserID: number;
    MessageID: number;
}

export interface BaseConversation {
    id: number;
    name: string;
    avatar?: string;
    messages: Message[];
    lastMessage: Message | null;
    unreadCount: number;
    isTemporary: boolean;
    membersLastSeen?: MemberLastSeen[];
}

export interface PrivateConversation extends BaseConversation {
    type: "private";
    user: User;
}

export interface GroupConversation extends BaseConversation {
    type: "group";
    participants: User[];
    description?: string;
    currentLastSeen: number;
    createdBy: User;
    createdAt: Date;
}

export type Conversation = PrivateConversation | GroupConversation;
