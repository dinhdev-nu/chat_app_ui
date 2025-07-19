"use client"

import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"

// Skeleton for conversation items
export function ConversationItemSkeleton() {
  return (
    <div className="p-2 rounded-lg">
      <div className="flex items-start">
        <div className="relative mr-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="absolute bottom-0 right-0 w-3 h-3 rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="ml-2 h-5 w-5 rounded-full" />
      </div>
    </div>
  )
}

// Skeleton for multiple conversation items
export function ConversationListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="p-2 space-y-1">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ConversationItemSkeleton />
        </motion.div>
      ))}
    </div>
  )
}

// Skeleton for chat messages
export function ChatMessageSkeleton({ isCurrentUser = false }: { isCurrentUser?: boolean }) {
  return (
    <div className={`flex mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[80%] ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
        <Skeleton className={`${isCurrentUser ? "ml-3" : "mr-3"} h-10 w-10 rounded-full`} />
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12 ml-4" />
          </div>
          <Skeleton className={`h-16 ${isCurrentUser ? "w-48" : "w-56"} rounded-2xl`} />
        </div>
      </div>
    </div>
  )
}

// Skeleton for chat messages list
export function ChatMessagesSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ScrollArea className="h-full px-4 py-4">
      <div className="space-y-4">
        {/* Date divider skeleton */}
        <div className="flex items-center justify-center my-4">
          <div className="h-px w-full bg-white/5"></div>
          <Skeleton className="h-4 w-24 mx-3" />
          <div className="h-px w-full bg-white/5"></div>
        </div>

        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <ChatMessageSkeleton isCurrentUser={index % 3 === 0} />
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  )
}

// Skeleton for user discovery
export function UserDiscoverySkeleton() {
  return (
    <ScrollArea className="h-80">
        <div className="p-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-lg"
            >
              <div className="flex items-center">
                <div className="relative mr-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full" />
                </div>

                <div className="flex-1 min-w-0">
                  <Skeleton className="h-4 w-20 mb-1" />
                  <div className="flex items-center">
                    <Skeleton className="h-3 w-3 mr-1 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>

                <Skeleton className="ml-2 h-8 w-8 rounded" />
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
  )
}

// Skeleton for notification center
export function NotificationCenterSkeleton() {
  return (
    <Card className="w-80 bg-[#1e1f2e]/95 backdrop-blur-md border border-indigo-500/20 shadow-lg overflow-hidden">
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center">
          <Skeleton className="h-4 w-4 mr-2" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-16 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>

      <ScrollArea className="h-64">
        <div className="p-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-lg border-b border-white/5 last:border-b-0"
            >
              <div className="flex items-start">
                <Skeleton className="h-8 w-8 rounded-full mr-3" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}

// Skeleton for chat header
export function ChatHeaderSkeleton() {
  return (
    <div className="flex items-center">
      <div className="relative mr-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="absolute bottom-0 right-0 w-3 h-3 rounded-full" />
      </div>
      <div>
        <Skeleton className="h-5 w-24 mb-1" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

