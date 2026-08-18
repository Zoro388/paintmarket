



// const testimonials = [
//   {
//     name: "Adaeze Okonkwo", role: "Homeowner, Lekki", rating: 5,
//     quote: "Paint Domain transformed my entire apartment. The painters were professional, punctual, and the colour consultations were spot on. I wouldn't use anyone else.",
//   },
//   {
//     name: "Emeka Nwosu", role: "Property Developer, Abuja", rating: 5,
//     quote: "We've used Paint Domain across 12 properties. Their site estimators are accurate, their delivery is reliable, and quality is always consistent.",
//   },
//   {
//     name: "Fatima Abdullahi", role: "Property Developer, Kano", rating: 5,
//     quote: "The colour range is exceptional and the team genuinely understands interior aesthetics. My clients always love the results.",
//   },
// ];

// // ── Color Constants from Palette Image ──────────────────────────────────────────
// const COLORS = {
//   bg: "#F8F5F0",
//   primaryText: "#1F1F1F",
//   secondaryText: "#7A7A7A",
//   accent: "#C59A46",
// };

// function Stars({ count }: { count: number }) {
//   return (
//     <div className="flex gap-0.5">
//       {Array.from({ length: count }).map((_, i) => (
//         <svg key={i} className="w-4 h-4 fill-current" style={{ color: COLORS.accent }} viewBox="0 0 20 20">
//           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//         </svg>
//       ))}
//     </div>
//   );
// }

// export default function TestimonialsSection() {
//   return (
//     <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: COLORS.bg }}>
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-16">
//           <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: COLORS.accent }}>
//             Client Stories
//           </p>
//           <h2 className="font-display text-4xl sm:text-5xl font-bold" style={{ color: COLORS.primaryText }}>
//             What Our Clients Say
//           </h2>
//         </div>
        
//         <div className="grid md:grid-cols-3 gap-6">
//           {testimonials.map((t) => (
//             <div
//               key={t.name}
//               className="bg-white rounded-2xl p-7 flex flex-col gap-4 shadow-sm border transition-all duration-300 hover:shadow-md hover:-translate-y-1"
//               style={{ borderColor: "rgba(197, 154, 70, 0.2)" }}
//             >
//               <Stars count={t.rating} />
              
//               <p className="text-sm leading-relaxed flex-1" style={{ color: COLORS.secondaryText }}>
//                 &ldquo;{t.quote}&rdquo;
//               </p>
              
//               <div 
//                 className="flex items-center gap-3 pt-4 border-t" 
//                 style={{ borderColor: "rgba(197, 154, 70, 0.15)" }}
//               >
//                 <div 
//                   className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
//                   style={{ backgroundColor: COLORS.accent }}
//                 >
//                   {t.name[0]}
//                 </div>
//                 <div>
//                   <p className="font-semibold text-sm" style={{ color: COLORS.primaryText }}>
//                     {t.name}
//                   </p>
//                   <p className="text-xs" style={{ color: COLORS.secondaryText }}>
//                     {t.role}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

const testimonials = [
  {
    name: "Sarah Akinyemi",
    role: "Homeowner, Lagos",
    rating: 5,
    quote:
      "Shopping on Paint Domain was so convenient. I compared products, placed my order from the comfort of my home and had it delivered right to my doorstep. Super easy and stress-free!",
    avatarBg: "bg-[#0B1E36]", // Dark Navy
  },
  {
    name: "Tunde Bello",
    role: "Property Owner, Abuja",
    rating: 5,
    quote:
      "I needed a reliable painter and didn't know where to start. Paint Domain connected me with trusted painters in my area. I found the right person quickly and the job turned out great.",
    avatarBg: "bg-[#0F5132]", // Dark Green
  },
  {
    name: "Chinedu Williams",
    role: "Homeowner, Port Harcourt",
    rating: 5,
    quote:
      "The platform is simple to use and saves you a lot of time. I was able to shop, book a painter and even get an estimate without leaving my house. Everything I needed was in one place.",
    avatarBg: "bg-[#7A2E1A]", // Dark Rust / Brown
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 fill-[#D99A29]"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="bg-[#F8F7F5] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-4 tracking-tight">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 text-base max-w-xl mx-auto font-normal leading-snug">
            Real experiences from people who shopped, found help <br className="hidden sm:inline" />
            and got things done on Paint Domain.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-8 flex flex-col justify-between shadow-sm border border-gray-100"
            >
              <div>
                {/* Rating Stars */}
                <Stars count={t.rating} />

                {/* Quote Block with Gold Quotation Mark */}
                <div className="flex items-start gap-2 mb-6">
                  <span className="text-[#D99A29] text-3xl font-serif font-bold leading-none select-none">
                    &#8220;
                  </span>
                  <p className="text-gray-700 text-sm leading-relaxed font-normal">
                    {t.quote}
                  </p>
                </div>
              </div>

              {/* Author Footer */}
              <div>
                <hr className="border-t border-gray-100 mb-6" />
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full ${t.avatarBg} flex items-center justify-center font-medium text-base text-white shrink-0`}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#1A1A1A]">
                      {t.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}