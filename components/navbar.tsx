"use client";

import { Button } from "@/components/ui/button";
import { Users, Menu, LogIn } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // Don't render the navbar on login page
  if (isLoginPage) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10">
      <Link href="/" className="flex items-center space-x-2">
        <Users className="w-8 h-8 text-indigo-500" />
        <span className="text-white font-medium text-xl">CommuniHub</span>
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        <NavLink href="#features">Features</NavLink>
        <NavLink href="#communities">Communities</NavLink>
        <NavLink href="#discover">Discover</NavLink>
        <NavLink href="#support">Support</NavLink>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        {!isLoginPage && (
          <>
            <Button
              variant="ghost"
              className="text-white hover:text-indigo-400"
              asChild
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              asChild
            >
              <Link href="/signup">
                <LogIn className="mr-2 h-4 w-4" />
                Join Now
              </Link>
            </Button>
          </>
        )}
        {isLoginPage && (
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            asChild
          >
            <Link href="/signup">Create Account</Link>
          </Button>
        )}
      </div>

      <Button variant="ghost" size="icon" className="md:hidden text-white">
        <Menu className="w-6 h-6" />
      </Button>
    </nav>
  );
}

function NavLink({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-gray-300 hover:text-white transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full" />
    </Link>
  );
}
