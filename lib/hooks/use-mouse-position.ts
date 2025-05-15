"use client"

import { useState, useEffect, useCallback } from "react"

// Simple throttle function
function throttle<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall < delay) return
    lastCall = now
    return func(...args)
  }
}

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Memoize the event handler and throttle it
  const updateMousePosition = useCallback(
    throttle((ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY })
    }, 50), // Throttle to 50ms
    [],
  )

  useEffect(() => {
    if (typeof window === "undefined") return

    window.addEventListener("mousemove", updateMousePosition)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
    }
  }, [updateMousePosition])

  return mousePosition
}
