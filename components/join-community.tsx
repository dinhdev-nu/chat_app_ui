"use client"

import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, MessageCircle, Star, Check } from "lucide-react"
import { FloatingParticles } from "@/components/floating-particles"

const stats = [
  { icon: <Users className="h-6 w-6 text-indigo-400" />, value: "10K+", label: "Community Members" },
  { icon: <MessageCircle className="h-6 w-6 text-indigo-400" />, value: "500+", label: "Active Channels" },
  { icon: <Star className="h-6 w-6 text-indigo-400" />, value: "24/7", label: "Live Support" },
]

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: ["Join unlimited communities", "Access to public channels", "Direct messaging", "Mobile app access"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$5",
    period: "per month",
    description: "Everything you need for active communities",
    features: [
      "All Free features",
      "HD video streaming",
      "Screen sharing",
      "Custom emojis",
      "Advanced moderation tools",
      "Priority support",
    ],
    cta: "Upgrade Now",
    popular: true,
  },
]

export default function JoinCommunity() {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const [activeTab, setActiveTab] = useState("join")

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }

    // Pre-load both tab contents to avoid loading delay
    controls.start("visible")
  }, [controls, inView])

  return (
    <section className="py-20 px-6 relative overflow-hidden" ref={ref}>
      {/* Floating particles */}
      <div className="absolute inset-0 z-0">
        <FloatingParticles count={20} />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <span className="h-px w-8 bg-indigo-500/50"></span>
            <span className="mx-4 text-indigo-400 font-medium">JOIN OUR COMMUNITY</span>
            <span className="h-px w-8 bg-indigo-500/50"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Ready to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              Connect
            </span>
            ?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join thousands of members and start building meaningful connections today.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
          }}
          className="max-w-4xl mx-auto"
        >
          {/* Tabs */}
          <div className="flex justify-center mb-10">
            <div className="bg-[#1a1b26]/80 backdrop-blur-md rounded-full p-1 flex">
              <button
                onClick={() => {
                  setActiveTab("join")
                  // Force immediate animation update
                  controls.start("visible")
                }}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "join" ? "bg-indigo-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
                }`}
              >
                Join Now
              </button>
              <button
                onClick={() => {
                  setActiveTab("plans")
                  // Force immediate animation update
                  controls.start("visible")
                }}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "plans" ? "bg-indigo-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
                }`}
              >
                Plans
              </button>
            </div>
          </div>

          {activeTab === "join" && (
            <>
              {/* Stats section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial="hidden"
                    animate={controls}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                    }}
                    className="bg-[#1e1f2e]/80 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center shadow-lg hover:border-indigo-500/30 transition-colors"
                  >
                    <div className="flex justify-center mb-2">{stat.icon}</div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* CTA card */}
              <motion.div
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                }}
                className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl p-10 border border-indigo-500/30 text-center relative overflow-hidden shadow-[0_0_25px_rgba(79,70,229,0.2)]"
              >
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Join?</h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Connect with thousands of members, join conversations, and be part of something special. Our community
                  is waiting for you!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all"
                  >
                    Join Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-indigo-500 hover:bg-indigo-500/20 transition-all"
                  >
                    Learn More
                  </Button>
                </div>
                <p className="mt-6 text-gray-400 text-sm">
                  Already a member?{" "}
                  <a href="#" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">
                    Sign in
                  </a>
                </p>
              </motion.div>
            </>
          )}

          {activeTab === "plans" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate={controls}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                  }}
                  className={`bg-[#1e1f2e]/80 backdrop-blur-md rounded-xl p-8 border ${
                    plan.popular ? "border-indigo-500/50" : "border-white/10"
                  } relative overflow-hidden shadow-lg ${
                    plan.popular ? "shadow-indigo-500/20" : ""
                  } hover:shadow-indigo-500/20 transition-all`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Popular</div>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400 ml-2">{plan.period}</span>
                    </div>
                    <p className="text-gray-400 mt-2">{plan.description}</p>
                  </div>
                  <div className="mb-8">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-indigo-500 mr-2 shrink-0 mt-0.5" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
