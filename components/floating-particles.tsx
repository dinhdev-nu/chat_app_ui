"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { motion } from "framer-motion"

export function FloatingParticles({ count = 10 }) {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })
  const [isClient, setIsClient] = useState(false)
  
  // Memoize particles to prevent recreation on every render - only on client
  const particles = useMemo(() => {
    if (!isClient) return []
    
    return Array.from({ length: count }).map(() => ({
      x: [Math.random() * 1200, Math.random() * 1200, Math.random() * 1200],
      y: [Math.random() * 800, Math.random() * 800, Math.random() * 800],
      opacity: (Math.floor(Math.random() * 30) + 20) / 100,
      duration: 20 + Math.random() * 10,
      initialX: Math.random() * dimensions.width,
      initialY: Math.random() * dimensions.height
    }))
  }, [count, isClient, dimensions.width, dimensions.height])

  // Set client-side flag
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Debounced resize handler
  const handleResize = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      handleResize()
      
      // Throttle resize events
      let timeoutId: NodeJS.Timeout
      const throttledResize = () => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(handleResize, 150)
      }
      
      window.addEventListener("resize", throttledResize)
      return () => {
        clearTimeout(timeoutId)
        window.removeEventListener("resize", throttledResize)
      }
    }
  }, [handleResize])

  // Don't render particles on server
  if (!isClient) {
    return <div className="relative w-full h-full pointer-events-none" />
  }

  return (
    <div className="relative w-full h-full pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute will-change-transform"
          initial={{
            x: particle.initialX,
            y: particle.initialY,
          }}
          animate={{
            x: particle.x,
            y: particle.y,
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
            repeatType: "reverse",
          }}
        >
          <div 
            className="w-1 h-1 rounded-full bg-indigo-500" 
            style={{ opacity: particle.opacity }}
          />
        </motion.div>
      ))}
    </div>
  )
}
