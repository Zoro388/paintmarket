import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gold" | "success" | "warning" | "danger";
}

export default function Badge({ children, className, variant = "default" }: BadgeProps) {
  const variants = {
    default: "bg-brand-card text-brand-lt-gray border border-brand-mid",
    gold:    "bg-brand-accent/20 text-brand-accent border border-brand-accent/40",
    success: "bg-green-900/40 text-green-400 border border-green-700",
    warning: "bg-yellow-900/40 text-yellow-400 border border-yellow-700",
    danger:  "bg-red-900/40 text-red-400 border border-red-700",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}
