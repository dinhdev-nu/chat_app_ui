"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, ArrowRight, Github, Mail } from "lucide-react"
import { FloatingParticles } from "@/components/floating-particles"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to Discord-style chat page after successful login
      router.push("/chat/discord")
    }, 1500)
  }

  return (
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10">
        <FloatingParticles count={10} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1e1f2e]/80 backdrop-blur-md rounded-xl border border-indigo-500/20 overflow-hidden shadow-[0_0_15px_rgba(79,70,229,0.15)] max-h-[90vh] w-[450px] mx-auto"
      >
        {/* Header - Compact version */}
        <div className="p-3 border-b border-white/10 flex items-center justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-indigo-500" />
            <span className="text-white font-medium">HarmonyHub</span>
          </Link>
          <span className="mx-2 text-gray-500">|</span>
          <h1 className="text-lg font-medium text-white">Login</h1>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#1a1b26] border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#1a1b26] border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
              >
                Remember me
              </label>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-[#1e1f2e] text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 hover:text-indigo-400">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 hover:text-indigo-400">
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-[#1a1b26]/50 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Decorative bottom element */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-4 text-center text-gray-500 text-xs flex items-center justify-center"
      >
        <p>Protected by enterprise-grade security</p>
      </motion.div>
    </div>
  )
}
