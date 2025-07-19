"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

// Emote categories and emotes
const emoteCategories = [
  {
    id: "recent",
    name: "Recent",
    emotes: ["😊", "👍", "❤️", "😂", "🎉", "🙌", "👏", "🔥"]
  },
  {
    id: "smileys",
    name: "Smileys",
    emotes: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
      "😗",
      "😙",
      "😚",
      "😋",
      "😛",
      "😝",
      "😜",
      "🤪",
      "🤨",
      "🧐",
      "🤓",
      "😎",
      "🤩",
      "🥳"
    ]
  },
  {
    id: "gestures",
    name: "Gestures",
    emotes: [
      "👍",
      "👎",
      "👌",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "🤙",
      "👈",
      "👉",
      "👆",
      "👇",
      "☝️",
      "👋",
      "🤚",
      "🖐️",
      "✋",
      "🖖",
      "👏",
      "🙌",
      "👐",
      "🤲",
      "🙏",
      "✍️",
      "💅",
      "🤳",
      "💪"
    ]
  },
  {
    id: "love",
    name: "Love",
    emotes: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❣️",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "💟",
      "♥️"
    ]
  },
  {
    id: "celebration",
    name: "Celebration",
    emotes: [
      "🎉",
      "🎊",
      "🎈",
      "🎂",
      "🎁",
      "🎆",
      "🎇",
      "🧨",
      "✨",
      "🎏",
      "🎎",
      "🎐",
      "🎑",
      "🎀",
      "🎗️",
      "🎟️",
      "🎫",
      "🏆",
      "🏅",
      "🥇",
      "🥈",
      "🥉"
    ]
  }
];

interface EmotePanelProps {
  onSelectEmote: (emote: string) => void;
  onClose: () => void;
}

export default function EmotePanel({
  onSelectEmote,
  onClose
}: EmotePanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("recent");

  // Filter emotes based on search query
  const filteredEmotes = searchQuery
    ? emoteCategories
        .flatMap((category) => category.emotes)
        .filter((emote) => emote.includes(searchQuery))
    : emoteCategories.find((category) => category.id === activeCategory)
        ?.emotes || [];

  return (
    <Card className="w-80 bg-[#1e1f2e]/95 backdrop-blur-md border border-indigo-500/20 shadow-lg overflow-hidden">
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-white font-medium">Emotes</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-3 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search emotes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-[#1a1b26] border-white/10 text-white"
          />
        </div>
      </div>

      {!searchQuery && (
        <Tabs
          defaultValue="recent"
          value={activeCategory}
          onValueChange={setActiveCategory}
        >
          <div className="border-b  border-white/10">
            <TabsList className="w-full flex overflow-x-auto whitespace-nowrap px-0 bg-transparent scrollbar-hidden">
              {emoteCategories.map((category) => (
                <TabsTrigger
                  id={category.id}
                  key={category.id}
                  value={category.id}
                  className="flex-shrink-0 px-3 py-1 rounded-[6px] scroll-mx-1 first:ml-1 data-[state=active]:bg-indigo-500"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {emoteCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="m-0">
              <div className="grid grid-cols-7 gap-1 p-3">
                {category.emotes.map((emote, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onSelectEmote(emote)}
                    className="h-9 w-9 flex items-center justify-center text-xl hover:bg-white/10 rounded"
                  >
                    {emote}
                  </motion.button>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {searchQuery && (
        <div className="grid grid-cols-7 gap-1 p-3">
          {filteredEmotes.length > 0 ? (
            filteredEmotes.map((emote, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onSelectEmote(emote)}
                className="h-9 w-9 flex items-center justify-center text-xl hover:bg-white/10 rounded"
              >
                {emote}
              </motion.button>
            ))
          ) : (
            <div className="col-span-7 py-8 text-center text-gray-400">
              No emotes found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
