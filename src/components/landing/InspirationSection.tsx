
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  MapPin,
  CalendarDays,
  ImageIcon,
  Loader2,
  Sparkles,
  CheckCircle2,
  X,
  ZoomIn,
} from "lucide-react";
import { apiGetPortfolio } from "@/lib/userApi";
import { formatDate } from "@/lib/utils";

type PortfolioMedia = {
  type?: string;
  url: string;
  publicId?: string;
};

type PortfolioProject = {
  _id: string;
  projectTitle: string;
  projectDescription: string;
  projectLocation: string;
  projectCategory: string;
  completionDate: string | null;
  createdAt?: string | null;
  media: PortfolioMedia[];
  materialsUsed: string[];
  customerTestimonial?: string | null;
};

export default function InspirationSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Close the image viewer with Escape and prevent background scrolling.
  useEffect(() => {
    if (!selectedImage) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  const { data, isLoading } = useQuery({
    queryKey: ["homepage-inspiration"],
    queryFn: async () => {
      const res = await apiGetPortfolio();
      return (res?.projects ?? res?.data ?? []) as any[];
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // Normalize projects and media.
  const projects: PortfolioProject[] = (data ?? [])
    .map((p: any) => {
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
          p.images ?? p.completedImages ?? p.beforeImages ?? [];

        media = Array.isArray(oldImages)
          ? oldImages
              .filter(
                (url: any) =>
                  typeof url === "string" && url.trim()
              )
              .map((url: string) => ({
                type: "image",
                url,
              }))
          : [];
      }

      return {
        _id: String(p._id ?? p.id ?? p.createdAt ?? Math.random()),
        projectTitle: p.projectTitle ?? p.clientName ?? "Completed Project",
        projectDescription:
          p.projectDescription ?? p.description ?? "",
        projectLocation: p.projectLocation ?? "",
        projectCategory: p.projectCategory ?? "",
        completionDate: p.completionDate ?? p.completedDate ?? null,
        createdAt: p.createdAt ?? null,
        media,
        materialsUsed: Array.isArray(p.materialsUsed)
          ? p.materialsUsed
          : [],
        customerTestimonial:
          p.customerTestimonial ?? p.testimonial ?? null,
      };
    })

    // Only show projects with images and absolutely no videos.
    .filter(
      (project) =>
        project.media.length > 0 &&
        project.media.every((item) => item.type === "image")
    )

    // Latest projects first.
    .sort((a, b) => {
      const dateA = a.createdAt
        ? new Date(a.createdAt).getTime()
        : 0;
      const dateB = b.createdAt
        ? new Date(b.createdAt).getTime()
        : 0;

      return dateB - dateA;
    })
    .slice(0, 6);

  return (
    <section
      id="inspiration"
      className="relative overflow-hidden bg-[#101010] py-20 sm:py-24 lg:py-28"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute -top-40 right-[-100px] h-[450px] w-[450px] rounded-full bg-brand-accent/[0.10] blur-[130px]" />

      <div className="pointer-events-none absolute bottom-[-150px] left-[-100px] h-[400px] w-[400px] rounded-full bg-brand-accent/[0.07] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section heading */}
        <div className="mb-14 flex flex-col gap-7 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-accent/30 bg-brand-accent/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">
              <Sparkles size={15} />
              Our Recent Work
            </div>

            <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Spaces We've{" "}
              <span className="text-brand-accent">
                Transformed.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-8 text-white/60 sm:text-base">
              A look at some of the spaces we've brought to life.
              Get inspired by our completed painting projects and
              imagine what's possible for your own property.
            </p>
          </div>

          <Link
            href="/portfolio"
            className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-lg border border-brand-accent/50 px-6 py-3.5 text-sm font-bold text-brand-accent transition-all duration-300 hover:border-brand-accent hover:bg-brand-accent hover:text-brand-black"
          >
            Explore All Projects
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex flex-col items-center gap-4">
              <Loader2
                size={36}
                className="animate-spin text-brand-accent"
              />
              <p className="text-sm text-white/50">
                Loading our latest projects...
              </p>
            </div>
          </div>
        )}

        {/* Project cards */}
        {!isLoading && projects.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => {
              const coverImage = project.media[0]?.url;

              return (
                <article
                  key={project._id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#191919] transition-all duration-500 hover:-translate-y-2 hover:border-brand-accent/40 hover:shadow-[0_25px_65px_rgba(0,0,0,0.4)]"
                >
                  {/* Project image */}
                  <div className="relative h-64 overflow-hidden bg-[#252525] sm:h-72">
                    {coverImage ? (
                      <button
                        type="button"
                        onClick={() => setSelectedImage(coverImage)}
                        aria-label={`View ${project.projectTitle} image`}
                        className="group/image relative block h-full w-full cursor-zoom-in"
                      >
                        <img
                          src={coverImage}
                          alt={project.projectTitle}
                          loading={index < 3 ? "eager" : "lazy"}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover/image:scale-110"
                        />

                        {/* Zoom icon */}
                        <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover/image:bg-black/30 group-hover/image:opacity-100">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-md">
                            <ZoomIn size={25} />
                          </span>
                        </span>
                      </button>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon
                          size={42}
                          className="text-white/30"
                        />
                      </div>
                    )}

                    {/* Image overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-90" />

                    {project.projectCategory && (
                      <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/60 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                        {project.projectCategory}
                      </span>
                    )}

                    {project.media.length > 1 && (
                      <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md">
                        <ImageIcon size={13} />
                        {project.media.length} Photos
                      </span>
                    )}

                    <div className="pointer-events-none absolute bottom-5 left-5 right-5">
                      <h3 className="font-display text-xl font-bold leading-snug text-white sm:text-2xl">
                        {project.projectTitle}
                      </h3>

                      {project.projectLocation && (
                        <p className="mt-2 flex items-center gap-2 text-xs font-medium text-white/75">
                          <MapPin
                            size={14}
                            className="shrink-0 text-brand-accent"
                          />
                          {project.projectLocation}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Project details */}
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    {project.projectDescription && (
                      <p className="line-clamp-3 whitespace-pre-line text-sm leading-7 text-white/60">
                        {project.projectDescription}
                      </p>
                    )}

                    {project.materialsUsed.length > 0 && (
                      <div className="mt-5">
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-brand-accent">
                          Materials Used
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {project.materialsUsed.slice(0, 4).map(
                            (material, i) => (
                              <span
                                key={`${material}-${i}`}
                                className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] text-white/70"
                              >
                                {material}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {project.customerTestimonial && (
                      <blockquote className="mt-5 rounded-xl border border-brand-accent/15 bg-brand-accent/[0.06] p-4 text-sm italic leading-6 text-white/70">
                        &ldquo;{project.customerTestimonial}&rdquo;
                      </blockquote>
                    )}

                    <div className="mt-auto">
                      {project.completionDate && (
                        <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-white/45">
                          <CalendarDays
                            size={14}
                            className="text-brand-accent"
                          />
                          Completed {formatDate(project.completionDate)}
                        </div>
                      )}

                      <Link
                        href="/portfolio"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-accent transition-all duration-300 hover:gap-3"
                      >
                        View Project
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && projects.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <ImageIcon
              size={42}
              className="mx-auto text-white/30"
            />

            <h3 className="mt-5 font-display text-xl font-bold text-white">
              Inspiration is on its way
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/50">
              Our latest project images will appear here as soon as
              they are available.
            </p>

            <Link
              href="/portfolio"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-accent hover:underline"
            >
              Visit our portfolio
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Bottom call to action */}
        <div className="relative mt-16 overflow-hidden rounded-2xl border border-brand-accent/25 bg-gradient-to-br from-[#292318] via-[#1c1c1c] to-[#171717] p-7 sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-accent/10 blur-[80px]" />

          <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-brand-accent">
                <CheckCircle2 size={15} />
                Let's Bring Your Vision to Life
              </div>

              <h3 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                Have a space that needs a{" "}
                <span className="text-brand-accent">
                  fresh look?
                </span>
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/60 sm:text-base">
                Book an inspection with our team. We'll help you
                assess your space and plan your painting project.
              </p>
            </div>

            <Link
              href="/book-inspection"
              className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-lg bg-brand-accent px-7 py-4 text-sm font-extrabold text-brand-black shadow-lg shadow-brand-accent/10 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-accent-lt hover:shadow-xl"
            >
              Start Your Project
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Full-screen image lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged project image"
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            aria-label="Close image"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={24} />
          </button>

          <img
            src={selectedImage}
            alt="Enlarged painting project"
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}
    </section>
  );
}
