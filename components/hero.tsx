"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Users, MessageCircle, ChevronRight } from "lucide-react"
import { FloatingIcons } from "@/components/floating-icons"

export default function Hero() {
  return (
    <div className="relative min-h-[calc(100vh-76px)] flex items-center">
      {/* Floating icons background */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingIcons count={8} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-6 py-2 bg-indigo-500/20 rounded-full mb-6"
          >
            <span className="text-indigo-300 font-medium">Join HarmonyHub</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Where Conversations
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">
                {" "}
                Come Alive
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto"
          >
            Join thousands of communities and connect with people who share your interests. Real-time chat, voice
            channels, and a vibrant community await you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
              <Users className="mr-2 h-5 w-5" />
              Join Community
            </Button>
            <Button size="lg" variant="outline" className="text-white border-indigo-500 hover:bg-indigo-500/20">
              <MessageCircle className="mr-2 h-5 w-5" />
              Explore Channels
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 flex items-center justify-center"
          >
            <a
              href="#chat-interface"
              className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <span className="mr-2">See how it works</span>
              <ChevronRight className="h-4 w-4 animate-bounce" />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
