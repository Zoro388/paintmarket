"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGetAllMedia } from "@/lib/userApi";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Image as ImageIcon,
  Film,
  X,
  Loader,
  Calendar,
} from "lucide-react";

interface MediaItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  video?: string;
  createdAt: string;
}

type ActiveMedia =
  | {
      type: "video";
      url: string;
      poster: string;
    }
  | {
      type: "image";
      url: string;
    };

export default function LessonsLandingPage() {
  const [activeGallery, setActiveGallery] = useState<MediaItem | null>(null);

  // 0 = video, 1 onward = images
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);

  // Controls whether the actual video is playing
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Controls the selected lesson category
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { data: lessons, isLoading } = useQuery({
    queryKey: ["client-lessons-media"],
    queryFn: async () => {
      const res = await apiGetAllMedia();
      return (res?.media ?? res?.data ?? []) as MediaItem[];
    },
  });

  console.log(lessons);

  const COLORS = {
    bg: "#F8F5F0",
    cardBg: "#FFFFFF",
    primaryText: "#1F1F1F",
    secondaryText: "#7A7A7A",
    accent: "#C59A46",
    accentHover: "#B0873B",
    border: "rgba(197, 154, 70, 0.2)",
  };

  // Get unique categories from lessons
  const categories = lessons
    ? Array.from(
        new Set(
          lessons
            .map((lesson) => lesson.category)
            .filter(
              (category): category is string =>
                Boolean(category && category.trim())
            )
        )
      )
    : [];

  // Filter lessons based on selected category
  const filteredLessons =
    selectedCategory === "All"
      ? lessons
      : lessons?.filter(
          (lesson) => lesson.category === selectedCategory
        );

  /**
   * Open lesson viewer.
   *
   * If the lesson has a video, video becomes the first media item.
   * Otherwise, the first image becomes the first media item.
   */
  const launchGallery = (item: MediaItem) => {
    setActiveGallery(item);
    setIsVideoPlaying(false);

    // Video comes first when available.
    // Otherwise start with the first image.
    if (item.video) {
      setActiveMediaIndex(0);
    } else {
      setActiveMediaIndex(0);
    }
  };

  /**
   * Number of media items in the viewer.
   *
   * Video = 1 item
   * Images = additional items
   */
  const getMediaCount = (item: MediaItem) => {
    return (item.video ? 1 : 0) + (item.images?.length || 0);
  };

  /**
   * Get the media currently being displayed.
   */
  const getActiveMedia = (item: MediaItem): ActiveMedia | null => {
    const hasVideo = Boolean(item.video);

    // Video is always media index 0.
    if (hasVideo && activeMediaIndex === 0) {
      return {
        type: "video",
        url: item.video!,
        poster: item.images?.[0] || "",
      };
    }

    // Images start at index 1 when video exists.
    const imageIndex = hasVideo
      ? activeMediaIndex - 1
      : activeMediaIndex;

    const imageUrl = item.images?.[imageIndex];

    if (!imageUrl) {
      return null;
    }

    return {
      type: "image",
      url: imageUrl,
    };
  };

  /**
   * Go to previous media.
   */
  const goToPrevious = () => {
    if (!activeGallery) return;

    const total = getMediaCount(activeGallery);

    setIsVideoPlaying(false);

    setActiveMediaIndex((prev) =>
      prev === 0 ? total - 1 : prev - 1
    );
  };

  /**
   * Go to next media.
   */
  const goToNext = () => {
    if (!activeGallery) return;

    const total = getMediaCount(activeGallery);

    setIsVideoPlaying(false);

    setActiveMediaIndex((prev) =>
      prev === total - 1 ? 0 : prev + 1
    );
  };

  const activeMedia = activeGallery
    ? getActiveMedia(activeGallery)
    : null;

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
            Visual guides, application workflows, and expert structural
            tutorials.
          </p>
        </section>

        {/* Category Buttons */}
        {!isLoading && lessons && lessons.length > 0 && (
          <section className="pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setSelectedCategory("All")}
                className="px-5 py-2.5 rounded-full text-xs font-semibold
                  border transition-all duration-200"
                style={{
                  backgroundColor:
                    selectedCategory === "All"
                      ? COLORS.accent
                      : COLORS.cardBg,
                  color:
                    selectedCategory === "All"
                      ? "#FFFFFF"
                      : COLORS.primaryText,
                  borderColor: COLORS.border,
                }}
              >
                All
              </button>

              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold
                    border transition-all duration-200"
                  style={{
                    backgroundColor:
                      selectedCategory === category
                        ? COLORS.accent
                        : COLORS.cardBg,
                    color:
                      selectedCategory === category
                        ? "#FFFFFF"
                        : COLORS.primaryText,
                    borderColor: COLORS.border,
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </section>
        )}

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
          ) : !filteredLessons || filteredLessons.length === 0 ? (
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
                No training found in this category.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson) => (
                <div
                  key={lesson._id}
                  onClick={() => launchGallery(lesson)}
                  className="bg-white border rounded-2xl overflow-hidden cursor-pointer
                    transition-all duration-300 group flex flex-col h-full
                    shadow-sm hover:shadow-md hover:-translate-y-1"
                  style={{ borderColor: COLORS.border }}
                >
                  {/* Card Cover */}
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

                    {/* Action Indicators */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1 font-medium">
                        <ImageIcon size={11} />
                        {lesson.images?.length || 0}
                      </span>

                      {lesson.video && (
                        <span
                          className="text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm"
                          style={{ backgroundColor: COLORS.accent }}
                        >
                          <Play size={10} fill="currentColor" />
                          Watch Video
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      <div
                        className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold mb-1.5"
                        style={{ color: COLORS.secondaryText }}
                      >
                        <Calendar size={11} />

                        {new Date(
                          lesson.createdAt
                        ).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
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

      {/* Lesson Viewer */}
      {activeGallery && activeMedia && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50
            flex items-center justify-center p-4"
          onClick={() => setActiveGallery(null)}
        >
          <div
            className="bg-white border rounded-2xl w-full max-w-5xl
              overflow-hidden flex flex-col max-h-[92vh] shadow-2xl"
            style={{ borderColor: COLORS.border }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Viewer Header */}
            <div
              className="p-4 border-b flex justify-between items-center gap-4"
              style={{
                backgroundColor: COLORS.bg,
                borderColor: COLORS.border,
              }}
            >
              <div className="max-w-[75%]">
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

              <button
                onClick={() => setActiveGallery(null)}
                className="p-2 rounded-full hover:bg-black/5 transition-colors"
                style={{ color: COLORS.secondaryText }}
                aria-label="Close lesson viewer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Media Viewer */}
            <div
              className="bg-[#111111] flex-1 flex items-center justify-center
                min-h-[350px] md:min-h-[500px] relative overflow-hidden"
            >
              {/* Previous Button */}
              {getMediaCount(activeGallery) > 1 && (
                <button
                  onClick={goToPrevious}
                  className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2
                    z-20 p-3 rounded-full bg-white/90 text-gray-800
                    hover:bg-white hover:text-[#C59A46]
                    transition-all shadow-lg"
                  aria-label="Previous media"
                >
                  <ChevronLeft size={26} />
                </button>
              )}

              {/* VIDEO */}
              {activeMedia.type === "video" ? (
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  {isVideoPlaying ? (
                    <video
                      src={activeMedia.url}
                      controls
                      autoPlay
                      playsInline
                      className="max-w-full max-h-[70vh] w-auto h-auto
                        object-contain rounded-xl shadow-2xl"
                      onEnded={() => setIsVideoPlaying(false)}
                    />
                  ) : (
                    <div
                      className="relative max-w-4xl w-full
                        aspect-video rounded-xl overflow-hidden bg-black
                        shadow-2xl"
                    >
                      {/* Video Thumbnail */}
                      {activeMedia.poster ? (
                        <img
                          src={activeMedia.poster}
                          alt={`${activeGallery.title} video thumbnail`}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#222222]" />
                      )}

                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-black/35" />

                      {/* Play Button */}
                      <button
                        onClick={() => setIsVideoPlaying(true)}
                        className="absolute left-1/2 top-1/2
                          -translate-x-1/2 -translate-y-1/2
                          w-20 h-20 md:w-24 md:h-24 rounded-full
                          flex items-center justify-center
                          bg-white/95 text-[#C59A46]
                          hover:bg-white hover:scale-110
                          transition-all duration-300 shadow-2xl"
                        aria-label="Play video"
                      >
                        <Play
                          size={36}
                          fill="currentColor"
                          className="ml-1"
                        />
                      </button>

                      {/* Video Label */}
                      <div
                        className="absolute bottom-4 left-1/2
                          -translate-x-1/2 bg-black/65 text-white
                          px-4 py-2 rounded-full text-xs font-semibold
                          flex items-center gap-2 backdrop-blur-sm"
                      >
                        <Film size={14} />
                        Watch Training Video
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* IMAGE */
                <div className="w-full h-full flex items-center justify-center p-4">
                  <img
                    src={activeMedia.url}
                    alt={activeGallery.title}
                    className="max-w-full max-h-[70vh] object-contain rounded-xl"
                  />
                </div>
              )}

              {/* Next Button */}
              {getMediaCount(activeGallery) > 1 && (
                <button
                  onClick={goToNext}
                  className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2
                    z-20 p-3 rounded-full bg-white/90 text-gray-800
                    hover:bg-white hover:text-[#C59A46]
                    transition-all shadow-lg"
                  aria-label="Next media"
                >
                  <ChevronRight size={26} />
                </button>
              )}
            </div>

            {/* Bottom Media Counter */}
            <div
              className="px-4 py-3 border-t flex items-center justify-center"
              style={{
                backgroundColor: COLORS.bg,
                borderColor: COLORS.border,
              }}
            >
              <div className="text-xs font-medium flex items-center gap-2">
                <span style={{ color: COLORS.secondaryText }}>
                  {activeMedia.type === "video"
                    ? "Video"
                    : `Image ${
                        activeGallery.video
                          ? activeMediaIndex
                          : activeMediaIndex + 1
                      }`}
                </span>

                <span
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: COLORS.accent }}
                />

                <span style={{ color: COLORS.secondaryText }}>
                  {activeMediaIndex + 1} /{" "}
                  {getMediaCount(activeGallery)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}