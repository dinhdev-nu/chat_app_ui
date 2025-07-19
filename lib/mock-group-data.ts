import type { User, Message, GroupConversation } from "@/types/chat";

export function generateGroupMockData() {
    // Current user
    const currentUser: User = {
        id: "user-1",
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "online",
        role: "member"
    };

    // Group participants
    const participants: User[] = [
        currentUser,
        {
            id: "user-2",
            name: "Alex Chen",
            avatar: "/placeholder.svg?height=40&width=40",
            status: "online",
            role: "admin"
        },
        {
            id: "user-3",
            name: "Sarah Johnson",
            avatar: "/placeholder.svg?height=40&width=40",
            status: "online",
            role: "moderator"
        },
        {
            id: "user-4",
            name: "Mike Rodriguez",
            avatar: "/placeholder.svg?height=40&width=40",
            status: "away",
            role: "member"
        },
        {
            id: "user-5",
            name: "Emma Wilson",
            avatar: "/placeholder.svg?height=40&width=40",
            status: "online",
            role: "member"
        },
        {
            id: "user-6",
            name: "David Kim",
            avatar: "/placeholder.svg?height=40&width=40",
            status: "offline",
            role: "member"
        },
        {
            id: "user-7",
            name: "Lisa Zhang",
            avatar: "/placeholder.svg?height=40&width=40",
            status: "online",
            role: "member"
        }
    ];

    // Generate group conversations
    const groupConversations: GroupConversation[] = [
        {
            id: "group-1",
            name: "Team Alpha",
            description: "Main project discussion group",
            avatar: "/placeholder.svg?height=60&width=60",
            participants: participants.slice(0, 5),
            messages: generateGroupMessages(
                participants.slice(0, 5),
                currentUser,
                25
            ),
            unreadCount: 3,
            type: "group",
            createdBy: participants[1],
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            settings: {
                allowInvites: true,
                muteNotifications: false,
                showReadReceipts: true
            }
        },
        {
            id: "group-2",
            name: "Design Squad",
            description: "Creative minds unite! 🎨",
            avatar: "/placeholder.svg?height=60&width=60",
            participants: [
                participants[0],
                participants[2],
                participants[4],
                participants[6]
            ],
            messages: generateGroupMessages(
                [
                    participants[0],
                    participants[2],
                    participants[4],
                    participants[6]
                ],
                currentUser,
                18
            ),
            unreadCount: 0,
            type: "group",
            createdBy: participants[2],
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            settings: {
                allowInvites: false,
                muteNotifications: false,
                showReadReceipts: true
            }
        },
        {
            id: "group-3",
            name: "Coffee Chat ☕",
            description: "Random discussions and daily check-ins",
            avatar: "/placeholder.svg?height=60&width=60",
            participants: participants,
            messages: generateGroupMessages(participants, currentUser, 35),
            unreadCount: 7,
            type: "group",
            createdBy: participants[4],
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            settings: {
                allowInvites: true,
                muteNotifications: true,
                showReadReceipts: false
            }
        }
    ];

    return { currentUser, groupConversations, allParticipants: participants };
}

function generateGroupMessages(
    participants: User[],
    currentUser: User,
    count: number
): Message[] {
    const messages: Message[] = [];
    const messageTemplates = [
        "Hey everyone! How's the project coming along?",
        "I just finished the wireframes, take a look!",
        "Great work on the presentation today 👏",
        "Can we schedule a meeting for tomorrow?",
        "I'll be working late tonight to finish this",
        "Does anyone have experience with this framework?",
        "The client loved our proposal! 🎉",
        "I'm running a bit late to the meeting",
        "Let's grab lunch together after this",
        "I found a great resource for our research",
        "The deadline has been moved to next week",
        "Thanks for all your hard work team!",
        "I have some concerns about the current approach",
        "Let me know if you need any help",
        "The demo went really well!",
        "I'll send the updated files shortly",
        "Good morning everyone! ☀️",
        "Have a great weekend team!",
        "I'm taking a short break, back in 15",
        "The bug has been fixed and deployed"
    ];

    const systemMessages = [
        "Alex Chen created the group",
        "Sarah Johnson was added to the group",
        "Mike Rodriguez changed the group name",
        "Emma Wilson left the group",
        "David Kim was added by Alex Chen"
    ];

    for (let i = 0; i < count; i++) {
        const timestamp = new Date();
        timestamp.setHours(timestamp.getHours() - (count - i) * 2);
        timestamp.setMinutes(timestamp.getMinutes() - Math.random() * 60);

        // Occasionally add system messages
        if (i % 8 === 0 && i > 0) {
            messages.push({
                id: `msg-${i}-system`,
                content:
                    systemMessages[
                        Math.floor(Math.random() * systemMessages.length)
                    ],
                sender: participants[0], // System messages use first participant as sender
                timestamp,
                type: "system"
            });
            continue;
        }

        const sender =
            participants[Math.floor(Math.random() * participants.length)];
        const isCurrentUser = sender.id === currentUser.id;

        messages.push({
            id: `msg-${i}`,
            content:
                messageTemplates[
                    Math.floor(Math.random() * messageTemplates.length)
                ],
            sender,
            timestamp,
            status: isCurrentUser ? "read" : undefined,
            type: "text",
            reactions:
                Math.random() > 0.7 ? generateRandomReactions(participants) : []
        });
    }

    return messages.sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
}

function generateRandomReactions(participants: User[]): any[] {
    const emojis = ["👍", "❤️", "😂", "😮", "😢", "🎉", "🔥"];
    const reactions = [];
    const numReactions = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numReactions; i++) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const reactingUsers = participants
            .filter(() => Math.random() > 0.6)
            .slice(0, Math.floor(Math.random() * 3) + 1);

        if (reactingUsers.length > 0) {
            reactions.push({
                emoji,
                users: reactingUsers,
                count: reactingUsers.length
            });
        }
    }

    return reactions;
}
