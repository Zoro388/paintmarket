"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    category: "Delivery",
    items: [
      {
        q: "How long does delivery take?",
        a: "We deliver within 1–2 business days across Lagos and major cities. For other states, delivery typically takes 2–4 business days. You'll receive a tracking notification once your order ships.",
      },
      {
        q: "Do you deliver nationwide?",
        a: "Yes — we deliver to all 36 states and the FCT. Whether you're in Lagos, Abuja, Port Harcourt, Kano, or anywhere in between, we've got you covered. Delivery fees vary by location and are calculated at checkout.",
      },
      
      {
        q: "Can I track my order?",
        a: "Absolutely. Once your order is dispatched, you'll receive an SMS and email with your tracking reference. You can also view your order status in real time from your account dashboard.",
      },
    ],
  },
  {
    category: "Painter Requests",
    items: [
      {
        q: "How does the Painter Request service work?",
        a: "Fill in your project details — property type, project scope, preferred start date, and location — and submit your request. Our team reviews it and connects you with a vetted, insured painter in your area, usually within 24 hours.",
      },
      {
        q: "Are the painters vetted and insured?",
        a: "Yes. Every painter in our network goes through a background check, skills assessment, and insurance verification before being listed. You can trust that whoever shows up to your property is qualified and accountable.",
      },
      {
        q: "Is there a fee for requesting a painter?",
        a: "Submitting a painter request is completely free. You only pay once you've reviewed and accepted a quote from a matched painter — no upfront charges, no hidden fees.",
      },
      {
        q: "What types of projects can I request a painter for?",
        a: "We handle interior painting, exterior painting, both combined, roof painting, and floor coating — for residential apartments, duplexes, commercial offices, warehouses, schools, and more.",
      },
    ],
  },
  {
    category: "Site Estimator",
    items: [
      {
        q: "What is the Site Estimator service?",
        a: "Our site estimator service sends an expert to physically inspect your property and provide an accurate estimate of the materials and labour required for your painting project.",
      },
      
      {
        q: "How long does it take to confirm a booking?",
        a: "We typically confirm your inspection booking within 2 hours of submission and contact you to finalise the date and time. Inspections are usually scheduled within 2–3 business days.",
      },
      {
        q: "What information do I need to book a site estimator?",
        a: "Just your name, contact details, property address, project type (interior, exterior, etc.), and your preferred inspection date. That's it — we handle the rest.",
      },
    ],
  },
  {
    category: "Orders & Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept payments via Paystack (card, USSD, bank transfer, and mobile money) as well as direct bank transfer. All transactions are secured and verified before your order is processed.",
      },
      {
        q: "Can I cancel or change my order after placing it?",
        a: "You can request a cancellation or modification within 2 hours of placing your order by contacting our support team. Once the order has been dispatched, changes may not be possible.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b border-brand-border/50 last:border-0 transition-colors ${open ? "bg-brand-raised/30" : ""}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 px-6 text-left"
      >
        <span className={`text-sm font-medium leading-snug transition-colors ${open ? "text-white" : "text-brand-lt-gray"}`}>
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 mt-0.5 transition-all duration-300 ${open ? "rotate-180 text-brand-accent" : "text-brand-subtle"}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <p className="px-6 pb-5 text-brand-mid text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState(FAQS[0].category);
  const current = FAQS.find((f) => f.category === activeCategory)!;

  return (
    <section className="bg-brand-black py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Got Questions?
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-brand-mid text-lg max-w-xl mx-auto">
            Everything you need to know about our paints, delivery, painter requests, and site estimator service.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FAQS.map((f) => (
            <button
              key={f.category}
              onClick={() => setActiveCategory(f.category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === f.category
                  ? "bg-brand-accent text-brand-black"
                  : "bg-brand-card border border-brand-border text-brand-mid hover:text-white hover:border-brand-border-lt"
              }`}
            >
              {f.category}
            </button>
          ))}
        </div>

        {/* FAQ list */}
        <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
          {current.items.map((item) => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-10 text-center">
          <p className="text-brand-mid text-sm">
            Still have questions?{" "}
            <a
              href="/contact"
              className="text-brand-accent hover:text-brand-accent-lt underline underline-offset-4 transition-colors font-medium"
            >
              Contact our support team
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}