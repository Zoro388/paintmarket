"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  X,
  Settings,
  LogOut,
  Package,
  Brush,
  Calculator,
  PenTool,
  ImageIcon,
  FileText,
  Mail,
  MessageSquare,
  PenBox,
  CalendarDays,
} from "lucide-react";
import { clearToken } from "@/lib/endpointRoute";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },

  {
    label: "Inspection Bookings",
    href: "/dashboard/inspection-bookings",
    icon: CalendarDays,
  },

  { label: "Tools", href: "/dashboard/tools", icon: PenTool },
  { label: "Training", href: "/dashboard/lesson", icon: PenBox },

  // { label: "Products", href: "/dashboard/products", icon: Package },
  // { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },

  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: ImageIcon },
  { label: "Blog", href: "/dashboard/blog", icon: FileText },
  { label: "Banner", href: "/dashboard/banner", icon: Settings },
  { label: "Newsletter", href: "/dashboard/newsletter", icon: Mail },
  { label: "Contact", href: "/dashboard/contact", icon: MessageSquare },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Profile", href: "/dashboard/profile", icon: Users },

  // { label: "Leads", href: "/dashboard/leads", icon: Users },
];

interface Props {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function DashboardSidebar({
  mobileOpen,
  onClose,
}: Props) {
  const pathname = usePathname();

  const handleLogout = () => {
    clearToken();
    window.location.href = "/login";
  };

  const content = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="border-b border-brand-border/50 px-5 pb-5 pt-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex flex-col leading-none">
            <span className="font-display text-xl font-bold tracking-tight text-white transition-colors duration-200 group-hover:text-brand-accent">
              Paint Domain
            </span>

            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-accent">
              {/* Brand tagline */}
            </span>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close navigation"
              className="rounded p-1 text-brand-mid transition-colors hover:text-white lg:hidden"
            >
              <X size={17} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href ||
            (href === "/dashboard/inspection-bookings" &&
              pathname.startsWith("/dashboard/inspection-bookings/"));

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150",
                active
                  ? "bg-brand-accent font-semibold text-brand-black"
                  : "text-grey-400 hover:bg-brand-raised hover:text-white"
              )}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-brand-border/50 px-3 pb-5 pt-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-brand-mid transition-colors hover:bg-red-950/30 hover:text-red-400"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden min-h-screen w-60 flex-col border-r border-brand-border/50 bg-brand-black lg:flex">
        {content}
      </aside>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/70 lg:hidden"
            onClick={onClose}
          />

          <aside className="animate-slide-in fixed bottom-0 left-0 top-0 z-50 w-64 border-r border-brand-border/50 bg-brand-black lg:hidden">
            {content}
          </aside>
        </>
      )}
    </>
  );
}
