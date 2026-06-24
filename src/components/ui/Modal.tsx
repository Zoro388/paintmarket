"use client";
import { useEffect, ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "relative z-10 bg-brand-card border border-brand-mid rounded-xl shadow-2xl w-full max-w-lg animate-fade-in",
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-brand-mid">
            <h3 className="text-lg font-semibold text-brand-white font-display">{title}</h3>
            <button
              onClick={onClose}
              className="text-brand-mid hover:text-brand-white transition-colors p-1 rounded"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
