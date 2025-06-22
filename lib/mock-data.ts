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
    // {
    //   id: "user-3",
    //   name: "Taylor Smith",
    //   avatar: "/placeholder.svg?height=40&width=40",
    //   status: "offline",
    // },
    // {
    //   id: "user-4",
    //   name: "Jordan Lee",
    //   avatar: "/placeholder.svg?height=40&width=40",
    //   status: "online",
    // },
    // {
    //   id: "user-5",
    //   name: "Casey Wilson",
    //   avatar: "/placeholder.svg?height=40&width=40",
    //   status: "offline",
    // },
    // {
    //   id: "user-6",
    //   name: "Riley Brown",
    //   avatar: "/placeholder.svg?height=40&width=40",
    //   status: "online",
    // }
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
        content: messages[i]?.content || "Hello",
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

