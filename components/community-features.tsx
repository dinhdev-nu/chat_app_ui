"use client"

import { motion, useAnimation } from "framer-motion"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { MessageSquare, Users, Video, Headphones, Shield, Zap, Sparkles } from "lucide-react"

const features = [
  {
    icon: <MessageSquare className="h-10 w-10 text-indigo-500" />,
    title: "Real-time Messaging",
    description: "Instant messaging with real-time updates. Never miss a conversation again.",
  },
  {
    icon: <Users className="h-10 w-10 text-indigo-500" />,
    title: "Community Channels",
    description: "Organize discussions by topics with dedicated channels for every interest.",
  },
  {
    icon: <Video className="h-10 w-10 text-indigo-500" />,
    title: "Video Chat",
    description: "Face-to-face conversations with crystal-clear video quality.",
  },
  {
    icon: <Headphones className="h-10 w-10 text-indigo-500" />,
    title: "Voice Channels",
    description: "Hang out in voice channels for casual conversations or gaming sessions.",
  },
  {
    icon: <Shield className="h-10 w-10 text-indigo-500" />,
    title: "Moderation Tools",
    description: "Powerful tools to keep your community safe and welcoming for everyone.",
  },
  {
    icon: <Zap className="h-10 w-10 text-indigo-500" />,
    title: "Integrations",
    description: "Connect with your favorite apps and services to enhance your experience.",
  },
]

export default function CommunityFeatures() {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <section className="py-20 px-6 bg-[#16171f] relative" ref={ref}>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>

      {/* Glowing orbs */}
      <div className="absolute top-40 left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-40 right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <span className="h-px w-8 bg-indigo-500/50"></span>
            <span className="mx-4 text-indigo-400 font-medium">POWERFUL FEATURES</span>
            <span className="h-px w-8 bg-indigo-500/50"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Everything You{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Need</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our platform provides all the tools you need to build and grow your community in one place.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
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
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-gradient-to-b from-[#1e1f2e] to-[#1a1b26] border border-white/10 rounded-xl p-6 hover:border-indigo-500/50 transition-all shadow-lg hover:shadow-indigo-500/10 relative overflow-hidden group"
            >
              {/* Sparkle effect on hover */}
              <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="h-6 w-6 text-indigo-400" />
              </div>

              <div className="mb-4 bg-indigo-500/10 p-3 rounded-lg w-fit">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>

              {/* Bottom gradient line */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
