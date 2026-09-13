import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function publicId(prefix: string) {
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
  const time = Date.now().toString(36).toUpperCase();
  return `${prefix}${time}${rand}`;
}
