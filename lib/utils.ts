import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind klasslarini xavfsiz birlashtiruvchi funksiya
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}