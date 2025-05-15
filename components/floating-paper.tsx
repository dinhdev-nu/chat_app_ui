"use client"

import { useEffect, useState, useRef, useCallback, memo } from "react"
import { motion } from "framer-motion"
import { MessageSquare } from "lucide-react"

export const FloatingPaper = memo(function FloatingPaper({ count = 5 }) {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })
  const particlesRef = useRef<Array<{ x: number[]; y: number[]; rotate: number[] }>>([])

  // Initialize particles only once with memoization
  const initializeParticles = useCallback(() => {
    return Array.from({ length: count }).map(() => ({
      x: [Math.random() * dimensions.width, Math.random() * dimensions.width, Math.random() * dimensions.width],
      y: [Math.random() * dimensions.height, Math.random() * dimensions.height, Math.random() * dimensions.height],
      rotate: [0, 180, 360],
    }))
  }, [count, dimensions.width, dimensions.height])

  // Set initial particles
  useEffect(() => {
    particlesRef.current = initializeParticles()
  }, [initializeParticles])

  // Memoize the resize handler
  const handleResize = useCallback(() => {
    if (typeof window !== "undefined") {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
  }, [])

  useEffect(() => {
    // Update dimensions only on client side
    if (typeof window !== "undefined") {
      handleResize()
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [handleResize])

  return (
    <div className="relative w-full h-full">
      {Array.from({ length: count }).map((_, i) => {
        const particle = particlesRef.current[i] || {
          x: [0, 0, 0],
          y: [0, 0, 0],
          rotate: [0, 180, 360],
        }

        return (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
            }}
            animate={{
              x: particle.x,
              y: particle.y,
              rotate: particle.rotate,
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              // Optimize animation performance
              type: "tween",
            }}
          >
            <div className="relative w-16 h-16 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center transform hover:scale-110 transition-transform">
              <MessageSquare className="w-8 h-8 text-purple-400/50" />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
})
