"use client";

import { CallApiWithAuth } from "@/config/axios.config";
import { ToasterToast } from "@/hooks/use-toast";
import {
    Conversation,
    GroupConversation,
    Message,
    RoomGroupChatResponse,
    User
} from "@/types/chat";
import { useEffect } from "react";

interface UseGetGroupProps {
    activeTab: string;
    isFetchingGroups: boolean;
    setIsFetchingGroups: (isFetching: boolean) => void;
    setConversations: (value: React.SetStateAction<Conversation[]>) => void;
    setIsLoadingConversations: (isLoading: boolean) => void;
    currentUser: User;
    toast: (props: Omit<ToasterToast, "id">) => void;
}

export default function useGetGroup({
    activeTab,
    isFetchingGroups,
    setIsFetchingGroups,
    setConversations,
    setIsLoadingConversations,
    currentUser,
    toast
}: UseGetGroupProps) {
    useEffect(() => {
        if (isFetchingGroups || activeTab !== "groups") return;
        setIsFetchingGroups(true);
        const fetchGroups = async () => {
            setIsLoadingConversations(true);
            try {
                setIsFetchingGroups(true);
                const res = await CallApiWithAuth.get("/chat/get-rooms");
                const rooms = res.data.data as RoomGroupChatResponse[];
                const groupConversations = rooms.map((room) => {
                    const sender = room.room_members.find(
                        (m) => m.id === room.room_last_message.message_sender_id
                    );

                    const createdBy = room.room_members.find(
                        (m) => m.role === "admin"
                    ) as User;

                    const isRead =
                        room.room_last_message.message_sender_id ===
                        currentUser.id
                            ? true
                            : room.current_last_seen !==
                              room.room_last_message.message_id
                            ? false
                            : true;
                    return {
                        id: room.room_id,
                        name: room.room_name,
                        avatar:
                            room.room_avatar ||
                            "/placeholder.svg?height=48&width=48",
                        description: room.room_description || "",
                        messages: [],
                        lastMessage: room.room_last_message
                            ? ({
                                  id: room.room_last_message.message_id,
                                  content:
                                      room.room_last_message.message_content,
                                  sender: sender || null,
                                  timestamp: new Date(
                                      room.room_last_message.message_sent_at
                                  ),
                                  status: isRead ? "read" : "delivered",
                                  type: room.room_last_message.message_type
                                      .GoDbChatMessagesGroupMessageType
                              } as Message)
                            : null,
                        unreadCount: isRead ? 0 : 1,
                        isTemporary: false,
                        type: "group",
                        participants: room.room_members,
                        createdBy: createdBy,
                        createdAt: new Date(room.room_created_at),
                        currentLastSeen: room.current_last_seen,
                        settings: {
                            allowInvites: true,
                            muteNotifications: false,
                            showReadReceipts: true
                        }
                    } as GroupConversation;
                });

                // sort messages by timestamp
                groupConversations.sort((a, b) => {
                    const aLastMessage = a.lastMessage
                        ? new Date(a.lastMessage.timestamp).getTime()
                        : 0;
                    const bLastMessage = b.lastMessage
                        ? new Date(b.lastMessage.timestamp).getTime()
                        : 0;
                    return bLastMessage - aLastMessage;
                });

                setConversations((prev) => [
                    ...prev.filter((c) => c.type !== "group"),
                    ...groupConversations
                ]);
            } catch (error) {
                console.error("Error fetching groups:", error);
                toast({
                    title: "Error",
                    description: "Failed to fetch groups. Please try again.",
                    variant: "destructive"
                });
            } finally {
                setIsLoadingConversations(false);
            }
        };

        fetchGroups();
    }, [activeTab]);
}
