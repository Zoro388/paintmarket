const testimonials = [
  {
    name: "Adaeze Okonkwo", role: "Homeowner, Lekki", rating: 5,
    quote: "Paint Domain transformed my entire apartment. The painters were professional, punctual, and the colour consultations were spot on. I wouldn't use anyone else.",
  },
  {
    name: "Emeka Nwosu", role: "Property Developer, Abuja", rating: 5,
    quote: "We've used Paint Domain across 12 properties. Their site estimators are accurate, their delivery is reliable, and quality is always consistent.",
  },
  {
    name: "Fatima Abdullahi", role: "Interior Designer, Kano", rating: 5,
    quote: "The colour range is exceptional and the team genuinely understands interior aesthetics. My clients always love the results.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 fill-brand-accent text-brand-accent" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="bg-brand-surface py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Client Stories
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            What Our Clients Say
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-brand-card border border-brand-border rounded-2xl p-7
                flex flex-col gap-4 hover:border-brand-accent/30 transition-all duration-300"
            >
              <Stars count={t.rating} />
              <p className="text-brand-lt-gray text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 border-t border-brand-border/60 pt-4">
                <div className="w-9 h-9 rounded-full bg-brand-accent flex items-center
                  justify-center text-brand-black font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-brand-mid text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
