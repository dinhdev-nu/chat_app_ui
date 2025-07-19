"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Hash,
  Volume2,
  Settings,
  Plus,
  Smile,
  MessageSquare,
  Bell,
  Users,
  Search,
  MoreHorizontal,
  Mic,
  Headphones,
  Video,
  Gift,
  ImageIcon,
  PlusCircle,
  ChevronDown,
  ChevronRight,
  X,
  Menu,
  Home,
  Compass,
  Download,
  HelpCircle,
  User,
  LogOut,
  Phone,
  Bookmark,
  ThumbsUp,
  Heart,
  Star,
  CheckCheck,
  Send
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DiscordChatInterface() {
  const [selectedServer, setSelectedServer] = useState<string>("harmony");
  const [selectedCategory, setSelectedCategory] = useState<string>("general");
  const [selectedChannel, setSelectedChannel] = useState<string>("welcome");
  const [selectedDM, setSelectedDM] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({
    general: true,
    community: true,
    voice: true
  });
  const [showNewConversationModal, setShowNewConversationModal] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChannel, selectedDM]);

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Handle channel selection
  const handleChannelSelect = (category: string, channel: string) => {
    setSelectedCategory(category);
    setSelectedChannel(channel);
    setSelectedDM(null);
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  // Handle DM selection
  const handleDMSelect = (userName: string) => {
    setSelectedDM(userName);
    setSelectedChannel("");
    setSelectedCategory("");
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  // Handle server selection
  const handleServerSelect = (server: string) => {
    setSelectedServer(server);
    setSelectedCategory("general");
    setSelectedChannel("welcome");
    setSelectedDM(null);
  };

  // Function to open new conversation modal
  const openNewConversation = () => {
    setShowNewConversationModal(true);
  };

  // Function to close new conversation modal
  const closeNewConversation = () => {
    setShowNewConversationModal(false);
    setSearchQuery("");
  };

  // Function to start a new conversation
  const startNewConversation = (userName: string) => {
    setSelectedDM(userName);
    setSelectedChannel("");
    setSelectedCategory("");
    closeNewConversation();
  };

  // Handle message submission
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // In a real app, you would send the message to the server here
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <TooltipProvider>
      <div className="h-screen w-full bg-[#1e1f2e] flex overflow-hidden">
        {/* Channels sidebar */}
        <div
          className={`w-60 bg-[#2d2f3e] flex-shrink-0 flex flex-col border-r border-black/20 ${
            isMobile
              ? isMobileSidebarOpen
                ? "fixed inset-0 z-40"
                : "hidden"
              : "flex"
          }`}
        >
          {/* Server header */}
          <div className="h-12 px-4 border-b border-black/20 flex items-center justify-between shadow-sm">
            <h2 className="font-semibold text-white truncate">
              {selectedServer === "harmony"
                ? "HarmonyHub"
                : selectedServer === "developers"
                ? "Developers"
                : selectedServer === "gaming"
                ? "Gaming"
                : selectedServer === "design"
                ? "Art & Design"
                : "Home"}
            </h2>
            {isMobile && (
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <ScrollArea className="flex-1">
            {/* Direct Messages section (only show on Home) */}
            {selectedServer === "home" && (
              <div className="px-2 py-4">
                <div className="px-2 mb-1 flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase">
                    Direct Messages
                  </h3>
                  <button
                    onClick={openNewConversation}
                    className="text-gray-400 hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-0.5">
                  <DirectMessageItem
                    name="Taylor"
                    status="online"
                    unread={true}
                    active={selectedDM === "Taylor"}
                    onClick={() => handleDMSelect("Taylor")}
                  />
                  <DirectMessageItem
                    name="Jordan"
                    status="online"
                    unread={false}
                    active={selectedDM === "Jordan"}
                    onClick={() => handleDMSelect("Jordan")}
                  />
                  <DirectMessageItem
                    name="Alex"
                    status="idle"
                    unread={false}
                    active={selectedDM === "Alex"}
                    onClick={() => handleDMSelect("Alex")}
                  />
                  <DirectMessageItem
                    name="Sam"
                    status="offline"
                    unread={false}
                    active={selectedDM === "Sam"}
                    onClick={() => handleDMSelect("Sam")}
                  />
                </div>
              </div>
            )}

            {/* Channels (only show on servers) */}
            {selectedServer !== "home" && (
              <div className="px-2 py-4">
                {/* General category */}
                <div className="mb-2">
                  <button
                    onClick={() => toggleCategory("general")}
                    className="px-1 mb-1 w-full flex items-center justify-between text-xs font-semibold text-gray-400 uppercase hover:text-gray-300"
                  >
                    <div className="flex items-center">
                      {expandedCategories["general"] ? (
                        <ChevronDown className="h-3 w-3 mr-1" />
                      ) : (
                        <ChevronRight className="h-3 w-3 mr-1" />
                      )}
                      <span>General</span>
                    </div>
                  </button>

                  {expandedCategories["general"] && (
                    <div className="space-y-0.5 ml-1">
                      <ChannelItem
                        icon={<Hash />}
                        name="welcome"
                        active={
                          selectedCategory === "general" &&
                          selectedChannel === "welcome"
                        }
                        unread={false}
                        onClick={() =>
                          handleChannelSelect("general", "welcome")
                        }
                      />
                      <ChannelItem
                        icon={<Hash />}
                        name="general"
                        active={
                          selectedCategory === "general" &&
                          selectedChannel === "general"
                        }
                        unread={true}
                        onClick={() =>
                          handleChannelSelect("general", "general")
                        }
                      />
                      <ChannelItem
                        icon={<Hash />}
                        name="introductions"
                        active={
                          selectedCategory === "general" &&
                          selectedChannel === "introductions"
                        }
                        unread={false}
                        onClick={() =>
                          handleChannelSelect("general", "introductions")
                        }
                      />
                    </div>
                  )}
                </div>

                {/* Community category */}
                <div className="mb-2">
                  <button
                    onClick={() => toggleCategory("community")}
                    className="px-1 mb-1 w-full flex items-center justify-between text-xs font-semibold text-gray-400 uppercase hover:text-gray-300"
                  >
                    <div className="flex items-center">
                      {expandedCategories["community"] ? (
                        <ChevronDown className="h-3 w-3 mr-1" />
                      ) : (
                        <ChevronRight className="h-3 w-3 mr-1" />
                      )}
                      <span>Community</span>
                    </div>
                  </button>

                  {expandedCategories["community"] && (
                    <div className="space-y-0.5 ml-1">
                      <ChannelItem
                        icon={<Hash />}
                        name="resources"
                        active={
                          selectedCategory === "community" &&
                          selectedChannel === "resources"
                        }
                        unread={false}
                        onClick={() =>
                          handleChannelSelect("community", "resources")
                        }
                      />
                      <ChannelItem
                        icon={<Hash />}
                        name="showcase"
                        active={
                          selectedCategory === "community" &&
                          selectedChannel === "showcase"
                        }
                        unread={false}
                        onClick={() =>
                          handleChannelSelect("community", "showcase")
                        }
                      />
                      <ChannelItem
                        icon={<Hash />}
                        name="feedback"
                        active={
                          selectedCategory === "community" &&
                          selectedChannel === "feedback"
                        }
                        unread={false}
                        onClick={() =>
                          handleChannelSelect("community", "feedback")
                        }
                      />
                    </div>
                  )}
                </div>

                {/* Voice category */}
                <div className="mb-2">
                  <button
                    onClick={() => toggleCategory("voice")}
                    className="px-1 mb-1 w-full flex items-center justify-between text-xs font-semibold text-gray-400 uppercase hover:text-gray-300"
                  >
                    <div className="flex items-center">
                      {expandedCategories["voice"] ? (
                        <ChevronDown className="h-3 w-3 mr-1" />
                      ) : (
                        <ChevronRight className="h-3 w-3 mr-1" />
                      )}
                      <span>Voice</span>
                    </div>
                  </button>

                  {expandedCategories["voice"] && (
                    <div className="space-y-0.5 ml-1">
                      <ChannelItem
                        icon={<Volume2 />}
                        name="General Voice"
                        active={
                          selectedCategory === "voice" &&
                          selectedChannel === "General Voice"
                        }
                        unread={false}
                        onClick={() =>
                          handleChannelSelect("voice", "General Voice")
                        }
                      />
                      <ChannelItem
                        icon={<Volume2 />}
                        name="Chill Lounge"
                        active={
                          selectedCategory === "voice" &&
                          selectedChannel === "Chill Lounge"
                        }
                        unread={false}
                        onClick={() =>
                          handleChannelSelect("voice", "Chill Lounge")
                        }
                      />
                      <ChannelItem
                        icon={<Volume2 />}
                        name="Gaming"
                        active={
                          selectedCategory === "voice" &&
                          selectedChannel === "Gaming"
                        }
                        unread={false}
                        onClick={() => handleChannelSelect("voice", "Gaming")}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </ScrollArea>

          {/* User controls */}
          <div className="h-14 px-2 bg-[#232533] flex items-center justify-between relative">
            <div
              className="flex items-center flex-1 p-1 rounded hover:bg-black/20 cursor-pointer"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <Avatar className="h-8 w-8 mr-2">
                <img src="/placeholder.svg?height=32&width=32" alt="User" />
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white font-medium truncate">
                  Username
                </div>
                <div className="text-xs text-green-400 truncate">Online</div>
              </div>
            </div>

            <div className="flex space-x-1">
              <button className="w-8 h-8 rounded-[6px] flex items-center justify-center text-gray-400 hover:text-white hover:bg-black/20">
                <Mic className="h-5 w-5" />
              </button>
              <button className="w-8 h-8 rounded-[6px] flex items-center justify-center text-gray-400 hover:text-white hover:bg-black/20">
                <Headphones className="h-5 w-5" />
              </button>
              <button className="w-8 h-8 rounded-[6px] flex items-center justify-center text-gray-400 hover:text-white hover:bg-black/20">
                <Settings className="h-5 w-5" />
              </button>
            </div>

            {/* User menu dropdown */}
            {isUserMenuOpen && (
              <div className="absolute bottom-16 left-2 w-[calc(100%-16px)] bg-[#1a1b26] rounded-[6px] shadow-lg border border-black/20 overflow-hidden z-50">
                <div className="p-2 border-b border-black/20">
                  <div className="flex items-center p-2 rounded hover:bg-indigo-500/20 cursor-pointer">
                    <User className="h-5 w-5 mr-2 text-gray-400" />
                    <span className="text-white text-sm">Profile</span>
                  </div>
                  <div className="flex items-center p-2 rounded hover:bg-indigo-500/20 cursor-pointer">
                    <Settings className="h-5 w-5 mr-2 text-gray-400" />
                    <span className="text-white text-sm">Settings</span>
                  </div>
                </div>
                <div className="p-2">
                  <div className="flex items-center p-2 rounded hover:bg-red-500/20 cursor-pointer">
                    <LogOut className="h-5 w-5 mr-2 text-red-400" />
                    <span className="text-red-400 text-sm">Log Out</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Channel header */}
          <div className="h-12 px-4 bg-[#2d2f3e] border-b border-black/20 flex items-center justify-between shadow-sm">
            {isMobile && (
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="mr-2 text-gray-400 hover:text-white"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}

            {selectedChannel && (
              <>
                <div className="flex items-center">
                  {selectedCategory === "voice" ? (
                    <Volume2 className="h-5 w-5 text-gray-400 mr-2" />
                  ) : (
                    <Hash className="h-5 w-5 text-gray-400 mr-2" />
                  )}
                  <span className="text-white font-medium">
                    {selectedChannel}
                  </span>
                </div>
              </>
            )}

            {selectedDM && (
              <div className="flex items-center">
                <div className="relative mr-2">
                  <Avatar className="h-6 w-6">
                    <img
                      src="/placeholder.svg?height=24&width=24"
                      alt={selectedDM}
                    />
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-[#2d2f3e]"></span>
                </div>
                <span className="text-white font-medium">{selectedDM}</span>
              </div>
            )}

            <div className="flex items-center space-x-2">
              {selectedDM && (
                <>
                  <button className="w-8 h-8 rounded-[6px] flex items-center justify-center text-gray-400 hover:text-white hover:bg-black/20">
                    <Phone className="h-5 w-5" />
                  </button>
                  <button className="w-8 h-8 rounded-[6px] flex items-center justify-center text-gray-400 hover:text-white hover:bg-black/20">
                    <Video className="h-5 w-5" />
                  </button>
                </>
              )}
              <button className="w-8 h-8 rounded-[6px] flex items-center justify-center text-gray-400 hover:text-white hover:bg-black/20">
                <Bell className="h-5 w-5" />
              </button>
              <button className="w-8 h-8 rounded-[6px] flex items-center justify-center text-gray-400 hover:text-white hover:bg-black/20">
                <Users className="h-5 w-5" />
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="h-6 w-36 bg-black/20 border-none rounded text-sm px-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              </div>
              <button className="w-8 h-8 rounded-[6px] flex items-center justify-center text-gray-400 hover:text-white hover:bg-black/20">
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <ScrollArea className="flex-1 px-4 py-4">
            <SystemMessage message="Today, May 10" />

            <ChatMessage
              avatar="/placeholder.svg?height=40&width=40"
              username="HarmonyBot"
              time="10:00 AM"
              message="👋 Welcome to the HarmonyHub community! This is where you can connect with other members, share ideas, and collaborate on projects."
              isBot
              isPinned
            />

            <ChatMessage
              avatar="/placeholder.svg?height=40&width=40"
              username="Alex"
              time="10:05 AM"
              message="Hello everyone! I'm excited to be here. Looking forward to connecting with all of you."
              reactions={[
                { emoji: "👋", count: 3 },
                { emoji: "😊", count: 2 }
              ]}
            />

            <ChatMessage
              avatar="/placeholder.svg?height=40&width=40"
              username="Taylor"
              time="10:07 AM"
              message="Welcome Alex! What brings you to our community?"
              reactions={[{ emoji: "❤️", count: 1 }]}
            />

            <ChatMessage
              avatar="/placeholder.svg?height=40&width=40"
              username="Alex"
              time="10:10 AM"
              message="I'm interested in web development and looking for a community to learn and grow with. Anyone working on interesting projects?"
            />

            <ChatMessage
              avatar="/placeholder.svg?height=40&width=40"
              username="Jordan"
              time="10:12 AM"
              message="I'm currently working on a React project. Would love to collaborate if you're interested!"
              hasAttachment
              attachmentType="image"
            />

            <ChatMessage
              avatar="/placeholder.svg?height=40&width=40"
              username="Taylor"
              time="10:15 AM"
              message="That sounds great! I've been working with React for about a year now. Maybe we could set up a time to chat about your project?"
              isDelivered
            />

            <TypingIndicator username="Jordan" />

            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Message input */}
          <div className="px-4 pb-6 pt-2">
            <form onSubmit={handleSendMessage} className="relative">
              <div className="relative rounded-lg overflow-hidden bg-[#383a4a] shadow-inner border border-[#232533] transition-all focus-within:border-indigo-500/50 focus-within:shadow-[0_0_8px_rgba(79,70,229,0.3)]">
                <button
                  type="button"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors p-1.5 rounded-full hover:bg-black/20"
                >
                  <PlusCircle className="h-5 w-5" />
                </button>

                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Message ${
                    selectedChannel ? `#${selectedChannel}` : selectedDM
                  }`}
                  className="w-full bg-transparent pl-12 pr-36 py-3.5 text-white placeholder-gray-400 focus:outline-none border-none"
                />

                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1.5">
                  <Tooltip content="Add GIF">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-indigo-400 transition-colors p-1.5 rounded-full hover:bg-black/20"
                    >
                      <Gift className="h-5 w-5" />
                    </button>
                  </Tooltip>

                  <Tooltip content="Attach File">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-indigo-400 transition-colors p-1.5 rounded-full hover:bg-black/20"
                    >
                      <ImageIcon className="h-5 w-5" />
                    </button>
                  </Tooltip>

                  <Tooltip content="Emoji">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-indigo-400 transition-colors p-1.5 rounded-full hover:bg-black/20"
                    >
                      <Smile className="h-5 w-5" />
                    </button>
                  </Tooltip>

                  {message.trim() && (
                    <button
                      type="submit"
                      className="ml-1 bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-full transition-all transform hover:scale-105 active:scale-95"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-2 px-2 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <kbd className="px-1.5 py-0.5 bg-[#232533] rounded text-gray-400 mr-1.5">
                    Enter
                  </kbd>
                  <span>to send</span>
                </div>
                <div>
                  <button className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">
                    Upload files
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Members sidebar */}
        <div className="w-60 bg-[#2d2f3e] flex-shrink-0 border-l border-black/20 hidden lg:block">
          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
                Online — 4
              </h3>
              <div className="space-y-2">
                <MemberItem name="HarmonyBot" status="Bot" isBot />
                <MemberItem
                  name="Alex"
                  status="Online"
                  activity="Web Development"
                />
                <MemberItem
                  name="Taylor"
                  status="Online"
                  activity="React Developer"
                />
                <MemberItem
                  name="Jordan"
                  status="Idle"
                  activity="Working on a project"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
                Offline — 2
              </h3>
              <div className="space-y-2">
                <MemberItem name="Sam" status="Offline" isOffline />
                <MemberItem name="Riley" status="Offline" isOffline />
              </div>
            </div>
          </div>
        </div>

        {/* New Conversation Modal */}
        {showNewConversationModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-[#2d2f3e] rounded-[6px] border border-black/20 w-full max-w-md overflow-hidden shadow-lg">
              <div className="p-4 border-b border-black/20 flex items-center justify-between">
                <h3 className="text-white font-medium">New Conversation</h3>
                <button
                  onClick={closeNewConversation}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search for friends..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-[#1a1b26] border-black/20 text-white focus:border-indigo-500 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <ScrollArea className="max-h-60">
                  <div className="space-y-1">
                    <FriendItem
                      name="Morgan"
                      status="online"
                      onClick={() => startNewConversation("Morgan")}
                    />
                    <FriendItem
                      name="Casey"
                      status="online"
                      onClick={() => startNewConversation("Casey")}
                    />
                    <FriendItem
                      name="Riley"
                      status="idle"
                      onClick={() => startNewConversation("Riley")}
                    />
                    <FriendItem
                      name="Quinn"
                      status="offline"
                      onClick={() => startNewConversation("Quinn")}
                    />
                    <FriendItem
                      name="Jamie"
                      status="online"
                      onClick={() => startNewConversation("Jamie")}
                    />
                  </div>
                </ScrollArea>
              </div>

              <div className="p-4 border-t border-black/20 bg-[#232533] flex justify-between">
                <Button
                  onClick={() => {
                    // Open group creation UI
                  }}
                  variant="outline"
                  className="border-black/20 text-white hover:bg-indigo-500 hover:text-white"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Create Group
                </Button>

                <Button
                  onClick={closeNewConversation}
                  variant="outline"
                  className="border-black/20 text-white hover:bg-black/20"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

function ChannelItem({
  icon,
  name,
  active = false,
  unread = false,
  onClick
}: {
  icon: React.ReactNode;
  name: string;
  active?: boolean;
  unread?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between px-2 py-1 rounded hover:bg-[#393b4d] cursor-pointer transition-colors ${
        active
          ? "bg-[#393b4d] text-white"
          : unread
          ? "text-white"
          : "text-gray-400"
      }`}
    >
      <div className="flex items-center">
        <div
          className={`mr-1.5 ${
            active ? "text-white" : unread ? "text-white" : "text-gray-400"
          }`}
        >
          {icon}
        </div>
        <div className="text-sm">{name}</div>
      </div>
      {unread && <div className="w-2 h-2 rounded-full bg-white"></div>}
      {!unread && (
        <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
          <button className="text-gray-400 hover:text-white">
            <Users className="h-3.5 w-3.5" />
          </button>
          <button className="text-gray-400 hover:text-white">
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function DirectMessageItem({
  name,
  status,
  unread = false,
  active = false,
  onClick
}: {
  name: string;
  status: "online" | "idle" | "offline";
  unread?: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between px-2 py-1 rounded hover:bg-[#393b4d] cursor-pointer transition-colors ${
        active
          ? "bg-[#393b4d] text-white"
          : unread
          ? "text-white"
          : "text-gray-400"
      }`}
    >
      <div className="flex items-center">
        <div className="relative mr-2">
          <Avatar className="h-8 w-8">
            <img src="/placeholder.svg?height=32&width=32" alt={name} />
          </Avatar>
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2d2f3e] ${
              status === "online"
                ? "bg-green-500"
                : status === "idle"
                ? "bg-yellow-500"
                : "bg-gray-500"
            }`}
          ></span>
        </div>
        <div className="text-sm">{name}</div>
      </div>
      {unread && <div className="w-2 h-2 rounded-full bg-white"></div>}
      {!unread && (
        <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
          <button className="text-gray-400 hover:text-white">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function MemberItem({
  name,
  status,
  activity,
  isBot = false,
  isOffline = false
}: {
  name: string;
  status: string;
  activity?: string;
  isBot?: boolean;
  isOffline?: boolean;
}) {
  return (
    <div className="flex items-center px-2 py-1 rounded hover:bg-[#393b4d] cursor-pointer transition-colors group">
      <div className="relative mr-2">
        <Avatar className={`h-8 w-8 ${isBot ? "ring-1 ring-indigo-500" : ""}`}>
          <img src="/placeholder.svg?height=32&width=32" alt={name} />
        </Avatar>
        {!isOffline && (
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2d2f3e] ${
              status === "Idle" ? "bg-yellow-500" : "bg-green-500"
            }`}
          ></span>
        )}
      </div>
      <div>
        <div
          className={`text-sm ${isOffline ? "text-gray-500" : "text-white"}`}
        >
          {name}
        </div>
        {isBot ? (
          <Badge
            variant="secondary"
            className="text-xs bg-indigo-500 text-white"
          >
            BOT
          </Badge>
        ) : (
          activity && <div className="text-xs text-gray-400">{activity}</div>
        )}
      </div>
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="text-gray-500 hover:text-white">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SystemMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="h-px w-full bg-[#393b4d]"></div>
      <div className="px-3 text-xs text-gray-500 whitespace-nowrap">
        {message}
      </div>
      <div className="h-px w-full bg-[#393b4d]"></div>
    </div>
  );
}

function ChatMessage({
  avatar,
  username,
  time,
  message,
  isBot = false,
  isPinned = false,
  reactions = [],
  hasAttachment = false,
  attachmentType = "",
  isDelivered = false
}: {
  avatar: string;
  username: string;
  time: string;
  message: string;
  isBot?: boolean;
  isPinned?: boolean;
  reactions?: { emoji: string; count: number }[];
  hasAttachment?: boolean;
  attachmentType?: string;
  isDelivered?: boolean;
}) {
  return (
    <div className="group hover:bg-[#32344a] rounded px-2 py-1.5 -mx-2 transition-colors mb-4">
      <div className="flex">
        <Avatar
          className={`h-10 w-10 mr-3 mt-0.5 ${
            isBot ? "ring-1 ring-indigo-500" : ""
          }`}
        >
          <img src={avatar || "/placeholder.svg"} alt={username} />
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <span
              className={`font-medium ${
                isBot ? "text-indigo-400" : "text-white"
              }`}
            >
              {username}
            </span>
            <span className="ml-2 text-xs text-gray-500">{time}</span>
            {isPinned && (
              <span className="ml-2 text-xs bg-[#393b4d] text-gray-300 px-1.5 py-0.5 rounded flex items-center">
                <Bookmark className="h-3 w-3 mr-1" />
                Pinned
              </span>
            )}
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
              <button className="text-gray-500 hover:text-white">
                <ThumbsUp className="h-4 w-4" />
              </button>
              <button className="text-gray-500 hover:text-white">
                <Heart className="h-4 w-4" />
              </button>
              <button className="text-gray-500 hover:text-white">
                <Star className="h-4 w-4" />
              </button>
              <button className="text-gray-500 hover:text-white">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="text-gray-300 mt-1">{message}</div>

          {hasAttachment && (
            <div className="mt-2 max-w-sm">
              {attachmentType === "image" && (
                <div className="relative rounded-[6px] overflow-hidden border border-black/20 hover:border-indigo-500/50 transition-colors cursor-pointer group/image">
                  <img
                    src="/placeholder.svg?height=200&width=350"
                    alt="Attachment"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-[6px] text-sm transition-colors">
                      View Full Size
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {reactions.length > 0 && (
            <div className="flex mt-2 space-x-2">
              {reactions.map((reaction, index) => (
                <div
                  key={index}
                  className="flex items-center bg-[#393b4d] hover:bg-indigo-500/20 px-2 py-0.5 rounded-full cursor-pointer transition-colors"
                >
                  <span className="mr-1">{reaction.emoji}</span>
                  <span className="text-xs text-gray-400">
                    {reaction.count}
                  </span>
                </div>
              ))}
            </div>
          )}

          {isDelivered && (
            <div className="flex items-center mt-1">
              <CheckCheck className="h-3 w-3 text-indigo-400 mr-1" />
              <span className="text-xs text-gray-500">Delivered</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator({ username }: { username: string }) {
  return (
    <div className="flex items-center px-2 py-1">
      <Avatar className="h-8 w-8 mr-2">
        <img src="/placeholder.svg?height=32&width=32" alt={username} />
      </Avatar>
      <div className="text-sm text-gray-400">
        <span className="font-medium text-white">{username}</span> is typing
        <span className="ml-1 inline-flex">
          <span
            className="w-1 h-1 bg-gray-400 rounded-full mx-0.5 animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-1 h-1 bg-gray-400 rounded-full mx-0.5 animate-bounce"
            style={{ animationDelay: "200ms" }}
          />
          <span
            className="w-1 h-1 bg-gray-400 rounded-full mx-0.5 animate-bounce"
            style={{ animationDelay: "400ms" }}
          />
        </span>
      </div>
    </div>
  );
}

function FriendItem({
  name,
  status,
  onClick
}: {
  name: string;
  status: "online" | "idle" | "offline";
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center px-3 py-2 rounded hover:bg-[#393b4d] cursor-pointer transition-colors"
    >
      <Avatar className="h-8 w-8 mr-3">
        <img src="/placeholder.svg?height=32&width=32" alt={name} />
      </Avatar>
      <div className="flex-1">
        <div className="text-sm text-white">{name}</div>
        <div className="text-xs text-gray-400">
          {status === "online"
            ? "Online"
            : status === "idle"
            ? "Idle"
            : "Offline"}
        </div>
      </div>
      <div
        className={`w-2 h-2 rounded-full ${
          status === "online"
            ? "bg-green-500"
            : status === "idle"
            ? "bg-yellow-500"
            : "bg-gray-500"
        }`}
      ></div>
    </div>
  );
}

// Additional icons needed
function Code(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  );
}

function Gamepad2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="6" y1="11" x2="10" y2="11"></line>
      <line x1="8" y1="9" x2="8" y2="13"></line>
      <line x1="15" y1="12" x2="15.01" y2="12"></line>
      <line x1="18" y1="10" x2="18.01" y2="10"></line>
      <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.152A4 4 0 0 0 17.32 5z"></path>
    </svg>
  );
}

function Palette(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13.5" cy="6.5" r=".5"></circle>
      <circle cx="17.5" cy="10.5" r=".5"></circle>
      <circle cx="8.5" cy="7.5" r=".5"></circle>
      <circle cx="6.5" cy="12.5" r=".5"></circle>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
    </svg>
  );
}
