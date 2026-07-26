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
const COLORS = {
  bg: "#F8F5F0",
  cardBg: "#FFFFFF",
  primaryText: "#1F1F1F",
  secondaryText: "#7A7A7A",
  accent: "#C59A46",
  accentHover: "#B0873B",
  border: "rgba(197, 154, 70, 0.2)",
};
  return (
   <main
      className="min-h-screen flex flex-col justify-between"
      style={{ backgroundColor: COLORS.bg }}
    >
      <div>
        <Navbar />

        {/* Header Block Section */}
        <section
          className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 border-b max-w-7xl mx-auto w-full"
          style={{ borderColor: COLORS.border }}
        >
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-2"
            style={{ color: COLORS.accent }}
          >
            Knowledge Base
          </p>
          <h1
            className="font-display text-3xl sm:text-4xl font-bold"
            style={{ color: COLORS.primaryText }}
          >
            Interactive Paint Training
          </h1>
          <p
            className="mt-2 text-sm font-medium"
            style={{ color: COLORS.secondaryText }}
          >
            Visual guides, application workflows, and expert structural tutorials.
          </p>
        </section>

        {/* Lessons Display Area Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loader
                size={30}
                className="animate-spin"
                style={{ color: COLORS.accent }}
              />
            </div>
          ) : !lessons || lessons.length === 0 ? (
            <div
              className="text-center py-20 border rounded-2xl bg-white shadow-sm"
              style={{ borderColor: COLORS.border }}
            >
              <Film
                className="mx-auto mb-2 opacity-40"
                size={36}
                style={{ color: COLORS.secondaryText }}
              />
              <p
                className="text-sm font-medium"
                style={{ color: COLORS.secondaryText }}
              >
                No workspace training published yet.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <div
                  key={lesson._id}
                  onClick={() => launchGallery(lesson)}
                  className="bg-white border rounded-2xl overflow-hidden cursor-pointer 
                    transition-all duration-300 group flex flex-col h-full shadow-sm hover:shadow-md hover:-translate-y-1"
                  style={{ borderColor: COLORS.border }}
                >
                  {/* Aspect Card Cover */}
                  <div
                    className="h-48 relative overflow-hidden border-b"
                    style={{
                      backgroundColor: "#EFEBE4",
                      borderColor: "rgba(197, 154, 70, 0.15)",
                    }}
                  >
                    {lesson.images && lesson.images[0] ? (
                      <img
                        src={lesson.images[0]}
                        alt={lesson.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon
                          size={32}
                          style={{ color: COLORS.secondaryText }}
                        />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Action Indicators Top Overlay */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1 font-medium">
                        <ImageIcon size={11} /> {lesson.images?.length || 0}
                      </span>
                      {lesson.video && (
                        <span
                          className="text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm"
                          style={{ backgroundColor: COLORS.accent }}
                        >
                          <Play size={10} fill="currentColor" /> Watch Video
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content Description */}
                  <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      <div
                        className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold mb-1.5"
                        style={{ color: COLORS.secondaryText }}
                      >
                        <Calendar size={11} />
                        {new Date(lesson.createdAt).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </div>
                      <h3
                        className="font-bold text-base leading-tight group-hover:opacity-80 transition-opacity line-clamp-1"
                        style={{ color: COLORS.primaryText }}
                      >
                        {lesson.title}
                      </h3>
                      <p
                        className="text-xs leading-relaxed mt-1.5 line-clamp-3"
                        style={{ color: COLORS.secondaryText }}
                      >
                        {lesson.description}
                      </p>
                    </div>

                    <span
                      className="text-xs font-semibold flex items-center gap-1 mt-2 group-hover:underline"
                      style={{ color: COLORS.accent }}
                    >
                      Launch Lesson Player &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Fullscale Dynamic Media Overlay Gallery Component */}
      {activeGallery && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="bg-white border rounded-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
            style={{ borderColor: COLORS.border }}
          >
            {/* Gallery Navbar Control */}
            <div
              className="p-4 border-b flex justify-between items-center"
              style={{
                backgroundColor: COLORS.bg,
                borderColor: COLORS.border,
              }}
            >
              <div className="max-w-[70%]">
                <h2
                  className="font-bold text-base md:text-lg truncate"
                  style={{ color: COLORS.primaryText }}
                >
                  {activeGallery.title}
                </h2>
                <p
                  className="text-xs truncate mt-0.5"
                  style={{ color: COLORS.secondaryText }}
                >
                  {activeGallery.description}
                </p>
              </div>

              {/* Media Switch View Tabs */}
              <div
                className="flex items-center gap-1.5 bg-white border rounded-lg p-1 shadow-sm"
                style={{ borderColor: COLORS.border }}
              >
                <button
                  onClick={() => setTabMode("photos")}
                  className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${
                    tabMode === "photos"
                      ? "text-white font-semibold"
                      : "hover:opacity-75"
                  }`}
                  style={{
                    backgroundColor:
                      tabMode === "photos" ? COLORS.accent : "transparent",
                    color:
                      tabMode === "photos" ? "#FFFFFF" : COLORS.secondaryText,
                  }}
                >
                  <ImageIcon size={12} /> Gallery
                </button>
                {activeGallery.video && (
                  <button
                    onClick={() => setTabMode("video")}
                    className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${
                      tabMode === "video"
                        ? "text-white font-semibold"
                        : "hover:opacity-75"
                    }`}
                    style={{
                      backgroundColor:
                        tabMode === "video" ? COLORS.accent : "transparent",
                      color:
                        tabMode === "video" ? "#FFFFFF" : COLORS.secondaryText,
                    }}
                  >
                    <Film size={12} /> Video Player
                  </button>
                )}
                <button
                  onClick={() => setActiveGallery(null)}
                  className="p-1 hover:opacity-70 ml-2 pl-2 border-l"
                  style={{
                    borderColor: COLORS.border,
                    color: COLORS.secondaryText,
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Main Interactive Screen Interface */}
            <div className="bg-[#111111] flex-1 flex flex-col items-center justify-center p-4 min-h-[300px] md:min-h-[450px] overflow-hidden relative">
              {tabMode === "photos" ? (
                <div className="w-full h-full flex flex-col items-center justify-center relative group">
                  {/* Main Display Image */}
                  <div className="w-full max-h-[50vh] flex justify-center items-center rounded-xl overflow-hidden bg-black/40">
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
                        onClick={() =>
                          setActiveImgIndex((prev) =>
                            prev === 0
                              ? activeGallery.images.length - 1
                              : prev - 1
                          )
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 border text-gray-800 hover:text-[#C59A46] transition-colors shadow-md"
                        style={{ borderColor: COLORS.border }}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() =>
                          setActiveImgIndex((prev) =>
                            prev === activeGallery.images.length - 1
                              ? 0
                              : prev + 1
                          )
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 border text-gray-800 hover:text-[#C59A46] transition-colors shadow-md"
                        style={{ borderColor: COLORS.border }}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}

                  {/* Bullet Indicators Count */}
                  <div className="text-gray-400 text-xs font-mono mt-4">
                    {activeImgIndex + 1} / {activeGallery.images.length}
                  </div>
                </div>
              ) : (
                /* Native Video Player */
                <div className="w-full max-w-2xl aspect-video rounded-xl overflow-hidden border border-gray-800 bg-black relative shadow-lg">
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