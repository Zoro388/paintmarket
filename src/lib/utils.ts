import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency", currency: "NGN", minimumFractionDigits: 0,
  }).format(amount);
}

// export function formatDate(date: string | Date) {
//   return new Intl.DateTimeFormat("en-NG", {
//     day: "numeric", month: "short", year: "numeric",
//   }).format(new Date(date));
// }

// src/lib/utils.ts

export function formatDate(date: any) {
  if (!date) return "—";
  
  const parsedDate = new Date(date);
  
  // Check if the parsed date object is valid
  if (isNaN(parsedDate.getTime())) {
    return "—"; // Fallback string if data is corrupted
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric", 
    month: "short", 
    year: "numeric"
  }).format(parsedDate);
}

// Richer semantic pills — visible on brand-card dark backgrounds
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending:    "bg-yellow-950/60 text-yellow-300 border border-yellow-800/50",
    confirmed:  "bg-blue-950/60 text-blue-300 border border-blue-800/50",
    processing: "bg-violet-950/60 text-violet-300 border border-violet-800/50",
    delivered:  "bg-emerald-950/60 text-emerald-300 border border-emerald-800/50",
    cancelled:  "bg-red-950/60 text-red-300 border border-red-800/50",
    completed:  "bg-emerald-950/60 text-emerald-300 border border-emerald-800/50",
    active:     "bg-emerald-950/60 text-emerald-300 border border-emerald-800/50",
    inactive:   "bg-brand-raised text-brand-mid border border-brand-border",
    published:  "bg-emerald-950/60 text-emerald-300 border border-emerald-800/50",
    draft:      "bg-brand-raised text-brand-mid border border-brand-border",
    paid:       "bg-emerald-950/60 text-emerald-300 border border-emerald-800/50",
    unpaid:     "bg-red-950/60 text-red-300 border border-red-800/50",
    refunded:   "bg-orange-950/60 text-orange-300 border border-orange-800/50",
    new:        "bg-blue-950/60 text-blue-300 border border-blue-800/50",
    read:       "bg-brand-raised text-brand-mid border border-brand-border",
    resolved:   "bg-emerald-950/60 text-emerald-300 border border-emerald-800/50",
  };
  return map[status?.toLowerCase()] ?? "bg-brand-raised text-brand-mid border border-brand-border";
}



