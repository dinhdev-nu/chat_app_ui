"use client";

import {
    AckMessage,
    Conversation,
    InitChatResponse,
    InitChatRoomsResponse,
    MemberLastSeen,
    Message,
    MessageRequest,
    OnMessage,
    PrivateConversation,
    User
} from "@/types/chat";
import { connectChatSocket } from "../chat/connect-websocket";
import { useEffect } from "react";
import { CallApiWithAuth } from "@/config/axios.config";
import { ToasterToast } from "@/hooks/use-toast";

interface InitChatProps {
    wsRef: React.RefObject<WebSocket | null>;
    setCurrentUser: (user: User) => void;
    setConversations: (conversation: Conversation[]) => void;
    setIsLoadingConversations: (isLoading: boolean) => void;
    onReceiveMessage: (message: MessageRequest) => void;
    onReceiveAck: (ack: AckMessage) => void;
    onTyping: (typing: OnMessage) => void;
    onRead: (read: OnMessage) => void;
    onStatusUpdate: (status: OnMessage) => void;
    onNewGroup: (data: OnMessage) => void;
    toast: (props: Omit<ToasterToast, "id">) => void;
}

export default function useInitChat({
    wsRef,
    setCurrentUser,
    setConversations,
    setIsLoadingConversations,
    onReceiveMessage,
    onReceiveAck,
    onTyping,
    onRead,
    onStatusUpdate,
    onNewGroup,
    toast
}: InitChatProps) {
    useEffect(() => {
        const fetchInitData = async () => {
            try {
                const dataRaw = await CallApiWithAuth.get("/chat/init");
                const data = dataRaw.data.data as InitChatResponse;
                const user = data.user;
                const conversationsData = data.rooms || [];
                const wsUrl = data.socket_url;
                const followers = data.followers;

                // currentUser
                const currentUser: User = {
                    id: user.user_id,
                    name: user.user_nickname,
                    avatar:
                        user.user_avatar ||
                        "/placeholder.svg?height=40&width=40",
                    status: "online"
                };
                setCurrentUser(currentUser);

                // conversations
                const formattedConversations: Conversation[] =
                    conversationsData.map((room: InitChatRoomsResponse) => {
                        const membersLastSeen = room.room.CurrentUserLastSeen;
                        const isLastMessageRead =
                            room.room.MessageReceiverID !== user.user_id
                                ? true
                                : membersLastSeen.Int64 !== room.room.MessageID
                                ? false
                                : true;
                        return {
                            id: room.room.RoomID,
                            name: room.info.user_name,
                            avatar:
                                room.info.user_avatar ||
                                "/placeholder.svg?height=48&width=48",
                            isTemporary: false,
                            type: "private",
                            user: {
                                id: room.info.user_id,
                                name: room.info.user_name,
                                avatar:
                                    room.info.user_avatar ||
                                    "/placeholder.svg?height=48&width=48",
                                status: room.info.user_status || "offline"
                            } as User,
                            messages: [] as Message[],
                            lastMessage: {
                                id: room.room.MessageID,
                                content: room.room.MessageContent,
                                sender:
                                    room.room.MessageReceiverID === user.user_id
                                        ? ({
                                              id: room.info.user_id,
                                              name: room.info.user_name,
                                              avatar:
                                                  room.info.user_avatar ||
                                                  "/placeholder.svg?height=48&width=48",
                                              status:
                                                  room.info.user_status ||
                                                  "offline"
                                          } as User)
                                        : currentUser,
                                timestamp: new Date(room.room.MessageSentAt),
                                status: isLastMessageRead ? "read" : "delivered"
                            } as Message,
                            unreadCount: isLastMessageRead ? 0 : 1,
                            isGroup: room.room.RoomIsGroup,
                            membersLastSeen: [
                                {
                                    UserID: room.info.user_id,
                                    MessageID: room.room.MemberLastSeen.Int64
                                } as MemberLastSeen,
                                {
                                    UserID: room.room.CurrentUserID,
                                    MessageID:
                                        room.room.CurrentUserLastSeen.Int64
                                } as MemberLastSeen
                            ]
                        } as PrivateConversation;
                    }) || [];

                setConversations(formattedConversations);

                const followerMessages: OnMessage = {
                    event: "subscribe",
                    sender_id: user.user_id,
                    receiver_ids: followers
                };

                // connect to WebSocket
                connectChatSocket({
                    url: wsUrl,
                    wsRef,
                    followers: followerMessages,
                    onMessageHandlers: {
                        onReceiveMessage,
                        onReceiveAck,
                        onTyping,
                        onRead,
                        onStatusUpdate,
                        onNewGroup
                    }
                });
                setIsLoadingConversations(false);
            } catch (error) {
                console.error("Error fetching initial chat data:", error);
                setIsLoadingConversations(false);
                toast({
                    title: "Error",
                    description:
                        "Failed to load chat data. Please try again later.",
                    variant: "destructive"
                });
            }
        };
        fetchInitData();

        return () => {
            wsRef.current?.close();
        };
    }, []);
}
