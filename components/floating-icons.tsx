"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
  const [isClient, setIsClient] = useState(false);

  // Memoize particles configuration - only on client
  const particlesConfig = useMemo(() => {
    if (!isClient) return [];
    
    return Array.from({ length: count }).map(() => ({
      x: [Math.random() * 1200, Math.random() * 1200, Math.random() * 1200],
      y: [Math.random() * 800, Math.random() * 800, Math.random() * 800],
      rotate: [0, 180, 360],
      duration: 20 + Math.random() * 10,
      initialX: Math.random() * dimensions.width,
      initialY: Math.random() * dimensions.height
    }));
  }, [count, isClient, dimensions.width, dimensions.height]);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Debounced resize handler
  const handleResize = useCallback(() => {
    if (typeof window !== "undefined") {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      handleResize();
      
      // Throttle resize events
      let timeoutId: NodeJS.Timeout;
      const throttledResize = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(handleResize, 200);
      };
      
      window.addEventListener("resize", throttledResize);
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("resize", throttledResize);
      };
    }
  }, [handleResize]);

  // Don't render particles on server
  if (!isClient) {
    return <div className="relative w-full h-full pointer-events-none" />;
  }

  return (
    <div className="relative w-full h-full pointer-events-none">
      {particlesConfig.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute will-change-transform"
          initial={{
            x: particle.initialX,
            y: particle.initialY
          }}
          animate={{
            x: particle.x,
            y: particle.y,
            rotate: particle.rotate
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
            repeatType: "reverse"
          }}
        >
          <div className="w-16 h-16 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center pointer-events-auto hover:scale-110 transition-transform duration-200">
            {icons[i % icons.length]}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
