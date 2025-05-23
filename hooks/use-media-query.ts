"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query)

      // Update the state with the current value
      const updateMatches = () => {
        setMatches(media.matches)
      }

      // Set the initial value
      updateMatches()

      // Add the change listener
      media.addEventListener("change", updateMatches)

      // Clean up
      return () => {
        media.removeEventListener("change", updateMatches)
      }
    }

    return undefined
  }, [query])

  return matches
}
