"use client"

import { memo, useMemo } from "react"
import { motion } from "framer-motion"

type GlowingBackgroundProps = {
  color: "indigo" | "purple" | "blue"
  position: "left" | "right" | "center"
}

export const GlowingBackground = memo(function GlowingBackground({ color, position }: GlowingBackgroundProps) {
  // Memoize class names to prevent recalculation on each render
  const colorClass = useMemo(() => {
    switch (color) {
      case "indigo":
        return "from-indigo-500/20 to-indigo-700/5"
      case "purple":
        return "from-purple-500/20 to-purple-700/5"
      case "blue":
        return "from-blue-500/20 to-blue-700/5"
      default:
        return "from-indigo-500/20 to-indigo-700/5"
    }
  }, [color])

  const positionClass = useMemo(() => {
    switch (position) {
      case "left":
        return "-left-64 -top-64"
      case "right":
        return "-right-64 -bottom-64"
      case "center":
        return "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      default:
        return "-left-64 -top-64"
    }
  }, [position])

  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          // Optimize animation performance
          type: "tween",
        }}
        className={`absolute ${positionClass} w-[40rem] h-[40rem] bg-gradient-to-br ${colorClass} rounded-full blur-[128px] opacity-30`}
      />
    </div>
  )
})
