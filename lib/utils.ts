import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isOTPValid(otp: string) {
  if (otp.length != 6) {
    return false
  }
    
  const regex = /^[0-9]+$/
  return regex.test(otp)
}
