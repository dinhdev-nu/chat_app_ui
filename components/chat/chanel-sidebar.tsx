"use client";

import type React from "react";

import {
  Plus,
  MessageSquare,
  Home,
  Compass,
  Download,
  Gamepad2,
  Code,
  Palette
} from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

type ChanelSidebarProps = {
  isMobile: boolean;
  selectedServer: string;
  setSelectedServer: (server: string) => void;
};

export default function ChanelSidebar({
  isMobile,
  selectedServer,
  setSelectedServer
}: ChanelSidebarProps) {
  return (
    <div
      className={`w-[72px] bg-black flex-shrink-0 flex flex-col items-center py-3 border-r border-black/20 h-screen ${
        isMobile ? "hidden" : "flex"
      }`}
    >
      <div className="w-full px-3 mb-2">
        <Tooltip content="Home">
          <button
            className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 transition-all hover:rounded-xl ${
              selectedServer === "home"
                ? "bg-indigo-500 text-white"
                : "bg-[#2d2f3e] text-indigo-400 hover:bg-indigo-500/80 hover:text-white"
            }`}
            onClick={() => setSelectedServer("home")}
          >
            <Home className="h-5 w-5" />
          </button>
        </Tooltip>

        <Separator className="my-2 bg-[#2d2f3e]" />
      </div>

      {/* Server list */}
      <ScrollArea className="flex-1 w-full px-3">
        <div className="space-y-2">
          <Tooltip content="HarmonyHub">
            <button
              onClick={() => setSelectedServer("harmony")}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:rounded-xl ${
                selectedServer === "harmony"
                  ? "bg-indigo-500 text-white"
                  : "bg-[#2d2f3e] text-indigo-400 hover:bg-indigo-500/80 hover:text-white"
              }`}
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          </Tooltip>

          <Tooltip content="Developers">
            <button
              onClick={() => setSelectedServer("developers")}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:rounded-xl ${
                selectedServer === "developers"
                  ? "bg-indigo-500 text-white"
                  : "bg-[#2d2f3e] text-indigo-400 hover:bg-indigo-500/80 hover:text-white"
              }`}
            >
              <Code className="h-5 w-5" />
            </button>
          </Tooltip>

          <Tooltip content="Gaming">
            <button
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:rounded-xl ${
                selectedServer === "gaming"
                  ? "bg-indigo-500 text-white"
                  : "bg-[#2d2f3e] text-indigo-400 hover:bg-indigo-500/80 hover:text-white"
              }`}
              onClick={() => setSelectedServer("gaming")}
            >
              <Gamepad2 className="h-5 w-5" />
            </button>
          </Tooltip>

          <Tooltip content="Art & Design">
            <button
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:rounded-xl ${
                selectedServer === "design"
                  ? "bg-indigo-500 text-white"
                  : "bg-[#2d2f3e] text-indigo-400 hover:bg-indigo-500/80 hover:text-white"
              }`}
              onClick={() => setSelectedServer("design")}
            >
              <Palette className="h-5 w-5" />
            </button>
          </Tooltip>
        </div>

        <Separator className="my-2 bg-[#2d2f3e]" />

        <Tooltip content="Add a Server">
          <button className="w-12 h-12 rounded-full bg-[#2d2f3e] flex items-center justify-center text-green-400 hover:bg-green-500 hover:text-white transition-all">
            <Plus className="h-5 w-5" />
          </button>
        </Tooltip>

        <Tooltip content="Explore Servers">
          <button className="w-12 h-12 rounded-full bg-[#2d2f3e] flex items-center justify-center text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all mt-2">
            <Compass className="h-5 w-5" />
          </button>
        </Tooltip>

        <Tooltip content="Download App">
          <button className="w-12 h-12 rounded-full bg-[#2d2f3e] flex items-center justify-center text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all mt-2">
            <Download className="h-5 w-5" />
          </button>
        </Tooltip>
      </ScrollArea>
    </div>
  );
}
