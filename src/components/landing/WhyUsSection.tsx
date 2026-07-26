

// import { ShoppingCart, Image, Calculator, Users, ClipboardCheck, GraduationCap, ArrowRight } from "lucide-react";

// const reasons = [
//   {
//     icon: ShoppingCart,
//     title: "Shop Premium Paints",
//     desc: "Order quality paints and decorative finishes online from the comfort of your home.",
//     cta: "Shop Now",
//   },
//   {
//     icon: Image,
//     title: "See Real Projects",
//     desc: "Explore completed projects, colours and finishes to inspire and help you choose with confidence.",
//     cta: "Explore Projects",
//   },
//   {
//     icon: Calculator,
//     title: "Estimate with Confidence",
//     desc: "Know exactly how much paint you need for your project before you spend a naira.",
//     cta: "Calculate Now",
//   },
//   {
//     icon: Users,
//     title: "Find Trusted Painters",
//     desc: "Hire experienced painters near you. Compare reviews, ratings and past projects with ease.",
//     cta: "Find a Painter",
//   },
//   {
//     icon: ClipboardCheck,
//     title: "Book a Site Inspection",
//     desc: "Get professional measurements and a detailed quotation before your project begins.",
//     cta: "Book Inspection",
//   },
//   {
//     icon: GraduationCap,
//     title: "Learn & Grow",
//     desc: "Access expert guides, tips and training to improve your skills and grow in the painting industry.",
//     cta: "Start Learning",
//   },
// ];

// export default function WhyUsSection() {
//   return (
//     <section className="bg-brand-offwhite py-24 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="grid lg:grid-cols-2 gap-16 items-center">

//           {/* Left text */}
//           <div className="on-light">
//             <p className="text-brand-accent-dk text-xs font-semibold tracking-[0.2em] uppercase mb-3">
//               Why Paint Domain
//             </p>
//             <h2 className="font-display text-4xl sm:text-5xl font-bold text-brand-black mb-5 leading-tight">
//               Build a Home You'll Be Proud to

//               <span style={{ color: "#A8842E" }}> Show Off</span>
//             </h2>
//             <p className="text-gray-600 text-lg leading-relaxed mb-8">
//              Your home is one of your biggest investments—it deserves the best.

// With Paint Domain, you can shop premium paints, explore inspiring projects, choose colours you'll love, calculate exactly what you need, book a professional site inspection, hire experienced painters, and learn from trusted experts—all from the comfort of your home.

// No guesswork. No unnecessary spending. Just smarter decisions and results that speak for themselves.
//             </p>
//             <div className="flex flex-wrap gap-4">
//               {[
//                 { value: "8+", label: "Years of Excellence" },
//                 { value: "18",  label: "States Covered" },
//                 { value: "500+", label: "Certified Painters" },
//               ].map((s) => (
//                 <div key={s.label} className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
//                   <p className="font-bold text-3xl font-display" style={{ color: "#A8842E" }}>{s.value}</p>
//                   <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right grid */}
//           <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
//             {/* {reasons.map((r) => {
//               const Icon = r.icon;
//               return (
//                 <div
//                   key={r.title}
//                   className="bg-white border border-gray-100 rounded-xl p-5
//                     hover:shadow-md hover:border-gray-200 transition-all group"
//                 >
//                   <div className="w-9 h-9 rounded-lg bg-brand-black flex items-center
//                     justify-center mb-3 group-hover:bg-brand-accent transition-colors">
//                     <Icon size={16} className="text-brand-accent group-hover:text-brand-black transition-colors" />
//                   </div>
//                   <h4 className="text-brand-black font-semibold text-sm mb-1">{r.title}</h4>
//                   <p className="text-gray-500 text-xs leading-relaxed">{r.desc}</p>
//                 </div>
//               );
//             })} */}

//             {reasons.map((card) => {
//             const Icon = card.icon;
//             return (
//               <div
//                 key={card.title}
//                   className="bg-white border border-gray-100 rounded-xl p-5
//                     hover:shadow-md hover:border-gray-200 transition-all group"
//                 // className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start"
//               >
//                 <div className="w-16 h-16 rounded-xl bg-black flex items-center justify-center mb-6">
//                   <Icon size={28} className="text-brand-accent" />
//                 </div>
//                 <h3 className="font-display text-1xl font-bold text-brand-black mb-3 md:text-l">
//                   {card.title}
//                 </h3>
//                 <p className="text-gray-600 text-base leading-relaxed mb-8 flex-grow">
//                   {card.desc}
//                 </p>
//                 <a
//                   href="#"
//                   className="inline-flex items-center text-brand-accent font-semibold text-lg group"
//                 >
//                   {card.cta}
//                   <ArrowRight
//                     size={20}
//                     className="ml-2 transform transition-transform group-hover:translate-x-1"
//                   />
//                 </a>
//               </div>
//             );
//           })}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import { ShoppingCart, Image, Calculator, Users, ClipboardCheck, GraduationCap, ArrowRight } from "lucide-react";

// ── Color Constants from Palette Image ──────────────────────────────────────────
const COLORS = {
  bg: "#F8F5F0",
  primaryText: "#1F1F1F",
  secondaryText: "#7A7A7A",
  accent: "#C59A46",
};

const reasons = [
  {
    icon: ShoppingCart,
    title: "Shop Premium Paints",
    desc: "Order quality paints and decorative finishes online from the comfort of your home.",
    cta: "Shop Now",
  },
  {
    icon: Image,
    title: "See Real Projects",
    desc: "Explore completed projects, colours and finishes to inspire and help you choose with confidence.",
    cta: "Explore Projects",
  },
  {
    icon: Calculator,
    title: "Estimate with Confidence",
    desc: "Know exactly how much paint you need for your project before you spend a naira.",
    cta: "Calculate Now",
  },
  {
    icon: Users,
    title: "Find Trusted Painters",
    desc: "Hire experienced painters near you. Compare reviews, ratings and past projects with ease.",
    cta: "Find a Painter",
  },
  {
    icon: ClipboardCheck,
    title: "Book a Site Inspection",
    desc: "Get professional measurements and a detailed quotation before your project begins.",
    cta: "Book Inspection",
  },
  {
    icon: GraduationCap,
    title: "Learn & Grow",
    desc: "Access expert guides, tips and training to improve your skills and grow in the painting industry.",
    cta: "Start Learning",
  },
];

export default function WhyUsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: COLORS.bg }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left text */}
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: COLORS.accent }}>
              Why Paint Domain
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-5 leading-tight" style={{ color: COLORS.primaryText }}>
              Build a Home You'll Be Proud to{" "}
              <span style={{ color: COLORS.accent }}>Show Off</span>
            </h2>
            <p className="text-lg leading-relaxed mb-8" style={{ color: COLORS.secondaryText }}>
              Your home is one of your biggest investments—it deserves the best.
              <br /><br />
              With Paint Domain, you can shop premium paints, explore inspiring projects, choose colours you'll love, calculate exactly what you need, book a professional site inspection, hire experienced painters, and learn from trusted experts—all from the comfort of your home.
              <br /><br />
              No guesswork. No unnecessary spending. Just smarter decisions and results that speak for themselves.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              {[
                { value: "8+", label: "Years of Excellence" },
                { value: "18", label: "States Covered" },
                { value: "500+", label: "Certified Painters" },
              ].map((s) => (
                <div 
                  key={s.label} 
                  className="bg-white rounded-xl px-5 py-4 shadow-sm border transition-all"
                  style={{ borderColor: "rgba(197, 154, 70, 0.2)" }}
                >
                  <p className="font-bold text-3xl font-display" style={{ color: COLORS.accent }}>
                    {s.value}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: COLORS.secondaryText }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {reasons.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 group flex flex-col hover:-translate-y-1 hover:shadow-md"
                  style={{ borderColor: "rgba(197, 154, 70, 0.2)" }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors"
                    style={{ 
                      backgroundColor: "rgba(197, 154, 70, 0.1)", 
                      border: "1px solid rgba(197, 154, 70, 0.2)" 
                    }}
                  >
                    <Icon size={22} style={{ color: COLORS.accent }} />
                  </div>
                  
                  <h3 className="font-display font-semibold text-base mb-2 leading-snug" style={{ color: COLORS.primaryText }}>
                    {card.title}
                  </h3>
                  
                  <p className="text-xs leading-relaxed mb-6 flex-grow" style={{ color: COLORS.secondaryText }}>
                    {card.desc}
                  </p>
                  
                  <a
                    href="#"
                    className="inline-flex items-center text-sm font-medium gap-1.5 group-hover:gap-2.5 transition-all mt-auto"
                    style={{ color: COLORS.accent }}
                  >
                    {card.cta}
                    <ArrowRight size={14} className="transform transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
