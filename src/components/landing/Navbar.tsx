

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown, ShoppingCart, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiGetCart, userGetStatus } from "@/lib/userApi";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
const navLinks = [
  { label: "Home",      href: "/" },
  { label: "Shop",      href: "/shop" },
  { label: "Portfolio", href: "/portfolio" },
  {
    label: "Services",
    children: [
      { label: "Request a Painter", href: "/painter-request" },
      { label: "Site Estimator",    href: "/site-estimator" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

interface CartItem {
  quantity: number;
  selectedColour: string;
}

interface AuthStatus {
  success: boolean;
  authenticated: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ── Auth status ───────────────────────────────────────────────────────────
  const { data: authData } = useQuery<AuthStatus>({
    queryKey: ["auth-status"],
    queryFn: async () => {
      try {
        return (await userGetStatus()) as AuthStatus;
      } catch {
        return { success: false, authenticated: false };
      }
    },
    staleTime: 1000 * 60 * 5, // re-check every 5 minutes
    retry: false,
  });
console.log(authData)
  const isAuthenticated = authData?.authenticated === true;
  const authUser = authData?.user;

  // ── Cart count ────────────────────────────────────────────────────────────
  const { data: fetchedItems } = useQuery<CartItem[]>({
    queryKey: ["cart-product"],
    queryFn: async () => {
      const res = await apiGetCart();
      const rawItems = res?.cart?.items ?? res?.data ?? [];
      return rawItems as CartItem[];
    },
    enabled: isAuthenticated, // only fetch cart if user is logged in
  });

  const cartCount = fetchedItems ? fetchedItems.length : 0;

  // ── Shared cart icon element ──────────────────────────────────────────────
  const CartIcon = ({ onClick }: { onClick?: () => void }) => (
    <Link
      href="/cart"
      onClick={onClick}
      className="relative flex items-center justify-center text-brand-lt-gray hover:text-brand-white transition-colors"
    >
      <ShoppingCart size={20} />
      {cartCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white
          text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
          {cartCount}
        </span>
      )}
    </Link>
  );

  // ── Shared auth button element ────────────────────────────────────────────
  const AuthButton = ({ mobile = false, onClick }: { mobile?: boolean; onClick?: () => void }) => {
    if (isAuthenticated && authUser) {
      return (
        <Link
          href={`${authUser.role === "admin" ? "/dashboard" : "/user-dashboard"}`}
          onClick={onClick}
          className={cn(
            "flex items-center gap-2 transition-colors group",
            mobile
              ? "px-3 py-2.5 text-sm text-brand-mid hover:text-white rounded-lg hover:bg-brand-raised"
              : "text-brand-mid hover:text-white"
          )}
          title={authUser.email}
        >
          <div className="w-7 h-7 rounded-full bg-brand-accent flex items-center justify-center
            text-brand-black font-bold text-xs flex-shrink-0">
            {authUser.email?.[0]?.toUpperCase() ?? "U"}
          </div>
          {mobile && (
            <span className="text-sm">{authUser.email}</span>
          )}
        </Link>
      );
    }

    return (
      <Link
        href="/login"
        onClick={onClick}
        className={cn(
          "text-sm text-brand-mid hover:text-white transition-colors",
          mobile ? "px-3 py-2.5 rounded-lg hover:bg-brand-raised" : "px-3 py-2"
        )}
      >
        Login
      </Link>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-brand-black/90 backdrop-blur-md border-b border-brand-border/60 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            {/* <span className="text-white font-display text-xl font-bold tracking-tight
              group-hover:text-brand-accent transition-colors duration-200">
              Paint Domain
            </span>
            <span className="text-brand-accent text-[10px] tracking-[0.18em] uppercase font-medium">
              &amp; Primary Interior Builders
            </span> */}
          <Image 
          src={"https://www.image2url.com/r2/default/images/1782374205744-637a3eeb-522f-45bb-8406-b9fa513d453f.png"}
           className
          ="h-10 object-cover" alt="logo" height={50} width={100} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm text-brand-mid
                    hover:text-white transition-colors rounded-md">
                    {link.label}
                    <ChevronDown size={13} className={cn("transition-transform duration-200",
                      servicesOpen && "rotate-180")} />
                  </button>

                  {servicesOpen && (
                    <div className="absolute top-full left-0 pt-1.5 w-52 z-50 animate-fade-in">
                      <div className="bg-brand-card border border-brand-border rounded-xl shadow-2xl py-1.5">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-brand-mid
                              hover:text-white hover:bg-brand-raised transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className={cn(
                    "px-3 py-2 text-sm rounded-md transition-colors",
                    pathname === link.href
                      ? "text-brand-accent"
                      : "text-brand-mid hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <CartIcon />
            <AuthButton />
            <Link
              href="/painter-request"
              className="bg-brand-accent text-brand-black text-sm font-semibold
                px-5 py-2.5 rounded-md hover:bg-brand-accent-lt transition-colors"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-white p-2 rounded-md hover:bg-brand-raised transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-brand-black border-t border-brand-border/60 z-30
          px-4 py-4 flex flex-col gap-0.5 animate-fade-in">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <p className="px-3 py-2 text-[10px] text-brand-accent uppercase tracking-[0.15em]
                  font-semibold">
                  {link.label}
                </p>
                {link.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-6 py-2.5 text-sm text-brand-mid
                      hover:text-white transition-colors"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href!}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-3 py-2.5 text-sm rounded-lg transition-colors",
                  pathname === link.href
                    ? "text-brand-accent bg-brand-accent-muted"
                    : "text-brand-mid hover:text-white hover:bg-brand-raised"
                )}
              >
                {link.label}
              </Link>
            )
          )}

          {/* Mobile bottom CTAs */}
          <div className="border-t border-brand-border/60 mt-2 pt-3 flex flex-col gap-2">
            <div className="flex items-center gap-3 px-3 py-2">
              <CartIcon onClick={() => setMobileOpen(false)} />
              <span className="text-brand-mid text-xs">Cart{cartCount > 0 ? ` (${cartCount})` : ""}</span>
            </div>
            <AuthButton mobile onClick={() => setMobileOpen(false)} />
            <Link
              href="/painter-request"
              onClick={() => setMobileOpen(false)}
              className="bg-brand-accent text-brand-black text-sm font-semibold
                px-5 py-2.5 rounded-md text-center hover:bg-brand-accent-lt transition-colors"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}