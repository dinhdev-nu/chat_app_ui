"use client"

import { AckMessage, MessageRequest, OnMessage } from "@/types/chat"

export interface ChatSocketProps {
  url: string
  wsRef: React.RefObject<WebSocket | null>
  followers: OnMessage
  onMessageHandlers: {
    onReceiveMessage: (message: MessageRequest) => void
    onReceiveAck: (ack: AckMessage) => void
    onTyping: (typing: OnMessage) => void
    onRead: (read: OnMessage) => void
    onStatusUpdate: (status: OnMessage) => void
  }
}

export function connectChatSocket({
  url,
  wsRef,
  followers,
  onMessageHandlers
}: ChatSocketProps) {
    const token = localStorage.getItem(process.env.NEXT_PUBLIC_SESSION_KEY!)
    if (!token) {
      console.error("No session token found")
      return
    }

    const socket = new WebSocket(url + token)
    wsRef.current = socket

    socket.onopen = () => {
      socket.send(JSON.stringify(followers))
      console.log("✅ WebSocket connection established")
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
    
    switch (data.event) {
      case "message":
        onMessageHandlers.onReceiveMessage(data.message as MessageRequest)
        break
      case "ack":
        onMessageHandlers.onReceiveAck({
          event: "ack",
          receiver_id: data.receiver_id,
          status: data.status,
          content: JSON.parse(atob(data.content)),
          message_id: data.message_id,
        } as AckMessage)
        break
      case "typing":
        onMessageHandlers.onTyping(data as OnMessage)
        break
      case "read":
        onMessageHandlers.onRead(data as OnMessage)
        break
      case "status":
        onMessageHandlers.onStatusUpdate(data as OnMessage)
        return
    }}

    socket.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    socket.onclose = () => {
      console.warn("WebSocket connection closed, reconnecting...")
      setTimeout(() => {
        connectChatSocket({ url, wsRef, followers,   onMessageHandlers })
      }, 5000)
    }
}
