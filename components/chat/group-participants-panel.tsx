"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GroupConversation, User } from "@/types/chat";
import {
  X,
  Search,
  UserPlus,
  Crown,
  Shield,
  MoreHorizontal,
  Circle,
  MessageSquare
} from "lucide-react";

interface GroupParticipantsPanelProps {
  conversation: GroupConversation;
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
}

export default function GroupParticipantsPanel({
  conversation,
  currentUser,
  isOpen,
  onClose
}: GroupParticipantsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredParticipants = conversation.participants.filter((participant) =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-3 w-3 text-yellow-500" />;
      case "moderator":
        return <Shield className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-[#1a1b26]/95 to-[#1e1f2e]/95 backdrop-blur-xl border-l border-indigo-500/20 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold text-lg">
                  Group Members
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 text-gray-400 hover:text-white rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                <span>{conversation.participants.length} members</span>
                <span>
                  {
                    conversation.participants.filter(
                      (p) => p.status === "online"
                    ).length
                  }{" "}
                  online
                </span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-black/30 border-white/10 text-white focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
            </div>

            {/* Add Member Button */}
            <div className="p-4 border-b border-white/10">
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Members
              </Button>
            </div>

            {/* Members List */}
            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {filteredParticipants.map((participant, index) => (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedUser(participant)}
                  >
                    <div className="flex items-center">
                      <div className="relative mr-3">
                        <Avatar className="h-10 w-10">
                          <img
                            src={participant.avatar || "/placeholder.svg"}
                            alt={participant.name}
                          />
                        </Avatar>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1a1b26] ${getStatusColor(
                            participant.status
                          )}`}
                        ></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <span className="text-white font-medium truncate">
                            {participant.name}
                            {participant.id === currentUser.id && " (You)"}
                          </span>
                          {getRoleIcon(participant.role)}
                        </div>
                        <div className="flex items-center text-xs text-gray-400">
                          <Circle
                            className={`h-2 w-2 mr-1 ${getStatusColor(
                              participant.status
                            ).replace("bg-", "text-")}`}
                            fill="currentColor"
                          />
                          {participant.status === "online"
                            ? "Online"
                            : participant.status === "away"
                            ? "Away"
                            : "Offline"}
                          {participant.typing && (
                            <span className="ml-2 text-indigo-400">
                              typing...
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-indigo-400"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-indigo-400"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Group Info */}
            <div className="p-4 border-t border-white/10 bg-gradient-to-r from-black/20 to-black/30">
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">Created by</div>
                <div className="flex items-center justify-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <img
                      src={conversation.createdBy.avatar || "/placeholder.svg"}
                      alt={conversation.createdBy.name}
                    />
                  </Avatar>
                  <span className="text-sm text-white">
                    {conversation.createdBy.name}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(conversation.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
