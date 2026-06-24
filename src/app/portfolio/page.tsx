

"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGetPortfolio } from "@/lib/userApi";
import { formatDate } from "@/lib/utils";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CTASection from "@/components/landing/CTASection";
import { Loader, Star, MapPin, ImageIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function PortfolioPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    placeholderData: [],
  });

  const list = (data ?? []) as any[];

  // Normalize API shape to expected fields
  const normalized = list.map((p: any) => ({
    _id: p._id ?? p.id ?? p.createdAt,
    projectTitle: p.projectTitle ?? p.projectTitle ?? p.clientName ?? "Untitled",
    projectDescription: p.projectDescription ?? p.projectDescription ?? p.description ?? "",
    projectLocation: p.projectLocation ?? p.projectLocation ?? p.projectLocation ?? "",
    completionDate: p.completionDate ?? p.completedDate ?? null,
    featured: p.featured ?? p.featuredProject ?? false,
    images: p.images ?? p.completedImages ?? p.beforeImages ?? [],
    materialsUsed: p.materialsUsed ?? [],
    customerTestimonial: p.customerTestimonial ?? p.testimonial ?? null,
  }));

  const featured = normalized.filter((p) => p.featured);
  const rest = normalized.filter((p) => !p.featured);

  function openModal(images: string[], start = 0) {
    setModalImages(images);
    setCurrentIndex(start);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setModalImages([]);
    setCurrentIndex(0);
  }

  function prev() {
    setCurrentIndex((i) => (modalImages.length ? (i - 1 + modalImages.length) % modalImages.length : 0));
  }

  function next() {
    setCurrentIndex((i) => (modalImages.length ? (i + 1) % modalImages.length : 0));
  }

  return (
    <main className="bg-brand-black min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-black via-brand-card/30 to-brand-black border-b border-brand-mid/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-3">Our Work</p>
          <h1 className="font-display text-5xl font-bold text-brand-white mb-4">Project Portfolio</h1>
          <p className="text-brand-mid text-lg max-w-xl mx-auto">Explore completed projects from across Nigeria — every one a testament to quality craftsmanship.</p>
        </div>
      </section>

      {/* Featured */}
       {featured.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-brand-white mb-8 flex items-center gap-2">
              <Star size={20} className="text-brand-accent" fill="currentColor" /> Featured Projects
            </h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {featured.map((p: any) => (
                <div key={p._id} className="bg-brand-card border border-brand-accent/20 rounded-2xl overflow-hidden hover:border-brand-accent/50 transition-all group">
                  {p.images && p.images.length ? (
                    <div className="h-56 relative overflow-hidden">
                      <img
                        src={p.images[0]}
                        alt={p.projectTitle}
                        onClick={() => openModal(p.images, 0)}
                        className="w-full h-56 object-cover cursor-pointer"
                      />
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-brand-accent text-brand-black text-xs font-bold px-3 py-1.5 rounded-full">
                        <Star size={11} fill="currentColor" /> Featured
                      </div>
                    </div>
                  ) : (
                    <div className="h-56 bg-gradient-to-br from-brand-accent/10 via-brand-card to-brand-black flex items-center justify-center relative">
                      <ImageIcon size={48} className="text-brand-accent/20" />
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-brand-accent text-brand-black text-xs font-bold px-3 py-1.5 rounded-full">
                        <Star size={11} fill="currentColor" /> Featured
                      </div>
                    </div>
                  )}
                  <div className="p-6 flex flex-col gap-4">
                    <div>
                      <h3 className="font-display text-xl font-bold text-brand-white group-hover:text-brand-accent transition-colors">{p.projectTitle}</h3>
                      <div className="flex items-center gap-1 text-brand-mid text-sm mt-1">
                        <MapPin size={13} className="text-brand-accent" /> {p.projectLocation}
                      </div>
                    </div>
                    <p className="text-brand-mid text-sm leading-relaxed">{p.projectDescription}</p>
                    {p.customerTestimonial && (
                      <blockquote className="border-l-2 border-brand-accent pl-4 text-brand-lt-gray text-sm italic">
                        &ldquo;{p.customerTestimonial}&rdquo;
                      </blockquote>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {p.materialsUsed.map((m: string) => (
                        <span key={m} className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs px-2.5 py-0.5 rounded-full">{m}</span>
                      ))}
                    </div>
                    <p className="text-brand-mid text-xs">Completed {p.completionDate ? formatDate(p.completionDate) : "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}  

      {/* All projects */}
      {rest.length > 0 && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-brand-white mb-8">All Projects</h2>
            {isLoading ? (
              <div className="py-16 flex justify-center"><Loader size={28} className="animate-spin text-brand-accent" /></div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((p: any) => (
                  <div key={p._id} className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden hover:border-brand-accent/30 transition-all group">
                    {p.images && p.images.length ? (
                      <div className="h-36 overflow-hidden">
                        <img
                          src={p.images[0]}
                          alt={p.projectTitle}
                          onClick={() => openModal(p.images, 0)}
                          className="w-full h-36 object-cover cursor-pointer"
                        />
                      </div>
                    ) : (
                      <div className="h-36 bg-gradient-to-br from-brand-black to-brand-card flex items-center justify-center">
                        <ImageIcon size={32} className="text-brand-accent/20" />
                      </div>
                    )}
                    <div className="p-4 flex flex-col gap-3">
                      <div>
                        <h3 className="text-brand-white font-semibold group-hover:text-brand-accent transition-colors">{p.projectTitle}</h3>
                        <div className="flex items-center gap-1 text-brand-mid text-xs mt-1"><MapPin size={11} className="text-brand-accent" />{p.projectLocation}</div>
                      </div>
                      <p className="text-brand-mid text-xs leading-relaxed line-clamp-2">{p.projectDescription}</p>
                      <div className="flex flex-wrap gap-1">
                        {p.materialsUsed.slice(0,2).map((m: string) => <span key={m} className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[10px] px-2 py-0.5 rounded-full">{m}</span>)}
                      </div>
                      <p className="text-brand-mid text-xs border-t border-brand-mid/20 pt-2">Completed {p.completionDate ? formatDate(p.completionDate) : "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )} 

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-4xl">
            <button onClick={closeModal} className="absolute top-2 right-2 p-2 bg-black/30 rounded-full text-white">
              <X size={18} />
            </button>
            <div className="relative">
              <img src={modalImages[currentIndex]} alt={`Image ${currentIndex + 1}`} className="w-full h-[60vh] object-contain bg-black rounded" />
              <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 rounded-full text-white">
                <ChevronLeft size={20} />
              </button>
              <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 rounded-full text-white">
                <ChevronRight size={20} />
              </button>
            </div>
            {modalImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {modalImages.map((src, i) => (
                  <button key={src} onClick={() => setCurrentIndex(i)} className={`w-20 h-12 overflow-hidden rounded ${i === currentIndex ? "ring-2 ring-brand-accent" : "opacity-70"}`}>
                    <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <CTASection />
      <Footer />
    </main>
  );
}
