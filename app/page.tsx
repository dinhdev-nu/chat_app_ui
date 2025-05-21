"use client"

import dynamic from "next/dynamic"
import Hero from "@/components/hero"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { GlowingBackground } from "@/components/glowing-background"

// Dynamically import heavy components to improve initial load time
const SparklesCore = dynamic(() => import("@/components/sparkles").then((mod) => mod.SparklesCore), {
  ssr: false,
})
const ChatInterface = dynamic(() => import("@/components/chat-interface"), {
  ssr: false,
})
const CommunityFeatures = dynamic(() => import("@/components/community-features"), {
  ssr: false,
})
const JoinCommunity = dynamic(() => import("@/components/join-community"), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1a1b26] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Ambient background with moving particles - reduced particle density */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={60} // Reduced from 100 to 50
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />

        {/* Chat Interface Section with Glowing Background */}
        <div className="relative">
          <GlowingBackground color="indigo" position="left" />
          <ChatInterface />
        </div>

        {/* Features Section */}
        <CommunityFeatures />

        {/* Join Community Section with Glowing Background */}
        <div className="relative">
          <GlowingBackground color="purple" position="right" />
          <JoinCommunity />
        </div>

        <Footer />
      </div>
    </main>
  )
}
