// import Link from "next/link";
// import { ArrowRight, Phone } from "lucide-react";

// export default function CTASection() {
//   return (
//     <section className="bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto text-center">
//         <h2 className="font-display text-4xl sm:text-5xl font-bold text-brand-black mb-5 leading-tight">
//          Ready to Make Your House Stand Out?
//         </h2>
//         <p className="text-brand-black/65 text-lg mb-10 max-w-xl mx-auto">
//          No dull yourself. Whether you don already know wetin you want or you still dey find ideas, we don gather everything for one place.
//         </p>
//         <div className="flex flex-wrap justify-center gap-4">
//           <Link
//             href="/painter-request"
//             className="flex items-center gap-2 bg-brand-black text-white font-semibold
//               px-8 py-4 rounded-md hover:bg-brand-surface transition-colors"
//           >
//             Shop Premium Paints →
//  <ArrowRight size={16} />
//           </Link>
//           <Link
//             href="/site-estimator"
//             className="flex items-center gap-2 bg-transparent border-2 border-brand-black
//               text-brand-black font-semibold px-8 py-4 rounded-md
//               hover:bg-brand-black hover:text-white transition-colors"
//           >
//             <Phone size={16} /> Book Site Inspection
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

// ── Color Constants from Palette Image ──────────────────────────────────────────
const COLORS = {
  bg: "#F8F5F0",
  primaryText: "#1F1F1F",
  secondaryText: "#7A7A7A",
  accent: "#C59A46",
};

export default function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t" style={{ backgroundColor: COLORS.bg, borderColor: "rgba(197, 154, 70, 0.15)" }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-5 leading-tight" style={{ color: COLORS.primaryText }}>
          Ready to Make Your House Stand Out?
        </h2>
        
        <p className="text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: COLORS.secondaryText }}>
          No dull yourself. Whether you don already know wetin you want or you still dey find ideas, we don gather everything for one place.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/painter-request"
            className="flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-md shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md"
            style={{ backgroundColor: COLORS.accent }}
          >
            <span>Shop Premium Paints</span>
            <ArrowRight size={16} />
          </Link>
          
          <Link
            href="/site-estimator"
            className="flex items-center gap-2 bg-white font-semibold px-8 py-4 rounded-md border transition-all duration-200 hover:bg-amber-50/30"
            style={{
              borderColor: COLORS.accent,
              color: COLORS.primaryText,
            }}
          >
            <Phone size={16} style={{ color: COLORS.accent }} />
            <span>Book Site Inspection</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
