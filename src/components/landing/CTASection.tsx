import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-brand-black mb-5 leading-tight">
          Ready to Transform Your Space?
        </h2>
        <p className="text-brand-black/65 text-lg mb-10 max-w-xl mx-auto">
          Get a free consultation with our experts. No commitment, just clarity.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/painter-request"
            className="flex items-center gap-2 bg-brand-black text-white font-semibold
              px-8 py-4 rounded-md hover:bg-brand-surface transition-colors"
          >
            Request a Painter <ArrowRight size={16} />
          </Link>
          <Link
            href="/site-estimator"
            className="flex items-center gap-2 bg-transparent border-2 border-brand-black
              text-brand-black font-semibold px-8 py-4 rounded-md
              hover:bg-brand-black hover:text-white transition-colors"
          >
            <Phone size={16} /> Book Site Estimator
          </Link>
        </div>
      </div>
    </section>
  );
}
