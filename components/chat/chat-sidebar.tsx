import React from "react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TooltipRoot,
  TooltipTrigger,
  TooltipContent
} from "@/components/ui/tooltip";
import {
  MessageSquare,
  Users,
  Search,
  Bookmark,
  LogOut,
  Plus,
  Hash
} from "lucide-react";
import { Conversation, User } from "@/types/chat";
import ConversationItem from "./conversation-item";
import { ConversationListSkeleton } from "./skeleton-loaders";
import GroupConversationItem from "./group-conversation-item";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isMobile: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setIsOpenCreateGroupModal: (isOpen: boolean) => void;
  conversations: Conversation[];
  isLoadingConversations: boolean;
  activeConversation: Conversation | null;
  handleConversationChange: (conversation: Conversation) => void;
  currentUser: User;
  toast: any;
  ws: React.RefObject<WebSocket | null>;
}

const ChatSidebar: React.FC<SidebarProps> = ({
  isMobile,
  activeTab,
  setActiveTab,
  setIsOpenCreateGroupModal,
  conversations,
  isLoadingConversations,
  activeConversation,
  handleConversationChange,
  currentUser,
  toast,
  ws
}) => {
  const groupConversations = conversations.filter(
    (conversation) => conversation.type === "group"
  );
  const privateConversations = conversations.filter(
    (conversation) => conversation.type === "private"
  );

  const router = useRouter();

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: "320px", opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`z-10 bg-[#1a1b26]/90 backdrop-blur-md border-r border-white/10 flex flex-col ${
        isMobile ? "absolute inset-y-0 left-0 z-50 w-full" : "relative"
      }`}
    >
      {/* Sidebar tabs */}
      <Tabs
        defaultValue="chats"
        value={activeTab}
        onValueChange={setActiveTab}
        className="h-full flex flex-col"
      >
        <div className="px-2 pt-2">
          <TabsList className="w-full bg-[#1e1f2e]">
            <TabsTrigger
              value="chats"
              className="flex-1 rounded-[6px] data-[state=active]:bg-indigo-500"
            >
              <MessageSquare className="h-4 w-4 mr-2 " />
              Chats
            </TabsTrigger>
            <TabsTrigger
              value="groups"
              className="flex-1 rounded-[6px] data-[state=active]:bg-indigo-500"
            >
              <Users className="h-4 w-4 mr-2" />
              Groups
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="flex-1 rounded-[6px] data-[state=active]:bg-indigo-500"
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Saved
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${activeTab}...`}
              className="pl-9 bg-[#1e1f2e] border-white/10 text-white w-full"
            />
          </div>
          {activeTab === "groups" && (
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-gray-400 hover:text-indigo-500 border-white/10 hover:border-indigo-500 bg-[#1e1f2e]"
                  onClick={() => setIsOpenCreateGroupModal(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Video Call</TooltipContent>
            </TooltipRoot>
          )}
        </div>

        <TabsContent value="chats" className="flex flex-col overflow-auto">
          {isLoadingConversations ? (
            <ConversationListSkeleton count={6} />
          ) : (
            <div className="p-2 space-y-1">
              {activeTab === "chats" && privateConversations.length > 0 ? (
                privateConversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={activeConversation?.id === conversation.id}
                    onClick={() => handleConversationChange(conversation)}
                  />
                ))
              ) : (
                <div className="text-center text-gray-400 p-4">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-500" />
                  <h3 className="text-lg font-medium text-white mb-1">
                    No Conversations Yet
                  </h3>
                  <p className="text-sm">
                    Start chatting with someone or create a group to begin.
                  </p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="groups" className="flex flex-col overflow-auto">
          <div className="p-2 space-y-1">
            {isLoadingConversations ? (
              <ConversationListSkeleton count={6} />
            ) : privateConversations.length > 0 ? (
              groupConversations.map((conversation) => (
                <GroupConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={activeConversation?.id === conversation.id}
                  onClick={() => handleConversationChange(conversation)}
                />
              ))
            ) : (
              <div className="p-4 text-center text-gray-400">
                <Hash className="h-12 w-12 mx-auto mb-2 text-gray-500" />
                <h3 className="text-lg font-medium text-white mb-1">
                  No Groups Yet
                </h3>
                <p className="text-sm mb-4">
                  Create or join a group to start chatting with multiple people
                  at once.
                </p>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => {
                    toast({
                      title: "Create Group",
                      description: "Group creation coming soon!",
                      variant: "info"
                    });
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent
          value="saved"
          className="flex-1 overflow-hidden flex flex-col mt-0"
        >
          <ScrollArea className="p-2 space-y-1">
            <div className="p-4 text-center text-gray-400">
              <Bookmark className="h-12 w-12 mx-auto mb-2 text-gray-500" />
              <h3 className="text-lg font-medium text-white mb-1">
                No Saved Messages
              </h3>
              <p className="text-sm mb-4">
                Bookmark important messages to find them easily later.
              </p>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* User profile */}
        <div className="p-3 border-t border-white/10 bg-[#1e1f2e]/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3 border-2 border-indigo-500/50">
                <img
                  src="/placeholder.svg?height=40&width=40"
                  alt={currentUser?.name}
                />
              </Avatar>
              <div>
                <div className="text-white font-medium">
                  {currentUser?.name}
                </div>
                <div className="text-xs text-gray-400 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                  Online
                </div>
              </div>
            </div>

            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-red-400"
                  onClick={() => {
                    // delete local storage or perform logout action
                    localStorage.clear();
                    ws.current?.close();
                    // redirect to login or login page;
                    router.push("/login");
                  }}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Logout</TooltipContent>
            </TooltipRoot>
          </div>
        </div>
      </Tabs>
    </motion.div>
  );
};

export default React.memo(ChatSidebar);
