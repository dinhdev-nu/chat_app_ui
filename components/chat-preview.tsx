"use client"

import { motion, useAnimation } from "framer-motion"
import { useEffect, useMemo } from "react"
import { useInView } from "react-intersection-observer"
import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"

// Memoize messages to prevent recreation on each render
const messages = [
  {
    id: 1,
    sender: "AI Assistant",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "Hello! How can I help you today?",
    isUser: false,
  },
  {
    id: 2,
    sender: "You",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "I need help planning my trip to Japan next month.",
    isUser: true,
  },
  {
    id: 3,
    sender: "AI Assistant",
    avatar: "/placeholder.svg?height=40&width=40",
    message:
      "Great choice! Japan is beautiful in the spring. Would you like recommendations for Tokyo, Kyoto, or other regions?",
    isUser: false,
  },
  {
    id: 4,
    sender: "You",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "I'm interested in Tokyo and Kyoto. What are the must-see attractions?",
    isUser: true,
  },
  {
    id: 5,
    sender: "AI Assistant",
    avatar: "/placeholder.svg?height=40&width=40",
    message:
      "For Tokyo, don't miss the Tokyo Skytree, Shibuya Crossing, and Meiji Shrine. In Kyoto, visit Fushimi Inari Shrine, Kinkaku-ji, and Arashiyama Bamboo Grove.",
    isUser: false,
  },
]

export default function ChatPreview() {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true, // Changed to true to only trigger once
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  // Memoize the message components to prevent unnecessary re-renders
  const messageComponents = useMemo(() => {
    return messages.map((message, index) => (
      <motion.div
        key={message.id}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: index * 0.2 },
          },
        }}
        className={`flex mb-6 ${message.isUser ? "justify-end" : "justify-start"}`}
      >
        <div className={`flex max-w-[80%] ${message.isUser ? "flex-row-reverse" : "flex-row"}`}>
          <Avatar
            className={`${message.isUser ? "ml-3" : "mr-3"} h-10 w-10 border-2 ${message.isUser ? "border-pink-500" : "border-purple-500"}`}
          >
            <img src={message.avatar || "/placeholder.svg"} alt={message.sender} />
          </Avatar>
          <div
            className={`p-4 rounded-2xl ${
              message.isUser
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                : "bg-white/10 backdrop-blur-sm text-white"
            }`}
          >
            <p className={`text-xs mb-1 ${message.isUser ? "text-pink-200" : "text-purple-200"}`}>{message.sender}</p>
            <p>{message.message}</p>
          </div>
        </div>
      </motion.div>
    ))
  }, [controls])

  return (
    <section className="py-20 px-6" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Experience Seamless Conversations</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our intelligent chat platform brings your conversations to life with beautiful animations and smart
            responses.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-black/50 backdrop-blur-md border border-purple-500/20 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <div className="ml-4 text-white font-medium">NexusChat</div>
            </div>
            <div className="p-6 max-h-[500px] overflow-y-auto">{messageComponents}</div>
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center bg-white/5 rounded-full px-4 py-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="bg-transparent border-none outline-none text-white flex-1"
                />
                <button className="ml-2 p-2 rounded-full bg-purple-600 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
