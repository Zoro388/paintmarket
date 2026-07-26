// import Link from "next/link";
// import { Brush, Calculator, ShoppingBag, Layers, ArrowRight } from "lucide-react";

// const services = [
//   {
//     icon: ShoppingBag,
//     title: "Shop Premium Paints",
//     description: "Browse our curated collection of interior and exterior paints in 200+ colours with professional-grade coverage.",
//     href: "/shop",
//     cta: "Browse Shop",
//     accent: "rgba(212,175,120,0.08)",
//     border: "rgba(212,175,120,0.18)",
//   },
//   {
//     icon: Brush,
//     title: "Request a Painter",
//     description: "Connect with our vetted, insured professional painters for residential and commercial projects of any scale.",
//     href: "/painter-request",
//     cta: "Request Now",
//     accent: "rgba(99,179,237,0.06)",
//     border: "rgba(99,179,237,0.15)",
//   },
//   {
//     icon: Calculator,
//     title: "Site Estimator",
//     description: "Book for site estimation in your Location and get an accurate material and labour estimate before you commit.",
//     href: "/site-estimator",
//     cta: "Book Inspection",
//     accent: "rgba(104,211,145,0.06)",
//     border: "rgba(104,211,145,0.15)",
//   },
 
// ];

// export default function ServicesSection() {
//   return (
//     <section className="bg-brand-black py-24 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-16">
//           <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-3">
//             What We Offer
//           </p>
//           <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
//             End-to-End Paint Solutions
//           </h2>
//           <p className="text-brand-mid text-lg max-w-xl mx-auto">
//             From choosing the perfect colour to the final coat — we handle every step.
//           </p>
//         </div>

//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {services.map((s) => {
//             const Icon = s.icon;
//             return (
//               <div
//                 key={s.title}
//                 className="rounded-2xl p-6 flex flex-col transition-all duration-300 group
//                   hover:translate-y-[-2px]"
//                 style={{
//                   background: s.accent,
//                   border: `0.5px solid ${s.border}`,
//                 }}
//               >
//                 <div className="w-11 h-11 rounded-xl bg-brand-raised border border-brand-border
//                   flex items-center justify-center mb-5 group-hover:border-brand-accent/40
//                   transition-colors">
//                   <Icon size={20} className="text-brand-accent" />
//                 </div>
//                 <h3 className="text-white font-semibold text-base mb-2 font-display leading-snug">
//                   {s.title}
//                 </h3>
//                 <p className="text-brand-mid text-sm leading-relaxed flex-1">{s.description}</p>
//                 <Link
//                   href={s.href}
//                   className="inline-flex items-center gap-1.5 text-brand-accent text-sm
//                     font-medium mt-5 group-hover:gap-2.5 transition-all"
//                 >
//                   {s.cta} <ArrowRight size={13} />
//                 </Link>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }


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
    title: "Site Estimator",
    description: "Book for site estimation in your Location and get an accurate material and labour estimate before you commit.",
    href: "/site-estimator",
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