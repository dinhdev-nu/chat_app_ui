"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, ArrowRight, CheckCircle, ChevronLeft } from "lucide-react"
import { FloatingParticles } from "@/components/floating-particles"

type RegistrationStep = "email" | "otp" | "password" | "success"

export default function RegistrationForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("email")
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  // Memoize handlers to prevent recreation on each render
  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      if (value.length > 1) {
        value = value.slice(0, 1)
      }

      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        if (nextInput) {
          nextInput.focus()
        }
      }
    },
    [otp],
  )

  const handleOtpKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`)
        if (prevInput) {
          prevInput.focus()
        }
      }
    },
    [otp],
  )

  const handleEmailSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate API call to check email and send OTP
    setTimeout(() => {
      setIsLoading(false)
      setCurrentStep("otp")
    }, 1500)
  }, [])

  const handleOtpSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setError("")

      const otpValue = otp.join("")
      if (otpValue.length !== 6) {
        setError("Please enter a valid 6-digit code")
        return
      }

      setIsLoading(true)

      // Simulate API call to verify OTP
      setTimeout(() => {
        setIsLoading(false)
        setCurrentStep("password")
      }, 1500)
    },
    [otp],
  )

  const handlePasswordSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setError("")

      if (password.length < 8) {
        setError("Password must be at least 8 characters long")
        return
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      setIsLoading(true)

      // Simulate API call to create account
      setTimeout(() => {
        setIsLoading(false)
        setCurrentStep("success")

        // Redirect to home after success
        setTimeout(() => {
          router.push("/")
        }, 3000)
      }, 1500)
    },
    [password, confirmPassword, router],
  )

  // Memoize progress calculation
  const getProgress = useMemo(() => {
    switch (currentStep) {
      case "email":
        return 25
      case "otp":
        return 50
      case "password":
        return 75
      case "success":
        return 100
      default:
        return 0
    }
  }, [currentStep])

  // Memoize step indicators to prevent recreation on each render
  const stepIndicators = useMemo(
    () => (
      <div className="px-6 pt-4 flex justify-between">
        <div className="flex items-center text-xs text-gray-400">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
              currentStep === "email"
                ? "bg-indigo-500 text-white"
                : currentStep === "otp" || currentStep === "password" || currentStep === "success"
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "bg-white/10 text-gray-400"
            }`}
          >
            1
          </div>
          <span>Email</span>
        </div>
        <div className="flex items-center text-xs text-gray-400">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
              currentStep === "otp"
                ? "bg-indigo-500 text-white"
                : currentStep === "password" || currentStep === "success"
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "bg-white/10 text-gray-400"
            }`}
          >
            2
          </div>
          <span>Verify</span>
        </div>
        <div className="flex items-center text-xs text-gray-400">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
              currentStep === "password"
                ? "bg-indigo-500 text-white"
                : currentStep === "success"
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "bg-white/10 text-gray-400"
            }`}
          >
            3
          </div>
          <span>Password</span>
        </div>
      </div>
    ),
    [currentStep],
  )

  return (
    <div className="relative">
      {/* Decorative elements - reduced particle count */}
      <div className="absolute inset-0 -z-10">
        <FloatingParticles count={5} /> {/* Reduced from 10 to 5 */}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1e1f2e]/80 backdrop-blur-md rounded-xl border border-indigo-500/20 overflow-hidden shadow-[0_0_15px_rgba(79,70,229,0.15)] max-h-[90vh] w-[450px] mx-auto"
      >
        {/* Header */}
        <div className="p-3 border-b border-white/10 flex items-center justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-indigo-500" />
            <span className="text-white font-medium">HarmonyHub</span>
          </Link>
          <span className="mx-2 text-gray-500">|</span>
          <h1 className="text-lg font-medium text-white">Create Account</h1>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-[#1a1b26]">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: `${getProgress}%` }}
            animate={{ width: `${getProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Step indicator */}
        {stepIndicators}

        {/* Form content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {currentStep === "email" && (
              <motion.div
                key="email-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">Get started</h2>
                    <p className="text-sm text-gray-400">Enter your email to create an account</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-300">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-[#1a1b26] border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500/20"
                    />
                  </div>

                  {error && <div className="text-red-500 text-sm">{error}</div>}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </motion.div>
            )}

            {currentStep === "otp" && (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">Verify your email</h2>
                    <p className="text-sm text-gray-400">
                      We've sent a 6-digit code to <span className="text-indigo-400">{email}</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="otp-0" className="text-sm font-medium text-gray-300">
                      Verification Code
                    </label>
                    <div className="flex justify-between gap-2">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="bg-[#1a1b26] border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500/20 w-12 h-12 text-center text-lg"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Didn't receive a code?{" "}
                      <button type="button" className="text-indigo-400 hover:text-indigo-300">
                        Resend
                      </button>
                    </p>
                  </div>

                  {error && <div className="text-red-500 text-sm">{error}</div>}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep("email")}
                      className="border-white/10 text-white hover:bg-white/5"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Verifying...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          Verify
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {currentStep === "password" && (
              <motion.div
                key="password-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">Create password</h2>
                    <p className="text-sm text-gray-400">Set a secure password for your new account</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-[#1a1b26] border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500/20"
                    />
                    <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium text-gray-300">
                      Confirm Password
                    </label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-[#1a1b26] border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500/20"
                    />
                  </div>

                  {error && <div className="text-red-500 text-sm">{error}</div>}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep("otp")}
                      className="border-white/10 text-white hover:bg-white/5"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating account...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {currentStep === "success" && (
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="h-10 w-10 text-indigo-500" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
                <p className="text-gray-400 mb-6">
                  Your account has been successfully created. Redirecting you to the home page...
                </p>

                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {currentStep !== "success" && (
          <div className="p-6 border-t border-white/10 bg-[#1a1b26]/50 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        )}
      </motion.div>

      {/* Decorative bottom element */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-4 text-center text-gray-500 text-xs flex items-center justify-center"
      >
        <p>Protected by enterprise-grade security</p>
      </motion.div>
    </div>
  )
}
