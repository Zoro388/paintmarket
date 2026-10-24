"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGetPortfolio } from "@/lib/userApi";
import { formatDate } from "@/lib/utils";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CTASection from "@/components/landing/CTASection";

import {
  Loader,
  Star,
  MapPin,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Images,
  CalendarCheck,
  ArrowRight,
} from "lucide-react";

type PortfolioMedia = {
  type: "image" | "video";
  url: string;
  publicId?: string;
};

export default function PortfolioPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMedia, setModalMedia] = useState<PortfolioMedia[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCat, setActiveCat] = useState("All");

  const { data, isLoading } = useQuery({
    queryKey: ["portfolio-public"],
    queryFn: async () => {
      try {
        const res = await apiGetPortfolio();
        return res?.projects ?? res?.data ?? [];
      } catch {
        return [];
      }
    },
  });

  const list = (data ?? []) as any[];

  /*
  |--------------------------------------------------------------------------
  | NORMALIZE BACKEND DATA
  |--------------------------------------------------------------------------
  */

  const normalized = list.map((p: any) => {
    let media: PortfolioMedia[] = [];

    if (Array.isArray(p.media) && p.media.length > 0) {
      media = p.media
        .filter((item: any) => item?.url)
        .map((item: any) => ({
          type: item.type === "video" ? "video" : "image",
          url: item.url,
          publicId: item.publicId ?? "",
        }));
    } else {
      const oldImages =
        p.images ??
        p.completedImages ??
        p.beforeImages ??
        [];

      media = Array.isArray(oldImages)
        ? oldImages.map((url: string) => ({
            type: "image" as const,
            url,
          }))
        : [];
    }

    return {
      _id: p._id ?? p.id ?? p.createdAt,
      projectTitle: p.projectTitle ?? p.clientName ?? "Untitled",
      projectDescription: p.projectDescription ?? p.description ?? "",
      projectLocation: p.projectLocation ?? "",
      projectCategory: p.projectCategory ?? "",
      completionDate: p.completionDate ?? p.completedDate ?? null,
      featured: p.featured ?? p.featuredProject ?? false,
      media,
      materialsUsed: p.materialsUsed ?? [],
      customerTestimonial: p.customerTestimonial ?? p.testimonial ?? null,
    };
  });

  /*
  |--------------------------------------------------------------------------
  | CATEGORIES
  |--------------------------------------------------------------------------
  */

  const categories = [
    "All",
    ...Array.from(
      new Set(
        normalized
          .map((p) => p.projectCategory)
          .filter(Boolean)
      )
    ),
  ];

  /*
  |--------------------------------------------------------------------------
  | CATEGORY FILTER
  |--------------------------------------------------------------------------
  */

  const categoryFiltered =
    activeCat === "All"
      ? normalized
      : normalized.filter(
          (p) => p.projectCategory === activeCat
        );

  const featured = categoryFiltered.filter((p) => p.featured);
  const rest = categoryFiltered.filter((p) => !p.featured);

  /*
  |--------------------------------------------------------------------------
  | MODAL
  |--------------------------------------------------------------------------
  */

  function openModal(media: PortfolioMedia[], start = 0) {
    setModalMedia(media);
    setCurrentIndex(start);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setModalMedia([]);
    setCurrentIndex(0);
  }

  function prev() {
    setCurrentIndex((i) =>
      modalMedia.length
        ? (i - 1 + modalMedia.length) % modalMedia.length
        : 0
    );
  }

  function next() {
    setCurrentIndex((i) =>
      modalMedia.length
        ? (i + 1) % modalMedia.length
        : 0
    );
  }

  /*
  |--------------------------------------------------------------------------
  | MEDIA SLIDER COMPONENT
  |--------------------------------------------------------------------------
  */

  function MediaSlider({
    media,
    projectTitle,
    heightClass,
  }: {
    media: PortfolioMedia[];
    projectTitle: string;
    heightClass: string;
  }) {
    const [slideIndex, setSlideIndex] = useState(0);

    if (!media || media.length === 0) {
      return (
        <div
          className={`${heightClass} bg-gradient-to-br from-brand-black to-brand-card flex items-center justify-center`}
        >
          <ImageIcon
            size={40}
            className="text-brand-accent/20"
          />
        </div>
      );
    }

    const current = media[slideIndex];

    function previousSlide(e: React.MouseEvent) {
      e.stopPropagation();
      setSlideIndex(
        (i) => (i - 1 + media.length) % media.length
      );
    }

    function nextSlide(e: React.MouseEvent) {
      e.stopPropagation();
      setSlideIndex(
        (i) => (i + 1) % media.length
      );
    }

    return (
      <div
        className={`${heightClass} relative overflow-hidden bg-black group/media`}
      >
        {/* IMAGE */}
        {current.type === "image" ? (
          <img
            src={current.url}
            alt={projectTitle}
            onClick={() => openModal(media, slideIndex)}
            className={`${heightClass} w-full object-cover cursor-pointer transition-transform duration-500 group-hover/media:scale-105`}
          />
        ) : (
          /* VIDEO */
          <div
            className={`${heightClass} relative cursor-pointer`}
            onClick={() => openModal(media, slideIndex)}
          >
            <video
              src={current.url}
              className={`${heightClass} w-full object-cover`}
              muted
              playsInline
              preload="metadata"
            />

            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-brand-accent text-brand-black flex items-center justify-center shadow-lg">
                <Play size={22} fill="currentColor" />
              </div>
            </div>
          </div>
        )}

        {/* MEDIA COUNT */}
        {media.length > 1 && (
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
            <Images size={13} />
            {slideIndex + 1}/{media.length}
          </div>
        )}

        {/* VIDEO LABEL */}
        {current.type === "video" && (
          <div className="absolute top-3 left-3 bg-brand-accent text-brand-black text-[10px] font-bold px-2.5 py-1 rounded-full">
            VIDEO
          </div>
        )}

        {/* SLIDER CONTROLS */}
        {media.length > 1 && (
          <>
            <button
              type="button"
              onClick={previousSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-all"
              aria-label="Previous media"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-all"
              aria-label="Next media"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <main className="bg-brand-black min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-black via-brand-card/30 to-brand-black border-b border-brand-mid/20">
        <div className="max-w-7xl mx-auto text-center">
          {/* BOOK INSPECTION BUTTON */}
          <div className="flex justify-end mb-6">
            <a
              href="/painting-estimator"
              className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-5 py-3 text-sm font-bold text-brand-black shadow-lg animate-pulse hover:animate-none hover:scale-105 transition-transform"
            >
              <CalendarCheck size={18} />
              Book Inspection
              <ArrowRight size={16} />
            </a>
          </div>

          <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Our Work
          </p>

          <h1 className="font-display text-5xl font-bold text-brand-white mb-4">
            Project Portfolio
          </h1>

          <p className="text-brand-mid text-lg max-w-xl mx-auto">
            Explore completed projects from across Nigeria — every one a testament to quality craftsmanship.
          </p>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      {categories.length > 1 && (
        <section className="px-4 sm:px-6 lg:px-8 pt-10">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
                  activeCat === cat
                    ? "bg-brand-accent text-brand-black"
                    : "bg-brand-card border border-brand-mid/30 text-brand-mid hover:text-brand-white hover:border-brand-mid/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-brand-white mb-8 flex items-center gap-2">
              <Star
                size={20}
                className="text-brand-accent"
                fill="currentColor"
              />
              Featured Projects
            </h2>

            <div className="grid lg:grid-cols-2 gap-6">
              {featured.map((p: any) => (
                <div
                  key={p._id}
                  className="bg-brand-card border border-brand-mid/20 rounded-2xl overflow-hidden hover:border-brand-accent/40 transition-colors"
                >
                  <MediaSlider
                    media={p.media}
                    projectTitle={p.projectTitle}
                    heightClass="h-72"
                  />

                  <div className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <h3 className="font-display text-xl font-bold text-brand-white">
                          {p.projectTitle}
                        </h3>

                        {p.projectCategory && (
                          <span className="inline-block mt-2 text-brand-accent text-xs font-medium uppercase tracking-wider">
                            {p.projectCategory}
                          </span>
                        )}
                      </div>

                      {p.projectLocation && (
                        <div className="flex items-center gap-1.5 text-brand-mid text-xs">
                          <MapPin
                            size={14}
                            className="text-brand-accent"
                          />
                          {p.projectLocation}
                        </div>
                      )}
                    </div>

                    <p className="text-brand-mid text-sm leading-relaxed">
                      {p.projectDescription}
                    </p>

                    {p.materialsUsed.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {p.materialsUsed.map((m: string) => (
                          <span
                            key={m}
                            className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs px-2.5 py-1 rounded-full"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    )}

                    {p.completionDate && (
                      <p className="text-brand-mid text-xs border-t border-brand-mid/20 pt-3">
                        Completed {formatDate(p.completionDate)}
                      </p>
                    )}

                    {p.customerTestimonial && (
                      <div className="border-t border-brand-mid/20 pt-4">
                        <p className="text-brand-mid text-sm italic">
                          “{typeof p.customerTestimonial === "string"
                            ? p.customerTestimonial
                            : p.customerTestimonial.content ?? p.customerTestimonial.text ?? ""}”
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* OTHER PROJECTS */}
      {rest.length > 0 && (
        <section className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {featured.length > 0 && (
              <h2 className="font-display text-2xl font-bold text-brand-white mb-8">
                More Projects
              </h2>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((p: any) => (
                <div
                  key={p._id}
                  className="bg-brand-card border border-brand-mid/20 rounded-2xl overflow-hidden hover:border-brand-accent/40 transition-colors"
                >
                  <MediaSlider
                    media={p.media}
                    projectTitle={p.projectTitle}
                    heightClass="h-56"
                  />

                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg font-bold text-brand-white">
                        {p.projectTitle}
                      </h3>

                      {p.projectCategory && (
                        <span className="text-brand-accent text-[10px] font-medium uppercase tracking-wider shrink-0">
                          {p.projectCategory}
                        </span>
                      )}
                    </div>

                    {p.projectLocation && (
                      <div className="flex items-center gap-1.5 text-brand-mid text-xs">
                        <MapPin
                          size={13}
                          className="text-brand-accent"
                        />
                        {p.projectLocation}
                      </div>
                    )}

                    <p className="text-brand-mid text-xs leading-relaxed line-clamp-2">
                      {p.projectDescription}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {p.materialsUsed.slice(0, 2).map((m: string) => (
                        <span
                          key={m}
                          className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[10px] px-2 py-0.5 rounded-full"
                        >
                          {m}
                        </span>
                      ))}
                    </div>

                    <p className="text-brand-mid text-xs border-t border-brand-mid/20 pt-2">
                      Completed{" "}
                      {p.completionDate
                        ? formatDate(p.completionDate)
                        : "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LOADING STATE */}
      {isLoading && (
        <section className="py-20 flex justify-center">
          <Loader
            size={32}
            className="animate-spin text-brand-accent"
          />
        </section>
      )}

      {/* EMPTY STATE */}
      {!isLoading && categoryFiltered.length === 0 && (
        <section className="py-20 px-4 text-center">
          <div className="max-w-md mx-auto flex flex-col items-center gap-3">
            <ImageIcon
              size={40}
              className="text-brand-mid"
            />

            <p className="text-brand-mid text-sm">
              No projects found for{" "}
              <span className="text-brand-accent font-medium">
                {activeCat}
              </span>
            </p>

            <button
              onClick={() => setActiveCat("All")}
              className="text-brand-accent text-sm font-medium hover:underline underline-offset-4"
            >
              View all projects
            </button>
          </div>
        </section>
      )}

      {/* MEDIA LIGHTBOX */}
      {isOpen && modalMedia.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative z-10 w-full max-w-5xl">
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close media viewer"
              className="absolute -top-12 right-0 z-20 p-2.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
            >
              <X size={22} />
            </button>

            <div className="relative">
              {modalMedia[currentIndex].type === "image" ? (
                <img
                  src={modalMedia[currentIndex].url}
                  alt={`Media ${currentIndex + 1}`}
                  className="w-full h-[75vh] object-contain bg-black rounded-xl"
                />
              ) : (
                <video
                  src={modalMedia[currentIndex].url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full max-h-[75vh] object-contain bg-black rounded-xl"
                />
              )}

              {modalMedia.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    aria-label="Previous media"
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    onClick={next}
                    aria-label="Next media"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* THUMBNAILS */}
            {modalMedia.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {modalMedia.map((item, i) => (
                  <button
                    key={item.publicId || item.url}
                    onClick={() => setCurrentIndex(i)}
                    aria-label={`View media ${i + 1}`}
                    className={`relative flex-shrink-0 w-20 h-14 overflow-hidden rounded-lg ${
                      i === currentIndex
                        ? "ring-2 ring-brand-accent"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={`thumb-${i}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-brand-card flex items-center justify-center">
                        <Play
                          size={18}
                          className="text-brand-accent"
                          fill="currentColor"
                        />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <CTASection />

      {/* FIXED WHATSAPP BUTTON */}
      <a
        href="https://wa.me/2348105757406"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Paint Domain on WhatsApp"
        title="Chat with us on WhatsApp"
        className="fixed right-5 bottom-6 z-[9999] flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-110 transition-transform"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20.52 3.48A11.87 11.87 0 0 0 12.08 0C5.5 0 .14 5.35.14 11.94c0 2.1.55 4.15 1.6 5.96L0 24l6.25-1.64a11.95 11.95 0 0 0 5.82 1.49h.01c6.59 0 11.94-5.36 11.94-11.94 0-3.19-1.24-6.19-3.5-8.43ZM12.08 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.71.97.99-3.62-.24-.37a9.85 9.85 0 0 1-1.52-5.25c0-5.46 4.44-9.9 9.9-9.9a9.84 9.84 0 0 1 7 2.9 9.84 9.84 0 0 1 2.9 7c-.01 5.46-4.45 9.86-9.92 9.86Zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.47-2.4-1.5-.89-.79-1.5-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.3-.5.1-.2.05-.38-.03-.53-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.8.38-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.48 1.69.61.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
        </svg>
      </a>

      <Footer />
    </main>
  );
}