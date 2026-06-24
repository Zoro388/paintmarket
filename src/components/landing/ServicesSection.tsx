import Link from "next/link";
import { Brush, Calculator, ShoppingBag, Layers, ArrowRight } from "lucide-react";

const services = [
  {
    icon: ShoppingBag,
    title: "Shop Premium Paints",
    description: "Browse our curated collection of interior and exterior paints in 200+ colours with professional-grade coverage.",
    href: "/shop",
    cta: "Browse Shop",
    accent: "rgba(212,175,120,0.08)",
    border: "rgba(212,175,120,0.18)",
  },
  {
    icon: Brush,
    title: "Request a Painter",
    description: "Connect with our vetted, insured professional painters for residential and commercial projects of any scale.",
    href: "/painter-request",
    cta: "Request Now",
    accent: "rgba(99,179,237,0.06)",
    border: "rgba(99,179,237,0.15)",
  },
  {
    icon: Calculator,
    title: "Site Estimator",
    description: "Book for site estimation in your Location and get an accurate material and labour estimate before you commit.",
    href: "/site-estimator",
    cta: "Book Inspection",
    accent: "rgba(104,211,145,0.06)",
    border: "rgba(104,211,145,0.15)",
  },
  {
    icon: Layers,
    title: "Interior Design",
    description: "Get expert colour consultation and interior finishing advice tailored to your space and lifestyle.",
    href: "/contact",
    cta: "Learn More",
    accent: "rgba(182,130,255,0.06)",
    border: "rgba(182,130,255,0.15)",
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-brand-black py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            What We Offer
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            End-to-End Paint Solutions
          </h2>
          <p className="text-brand-mid text-lg max-w-xl mx-auto">
            From choosing the perfect colour to the final coat — we handle every step.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="rounded-2xl p-6 flex flex-col transition-all duration-300 group
                  hover:translate-y-[-2px]"
                style={{
                  background: s.accent,
                  border: `0.5px solid ${s.border}`,
                }}
              >
                <div className="w-11 h-11 rounded-xl bg-brand-raised border border-brand-border
                  flex items-center justify-center mb-5 group-hover:border-brand-accent/40
                  transition-colors">
                  <Icon size={20} className="text-brand-accent" />
                </div>
                <h3 className="text-white font-semibold text-base mb-2 font-display leading-snug">
                  {s.title}
                </h3>
                <p className="text-brand-mid text-sm leading-relaxed flex-1">{s.description}</p>
                <Link
                  href={s.href}
                  className="inline-flex items-center gap-1.5 text-brand-accent text-sm
                    font-medium mt-5 group-hover:gap-2.5 transition-all"
                >
                  {s.cta} <ArrowRight size={13} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
