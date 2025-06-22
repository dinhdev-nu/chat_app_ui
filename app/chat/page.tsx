// app/chat/page.tsx
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import ImmersiveChatWrapper from "@/app/chat/conversation/page"

export const metadata: Metadata = {
  title: "ChatHub | Immersive Experience",
  description: "Connect and chat with your community in an immersive environment",
}

export default function ChatPage() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-[#1a1b26] antialiased relative">

      {/* Main chat interface */}
        <ImmersiveChatWrapper />

      {/* Toast notifications */}
      <Toaster /> 
    </main>
  )
}
