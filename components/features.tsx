"use client"

import { motion, useAnimation } from "framer-motion"
import { useEffect, useMemo } from "react"
import { useInView } from "react-intersection-observer"
import { MessageSquareText, Sparkles, Zap, Shield, Globe, Palette } from "lucide-react"

// Memoize features to prevent recreation on each render
const features = [
  {
    icon: <MessageSquareText className="h-10 w-10 text-purple-500" />,
    title: "Smart Conversations",
    description: "AI-powered chat that understands context and provides intelligent responses.",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-purple-500" />,
    title: "Beautiful Animations",
    description: "Engaging visual effects that bring your conversations to life.",
  },
  {
    icon: <Zap className="h-10 w-10 text-purple-500" />,
    title: "Lightning Fast",
    description: "Optimized performance ensures messages are delivered instantly.",
  },
  {
    icon: <Shield className="h-10 w-10 text-purple-500" />,
    title: "End-to-End Encryption",
    description: "Your conversations are secure and private with advanced encryption.",
  },
  {
    icon: <Globe className="h-10 w-10 text-purple-500" />,
    title: "Cross-Platform",
    description: "Seamlessly sync your chats across all your devices.",
  },
  {
    icon: <Palette className="h-10 w-10 text-purple-500" />,
    title: "Customizable Themes",
    description: "Personalize your chat experience with custom themes and styles.",
  },
]

export default function Features() {
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

  // Memoize the feature components to prevent unnecessary re-renders
  const featureComponents = useMemo(() => {
    return features.map((feature, index) => (
      <motion.div
        key={index}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: index * 0.1 },
          },
        }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
      >
        <div className="mb-4">{feature.icon}</div>
        <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
        <p className="text-gray-400">{feature.description}</p>
      </motion.div>
    ))
  }, [controls])

  return (
    <section className="py-20 px-6 bg-black/50" ref={ref}>
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover what makes NexusChat the most advanced messaging platform available today.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{featureComponents}</div>
      </div>
    </section>
  )
}
