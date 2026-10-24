"use client";
import Link from "next/link";
import { useState } from "react";
import { apiSubscribeNewsletter } from "@/lib/userApi";
import { Facebook, Instagram, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { SiTiktok } from "react-icons/si";

// ── Color Constants from Palette Image ──────────────────────────────────────────
const COLORS = {
  bg: "#F8F5F0",
  primaryText: "#1F1F1F",
  secondaryText: "#7A7A7A",
  accent: "#C59A46",
};

const footerLinks = {
  Company: [
    { label: "About Us", href: "/" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Blog", href: "/blog" },
    { label: "Training", href: "/lessons" },
  ],
  Services: [
    { label: "Shop Paints", href: "/shop" },
    { label: "Request a Painter", href: "/painter-request" },
    { label: "Book Inspection", href: "/painting-estimator" },
    // { label: "Get a Quote", href: "/painter-request" },
  ],
  Support: [
    { label: "Contact Us", href: "/contact" },
    { label: "Track My Order", href: "/login" },
  ],
};

const socials = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/share/18jU4qaeHY/",
    label: "Facebook",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/smart.choiceinteriors?igsh=MXE5NDhvdTV2Z3AxYQ==",
    label: "Instagram",
  },
  {
    icon: SiTiktok,
    href: "https://www.tiktok.com/@smartchoice_interiors",
    label: "TikTok",
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await apiSubscribeNewsletter({ email });
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer className="border-t" style={{ backgroundColor: COLORS.bg, borderColor: "rgba(197, 154, 70, 0.2)" }}>

      {/* Newsletter banner */}
      <div className="bg-white border-b" style={{ borderColor: "rgba(197, 154, 70, 0.15)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-bold" style={{ color: COLORS.primaryText }}>
                Stay in the Loop
              </h3>
              <p className="text-sm mt-1" style={{ color: COLORS.secondaryText }}>
                Get tips, offers, and project inspiration to your inbox.
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="flex flex-wrap gap-2 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 md:w-72 bg-white border rounded-md px-4 py-2.5 text-sm focus:outline-none transition-all placeholder:text-gray-400"
                style={{
                  color: COLORS.primaryText,
                  borderColor: "rgba(197, 154, 70, 0.3)",
                }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-opacity flex items-center gap-2 whitespace-nowrap shadow-sm hover:opacity-90"
                style={{ backgroundColor: COLORS.accent }}
              >
                {status === "loading" ? "..." : "Subscribe"}
                <ArrowRight size={13} />
              </button>
            </form>

            {status === "done" && (
              <p className="text-sm font-semibold" style={{ color: COLORS.accent }}>
                ✓ You&apos;re subscribed!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex flex-col leading-none mb-4">
              <span className="font-display text-2xl font-bold" style={{ color: COLORS.primaryText }}>
                Paint Domain
              </span>
            </Link>
            
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: COLORS.secondaryText }}>
              Nigeria&apos;s trusted partner for premium paints and professional interior finishing.
              Quality you can see. Craftsmanship you can feel.
            </p>

            <div className="flex gap-2.5 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white border flex items-center justify-center transition-all hover:scale-105"
                  style={{
                    borderColor: "rgba(197, 154, 70, 0.3)",
                    color: COLORS.accent,
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-xs mb-4 tracking-widest uppercase" style={{ color: COLORS.primaryText }}>
                {section}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:opacity-75"
                      style={{ color: COLORS.secondaryText }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div
  className="border-t mt-10 pt-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8"
  style={{ borderColor: "rgba(197, 154, 70, 0.2)" }}
>
  {/* Phone numbers stacked vertically */}
  <div className="flex flex-col gap-2">
    {[
      "0808 4999 530",
      "081 0575 7406",
    ].map((phone) => (
      <div
        key={phone}
        className="flex items-center gap-2 text-sm"
        style={{ color: COLORS.secondaryText }}
      >
        <Phone size={14} style={{ color: COLORS.accent }} />
        <span>{phone}</span>
      </div>
    ))}
  </div>

  {/* Email */}
  <div
    className="flex items-center gap-2 text-sm"
    style={{ color: COLORS.secondaryText }}
  >
    <Mail size={14} style={{ color: COLORS.accent }} />
    <span>Paintdomain.ng@gmail.com</span>
  </div>

  {/* Address */}
  <div
    className="flex items-center gap-2 text-sm"
    style={{ color: COLORS.secondaryText }}
  >
    <MapPin size={14} style={{ color: COLORS.accent }} />
    <span>Shop 81p F01 BUILDING MATERIAL MARKET KUBWA ABUJA Nigeria</span>
  </div>
</div>

        {/* Bottom bar */}
        <div 
          className="border-t mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: "rgba(197, 154, 70, 0.2)" }}
        >
          <p className="text-xs" style={{ color: COLORS.secondaryText }}>
            © {new Date().getFullYear()} Paint Domain. All rights reserved.
          </p>
          <p className="text-xs opacity-75" style={{ color: COLORS.secondaryText }}>
            Powered by Smart-choice interior builders
          </p>
        </div>
      </div>
    </footer>
  );
}