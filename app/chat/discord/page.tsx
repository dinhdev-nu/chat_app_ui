import type { Metadata } from "next";
import DiscordChatInterface from "@/components/discord-chat-interface";

export const metadata: Metadata = {
  title: "Discord-Style Chat",
  description: "Modern chat interface inspired by Discord"
};

export default function DiscordChatPage() {
  return <DiscordChatInterface />;
}
