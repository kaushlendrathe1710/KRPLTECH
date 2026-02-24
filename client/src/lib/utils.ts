import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validate Indian-style 10-digit mobile numbers starting with 6-9.
 */
export function isValidMobile(mobile: string) {
  return /^[6-9]\d{9}$/.test(mobile);
}
