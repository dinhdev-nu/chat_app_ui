"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Search, UserPlus, X, Users } from "lucide-react"

// Mock user data
const suggestedUsers = [
  { id: 1, name: "Alex Johnson", status: "online", avatar: "/placeholder.svg?height=40&width=40", mutualFriends: 3 },
  { id: 2, name: "Jamie Smith", status: "online", avatar: "/placeholder.svg?height=40&width=40", mutualFriends: 5 },
  { id: 3, name: "Casey Wilson", status: "offline", avatar: "/placeholder.svg?height=40&width=40", mutualFriends: 1 },
  { id: 4, name: "Riley Brown", status: "online", avatar: "/placeholder.svg?height=40&width=40", mutualFriends: 2 },
  { id: 5, name: "Morgan Lee", status: "away", avatar: "/placeholder.svg?height=40&width=40", mutualFriends: 4 },
  { id: 6, name: "Jordan Taylor", status: "online", avatar: "/placeholder.svg?height=40&width=40", mutualFriends: 7 },
  { id: 7, name: "Quinn Davis", status: "offline", avatar: "/placeholder.svg?height=40&width=40", mutualFriends: 0 },
]

interface UserDiscoveryProps {
  onClose: () => void
  onAddFriend: (user: any) => void
}

export default function UserDiscovery({ onClose, onAddFriend }: UserDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter users based on search query
  const filteredUsers = searchQuery
    ? suggestedUsers.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : suggestedUsers
  
  return (
    <Card className="w-80 bg-[#1e1f2e]/95 backdrop-blur-md border border-indigo-500/20 shadow-lg overflow-hidden">
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center">
          <Users className="h-4 w-4 text-indigo-400 mr-2" />
          <h3 className="text-white font-medium">Discover People</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-gray-400 hover:text-white">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-3 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-[#1a1b26] border-white/10 text-white"
          />
        </div>
      </div>

      <ScrollArea className="h-80">
        {filteredUsers.length > 0 ? (
          <div className="p-2">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <Avatar className="h-10 w-10">
                      <img src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#1e1f2e] ${
                        user.status === "online"
                          ? "bg-green-500"
                          : user.status === "away"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                      }`}
                    ></span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm truncate">{user.name}</div>
                    <div className="flex items-center text-xs text-gray-400 mt-0.5">
                      {user.mutualFriends > 0 ? (
                        <>
                          <Users className="h-3 w-3 mr-1" />
                          {user.mutualFriends} mutual friend{user.mutualFriends !== 1 && "s"}
                        </>
                      ) : (
                        <span className="text-gray-500">No mutual friends</span>
                      )}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-2 h-8 w-8 p-0 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/20"
                    onClick={() => onAddFriend(user)}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            <Search className="h-12 w-12 mx-auto mb-2 text-gray-500" />
            <h3 className="text-lg font-medium text-white mb-1">No Users Found</h3>
            <p className="text-sm">Try a different search term</p>
          </div>
        )}
      </ScrollArea>
    </Card>
  )
}
