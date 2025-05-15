"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Smile, Paperclip, Send, ImageIcon } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (content: string) => void
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")

      // Focus the input after sending
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }

  return (
    <div className="p-4 border-t border-white/10">
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="flex items-center bg-white/5 rounded-full px-4 py-2 flex-1">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-transparent border-none outline-none text-white flex-1"
          />
          <div className="flex space-x-2">
            <button type="button" className="text-gray-400 hover:text-indigo-400 transition-colors p-1">
              <Smile className="h-5 w-5" />
            </button>
            <button type="button" className="text-gray-400 hover:text-indigo-400 transition-colors p-1">
              <Paperclip className="h-5 w-5" />
            </button>
            <button type="button" className="text-gray-400 hover:text-indigo-400 transition-colors p-1">
              <ImageIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <button
          type="submit"
          className={`ml-2 p-2 rounded-full ${
            message.trim() ? "bg-purple-600 text-white" : "bg-purple-600/50 text-white/50 cursor-not-allowed"
          }`}
          disabled={!message.trim()}
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
}
