import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CommuniHub",
  description: "A simple chat app built with Next.js and TypeScript",
  generator: "Next.js"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
