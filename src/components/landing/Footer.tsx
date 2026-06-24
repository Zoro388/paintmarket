"use client";
import Link from "next/link";
import { useState } from "react";
import { apiSubscribeNewsletter } from "@/lib/userApi";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const footerLinks = {
  Company: [
    { label: "About Us",  href: "/" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Blog",      href: "/blog" },
    { label: "Careers",   href: "/contact" },
  ],
  Services: [
    { label: "Shop Paints",       href: "/shop" },
    { label: "Request a Painter", href: "/painter-request" },
    { label: "Site Estimator",    href: "/site-estimator" },
    { label: "Get a Quote",       href: "/painter-request" },
  ],
  Support: [
    { label: "Contact Us",       href: "/contact" },
    { label: "Track My Order",   href: "/login" },
    // { label: "Privacy Policy",   href: "/" },
    // { label: "Terms of Service", href: "/" },
  ],
};

const socials = [
  { icon: Facebook,  href: "https://www.facebook.com/share/18jU4qaeHY/", label: "Facebook" },


  { icon: Instagram, href: "https://www.instagram.com/smart.choiceinteriors?igsh=MXE5NDhvdTV2Z3AxYQ==", label: "Instagram" },
  // { icon: Twitter,   href: "#", label: "Twitter" },
  // { icon: Youtube,   href: "#", label: "YouTube" },
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
    <footer className="bg-brand-surface border-t border-brand-border/50">

      {/* Newsletter banner */}
      <div className="bg-brand-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-brand-black font-display text-2xl font-bold">Stay in the Loop</h3>
              <p className="text-brand-black/65 text-sm mt-1">
                Get tips, offers, and project inspiration to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 md:w-72 bg-brand-black/12 text-brand-black placeholder-brand-black/45
                  border border-brand-black/18 rounded-md px-4 py-2.5 text-sm
                  focus:outline-none focus:border-brand-black/40"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-brand-black text-white px-5 py-2.5 rounded-md text-sm font-semibold
                  hover:bg-brand-card transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                {status === "loading" ? "..." : "Subscribe"}
                <ArrowRight size={13} />
              </button>
            </form>
            {status === "done" && (
              <p className="text-brand-black text-sm font-semibold">✓ You&apos;re subscribed!</p>
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
              <span className="font-display text-2xl font-bold text-white">Paint Domain</span>
              <span className="text-brand-accent text-[10px] tracking-[0.18em] uppercase">
                &amp; Primary Interior Builders
              </span>
            </Link>
            <p className="text-brand-mid text-sm leading-relaxed max-w-xs">
              Nigeria&apos;s trusted partner for premium paints and professional interior finishing.
              Quality you can see. Craftsmanship you can feel.
            </p>
            <div className="flex gap-2.5 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="blank"
                  aria-label={label}
                  className="w-8 h-8 rounded-full border border-brand-border flex items-center
                    justify-center text-brand-mid hover:text-brand-accent hover:border-brand-accent
                    transition-colors"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-xs mb-4 tracking-widest uppercase">
                {section}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-brand-mid text-sm hover:text-brand-accent transition-colors"
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
        <div className="border-t border-brand-border/50 mt-10 pt-8 flex flex-col md:flex-row
          items-start md:items-center gap-4 md:gap-8">
          {[
            { icon: Phone,  text: "+234 8105 757 406" },
            { icon: Mail,   text: "Paintdomain.ng@gmail.com" },
            { icon: MapPin, text: "Shop 81p F01 BUILDING MATERIAL MARKET KUBWA ABUJA Nigeria" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-brand-mid text-sm">
              <Icon size={13} className="text-brand-accent" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brand-border/50 mt-8 pt-6 flex flex-col sm:flex-row
          items-center justify-between gap-3">
          <p className="text-brand-subtle text-xs">
            © {new Date().getFullYear()} Paint Domain &amp; Primary Interior Builders. All rights reserved.
          </p>
          <p className="text-brand-subtle/50 text-xs">Powered by PaintMarket</p>
        </div>
      </div>
    </footer>
  );
}
