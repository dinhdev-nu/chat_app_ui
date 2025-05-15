"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"

export function FloatingParticles({ count = 10 }) {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })
  const particlesRef = useRef<Array<{ x: number[]; y: number[] }>>([])

  // Initialize particles only once
  useEffect(() => {
    particlesRef.current = Array.from({ length: count }).map(() => ({
      x: [Math.random() * dimensions.width, Math.random() * dimensions.width, Math.random() * dimensions.width],
      y: [Math.random() * dimensions.height, Math.random() * dimensions.height, Math.random() * dimensions.height],
    }))
  }, [count, dimensions.width, dimensions.height])

  // Memoize the resize handler
  const handleResize = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })
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
      {particlesRef.current.map((particle, i) => (
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
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            repeatType: "reverse",
          }}
        >
          <div className={`w-1 h-1 rounded-full bg-indigo-500 opacity-${Math.floor(Math.random() * 50) + 20}`} />
        </motion.div>
      ))}
    </div>
  )
}
