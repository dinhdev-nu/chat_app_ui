"use client";

import dynamic from "next/dynamic";
import { GlowingBackground } from "@/components/glowing-background";

// Dynamically import heavy components with loading states
const SparklesCore = dynamic(
  () => import("@/components/sparkles").then((mod) => mod.SparklesCore),
  {
    ssr: false,
    loading: () => null // No loading UI for sparkles
  }
);

const ChatInterface = dynamic(() => import("@/components/chat-interface"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-400">Loading...</div>
    </div>
  )
});

const CommunityFeatures = dynamic(
  () => import("@/components/community-features"),
  { 
    ssr: false,
    loading: () => null // Load in background
  }
);

const JoinCommunity = dynamic(() => import("@/components/join-community"), {
  ssr: false,
  loading: () => null // Load in background
});

export function HomeClientWrapper() {
  return (
    <>
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
    </>
  );
}

export function SparklesClientWrapper() {
  return (
    <SparklesCore
      id="tsparticlesfullpage"
      background="transparent"
      minSize={0.6}
      maxSize={1.2}
      particleDensity={40} // Reduced from 60 to 40 for better performance
      className="w-full h-full"
      particleColor="#FFFFFF"
    />
  );
}
