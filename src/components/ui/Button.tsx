"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "gold" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-black";

    const variants = {
      primary: "bg-brand-white text-brand-black hover:bg-brand-accent hover:text-brand-black border border-brand-white hover:border-brand-accent",
      outline: "bg-transparent text-brand-white border border-brand-white hover:bg-brand-white hover:text-brand-black",
      ghost:   "bg-transparent text-brand-mid hover:text-brand-white hover:bg-brand-card border border-transparent",
      gold:    "bg-brand-accent text-brand-black hover:bg-brand-accent-lt border border-brand-accent font-semibold",
      danger:  "bg-red-600 text-white hover:bg-red-700 border border-red-600",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded",
      md: "px-5 py-2.5 text-sm rounded-md",
      lg: "px-8 py-3.5 text-base rounded-md",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
