"use client"

import type React from "react"

import { useState } from "react"
import { TooltipRoot, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import {
  Smile,
  PlusCircle,
  Send,
  ImageIcon,
  Mic,
} from "lucide-react"

interface ChatInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  onClick: () => void
  onTyping: () => void
}

export default function ChatInput({ 
  
 }: ChatInputProps) {
  const [message, setMessage] = useState("")

  

  return (
    <div className="p-4 border-t border-white/10">
      <form onSubmit={onSubmit} className="flex items-end gap-2">
        <div className="flex-1 bg-[#1e1f2e] rounded-[6px] border border-white/10 overflow-hidden">
          <div className="flex items-center px-3 py-2 border-b border-white/5">
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach File</TooltipContent>
            </TooltipRoot>

            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <ImageIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send Image</TooltipContent>
            </TooltipRoot>

            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <Mic className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Voice Message</TooltipContent>
            </TooltipRoot>

            <TooltipRoot>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white"
                  onClick={() => {
                    setIsEmotePanelOpen(!isEmotePanelOpen)
                    setIsNotificationPanelOpen(false)
                    setIsUserDiscoveryOpen(false)
                  }}
                >
                  <Smile className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Emotes</TooltipContent>
            </TooltipRoot>
          </div>

          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              onTyping
            }}
            placeholder={`Message ${activeConversation.user.name}...`}
            className="w-full bg-transparent border-none px-4 py-3 text-white placeholder-gray-500 focus:outline-none resize-none h-20"
          />
        </div>

        <Button
          type="submit"
          disabled={!message.trim()}
          className={`rounded-full p-3 ${
            message.trim() ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-indigo-600/50 cursor-not-allowed"
          }`}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>                 
  )
}
