import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(val: number): string {
  return `${val > 0 ? "+" : ""}${val.toFixed(1)}%`;
}

export function formatHours(val: number): string {
  return `${val.toFixed(1)} hrs`;
}
