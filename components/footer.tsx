"use client"

import type React from "react"

import { motion } from "framer-motion"
import Link from "next/link"
import { Users, Github, Twitter, Instagram, Linkedin, Heart, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-[#16171f] border-t border-indigo-500/20 pt-16 pb-8 px-6 relative">
      {/* Glowing background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Newsletter section */}
        <div className="max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#1e1f2e]/80 backdrop-blur-md rounded-xl p-8 border border-indigo-500/20 shadow-lg"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Newsletter</h3>
                <p className="text-gray-400 max-w-md">
                  Subscribe for the latest updates, community news, and exclusive offers.
                </p>
              </div>
              <div className="flex w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-[#1a1b26] border border-white/10 rounded-l-md px-4 py-2 text-white w-full md:w-64 focus:outline-none focus:border-indigo-500"
                />
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-l-none">Subscribe</Button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Users className="w-8 h-8 text-indigo-500" />
              <span className="text-white font-medium text-xl">HarmonyHub</span>
            </Link>
            <p className="text-gray-400 mb-4">
              A vibrant community platform where people connect, share ideas, and build relationships in real-time.
            </p>
            <div className="flex space-x-4 mb-6">
              <SocialIcon icon={<Github className="w-5 h-5" />} href="https://github.com" />
              <SocialIcon icon={<Twitter className="w-5 h-5" />} href="https://twitter.com" />
              <SocialIcon icon={<Instagram className="w-5 h-5" />} href="https://instagram.com" />
              <SocialIcon icon={<Linkedin className="w-5 h-5" />} href="https://linkedin.com" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-2 text-indigo-400" />
                <a href="mailto:contact@harmonyhub.com" className="hover:text-indigo-400 transition-colors">
                  contact@harmonyhub.com
                </a>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="w-4 h-4 mr-2 text-indigo-400" />
                <a href="tel:+1234567890" className="hover:text-indigo-400 transition-colors">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin className="w-4 h-4 mr-2 text-indigo-400" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <span className="w-1 h-5 bg-indigo-500 rounded-full mr-2"></span>
              Community
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/guidelines">Community Guidelines</FooterLink>
              <FooterLink href="/safety">Safety Center</FooterLink>
              <FooterLink href="/moderators">Moderator Hub</FooterLink>
              <FooterLink href="/events">Community Events</FooterLink>
              <FooterLink href="/partners">Partner Program</FooterLink>
              <FooterLink href="/verification">Verification</FooterLink>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <span className="w-1 h-5 bg-indigo-500 rounded-full mr-2"></span>
              Resources
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/help">Help Center</FooterLink>
              <FooterLink href="/developers">Developers</FooterLink>
              <FooterLink href="/status">System Status</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/changelog">What's New</FooterLink>
              <FooterLink href="/tutorials">Tutorials</FooterLink>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <span className="w-1 h-5 bg-indigo-500 rounded-full mr-2"></span>
              Company
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/press">Press</FooterLink>
              <FooterLink href="/investors">Investors</FooterLink>
              <FooterLink href="/legal">Legal</FooterLink>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <div className="mb-4 md:mb-0">
            <p>© {new Date().getFullYear()} HarmonyHub. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <FooterLink href="/terms">Terms of Service</FooterLink>
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/cookies">Cookie Settings</FooterLink>
            <FooterLink href="/accessibility">Accessibility</FooterLink>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 text-center text-gray-500 text-sm flex items-center justify-center"
        >
          <p>Made with</p>
          <Heart className="h-4 w-4 mx-1 text-red-500 animate-pulse" />
          <p>for the community</p>
        </motion.div>
      </div>
    </footer>
  )
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all hover:scale-110 shadow-lg"
    >
      {icon}
    </a>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-gray-400 hover:text-indigo-400 transition-colors relative group">
        {children}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full"></span>
      </Link>
    </li>
  )
}
