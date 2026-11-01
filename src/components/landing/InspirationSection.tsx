
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  X,
  ZoomIn,
} from "lucide-react";

const paints = [
  {
    name: "Fortishield Gravitex",
    tagline: "Premium Texture. Lasting Beauty. Superior Protection.",
    description:
      "Distinctive textured finishes for beautiful, durable and protected exterior walls.",
    image: "/images/paints/gravitex-paint.jpg",
  },
  {
    name: "Fortishield Trowel Paint",
    tagline: "Luxury Finishes. Unmatched Durability. Lasting Beauty.",
    description:
      "Elegant marble-inspired finishes that bring sophistication and character to your walls.",
    image: "/images/paints/marble-trowel1.png",
  },
  {
    name: "Matte Paint",
    tagline: "Rich Colours. Elegant Finishes. Exceptional Interior Beauty.",
    description:
      "Smooth, refined finishes that bring warmth and beauty to interior spaces.",
    image: "/images/paints/matte-paint.jpg",
  },
];

export default function InspirationSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const activePaint = paints[activeIndex];

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % paints.length);
  };

  const previousSlide = () => {
    setActiveIndex(
      (current) => (current - 1 + paints.length) % paints.length
    );
  };

  // Automatic slider
  useEffect(() => {
    if (zoomOpen) return;

    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [zoomOpen]);

  // Close zoom with Escape
  useEffect(() => {
    if (!zoomOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [zoomOpen]);

  return (
    <section className="relative overflow-hidden bg-[#111111] py-14 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Compact heading */}
        <div className="mb-8 text-center sm:mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-accent">
            Discover Our Collection
          </span>

          <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
            Beautiful Paints. Exceptional Finishes.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400">
            Discover finishes that transform and protect your spaces.
          </p>
        </div>

        {/* Main slider */}
        <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#1b1b1b] shadow-2xl">
          <div className="relative h-[360px] sm:h-[430px] lg:h-[480px]">

            {/* Clickable image */}
            <button
              type="button"
              onClick={() => setZoomOpen(true)}
              aria-label={`Zoom in on ${activePaint.name}`}
              className="absolute inset-0 z-0 block h-full w-full cursor-zoom-in"
            >
              <Image
                key={activePaint.image}
                src={activePaint.image}
                alt={activePaint.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover object-center transition-transform duration-500"
              />
            </button>

            {/* Bottom text overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

            {/* Zoom indicator */}
            <div className="pointer-events-none absolute right-5 top-5 z-10 flex items-center gap-2 rounded-full border border-white/30 bg-black/45 px-3 py-2 text-xs text-white backdrop-blur-md">
              <ZoomIn size={15} />
              Click image to zoom
            </div>

            {/* Paint details */}
            <div
              key={activePaint.name}
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-5 sm:p-8 lg:p-9"
            >
              <span className="inline-block rounded-full border border-brand-accent/50 bg-black/50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-brand-accent sm:text-[10px]">
                Paint {activeIndex + 1} of 3
              </span>

              <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
                {activePaint.name}
              </h3>

              <p className="mt-2 max-w-2xl text-xs font-semibold leading-5 text-brand-accent sm:text-sm">
                {activePaint.tagline}
              </p>

              <p className="mt-2 max-w-xl text-xs leading-5 text-gray-200 sm:text-sm">
                {activePaint.description}
              </p>

              <div className="pointer-events-auto mt-4">
                <Link
                  href="/portfolio"
                  className="group inline-flex items-center gap-2 rounded-md bg-brand-accent px-5 py-3 text-xs font-bold text-black shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white sm:text-sm"
                >
                  <CalendarCheck size={16} />
                  Explore our Portfolio
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>

            {/* Previous button */}
            <button
              type="button"
              onClick={previousSlide}
              aria-label="Previous paint"
              className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-md transition hover:border-brand-accent hover:bg-brand-accent hover:text-black sm:left-5 sm:h-12 sm:w-12"
            >
              <ArrowLeft size={20} />
            </button>

            {/* Next button */}
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next paint"
              className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-md transition hover:border-brand-accent hover:bg-brand-accent hover:text-black sm:right-5 sm:h-12 sm:w-12"
            >
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Slide indicators */}
          <div className="flex items-center justify-center gap-3 border-t border-white/10 bg-[#171717] py-4">
            {paints.map((paint, index) => (
              <button
                key={paint.name}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${paint.name}`}
                aria-current={activeIndex === index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "w-9 bg-brand-accent"
                    : "w-2 bg-gray-500 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Half-screen image zoom */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setZoomOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${activePaint.name} image preview`}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/20 bg-[#171717] shadow-2xl animate-in zoom-in-95 fade-in duration-300"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <div>
                <h3 className="text-base font-bold text-white sm:text-lg">
                  {activePaint.name}
                </h3>
                <p className="text-xs text-gray-400">
                  Paint Collection
                </p>
              </div>

              <button
                type="button"
                onClick={() => setZoomOpen(false)}
                aria-label="Close image preview"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand-accent hover:text-black"
              >
                <X size={19} />
              </button>
            </div>

            <div className="relative h-[40vh] min-h-[240px] max-h-[450px] w-full overflow-hidden bg-black">
  <Image
    src={activePaint.image}
    alt={activePaint.name}
    fill
    sizes="(max-width: 768px) 100vw, 768px"
    className="object-cover object-center"
  />
</div>

            <div className="px-4 py-4 sm:px-6">
              <p className="text-xs font-semibold text-brand-accent sm:text-sm">
                {activePaint.tagline}
              </p>

              <p className="mt-2 text-xs leading-5 text-gray-300 sm:text-sm">
                {activePaint.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
