import Link from "next/link";
import { Brush, Calculator, ShoppingBag, ArrowRight } from "lucide-react";

const services = [
  {
    icon: ShoppingBag,
    title: "Shop Premium Paints",
    description: "Browse our curated collection of interior and exterior paints in 200+ colours with professional-grade coverage.",
    href: "/shop",
    cta: "Browse Shop",
  },
  {
    icon: Brush,
    title: "Request a Painter",
    description: "Connect with our vetted, insured professional painters for residential and commercial projects of any scale.",
    href: "/painter-request",
    cta: "Request Now",
  },
  {
    icon: Calculator,
    title: "Book Inspection",
    description: "Book for site estimation in your Location and get an accurate material and labour estimate before you commit.",
    href: "/painting-estimator",
    cta: "Book Inspection",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#F8F5F0" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#C59A46" }}>
            What We Offer
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4" style={{ color: "#1F1F1F" }}>
            End-to-End Paint Solutions
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#7A7A7A" }}>
            From choosing the perfect colour to the final coat — we handle every step.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="rounded-2xl p-6 flex flex-col transition-all duration-300 group hover:-translate-y-1 bg-white shadow-sm"
                style={{
                  border: "1px solid rgba(197, 154, 70, 0.2)",
                }}
              >
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors"
                  style={{ 
                    backgroundColor: "rgba(197, 154, 70, 0.1)",
                    border: "1px solid rgba(197, 154, 70, 0.2)"
                  }}
                >
                  <Icon size={20} style={{ color: "#C59A46" }} />
                </div>
                
                <h3 className="font-semibold text-base mb-2 font-display leading-snug" style={{ color: "#1F1F1F" }}>
                  {s.title}
                </h3>
                
                <p className="text-sm leading-relaxed flex-1" style={{ color: "#7A7A7A" }}>
                  {s.description}
                </p>
                
                <Link
                  href={s.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium mt-5 group-hover:gap-2.5 transition-all"
                  style={{ color: "#C59A46" }}
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