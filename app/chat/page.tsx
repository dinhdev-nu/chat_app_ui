import type { Metadata } from "next"
import ChatInterface from "@/components/chat/chat-interface"
import { SparklesCore } from "@/components/sparkles"

export const metadata: Metadata = {
  title: "Vizify Chat",
  description: "Connect and chat with your community",
}

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-[#1a1b26] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Ambient background with moving particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-40 left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-40 right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-4 py-6 h-screen flex flex-col">
        <ChatInterface />
      </div>
    </main>
  )
}
