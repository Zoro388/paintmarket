"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ShoppingCart, Users, X, LogOut } from "lucide-react";
import { clearToken } from "@/lib/endpointRoute";

const navItems = [
  { label: "Overview",      href: "/user-dashboard",              icon: LayoutDashboard },
  { label: "Order History", href: "/user-dashboard/orderhistory", icon: ShoppingCart },
  { label: "Profile",       href: "/user-dashboard/profile",      icon: Users },
];

interface Props { mobileOpen?: boolean; onClose?: () => void; }

export default function DashboardSidebar({ mobileOpen, onClose }: Props) {
  const pathname = usePathname();

  const handleLogout = () => {
    clearToken();
    window.location.href = "/login";
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-brand-border/50">
        <div className="flex items-center justify-between">
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold text-white">Paint Domain</span>
            <span className="text-brand-accent text-[9px] tracking-[0.18em] uppercase font-medium">
              User Panel
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-brand-mid hover:text-white p-1 rounded transition-colors"
            >
              <X size={17} />
            </button>
          )}
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
                active
                  ? "bg-brand-accent text-brand-black font-semibold"
                  : "text-grey-400 hover:text-white hover:bg-brand-raised"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t border-brand-border/50 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-brand-mid
            hover:text-red-400 hover:bg-red-950/30 rounded-lg w-full transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-brand-black
        border-r border-brand-border/50 fixed top-0 left-0 z-30">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-40 lg:hidden"
            onClick={onClose}
          />
          <aside className="fixed top-0 left-0 bottom-0 w-64 bg-brand-black
            border-r border-brand-border/50 z-50 lg:hidden animate-slide-in">
            {content}
          </aside>
        </>
      )}
    </>
  );
}
