"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, m } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useToast } from "@/hooks/use-toast";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";
import ChatMessages from "@/components/chat/chat-messages";
import UserDiscovery from "@/components/chat/user-discovery";
import EmotePanel from "@/components/chat/emote-panel";
import NotificationCenter from "@/components/chat/notification-center";
import {
  Search,
  Bell,
  Settings,
  MessageSquare,
  Smile,
  PlusCircle,
  Send,
  ImageIcon,
  Mic,
  UserPlus
} from "lucide-react";
import { ChatMessagesSkeleton } from "@/components/chat/skeleton-loaders";
import {
  AckMessage,
  Conversation,
  CreateRoom,
  GroupConversation,
  Message,
  MessageGroupResponse,
  MessagePrivateResponse,
  MessageRequest,
  OnMessage,
  PrivateConversation,
  UserStatus
} from "@/types/chat";
import { CallApiWithAuth } from "@/config/axios.config";
import { User } from "@/types/chat";
import useInitChat from "@/lib/hooks/use-init-chat";
import { UserInfo } from "@/types/user";
import { useRouter } from "next/router";
import ChatSidebar from "./chat-sidebar";
import GroupCreationModal from "./group-creation-modal";
import useGetGroup from "@/lib/hooks/use-get-group";
import ChatHeader from "./chat-header";
import GroupChatMessages from "./group-chat-messages";
import { fetchGetMessages } from "@/lib/api/chat";
import {
  mockNotificationsData,
  Notification
} from "@/lib/mock-notifications-data";

export default function ImmersiveChatInterface() {
  // State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(() => {
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
      status: "online"
    };
  });

  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEmotePanelOpen, setIsEmotePanelOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [isUserDiscoveryOpen, setIsUserDiscoveryOpen] = useState(false);
  const [typingUsers, setTypingUsers] = useState<User[]>([]);
  const [isOpenCreateGroupModal, setIsOpenCreateGroupModal] = useState(false);
  const [activeTab, setActiveTab] = useState("chats");
  const [isFecthingGroups, setIsFetchingGroups] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(
    mockNotificationsData
  );
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const conversationListRef = useRef<Conversation[]>([]);
  const acctiveConversationRef = useRef<Conversation | null>(null);

  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const ws = useRef<WebSocket>(null);

  useEffect(() => {
    conversationListRef.current = conversations;
    acctiveConversationRef.current = activeConversation;
  }, [conversations, activeConversation]);

  useEffect(() => setTypingUsers([]), [activeConversation]);

  // Close sidebar on mobile when conversation is selected
  useEffect(() => {
    if (isMobile && activeConversation) {
      setIsSidebarOpen(false);
    }
  }, [activeConversation]);

  // Auto-open sidebar on desktop
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useGetGroup({
    activeTab,
    isFetchingGroups: isFecthingGroups,
    setIsFetchingGroups: setIsFetchingGroups,
    setConversations,
    setIsLoadingConversations,
    currentUser,
    toast
  });

  const handleReceiveMessage = (data: MessageRequest) => {
    if (!data || data.sender_id === currentUser.id) return;

    // Check if the conversation exists
    const conversation = conversationListRef.current.find(
      (c) => c.id === data.room_id
    );

    // create a new conversation if it doesn't exist
    if (!conversation) {
      // Create a new conversation object
      const newConversation: PrivateConversation = {
        id: data.room_id,
        user: {
          id: data.sender_id,
          name: data.sender_name,
          avatar: data.sender_avatar || "/placeholder.svg?height=48&width=48",
          status: "online" // Assume online for received messages
        } as User,
        messages: [] as Message[],
        lastMessage: {
          id: data.id,
          content: data.content,
          sender: {
            id: data.sender_id,
            name: data.sender_name,
            avatar: data.sender_avatar || "/placeholder.svg?height=48&width=48",
            status: "online"
          } as User,
          timestamp: new Date(data.send_at),
          status: "delivered"
        },
        unreadCount: 1,
        isTemporary: false,
        type: "private",
        name: data.sender_name,
        avatar: data.sender_avatar || "/placeholder.svg?height=48&width=48"
      };

      // Add the new conversation to the state
      setConversations((prev) => [newConversation, ...prev]);
      handleSendSubscribeTo([data.sender_id]);
      handleSendChangeStatus({
        status: "online"
      });
      return;
    }

    // if convensation is active and conversation is temporary
    if (
      acctiveConversationRef.current?.type === "private" &&
      acctiveConversationRef.current.user.id === data.sender_id &&
      acctiveConversationRef.current?.isTemporary
    ) {
      // Update the active conversation with the new message
      const newMessage: Message = {
        id: data.id,
        content: data.content,
        sender: {
          id: data.sender_id,
          name: data.sender_name,
          avatar: data.sender_avatar || "/placeholder.svg?height=48&width=48",
          status: "online"
        } as User,
        timestamp: new Date(data.send_at),
        status: "read"
      };

      setConversations((prev) => {
        const conv = prev.find((c) => c.id === data.room_id);
        if (!conv) return prev;
        const updatedConv = {
          ...conv,
          id: data.room_id,
          messages: [...(conv.messages || []), newMessage],
          lastMessage: newMessage,
          unreadCount: 0,
          isTemporary: false
        };

        return [updatedConv, ...prev.filter((c) => c.id !== conv.id)];
      });

      setActiveConversation((prev) => {
        if (!prev) {
          return null; // Ensure the previous state and user exist
        }
        return {
          ...prev,
          id: data.room_id,
          isTemporary: false,
          lastMessage: newMessage
        } as PrivateConversation;
      });

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      const payload = {
        room_id: data.room_id,
        user_id: currentUser.id,
        last_message: data.id
      };

      // update message status
      CallApiWithAuth.post(`/chat/set-status`, payload);

      handleSendSubscribeTo([data.sender_id]);
      handleSendReadStatus(acctiveConversationRef.current as Conversation);
      return;
    }
    // If conversation exists, update it with the new message
    // conversation is active
    if (
      conversation &&
      acctiveConversationRef.current?.id === conversation.id
    ) {
      // Add the new message to the active conversation
      let sender: User;

      if (conversation.type === "private") {
        sender = {
          id: data.sender_id,
          name: data.sender_name,
          avatar: data.sender_avatar || "/placeholder.svg?height=48&width=48",
          status: "online"
        };
      } else {
        sender =
          conversation.participants.find((u) => u.id === data.sender_id) ||
          ({
            id: data.sender_id,
            name: data.sender_name,
            avatar: data.sender_avatar || "/placeholder.svg?height:48&width=48",
            status: "online"
          } as User);
      }

      const newMessage: Message = {
        id: data.id,
        content: data.content,
        timestamp: new Date(data.send_at),
        status: "delivered",
        type: data.content_type,
        sender: sender
      };

      setConversations((prev) => {
        const conv = prev.find((c) => c.id === data.room_id);
        if (!conv) return prev;
        const updatedConv = {
          ...conv,
          messages: [...(conv.messages || []), newMessage],
          lastMessage: newMessage,
          unreadCount: 0 // Reset unread count when sending a message
        };

        return [updatedConv, ...prev.filter((c) => c.id !== conv.id)];
      });

      setActiveConversation((prev) => {
        if (!prev) return null; // Ensure previous state exists

        return {
          ...prev,
          lastMessage: newMessage
        };
      });

      setMessages((prev) => [...prev, newMessage]);
      // update message status
      const payload = {
        room_id: conversation.id,
        user_id: currentUser.id,
        last_message: data.id
      };
      CallApiWithAuth.post(`/chat/set-status`, payload);
      acctiveConversationRef.current.type === "private" &&
        handleSendReadStatus(acctiveConversationRef.current as Conversation);
      return;
    }

    // If conversation is not active, increment unread count
    setConversations((prev) => {
      const conv = prev.find((c) => c.id === data.room_id);
      if (!conv) return prev;

      const newMessage: Message = {
        id: data.id,
        content: data.content,
        timestamp: new Date(data.send_at),
        status: "delivered",
        type: data.content_type,
        sender: {
          id: data.sender_id,
          name: data.sender_name,
          avatar: data.sender_avatar || "/placeholder.svg?height=48&width=48",
          status: "online"
        } as User
      };

      const updatedConv = {
        ...conv,
        unreadCount: conv.unreadCount + 1,
        lastMessage: newMessage,
        messages: [...(conv.messages || []), newMessage]
      };

      return [updatedConv, ...prev.filter((c) => c.id !== conv.id)];
    });
  };

  // Handle ack
  const handleReceiverAckMessage = (data: AckMessage) => {
    if (!data || data.content.event !== "message") return;
    const message = data.content.message as MessageRequest;
    if (data.status === "success") {
      if (message.room_id === acctiveConversationRef.current?.id) {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === 0) {
              return {
                ...msg,
                id: data.message_id,
                status: "delivered"
              };
            }
            return msg;
          })
        );
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      // delete the message from the state
      setMessages((prev) => prev.filter((msg) => msg.id !== 0));
    }
  };

  const typingTimeoutRef = useRef<Record<number, NodeJS.Timeout>>({});
  const handleReceiveTyping = (data: OnMessage) => {
    if (!data || !data.typing?.room_id || !data.sender_id) return;

    const senderID = data.sender_id;
    if (
      acctiveConversationRef.current?.id !== data.typing.room_id ||
      currentUser.id === senderID
    )
      return;
    setTypingUsers((prev) => {
      const existingUser = prev.some((u) => u.id === senderID);
      if (existingUser) {
        return prev;
      }
      let user: User | undefined;
      if (acctiveConversationRef.current?.type === "private") {
        user = acctiveConversationRef.current.user;
      } else {
        user = acctiveConversationRef.current?.participants.find(
          (p) => p.id === senderID
        );
      }
      return user ? [...prev, user] : prev;
    });

    if (typingTimeoutRef.current[senderID]) {
      clearTimeout(typingTimeoutRef.current[senderID]);
    }

    typingTimeoutRef.current[senderID] = setTimeout(() => {
      setTypingUsers((prev) => prev.filter((u) => u.id !== senderID));
      delete typingTimeoutRef.current[senderID];
    }, 3000);
  };

  const handleReceiveReadStatus = (data: OnMessage) => {
    if (!data || !data.read?.room_id || !data.sender_id) return;
    // Check if the conversation is active
    if (acctiveConversationRef.current?.id === data.read.room_id) {
      setConversations((prev) => {
        return prev.map((c) => {
          if (c.id === data.read?.room_id) {
            return {
              ...c,
              membersLastSeen: c.membersLastSeen?.map((m) => {
                if (m.UserID === data.sender_id) {
                  return {
                    ...m,
                    MessageID:
                      acctiveConversationRef.current?.lastMessage?.id || 0
                  };
                }
                return m;
              })
            };
          }
          return c;
        });
      });
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => ({ ...msg, status: "read" })));
      }, 200);
    }
  };

  const handleReceiveUserStatus = (data: OnMessage) => {
    if (!data) return;

    setConversations((prev) =>
      prev.map((c) => {
        if (c.type === "private" && c.user.id == data.sender_id) {
          return {
            ...c,
            user: {
              ...c.user,
              status: data.status?.status as UserStatus["status"]
            }
          };
        } else if (c.type === "group") {
          return {
            ...c,
            participants: c.participants.map((u) => {
              if (u.id === data.sender_id) {
                return {
                  ...u,
                  status: data.status?.status as UserStatus["status"]
                };
              }
              return u;
            })
          };
        }
        return c;
      })
    );
    if (
      acctiveConversationRef.current?.type === "private" &&
      acctiveConversationRef.current?.user.id === data.sender_id
    ) {
      setActiveConversation((prev) => {
        if (!prev) return null; // Ensure previous state exists
        if (prev.type !== "private") return prev; // Only update if private conversation
        return {
          ...prev,
          user: {
            ...prev.user,
            status: data.status?.status as UserStatus["status"]
          }
        };
      });
    } else if (
      acctiveConversationRef.current?.type === "group" &&
      acctiveConversationRef.current?.participants.some(
        (u) => u.id === data.sender_id
      )
    ) {
      setActiveConversation((prev) => {
        if (!prev) return null; // Ensure previous state exists
        if (prev.type !== "group") return prev; // Only update if group conversation
        return {
          ...prev,
          participants: prev.participants.map((u) => {
            if (u.id === data.sender_id) {
              return {
                ...u,
                status: data.status?.status as UserStatus["status"]
              };
            }
            return u;
          })
        };
      });
    }
  };

  const handleReceiveNewGroup = (data: OnMessage) => {
    const room = data.room as GroupConversation;
    if (!room || !room.id) return;

    setConversations((prev) => [room, ...prev]);

    // add subscribe to the new group
    handleSendSubscribeTo(
      room.participants.map((u) => u.id).filter((id) => id !== currentUser.id)
    );
  };

  // Initialize chat page vả
  useInitChat({
    wsRef: ws,
    setCurrentUser,
    setConversations,
    setIsLoadingConversations,
    onReceiveMessage: handleReceiveMessage,
    onReceiveAck: handleReceiverAckMessage,
    onTyping: handleReceiveTyping,
    onRead: handleReceiveReadStatus,
    onStatusUpdate: handleReceiveUserStatus,
    onNewGroup: handleReceiveNewGroup,
    toast
  });

  const handleSendReadStatus = (conversation: Conversation) => {
    if (!conversation) return;

    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    const msgRequest: OnMessage = {
      event: "read",
      sender_id: currentUser.id,
      type: conversation.type === "group" ? "group" : "single",
      read: {
        room_id: conversation.id
      }
    };
    if (conversation.type === "group") {
      msgRequest.receiver_ids = conversation.participants.map((u) => u.id);
    } else {
      msgRequest.receiver_id = conversation.user.id;
    }

    ws.current.send(JSON.stringify(msgRequest));
  };

  // Handle conversation change
  const handleConversationChange = async (conversation: Conversation) => {
    if (!conversation || acctiveConversationRef.current?.id === conversation.id)
      return;

    // Gán trước để UI phản hồi nhanh
    setActiveConversation(conversation);
    setIsLoadingMessages(true);
    try {
      const messages = await fetchGetMessages(conversation.id, 1, 0);
      if (
        messages.messages_group === null &&
        messages.messages_direct === null
      ) {
        return true; // Không còn tin nhắn nào để tải
      }
      let newMessages: Message[] = [];

      if (conversation.type === "group") {
        const data = messages.messages_group as MessageGroupResponse[];
        const participantMap = new Map(
          conversation.participants.map((p) => [p.id, p])
        );
        newMessages = data.map((msg) => ({
          id: msg.MessageID,
          content: msg.MessageContent,
          sender: participantMap.get(msg.MessageSenderID) || currentUser,
          timestamp: new Date(msg.MessageSentAt),
          status: "read"
        }));
      } else {
        const data = messages.messages_direct as MessagePrivateResponse[];
        const messageLastSeen = conversation.membersLastSeen?.find(
          (m) => m.UserID === conversation.user.id
        );
        newMessages = data.map((msg) => {
          const isMessageRead =
            messageLastSeen?.MessageID &&
            msg.MessageID <= messageLastSeen.MessageID;
          return {
            id: msg.MessageID,
            content: msg.MessageContent,
            sender:
              currentUser.id === msg.MessageReceiverID
                ? {
                    id: conversation.user.id,
                    name: conversation.user.name,
                    avatar:
                      conversation.user.avatar ||
                      "/placeholder.svg?height=48&width=48",
                    status: conversation.user.status || "offline"
                  }
                : currentUser,
            timestamp: new Date(msg.MessageSentAt),
            status: isMessageRead ? "read" : "delivered"
          };
        });
      }

      newMessages.reverse();
      if (conversation.unreadCount > 0) {
        CallApiWithAuth.post(`/chat/set-status`, {
          room_id: conversation.id,
          user_id: currentUser.id,
          last_message: acctiveConversationRef.current?.lastMessage?.id
        }).catch(console.error); // Không block UI
        handleSendReadStatus(conversation);
      }
      // Cập nhật messages
      const updated = {
        ...conversation,
        messages: [...newMessages, ...(conversation.messages || [])],
        unreadCount: 0
      };
      setMessages(newMessages);
      setConversations((prev) =>
        prev.map((c) => (c.id === conversation.id ? updated : c))
      );
    } catch (err) {
      console.error("Error fetching messages:", err);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive"
      });
    }

    // Đóng panel và loading
    setIsEmotePanelOpen(false);
    setIsNotificationPanelOpen(false);
    setIsUserDiscoveryOpen(false);
    setIsLoadingMessages(false);

    // Xóa conversation tạm
    setConversations((prev) => prev.filter((c) => !c.isTemporary));
  };

  const handAddConversation = (user: User) => {
    // Check if conversation already exists
    const existingConversation = conversations?.find(
      (c) => c.type === "private" && c.user.id === user.id
    );
    if (
      existingConversation &&
      acctiveConversationRef.current?.type === "private" &&
      acctiveConversationRef.current?.user.id === user.id
    ) {
      setIsUserDiscoveryOpen(false);
      return;
    }

    if (existingConversation) {
      handleConversationChange(existingConversation);
      setIsUserDiscoveryOpen(false);
      return;
    } else {
      // remove temporary conversation
      setConversations((prev) => prev.filter((c) => !c.isTemporary));
    }
    // Create a temporary conversation
    const newConversation: PrivateConversation = {
      id: Date.now(), // Temporary ID
      user: user,
      messages: [],
      lastMessage: null,
      unreadCount: 0,
      isTemporary: true,
      type: "private", // Add required property
      name: user.name, // Add required property
      avatar: user.avatar || "/placeholder.svg?height=48&width=48"
    };

    // Add new conversation to state
    setActiveConversation(newConversation);
    setMessages([]);
    setConversations((prev) => [newConversation, ...prev]);
    setActiveTab("chats");

    // Close panels
    setIsEmotePanelOpen(false);
    setIsNotificationPanelOpen(false);
    setIsUserDiscoveryOpen(false);
    // Scroll to bottom of messages
    scrollToBottom();
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDataRoom = useCallback(
    (conversation: PrivateConversation): CreateRoom => {
      return {
        room_id: conversation.id,
        room_name: conversation.user.name + " - " + currentUser.name,
        room_create_by: currentUser.id,
        room_is_group: false,
        room_avatar: "",
        room_description: "",
        room_members: [conversation.user.id, currentUser.id]
      };
    },
    [activeConversation, currentUser]
  );

  const handleSendChangeStatus = React.useCallback(
    (s: UserStatus) => {
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

      const statusMessage: OnMessage = {
        event: "status",
        sender_id: currentUser.id,
        receiver_ids: conversations.flatMap((c) => {
          if (c.type === "private") {
            return c.user.id;
          } else if (c.type === "group") {
            return c.participants.map((u) => u.id);
          }
          return [];
        }),
        status: s
      };

      ws.current.send(JSON.stringify(statusMessage));
    },
    [conversations]
  );

  // Handle sending a message
  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    const currentConversation = acctiveConversationRef.current;
    if (
      !message.trim() ||
      !ws.current ||
      ws.current.readyState !== WebSocket.OPEN ||
      !currentConversation
    )
      return;

    let roomId = currentConversation.id;
    if (
      currentConversation.isTemporary &&
      currentConversation.type === "private"
    ) {
      try {
        const room = handleDataRoom(currentConversation as PrivateConversation);
        const response = await CallApiWithAuth.post("/chat/create-room", room);
        const data = response.data.data as CreateRoom;
        roomId = data.room_id;

        setConversations((prev) => {
          return prev.map((c) => {
            if (c.id === currentConversation.id) {
              return {
                ...c,
                id: data.room_id,
                isTemporary: false,
                isGroup: data.room_is_group
              };
            }
            return c;
          });
        });
        setActiveConversation((prev) =>
          prev
            ? {
                ...prev,
                id: data.room_id,
                isTemporary: false,
                isGroup: data.room_is_group
              }
            : null
        );
        handleSendSubscribeTo([currentConversation.user.id]);
      } catch (error) {
        console.error("Error creating conversation:", error);
        toast({
          title: "Error",
          description: "Failed to create conversation. Please try again.",
          variant: "destructive"
        });
        return;
      }
    }

    const currentTime = new Date();
    const msg: OnMessage = {
      event: "message",
      sender_id: currentUser.id,
      message: {
        id: 0, // Temporary ID, will be replaced by server
        room_id: roomId,
        sender_id: currentUser.id,
        sender_name: currentUser.name,
        sender_avatar:
          currentUser.avatar || "/placeholder.svg?height=48&width=48",
        content: message,
        content_type: "text",
        send_at: currentTime.toISOString()
      } as MessageRequest
    };

    if (currentConversation.type === "group") {
      msg.type = "group";
      msg.receiver_ids = currentConversation.participants
        .map((u) => u.id)
        .filter((u) => u !== currentUser.id);
    } else {
      msg.type = "single";
      msg.receiver_id = currentConversation.user.id;
    }

    try {
      ws.current.send(JSON.stringify(msg));
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }

    const newMessage: Message = {
      id: 0, // Temporary ID, will be replaced by server
      content: message,
      sender: currentUser,
      timestamp: currentTime,
      status: "sent" // Initial status before ack
    };

    if (currentConversation.type === "group") {
      newMessage.sender =
        currentConversation.participants.find((u) => u.id === currentUser.id) ||
        currentUser;
    }

    setMessages((prev) => [...prev, newMessage]);

    setConversations((prev) => {
      const conv = prev.find((x) => x.id === roomId);
      if (!conv) return prev;
      const updatedMessages = [...(conv.messages || []), newMessage];
      const updatedConv = {
        ...conv,
        messages: updatedMessages,
        lastMessage: newMessage
      };

      return [updatedConv, ...prev.filter((x) => x.id !== roomId)];
    });

    setMessage("");
  };

  const handleSendSubscribeTo = (receiver_ids: number[]) => {
    if (
      !ws.current ||
      ws.current.readyState !== WebSocket.OPEN ||
      !acctiveConversationRef.current ||
      !currentUser
    )
      return;
    const subscribeMessage: OnMessage = {
      event: "subscribe",
      sender_id: currentUser.id,
      receiver_ids: receiver_ids
    };

    ws.current.send(JSON.stringify(subscribeMessage));
  };

  // handle send typing event
  const lastSendTypingTimeRef = useRef<number>(0);
  const handleSendTyping = () => {
    const currentConversation = acctiveConversationRef.current;
    if (
      !ws.current ||
      ws.current.readyState !== WebSocket.OPEN ||
      !currentConversation
    )
      return;

    const currentTime = Date.now();

    if (currentTime - lastSendTypingTimeRef.current < 1500) return;

    lastSendTypingTimeRef.current = currentTime;

    const typingMessage: OnMessage = {
      event: "typing",
      sender_id: currentUser.id,
      type: "group",
      typing: {
        room_id: currentConversation.id
      }
    };
    if (currentConversation.type === "group") {
      typingMessage.receiver_ids = currentConversation.participants
        .map((u) => u.id)
        .filter((id) => id !== currentUser.id);
    } else {
      typingMessage.receiver_ids = [currentConversation.user.id];
    }

    ws.current.send(JSON.stringify(typingMessage));
  };

  // Handle sending an emote
  const handleSendEmote = (emote: any) => {
    if (!emote) return;
    // Create new message with emote
    const newMessage = {
      id: Date.now(),
      content: emote,
      sender: currentUser,
      timestamp: new Date(),
      isEmote: true
    };

    // Add message to state
    setMessages((prev) => [
      ...prev,
      { ...newMessage, sender: currentUser as User }
    ]);

    // Close emote panel
    setIsEmotePanelOpen(false);

    // Simulate reply after a delay
    setTimeout(() => {
      // Create reply message
      const replyMessage = {
        id: Date.now() + 1, // Ensure unique ID
        content: getRandomEmote(),
        sender:
          (acctiveConversationRef.current?.type === "private" &&
            acctiveConversationRef.current.user) ||
          currentUser,
        timestamp: new Date(),
        isEmote: true
      };

      // Add reply to state
      setMessages((prev) => [
        ...prev,
        { ...replyMessage, sender: currentUser as User }
      ]);
    }, 2000);
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
    toast({
      title: "Notifications cleared",
      description: "All notifications have been marked as read",
      variant: "success"
    });
  };

  // Handle adding a new friend
  const handleAddFriend = (user: { name: string }) => {
    toast({
      title: "Friend request sent",
      description: `Your friend request to ${user.name} has been sent`,
      variant: "success"
    });
  };

  // Get random emote
  const getRandomEmote = () => {
    const emotes = ["😊", "👍", "❤️", "😂", "🎉", "🙌", "👏", "🔥"];
    if (emotes.length === 0) return "👍";
    return emotes[Math.floor(Math.random() * emotes.length)];
  };

  // Count unread notifications
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <TooltipProvider>
      <div className="h-full w-full flex flex-col">
        {/* Header */}
        <div className="h-16 bg-[#1e1f2e]/90 backdrop-blur-md border-b border-white/10 flex items-center px-4 justify-between z-10">
          <div className="flex items-center">
            <div className="flex items-center">
              <MessageSquare className="h-6 w-6 text-indigo-500 mr-2" />
              <h1 className="text-white font-medium text-lg">Chat Hub</h1>
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
                      variant: "info"
                    });
                  }}
                >
                  <Search className="h-5 w-5" />
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
                    setIsNotificationPanelOpen(!isNotificationPanelOpen);
                    setIsEmotePanelOpen(false);
                    setIsUserDiscoveryOpen(false);
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
                    setIsUserDiscoveryOpen(!isUserDiscoveryOpen);
                    setIsEmotePanelOpen(false);
                    setIsNotificationPanelOpen(false);
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
                      variant: "info"
                    });
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
              <ChatSidebar
                isMobile={isMobile}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setIsOpenCreateGroupModal={setIsOpenCreateGroupModal}
                conversations={conversations}
                isLoadingConversations={isLoadingConversations}
                activeConversation={activeConversation}
                handleConversationChange={handleConversationChange}
                currentUser={currentUser}
                toast={toast}
                ws={ws}
              />
            )}
          </AnimatePresence>

          {/* Chat area */}
          <div className=" flex-1 flex flex-col bg-gradient-to-b from-[#1e1f2e]/70 to-[#1a1b26]/70 backdrop-blur-md relative">
            {activeConversation ? (
              <>
                {/* Chat header */}
                <ChatHeader
                  activeConversation={activeConversation}
                  isLoadingMessages={isLoadingMessages}
                  setIsSidebarOpen={setIsSidebarOpen}
                  isSidebarOpen={isSidebarOpen}
                  isMobile={isMobile}
                />

                {/* Chat messages */}
                <div className="flex-1 overflow-hidden relative">
                  {isLoadingMessages ? (
                    <ChatMessagesSkeleton />
                  ) : activeConversation.type === "private" ? (
                    <ChatMessages
                      messages={messages}
                      currentUser={currentUser}
                      receiverUser={activeConversation.user}
                      typingUsers={typingUsers}
                      messagesEndRef={messagesEndRef}
                    />
                  ) : (
                    <GroupChatMessages
                      messages={messages}
                      currentUser={currentUser}
                      typingUsers={typingUsers}
                      messagesEndRef={messagesEndRef}
                    />
                  )}
                </div>

                {/* Chat input */}
                <div className="p-4 border-t border-white/10">
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-end gap-2"
                  >
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
                                setIsEmotePanelOpen(!isEmotePanelOpen);
                                setIsNotificationPanelOpen(false);
                                setIsUserDiscoveryOpen(false);
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
                          setMessage(e.target.value);
                          handleSendTyping();
                        }}
                        placeholder={`Message ${
                          activeConversation.type === "private"
                            ? activeConversation.user.name
                            : activeConversation.name
                        }...`}
                        className="w-full bg-transparent border-none px-4 py-3 text-white placeholder-gray-500 focus:outline-none resize-none h-20 "
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={!message.trim()}
                      className={`rounded-full p-3 ${
                        message.trim()
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : "bg-indigo-600/50 cursor-not-allowed"
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
                  <h3 className="text-2xl font-semibold text-white mb-3 glow-text">
                    Select a Conversation
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Choose a conversation from the sidebar or start a new chat
                    to begin messaging
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
                <EmotePanel
                  onSelectEmote={handleSendEmote}
                  onClose={() => setIsEmotePanelOpen(false)}
                />
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
                <UserDiscovery
                  onClose={() => setIsUserDiscoveryOpen(false)}
                  onAddFriend={handleAddFriend}
                  onAddConversation={handAddConversation}
                />
              </motion.div>
            )}
          </AnimatePresence>
          {isOpenCreateGroupModal && (
            <GroupCreationModal
              isOpen={isOpenCreateGroupModal}
              onClose={() => setIsOpenCreateGroupModal(false)}
              onCreateGroup={async (groupData) => {
                try {
                  // Implement group creation logic here
                  const newRoom: CreateRoom = {
                    room_id: 0, // This will be set by the server
                    room_name: groupData.name,
                    room_avatar: groupData.avatar || "",
                    room_description: groupData.description,
                    room_create_by: currentUser.id,
                    room_is_group: true,
                    room_members: groupData.participants.map((u) => u.id)
                  };

                  const response = await CallApiWithAuth.post(
                    "/chat/create-room",
                    newRoom
                  );
                  const data = response.data.data as CreateRoom;

                  // create new group conversation
                  const newGroupConversation: GroupConversation = {
                    id: data.room_id,
                    name: data.room_name,
                    avatar:
                      data.room_avatar || "/placeholder.svg?height=48&width=48",
                    description: data.room_description || "",
                    participants: groupData.participants,
                    messages: [],
                    lastMessage: {
                      id: data.room_message_id || 0,
                      content: "Welcome to the group!",
                      sender: currentUser,
                      timestamp: new Date(),
                      status: "sent",
                      type: "text"
                    } as Message,
                    unreadCount: 1,
                    isTemporary: false,
                    type: "group",
                    createdBy: currentUser,
                    createdAt: new Date(),
                    cuurrentLastSeen: 0 // Set to 0 or current timestamp
                  };

                  // send new group
                  ws.current?.send(
                    JSON.stringify({
                      event: "room_created",
                      type: "group",
                      sender_id: currentUser.id,
                      receiver_ids: groupData.participants
                        .map((u) => u.id)
                        .filter((id) => id !== currentUser.id),
                      room: newGroupConversation
                    } as OnMessage)
                  );

                  setConversations((prev) => [newGroupConversation, ...prev]);

                  toast({
                    title: "Group Created",
                    description: `Group "${groupData.name}" has been successfully created.`,
                    variant: "success"
                  });
                } catch (error) {
                  console.error("Error creating group:", error);
                  toast({
                    title: "Error",
                    description: "Failed to create group. Please try again.",
                    variant: "destructive"
                  });
                }
              }}
              availableUsers={[
                ...conversations.flatMap((c) => {
                  if (c.type === "private") {
                    return c.user;
                  }
                  return [];
                })
              ]}
              currentUser={currentUser}
            />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
