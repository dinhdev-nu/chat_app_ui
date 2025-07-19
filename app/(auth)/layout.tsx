import type React from "react";
import { SparklesCore } from "@/components/sparkles";
import { GlowingBackground } from "@/components/glowing-background";
import { FloatingIcons } from "@/components/floating-icons";
import { Toaster } from "@/components/ui/toaster";

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#1a1b26] antialiased bg-grid-white/[0.02] relative overflow-hidden flex items-center justify-center">
      {/* Ambient background with moving particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <FloatingIcons count={8} />
      </div>
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          particleColor="#FFFFFF"
        />
      </div>
      {/* Glowing background effect */}
      <GlowingBackground color="indigo" position="left" />
      <GlowingBackground color="purple" position="right" />
      {/* Floating icons background */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto">{children}</div>
      </div>

      {/* Toast */}
      <Toaster />
    </main>
  );
}
