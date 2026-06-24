"use client";
import { Menu } from "lucide-react";

interface Props { onMenuClick: () => void; title?: string; userName?: string; }

export default function DashboardHeader({ onMenuClick, userName }: Props) {
  const initials = userName?.trim()?.[0]?.toUpperCase() ?? "U";
  const label = userName ? userName : "Admin";
  const subtitle = userName ? "User Dashboard" : "Paint Domain";

  return (
    <header className="bg-brand-black border-b border-brand-border/50 px-4 sm:px-6 py-3.5
      flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-brand-mid hover:text-white p-1.5 rounded-md
            hover:bg-brand-raised transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 pl-2 border-l border-brand-border/50">
          <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center
            text-brand-black font-bold text-xs">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-white text-xs font-medium leading-none">{label}</p>
            <p className="text-brand-mid text-[10px] mt-0.5">{subtitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
