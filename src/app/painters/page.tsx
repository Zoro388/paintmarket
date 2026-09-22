"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  apiGetPainters,
  apiRequestAPainter,
} from "@/lib/userApi";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  Search,
  Loader,
  User,
  MapPin,
  Calendar,
  Star,
  X,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Skill {
  _id?: string;
  name: string;
}

interface LocationValue {
  _id?: string;
  type?: string;
  name: string;
}

type LocationField = string | LocationValue | null | undefined;

interface PortfolioImage {
  url: string;
  publicId?: string;
}

interface Painter {
  _id: string;
  fullName: string;
  bio: string;
  city: LocationField;
  state: LocationField;
  profileImage: string;
  yearsOfExperience: number;
  averageRating: number;
  totalReviews: number;
  preferredBrands: string[];
  services: string[];
  skills: Skill[];
  portfolioImages: PortfolioImage[];
}

const inputCls =
  "w-full bg-brand-raised border border-brand-border rounded-lg p-2.5 text-white placeholder-brand-subtle/50 outline-none focus:border-brand-accent/50 text-xs";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The backend may return city/state as either:
 *
 * "Enugu"
 *
 * OR:
 *
 * {
 *   _id: "...",
 *   type: "...",
 *   name: "Enugu"
 * }
 *
 * This helper always gives us a safe string for display/filtering.
 */
function getLocationName(value: LocationField): string {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && typeof value.name === "string") {
    return value.name;
  }

  return "";
}

/**
 * Safely handles values coming from the API before rendering.
 */
function getSafeString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (
    value &&
    typeof value === "object" &&
    "name" in value &&
    typeof (value as { name?: unknown }).name === "string"
  ) {
    return (value as { name: string }).name;
  }

  return "";
}

// ─────────────────────────────────────────────────────────────────────────────
// Star Rating Input
// ─────────────────────────────────────────────────────────────────────────────

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={22}
            className={`transition-colors ${
              n <= (hovered || value)
                ? "fill-brand-accent text-brand-accent"
                : "text-brand-border"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Portfolio Viewer
// ─────────────────────────────────────────────────────────────────────────────

function PortfolioViewer({
  painter,
  onClose,
}: {
  painter: Painter;
  onClose: () => void;
}) {
  const portfolio = (painter.portfolioImages || [])
    .filter((item) => item?.url)
    .slice(0, 3);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  if (portfolio.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
          <div className="p-5 border-b flex items-center justify-between">
            <div>
              <p className="text-[#C59A46] text-[10px] font-bold uppercase tracking-widest">
                Portfolio
              </p>

              <h2 className="text-[#1F1F1F] font-bold text-base">
                {painter.fullName}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-10 text-center">
            <p className="text-sm text-gray-500">
              This painter has no portfolio images available yet.
            </p>
          </div>

          <div className="p-4 border-t flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-[#C59A46] text-white text-xs font-semibold hover:bg-[#B0873B] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = portfolio[currentIndex];

  const goPrevious = () => {
    setCurrentIndex((current) =>
      current === 0 ? portfolio.length - 1 : current - 1
    );
  };

  const goNext = () => {
    setCurrentIndex((current) =>
      current === portfolio.length - 1 ? 0 : current + 1
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b flex items-center justify-between">
            <div>
              <p className="text-[#C59A46] text-[10px] font-bold uppercase tracking-widest">
                Painter Portfolio
              </p>

              <h2 className="text-[#1F1F1F] font-bold text-base">
                {painter.fullName}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Carousel */}
          <div className="p-5">
            <div className="relative aspect-video bg-[#EFEBE4] rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setViewingImage(currentImage.url)}
                className="w-full h-full cursor-zoom-in"
              >
                <img
                  src={currentImage.url}
                  alt={`${painter.fullName} portfolio ${currentIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>

              {/* Previous */}
              {portfolio.length > 1 && (
                <button
                  type="button"
                  onClick={goPrevious}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                  aria-label="Previous portfolio image"
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              {/* Next */}
              {portfolio.length > 1 && (
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                  aria-label="Next portfolio image"
                >
                  <ChevronRight size={20} />
                </button>
              )}

              {/* Counter */}
              {portfolio.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                  {currentIndex + 1} / {portfolio.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {portfolio.length > 1 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {portfolio.map((item, index) => (
                  <button
                    key={item.publicId || item.url || index}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      currentIndex === index
                        ? "border-[#C59A46] ring-1 ring-[#C59A46]/30"
                        : "border-transparent hover:border-[#C59A46]/40"
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={`${painter.fullName} portfolio thumbnail ${
                        index + 1
                      }`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-[#C59A46] text-white text-xs font-semibold hover:bg-[#B0873B] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Full Image Viewer */}
      {viewingImage && (
        <div
          className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
          onClick={() => setViewingImage(null)}
        >
          <button
            type="button"
            onClick={() => setViewingImage(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Close image viewer"
          >
            <X size={22} />
          </button>

          <img
            src={viewingImage}
            alt={`${painter.fullName} portfolio`}
            className="max-w-full max-h-[90vh] object-contain cursor-zoom-out"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Booking Modal
// ─────────────────────────────────────────────────────────────────────────────

function BookingModal({
  painter,
  onClose,
}: {
  painter: Painter;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    propertyLocation: "",
    projectType: "Residential",
    propertyType: "Interior Paint",
    projectDescription: "",
    preferredStartDate: "",
    additionalNotes: "",
  });

  const mutation = useMutation({
    mutationFn: () =>
      apiRequestAPainter({
        ...formData,
        selectedPainter: painter._id,
      }),

    onSuccess: () => {
      toast.success("Booking request sent!");
      onClose();
    },

    onError: (err: Error) => {
      toast.error(err?.message || "Failed to submit");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const {
      fullName,
      phoneNumber,
      email,
      propertyLocation,
      projectDescription,
      preferredStartDate,
    } = formData;

    if (
      !fullName ||
      !phoneNumber ||
      !email ||
      !propertyLocation ||
      !projectDescription ||
      !preferredStartDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    mutation.mutate();
  };

  const set =
    (field: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setFormData((p) => ({
        ...p,
        [field]: e.target.value,
      }));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-xl
        overflow-hidden flex flex-col shadow-2xl max-h-[90vh]"
      >
        <div className="p-5 border-b border-brand-border/60 flex justify-between items-center bg-brand-raised/50">
          <div>
            <span className="text-brand-accent text-[10px] font-bold tracking-widest uppercase block mb-0.5">
              Booking Request
            </span>

            <h2 className="text-white font-bold text-base leading-tight">
              Request {painter.fullName}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-brand-subtle hover:text-white transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-4 text-xs"
        >
          <p className="text-brand-accent text-[10px] font-bold uppercase tracking-wider">
            Contact Details
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-brand-subtle mb-1">
                Full Name *
              </label>

              <input
                type="text"
                required
                value={formData.fullName}
                onChange={set("fullName")}
                placeholder="First & last name"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-brand-subtle mb-1">
                Phone Number *
              </label>

              <input
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={set("phoneNumber")}
                placeholder="+234 8xx..."
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="block text-brand-subtle mb-1">
              Email Address *
            </label>

            <input
              type="email"
              required
              value={formData.email}
              onChange={set("email")}
              placeholder="you@email.com"
              className={inputCls}
            />
          </div>

          <hr className="border-brand-border/30" />

          <p className="text-brand-accent text-[10px] font-bold uppercase tracking-wider">
            Project Details
          </p>

          <div>
            <label className="block text-brand-subtle mb-1">
              Property Location *
            </label>

            <input
              type="text"
              required
              value={formData.propertyLocation}
              onChange={set("propertyLocation")}
              placeholder="Street, City, State"
              className={inputCls}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-brand-subtle mb-1">
                Project Type
              </label>

              <select
                value={formData.projectType}
                onChange={set("projectType")}
                className={inputCls}
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>

            <div>
              <label className="block text-brand-subtle mb-1">
                Property Type
              </label>

              <select
                value={formData.propertyType}
                onChange={set("propertyType")}
                className={inputCls}
              >
                <option value="Interior Paint">Interior Only</option>
                <option value="Exterior Paint">Exterior Only</option>
                <option value="Complete Overhaul">Both</option>
                <option value="Spackling/Screeding">
                  Spackling & Screeding
                </option>
                <option value="Wallpapering">
                  Wallpaper / Special Finish
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-brand-subtle mb-1">
              Preferred Start Date *
            </label>

            <input
              type="date"
              required
              value={formData.preferredStartDate}
              onChange={set("preferredStartDate")}
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-brand-subtle mb-1">
              Project Description *
            </label>

            <textarea
              required
              rows={3}
              value={formData.projectDescription}
              onChange={set("projectDescription")}
              placeholder="Number of rooms, current condition, colours, etc."
              className={`${inputCls} resize-none`}
            />
          </div>

          <div>
            <label className="block text-brand-subtle mb-1">
              Additional Notes
            </label>

            <textarea
              rows={2}
              value={formData.additionalNotes}
              onChange={set("additionalNotes")}
              placeholder="Anything else for the painter?"
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="pt-3 border-t border-brand-border/40 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-brand-border text-brand-mid rounded-lg text-xs hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-5 py-2 bg-brand-accent text-brand-black font-semibold rounded-lg text-xs
                hover:bg-brand-accent-lt transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {mutation.isPending ? (
                <Loader size={13} className="animate-spin" />
              ) : (
                <Check size={13} />
              )}

              {mutation.isPending ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function PaintersPage() {
  const [selectedState, setSelectedState] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingPainter, setBookingPainter] =
    useState<Painter | null>(null);

  const [portfolioPainter, setPortfolioPainter] =
    useState<Painter | null>(null);

  const { data: painters = [], isLoading } = useQuery<Painter[]>({
    queryKey: ["painters"],
    queryFn: async () => {
      try {
        const res = await apiGetPainters();

        return res?.painters ?? res?.data ?? [];
      } catch (error) {
        console.error("Failed to fetch painters:", error);
        return [];
      }
    },
  });

  console.log(painters);

  // ───────────────────────────────────────────────────────────────────────────
  // Unique states
  //
  // IMPORTANT:
  // The backend may return state as an object:
  // { _id, type, name }
  //
  // We convert it to the actual state name before putting it in the dropdown.
  // ───────────────────────────────────────────────────────────────────────────

  const statesList = Array.from(
    new Set(
      painters
        .map((p) => getLocationName(p.state))
        .filter(Boolean)
    )
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Filter painters
  // ───────────────────────────────────────────────────────────────────────────

  const filtered = painters.filter((p) => {
    const painterState = getLocationName(p.state);
    const painterCity = getLocationName(p.city);

    const matchState =
      selectedState === "All" || painterState === selectedState;

    const normalizedSearch = searchQuery.toLowerCase().trim();

    const matchSearch =
      !normalizedSearch ||
      getSafeString(p.fullName)
        .toLowerCase()
        .includes(normalizedSearch) ||
      p.skills?.some((s) =>
        getSafeString(s?.name)
          .toLowerCase()
          .includes(normalizedSearch)
      ) ||
      getSafeString(p.bio)
        .toLowerCase()
        .includes(normalizedSearch) ||
      painterCity.toLowerCase().includes(normalizedSearch) ||
      painterState.toLowerCase().includes(normalizedSearch);

    return matchState && matchSearch;
  });

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
      className="min-h-screen"
      style={{ backgroundColor: COLORS.bg }}
    >
      <Navbar />

      {/* Header */}
      <section
        className="pt-32 pb-10 px-4 sm:px-6 lg:px-8 border-b"
        style={{ borderColor: COLORS.border }}
      >
        <div className="max-w-7xl mx-auto">
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-2"
            style={{ color: COLORS.accent }}
          >
            Expert Services
          </p>

          <h1
            className="font-display text-3xl sm:text-4xl font-bold"
            style={{ color: COLORS.primaryText }}
          >
            Find &amp; Book Professional Painters
          </h1>

          <p
            className="mt-2 text-sm font-medium"
            style={{ color: COLORS.secondaryText }}
          >
            {painters.length} certified professionals ready to transform your
            space.
          </p>
        </div>
      </section>

      {/* Sticky Filters Header */}
      <div
        className="sticky top-[60px] z-20 backdrop-blur-md border-b py-4 px-4 sm:px-6 lg:px-8 shadow-sm"
        style={{
          backgroundColor: "rgba(248, 245, 240, 0.95)",
          borderColor: "rgba(197, 154, 70, 0.15)",
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search Box */}
          <div
            className="flex items-center gap-2 bg-white border rounded-lg px-3.5 py-2.5 w-full sm:w-64 shadow-sm"
            style={{ borderColor: COLORS.border }}
          >
            <Search
              size={14}
              className="flex-shrink-0"
              style={{ color: COLORS.secondaryText }}
            />

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name or skill..."
              className="bg-transparent text-sm placeholder:text-gray-400 outline-none flex-1 min-w-0"
              style={{ color: COLORS.primaryText }}
            />
          </div>

          {/* Location Select Dropdown */}
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-white border text-sm rounded-lg pl-3.5 pr-9 py-2.5 outline-none focus:ring-1 transition-all cursor-pointer shadow-sm font-medium"
              style={{
                color: COLORS.primaryText,
                borderColor: COLORS.border,
              }}
            >
              <option value="All">All Locations</option>

              {statesList.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: COLORS.secondaryText }}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loader
                size={32}
                className="animate-spin"
                style={{ color: COLORS.accent }}
              />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <User
                size={44}
                className="mx-auto mb-3 opacity-30"
                style={{ color: COLORS.secondaryText }}
              />

              <p
                className="text-sm font-medium"
                style={{ color: COLORS.secondaryText }}
              >
                No painters found matching your criteria.
              </p>
            </div>
          ) : (
            <>
              <p
                className="text-xs mb-6 uppercase tracking-wider font-semibold"
                style={{ color: COLORS.secondaryText }}
              >
                {filtered.length} Painter
                {filtered.length !== 1 ? "s" : ""} found
              </p>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filtered.map((painter) => {
                  const cityName = getLocationName(painter.city);
                  const stateName = getLocationName(painter.state);

                  return (
                    <div
                      key={painter._id}
                      className="bg-white border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group shadow-sm hover:shadow-md hover:-translate-y-1"
                      style={{ borderColor: COLORS.border }}
                    >
                      {/* Image Header */}
                      <div
                        className="relative w-full aspect-square overflow-hidden border-b"
                        style={{
                          backgroundColor: "#EFEBE4",
                          borderColor:
                            "rgba(197, 154, 70, 0.15)",
                        }}
                      >
                        <img
                          src={
                            painter.profileImage ||
                            "https://res.cloudinary.com/ddqhj3e3a/image/upload/v1784109923/paintmarket/painters/profile/nqdwczuyo1vsf5b0lyun.png"
                          }
                          alt={painter.fullName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Info Body */}
                      <div className="p-5 flex flex-col flex-1 gap-3">
                        <div>
                          <h3
                            className="font-semibold text-base leading-tight"
                            style={{ color: COLORS.primaryText }}
                          >
                            {painter.fullName}
                          </h3>

                          <div
                            className="flex items-center gap-1 mt-1 text-xs font-medium"
                            style={{
                              color: COLORS.secondaryText,
                            }}
                          >
                            <MapPin
                              size={12}
                              style={{
                                color: COLORS.accent,
                              }}
                            />

                            <span>
                              {cityName}
                              {cityName && stateName ? ", " : ""}
                              {stateName}
                            </span>
                          </div>
                        </div>

                        <p
                          className="text-xs leading-relaxed line-clamp-2 italic"
                          style={{
                            color: COLORS.secondaryText,
                          }}
                        >
                          &ldquo;
                          {painter.bio ||
                            "Professional painter ready for your project."}
                          &rdquo;
                        </p>

                        {/* Experience & Rating Bar */}
                        <div
                          className="grid grid-cols-2 gap-2 text-[11px] py-2.5 border-y"
                          style={{
                            borderColor:
                              "rgba(197, 154, 70, 0.15)",
                          }}
                        >
                          <div>
                            <span
                              className="block text-[10px] uppercase font-semibold"
                              style={{
                                color: COLORS.secondaryText,
                              }}
                            >
                              Experience
                            </span>

                            <span
                              className="font-bold text-xs"
                              style={{
                                color: COLORS.primaryText,
                              }}
                            >
                              {painter.yearsOfExperience} yrs
                            </span>
                          </div>

                          <div>
                            <span
                              className="block text-[10px] uppercase font-semibold"
                              style={{
                                color: COLORS.secondaryText,
                              }}
                            >
                              Rating
                            </span>

                            <span
                              className="font-bold text-xs flex items-center gap-1"
                              style={{
                                color: COLORS.primaryText,
                              }}
                            >
                              <Star
                                size={11}
                                className="fill-[#C59A46]"
                                style={{
                                  color: COLORS.accent,
                                }}
                              />

                              {painter.averageRating > 0
                                ? painter.averageRating.toFixed(1)
                                : "N/A"}

                              <span
                                className="font-normal"
                                style={{
                                  color: COLORS.secondaryText,
                                }}
                              >
                                ({painter.totalReviews})
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Skills Chips */}
                        {painter.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {painter.skills
                              .slice(0, 3)
                              .map((skill, index) => (
                                <span
                                  key={skill._id || index}
                                  className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
                                  style={{
                                    backgroundColor:
                                      "rgba(197, 154, 70, 0.08)",
                                    borderColor:
                                      "rgba(197, 154, 70, 0.25)",
                                    color: COLORS.accent,
                                  }}
                                >
                                  {getSafeString(skill?.name)}
                                </span>
                              ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-auto flex flex-col gap-2 pt-1">
                          {/* View Portfolio Button */}
                          <button
                            type="button"
                            onClick={() =>
                              setPortfolioPainter(painter)
                            }
                            disabled={
                              !painter.portfolioImages ||
                              painter.portfolioImages.length === 0
                            }
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all font-semibold text-xs active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                              borderColor: COLORS.accent,
                              color: COLORS.accent,
                              backgroundColor:
                                "rgba(197, 154, 70, 0.05)",
                            }}
                          >
                            View Portfolio
                          </button>

                          {/* Book Painter Button */}
                          <button
                            onClick={() =>
                              setBookingPainter(painter)
                            }
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white transition-all font-semibold text-xs shadow-sm active:scale-[0.99]"
                            style={{
                              backgroundColor: COLORS.accent,
                            }}
                          >
                            <Calendar size={13} />
                            Book This Painter
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Portfolio Modal */}
      {portfolioPainter && (
        <PortfolioViewer
          painter={portfolioPainter}
          onClose={() => setPortfolioPainter(null)}
        />
      )}

      {/* Booking Modal */}
      {bookingPainter && (
        <BookingModal
          painter={bookingPainter}
          onClose={() => setBookingPainter(null)}
        />
      )}

      <Footer />
    </main>
  );
}