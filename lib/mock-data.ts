import type { User, Message, Conversation } from "@/types/chat"

export function generateMockData() {
  // Current user
  const currentUser: User = {
    id: "user-1",
    name: "You",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  }

  // Other users
  const users: User[] = [
    {
      id: "user-2",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
    },
    {
      id: "user-3",
      name: "Taylor Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
    },
    {
      id: "user-4",
      name: "Jordan Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
    },
    {
      id: "user-5",
      name: "Casey Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
    },
    {
      id: "user-6",
      name: "Riley Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
    },
    {
      id: "user-6",
      name: "Riley Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
    },
    {
      id: "user-6",
      name: "Riley Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
    },
    {
      id: "user-6",
      name: "Riley Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
    },
    {
      id: "user-6",
      name: "Riley Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
    },
    {
      id: "user-6",
      name: "Riley Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
    },
    
  ]

  // Generate conversations
  const conversations: Conversation[] = users.map((user, index) => {
    // Generate messages
    const messages: Message[] = []
    const messageCount = Math.floor(Math.random() * 10) + 5

    for (let i = 0; i < messageCount; i++) {
      const isCurrentUser = i % 2 === 0
      const timestamp = new Date()
      timestamp.setHours(timestamp.getHours() - (messageCount - i))

      messages.push({
        id: `msg-${index}-${i}`,
        content: getRandomMessage(isCurrentUser),
        sender: isCurrentUser ? currentUser : user,
        timestamp,
        status: isCurrentUser ? "read" : undefined,
      })
    }

    return {
      id: `conv-${index}`,
      user,
      messages,
      lastMessage: messages[messages.length - 1],
      unreadCount: index === 0 ? 0 : Math.floor(Math.random() * 5),
    }
  })

  return { currentUser, conversations }
}

function getRandomMessage(isCurrentUser: boolean): string {
  const currentUserMessages = [
    "Hey, how are you doing?",
    "Can we meet tomorrow to discuss the project?",
    "I've sent you the files you requested.",
    "What do you think about the new design?",
    "Are you available for a call later today?",
    "Just checking in to see how things are going.",
    "Have you had a chance to review the documents?",
    "Let me know when you're free to chat.",
  ]

  const otherUserMessages = [
    "I'm doing well, thanks for asking!",
    "Sure, what time works for you?",
    "Got them, thanks! I'll take a look.",
    "I think it looks great! Just a few minor tweaks needed.",
    "Yes, I'm free after 3 PM.",
    "Things are going well! Making good progress.",
    "Yes, I've reviewed them. Everything looks good.",
    "I should be free in about an hour.",
  ]

  const messages = isCurrentUser ? currentUserMessages : otherUserMessages
  return messages[Math.floor(Math.random() * messages.length)]
}
