import LoginForm from "@/components/login-form"
import { SparklesCore } from "@/components/sparkles"
import { GlowingBackground } from "@/components/glowing-background"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#1a1b26] antialiased bg-grid-white/[0.02] relative overflow-hidden flex items-center justify-center">
      {/* Ambient background with moving particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      {/* Glowing background effect */}
      <GlowingBackground color="indigo" position="left" />
      <GlowingBackground color="purple" position="right" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
