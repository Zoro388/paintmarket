import { Shield, Clock, Star, Award, Truck, Users } from "lucide-react";

const reasons = [
  { icon: Shield, title: "Quality Guaranteed",    desc: "Every product is tested and certified. If you're not satisfied, we make it right." },
  { icon: Clock,  title: "Fast Turnaround",       desc: "Same-day delivery in Lagos, next-day delivery across major Nigerian cities." },
  { icon: Star,   title: "Premium Brands",        desc: "We stock Nigeria's best paint brands alongside exclusive Paint Domain formulations." },
  { icon: Award,  title: "Certified Painters",    desc: "Our painter network is background-checked, trained, and fully insured." },
  { icon: Truck,  title: "Free Delivery",         desc: "Free nationwide delivery on orders above ₦50,000. No hidden charges." },
  { icon: Users,  title: "Expert Support",        desc: "Dedicated support team available Mon–Sat to answer all your paint questions." },
];

export default function WhyUsSection() {
  return (
    <section className="bg-brand-offwhite py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left text */}
          <div className="on-light">
            <p className="text-brand-accent-dk text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Why Paint Domain
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-brand-black mb-5 leading-tight">
              Built on Trust &amp;{" "}
              <span style={{ color: "#A8842E" }}>Craftsmanship</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              For over a decade, Paint Domain &amp; Primary Interior Builders has been the go-to
              name for premium paint solutions in Nigeria. Our commitment to quality is woven into
              every project we deliver.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { value: "12+", label: "Years of Excellence" },
                { value: "36",  label: "States Covered" },
                { value: "500+",label: "Certified Painters" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
                  <p className="font-bold text-3xl font-display" style={{ color: "#A8842E" }}>{s.value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right grid */}
          <div className="grid grid-cols-2 gap-3">
            {reasons.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.title}
                  className="bg-white border border-gray-100 rounded-xl p-5
                    hover:shadow-md hover:border-gray-200 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-brand-black flex items-center
                    justify-center mb-3 group-hover:bg-brand-accent transition-colors">
                    <Icon size={16} className="text-brand-accent group-hover:text-brand-black transition-colors" />
                  </div>
                  <h4 className="text-brand-black font-semibold text-sm mb-1">{r.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{r.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
