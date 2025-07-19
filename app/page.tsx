import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import { SparklesClientWrapper, HomeClientWrapper } from "./client-wrapper";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@/components/footer"));

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1a1b26] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Ambient background with moving particles - reduced particle density */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesClientWrapper />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />

        <HomeClientWrapper />

        <Footer />
      </div>
    </main>
  );
}
