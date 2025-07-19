// components/chat/ImmersiveChatWrapper.tsx
"use client";

import ChanelSidebar from "@/components/chat/chanel-sidebar";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState } from "react";
import DiscordChatInterface from "@/components/discord-chat-interface";

const ImmersiveChatInterface = dynamic(
  () => import("@/components/chat/immersive-chat-interface"),
  {
    ssr: false,
    loading: () => <ChatLoadingState />
  }
);

export default function ImmersiveChatWrapper() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedServer, setSelectedServer] = useState<string>("home");
  return (
    <div className="flex h-full">
      <ChanelSidebar
        isMobile={isMobile}
        selectedServer={selectedServer}
        setSelectedServer={setSelectedServer}
      />
      {selectedServer === "home" ? (
        <ImmersiveChatInterface />
      ) : (
        <DiscordChatInterface />
      )}
    </div>
  );
}

// Loading component có thể giữ trong file này
function ChatLoadingState() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-indigo-400 animate-pulse">
          Loading chat experience...
        </p>
      </div>
    </div>
  );
}
