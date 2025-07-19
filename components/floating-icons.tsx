"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Users,
  Hash,
  Video,
  Headphones,
  ImageIcon,
  Smile,
  AtSign
} from "lucide-react";

// Memoize icons to prevent recreation on each render
const icons = [
  <MessageCircle key="message" className="w-8 h-8 text-indigo-400/50" />,
  <Users key="users" className="w-8 h-8 text-purple-400/50" />,
  <Hash key="hash" className="w-8 h-8 text-blue-400/50" />,
  <Video key="video" className="w-8 h-8 text-green-400/50" />,
  <Headphones key="headphones" className="w-8 h-8 text-yellow-400/50" />,
  <ImageIcon key="image" className="w-8 h-8 text-pink-400/50" />,
  <Smile key="smile" className="w-8 h-8 text-red-400/50" />,
  <AtSign key="at" className="w-8 h-8 text-cyan-400/50" />
];

export function FloatingIcons({ count = 5 }) {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const particlesRef = useRef<
    Array<{ x: number[]; y: number[]; rotate: number[] }>
  >([]);

  // Initialize particles only once with memoization
  const initializeParticles = useCallback(() => {
    return Array.from({ length: count }).map(() => ({
      x: [
        Math.random() * dimensions.width,
        Math.random() * dimensions.width,
        Math.random() * dimensions.width
      ],
      y: [
        Math.random() * dimensions.height,
        Math.random() * dimensions.height,
        Math.random() * dimensions.height
      ],
      rotate: [0, 180, 360]
    }));
  }, [count, dimensions.width, dimensions.height]);

  // Set initial particles
  useEffect(() => {
    particlesRef.current = initializeParticles();
  }, [initializeParticles]);

  // Memoize the resize handler
  const handleResize = useCallback(() => {
    if (typeof window !== "undefined") {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  }, []);

  useEffect(() => {
    // Update dimensions only on client side
    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [handleResize]);

  // Memoize the particles to prevent unnecessary re-renders
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const particle = particlesRef.current[i] || {
        x: [0, 0, 0],
        y: [0, 0, 0],
        rotate: [0, 180, 360]
      };

      return (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: dimensions.width,
            y: dimensions.height
          }}
          animate={{
            x: particle.x,
            y: particle.y,
            rotate: particle.rotate
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            repeatType: "reverse"
          }}
        >
          <div className="m-0 p-0 relative w-16 h-16 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center transform hover:scale-110 transition-transform">
            {icons[i % icons.length]}
          </div>
        </motion.div>
      );
    });
  }, [count, dimensions.width, dimensions.height]);

  return <div className="relative w-full h-full">{particles}</div>;
}
