"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGetAllMedia } from "@/lib/userApi"; // Replace with your exact user endpoint path
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { ChevronLeft, ChevronRight, Play, Image as ImageIcon, Film, X, Loader, Calendar } from "lucide-react";

interface MediaItem {
  _id: string;
  title: string;
  description: string;
  images: string[];
  video?: string;
  createdAt: string;
}

export default function LessonsLandingPage() {
  const [activeGallery, setActiveGallery] = useState<MediaItem | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);
  const [tabMode, setTabMode] = useState<"photos" | "video">("photos");

  const { data: lessons, isLoading } = useQuery({
    queryKey: ["client-lessons-media"],
    queryFn: async () => {
      const res = await apiGetAllMedia();
      return (res?.media ?? res?.data ?? []) as MediaItem[];
    },
  });

  const launchGallery = (item: MediaItem) => {
    setActiveGallery(item);
    setActiveImgIndex(0);
    setTabMode("photos");
  };

  return (
    <main className="bg-brand-black min-h-screen text-white flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Header Block Section */}
        <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 border-b border-brand-border/40 max-w-7xl mx-auto w-full">
          <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-2">Knowledge Base</p>
          <h1 className="font-display text-4xl font-bold text-white">Interactive Paint Training</h1>
          <p className="text-brand-mid mt-2 text-sm">Visual guides, application workflows, and expert structural tutorials.</p>
        </section>

        {/* Lessons Display Area Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {isLoading ? (
            <div className="py-20 flex justify-center"><Loader size={30} className="animate-spin text-brand-accent" /></div>
          ) : !lessons || lessons.length === 0 ? (
            <div className="text-center py-20 border border-brand-border/30 rounded-2xl bg-brand-card/40">
              <Film className="text-brand-subtle mx-auto mb-2 opacity-50" size={36} />
              <p className="text-brand-mid text-sm">No workspace training published yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <div 
                  key={lesson._id}
                  onClick={() => launchGallery(lesson)}
                  className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden cursor-pointer 
                    hover:border-brand-accent/30 transition-all duration-300 group flex flex-col h-full shadow-lg"
                >
                  {/* Aspect Card Cover */}
                  <div className="h-48 relative bg-brand-raised overflow-hidden">
                    {lesson.images && lesson.images[0] ? (
                      <img 
                        src={lesson.images[0]} 
                        alt={lesson.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><ImageIcon className="text-brand-subtle" size={32}/></div>
                    )}
                    
                    {/* Shadow Layer */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Action indicators top overlay */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                        <ImageIcon size={11} /> {lesson.images?.length || 0}
                      </span>
                      {lesson.video && (
                        <span className="bg-brand-accent text-brand-black text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                          <Play size={10} fill="currentColor" /> Watch Video
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content Description info */}
                  <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-brand-subtle text-[10px] uppercase tracking-wider mb-1.5">
                        <Calendar size={11} />
                        {new Date(lesson.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <h3 className="text-white font-bold text-lg leading-tight group-hover:text-brand-accent transition-colors line-clamp-1">
                        {lesson.title}
                      </h3>
                      <p className="text-brand-mid text-xs leading-relaxed mt-1.5 line-clamp-3">
                        {lesson.description}
                      </p>
                    </div>

                    <span className="text-brand-accent text-xs font-semibold flex items-center gap-1 mt-2 group-hover:underline">
                      Launch Lesson Player &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Fullscale Immersive Dynamic Media Overlay Gallery Component */}
      {activeGallery && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
            
            {/* Gallery Navbar Control */}
            <div className="p-4 border-b border-brand-border/60 flex justify-between items-center bg-brand-raised/40">
              <div className="max-w-[70%]">
                <h2 className="text-white font-bold text-base md:text-lg truncate">{activeGallery.title}</h2>
                <p className="text-brand-mid text-xs truncate mt-0.5">{activeGallery.description}</p>
              </div>
              
              {/* Media Switch View Tabs */}
              <div className="flex items-center gap-1.5 bg-brand-black border border-brand-border rounded-lg p-1">
                <button 
                  onClick={() => setTabMode("photos")}
                  className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${tabMode === "photos" ? "bg-brand-accent text-brand-black" : "text-brand-mid hover:text-white"}`}
                >
                  <ImageIcon size={12} /> Gallery
                </button>
                {activeGallery.video && (
                  <button 
                    onClick={() => setTabMode("video")}
                    className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${tabMode === "video" ? "bg-brand-accent text-brand-black" : "text-brand-mid hover:text-white"}`}
                  >
                    <Film size={12} /> Video Player
                  </button>
                )}
                <button onClick={() => setActiveGallery(null)} className="p-1 text-brand-subtle hover:text-white ml-2 pl-2 border-l border-brand-border"><X size={16}/></button>
              </div>
            </div>

            {/* Main Interactive Screen Interface */}
            <div className="bg-black/40 flex-1 flex flex-col items-center justify-center p-4 min-h-[300px] md:min-h-[450px] overflow-hidden">
              {tabMode === "photos" ? (
                <div className="w-full h-full flex flex-col items-center justify-center relative group">
                  {/* Main Display Image */}
                  <div className="w-full max-h-[50vh] flex justify-center items-center rounded-xl overflow-hidden bg-brand-black/50">
                    <img 
                      src={activeGallery.images[activeImgIndex]} 
                      alt="" 
                      className="max-w-full max-h-[50vh] object-contain"
                    />
                  </div>

                  {/* Left / Right Carousel Buttons */}
                  {activeGallery.images.length > 1 && (
                    <>
                      <button 
                        onClick={() => setActiveImgIndex(prev => (prev === 0 ? activeGallery.images.length - 1 : prev - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-brand-card/80 border border-brand-border text-white hover:text-brand-accent transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        onClick={() => setActiveImgIndex(prev => (prev === activeGallery.images.length - 1 ? 0 : prev + 1))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-brand-card/80 border border-brand-border text-white hover:text-brand-accent transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}

                  {/* Bullet Indicators count */}
                  <div className="text-brand-subtle text-xs font-mono mt-4">
                    {activeImgIndex + 1} / {activeGallery.images.length}
                  </div>
                </div>
              ) : (
                /* Native Adaptive Video Renderer */
                <div className="w-full max-w-2xl aspect-video rounded-xl overflow-hidden border border-brand-border bg-black relative">
                  <video 
                    src={activeGallery.video} 
                    controls 
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}