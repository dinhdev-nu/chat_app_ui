"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useMousePosition } from "@/lib/hooks/use-mouse-position";

interface SparklesProps {
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
}

export const SparklesCore = ({
  id = "tsparticles",
  background = "transparent",
  minSize = 0.6,
  maxSize = 1.4,
  particleDensity = 100,
  className = "h-full w-full",
  particleColor = "#FFFFFF"
}: SparklesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useMousePosition();
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const animationFrameIdRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    update: (
      canvasWidth: number,
      canvasHeight: number,
      mouseX: number,
      mouseY: number
    ) => void;
    draw: (ctx: CanvasRenderingContext2D) => void;
  }

  // Memoize the Particle class to prevent recreation on each render
  const Particle = useMemo(() => {
    return class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * (maxSize - minSize) + minSize;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
      }

      update(
        canvasWidth: number,
        canvasHeight: number,
        mouseX: number,
        mouseY: number
      ) {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvasWidth) this.x = 0;
        if (this.x < 0) this.x = canvasWidth;
        if (this.y > canvasHeight) this.y = 0;
        if (this.y < 0) this.y = canvasHeight;

        // Mouse interaction - only calculate if mouse is in the canvas
        if (mouseX >= 0 && mouseY >= 0) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * 1;
            this.y -= Math.sin(angle) * 1;
          }
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };
  }, [maxSize, minSize, particleColor]);

  // Memoize the initialization function
  const initParticles = useCallback(
    (width: number, height: number) => {
      particlesRef.current = [];
      for (let i = 0; i < particleDensity; i++) {
        particlesRef.current.push(new Particle(width, height));
      }
    },
    [Particle, particleDensity]
  );

  // Memoize the animation function
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((particle) => {
      particle.update(
        canvas.width,
        canvas.height,
        mousePosition.x,
        mousePosition.y
      );
      particle.draw(ctx);
    });

    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, [mousePosition.x, mousePosition.y, Particle]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      if (typeof window === "undefined" || !canvasRef.current) return;

      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });

      initParticles(window.innerWidth, window.innerHeight);
    };

    // Set initial dimensions and initialize particles
    handleResize();

    // Start animation
    animate();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [animate, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={className}
      style={{
        background,
        width: dimensions.width,
        height: dimensions.height
      }}
    />
  );
};
