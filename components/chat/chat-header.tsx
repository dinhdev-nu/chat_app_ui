"use client";

import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  TooltipRoot,
  TooltipTrigger,
  TooltipContent
} from "@/components/ui/tooltip";
import {
  Info,
  Menu,
  Search,
  Users,
  VolumeX,
  X,
  Video,
  Phone,
  MoreHorizontal
} from "lucide-react";
import { ChatHeaderSkeleton } from "@/components/chat/skeleton-loaders";
import {
  Conversation,
  GroupConversation,
  PrivateConversation
} from "@/types/chat";

type ChatHeaderProps = {
  activeConversation: Conversation;
  isLoadingMessages: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen: boolean;
  isMobile: boolean;
};

const AvatarWithStatus = ({
  avatar,
  name,
  isOnline
}: {
  avatar: string;
  name: string;
  isOnline: boolean;
}) => (
  <div className="relative mr-3">
    <Avatar className="h-10 w-10 border-2 border-indigo-500/50">
      <img src={avatar} alt={name} />
    </Avatar>
    <span
      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1e1f2e] ${
        isOnline ? "bg-green-500" : "bg-gray-500"
      }`}
    />
  </div>
);

const PrivateHeaderInfo = ({ user }: { user: PrivateConversation["user"] }) => (
  <div className="flex-1 min-w-0">
    <h2 className="text-white font-medium">{user.name}</h2>
    <p className="text-xs text-gray-400">
      {user.status === "online"
        ? "Online"
        : user.status === "away"
        ? "Away"
        : "Offline"}
    </p>
  </div>
);

const GroupHeaderInfo = ({
  name,
  participants
}: {
  name: string;
  participants: GroupConversation["participants"];
}) => {
  const onlineCount = participants.filter((p) => p.status === "online").length;
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center">
        <h2 className="text-white font-semibold text-lg truncate mr-2">
          {name}
        </h2>
      </div>
      <div className="flex items-center text-sm text-gray-400">
        <Users className="h-3 w-3 mr-1" />
        <span className="truncate">
          {participants.length} members, {onlineCount} online
        </span>
      </div>
    </div>
  );
};

const HeaderActions = ({ type }: { type: Conversation["type"] }) => (
  <div className="flex gap-1 items-center space-x-1">
    {type === "group" && (
      <>
        <TooltipRoot>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
            >
              <Users className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Show Participants</TooltipContent>
        </TooltipRoot>

        <TooltipRoot>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-indigo-400"
            >
              <Search className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Find Message</TooltipContent>
        </TooltipRoot>

        <TooltipRoot>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-indigo-400"
            >
              <Info className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Info</TooltipContent>
        </TooltipRoot>
      </>
    )}

    <TooltipRoot>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-indigo-400"
        >
          <Phone className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Voice Call</TooltipContent>
    </TooltipRoot>

    <TooltipRoot>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-indigo-400"
        >
          <Video className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Video Call</TooltipContent>
    </TooltipRoot>

    <TooltipRoot>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-indigo-400"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">More Options</TooltipContent>
    </TooltipRoot>
  </div>
);

export default function ChatHeader({
  activeConversation,
  isLoadingMessages,
  setIsSidebarOpen,
  isSidebarOpen,
  isMobile
}: ChatHeaderProps) {
  if (isLoadingMessages) {
    return (
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-4 z-10">
        <ChatHeaderSkeleton />
      </div>
    );
  }

  const isPrivate = activeConversation.type === "private";
  const avatar = isPrivate
    ? activeConversation.user.avatar || "/placeholder.svg?height=40&width=40"
    : activeConversation.avatar || "/placeholder.svg?height=40&width=40";

  const name = isPrivate
    ? activeConversation.user.name
    : activeConversation.name;

  const isOnline = isPrivate
    ? activeConversation.user.status === "online"
    : activeConversation.participants.filter((p) => p.status === "online")
        .length > 1;

  return (
    <div className="h-16 border-b border-white/10 flex items-center justify-between px-4 z-10">
      <div className="flex items-center flex-1 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="mr-4 text-gray-400 hover:text-white"
        >
          {isSidebarOpen || !isMobile ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
        <AvatarWithStatus avatar={avatar} name={name} isOnline={isOnline} />
        {isPrivate ? (
          <PrivateHeaderInfo user={activeConversation.user} />
        ) : (
          <GroupHeaderInfo
            name={activeConversation.name}
            participants={activeConversation.participants}
          />
        )}
      </div>
      <HeaderActions type={activeConversation.type} />
    </div>
  );
}
