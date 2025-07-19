import {
    Conversation,
    Message,
    MessageGroupResponse,
    MessagePrivateResponse,
    User
} from "@/types/chat";
import { fetchGetMessages } from "../api/chat";

type Type = "new" | "loadMore";

export default async function getMessages(
    conversation: Conversation,
    currentUser: User,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
    page: number = 1,
    offset: number = 0,
    type?: Type
) {
    const messages = await fetchGetMessages(conversation.id, page, offset);
    if (messages.messages_group === null && messages.messages_direct === null) {
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

    // Cập nhật messages
    const updated = {
        ...conversation,
        messages: [...newMessages, ...(conversation.messages || [])],
        unreadCount: 0
    };
    type === "new"
        ? setMessages(newMessages)
        : setMessages((prev) => [...newMessages, ...prev]);
    setConversations((prev) =>
        prev.map((c) => (c.id === conversation.id ? updated : c))
    );

    return newMessages.length < 20 ? true : false;
}
