"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiGetPainters, apiRequestAPainter } from "@/lib/userApi";
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
} from "lucide-react";
import toast from "react-hot-toast";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface LocationObject {
  _id?: string;
  type?: string;
  name?: string;
}

type LocationValue = string | LocationObject | null | undefined;

interface SkillObject {
  _id?: string;
  name?: string;
}

type SkillValue = string | SkillObject | null | undefined;

interface Painter {
  _id: string;
  fullName: string;
  bio: string;
  city: LocationValue;
  state: LocationValue;
  profileImage: string;
  yearsOfExperience: number;
  averageRating: number;
  totalReviews: number;
  preferredBrands: string[];
  services: string[];
  skills: SkillValue[];
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Safely converts a city/state value into a string.
 *
 * Backend may return:
 * "Enugu"
 *
 * or:
 * {
 *   _id: "...",
 *   type: "state",
 *   name: "Enugu"
 * }
 */
function getLocationName(value: LocationValue): string {
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
 * Safely converts a skill value into a string.
 *
 * Handles both:
 * "Interior Painting"
 *
 * and:
 * {
 *   _id: "...",
 *   name: "Interior Painting"
 * }
 */
function getSkillName(value: SkillValue): string {
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
 * Safely converts any possible backend value to a searchable string.
 */
function getSafeString(value: unknown): string {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object") {
    const obj = value as { name?: unknown };

    if (typeof obj.name === "string") {
      return obj.name;
    }
  }

  return "";
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

const inputCls =
  "w-full bg-brand-raised border border-brand-border rounded-lg p-2.5 text-white placeholder-brand-subtle/50 outline-none focus:border-brand-accent/50 text-xs";

/* -------------------------------------------------------------------------- */
/* Booking Modal                                                              */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Main Page                                                                  */
/* -------------------------------------------------------------------------- */

export default function PaintersPage() {
  const [selectedState, setSelectedState] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingPainter, setBookingPainter] = useState<Painter | null>(null);

  const { data: painters = [], isLoading } = useQuery<Painter[]>({
    queryKey: ["painters"],

    queryFn: async () => {
      try {
        const res = await apiGetPainters();

        console.log("PAINTERS API RESPONSE:", res);

        const data = res?.painters ?? res?.data ?? [];

        console.log("NORMALIZED PAINTERS:", data);

        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Failed to fetch painters:", error);
        return [];
      }
    },
  });

  /* ------------------------------------------------------------------------ */
  /* State Filter                                                             */
  /* ------------------------------------------------------------------------ */

  const statesList = Array.from(
    new Set(
      painters
        .map((p) => getLocationName(p.state))
        .filter((stateName) => Boolean(stateName))
    )
  );

  /* ------------------------------------------------------------------------ */
  /* Search + Filtering                                                       */
  /* ------------------------------------------------------------------------ */

  const filtered = painters.filter((p) => {
    const painterState = getLocationName(p.state);
    const painterCity = getLocationName(p.city);

    const painterName = getSafeString(p.fullName);
    const painterBio = getSafeString(p.bio);

    const painterSkills = Array.isArray(p.skills)
      ? p.skills.map((skill) => getSkillName(skill)).filter(Boolean)
      : [];

    const search = searchQuery.trim().toLowerCase();

    const matchState =
      selectedState === "All" || painterState === selectedState;

    const matchSearch =
      !search ||
      painterName.toLowerCase().includes(search) ||
      painterCity.toLowerCase().includes(search) ||
      painterState.toLowerCase().includes(search) ||
      painterBio.toLowerCase().includes(search) ||
      painterSkills.some((skill) =>
        skill.toLowerCase().includes(search)
      );

    return matchState && matchSearch;
  });

  /* ------------------------------------------------------------------------ */
  /* Colors                                                                   */
  /* ------------------------------------------------------------------------ */

  const COLORS = {
    bg: "#F8F5F0",
    cardBg: "#FFFFFF",
    primaryText: "#1F1F1F",
    secondaryText: "#7A7A7A",
    accent: "#C59A46",
    accentHover: "#B0873B",
    border: "rgba(197, 154, 70, 0.2)",
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="min-h-screen" style={{ backgroundColor: COLORS.bg }}>
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

              {statesList.map((stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName}
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
                {filtered.map((p) => {
                  const cityName = getLocationName(p.city);
                  const stateName = getLocationName(p.state);

                  const skills = Array.isArray(p.skills)
                    ? p.skills
                        .map((skill) => getSkillName(skill))
                        .filter(Boolean)
                    : [];

                  return (
                    <div
                      key={p._id}
                      className="bg-white border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group shadow-sm hover:shadow-md hover:-translate-y-1"
                      style={{ borderColor: COLORS.border }}
                    >
                      {/* Image Header */}
                      <div
                        className="relative w-full aspect-square overflow-hidden border-b"
                        style={{
                          backgroundColor: "#EFEBE4",
                          borderColor: "rgba(197, 154, 70, 0.15)",
                        }}
                      >
                        <img
                          src={
                            p.profileImage ||
                            "https://res.cloudinary.com/ddqhj3e3a/image/upload/v1784109923/paintmarket/painters/profile/nqdwczuyo1vsf5b0lyun.png"
                          }
                          alt={getSafeString(p.fullName)}
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
                            {getSafeString(p.fullName)}
                          </h3>

                          <div
                            className="flex items-center gap-1 mt-1 text-xs font-medium"
                            style={{ color: COLORS.secondaryText }}
                          >
                            <MapPin
                              size={12}
                              style={{ color: COLORS.accent }}
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
                          style={{ color: COLORS.secondaryText }}
                        >
                          &ldquo;
                          {getSafeString(p.bio) ||
                            "Professional painter ready for your project."}
                          &rdquo;
                        </p>

                        {/* Experience & Rating Bar */}
                        <div
                          className="grid grid-cols-2 gap-2 text-[11px] py-2.5 border-y"
                          style={{
                            borderColor: "rgba(197, 154, 70, 0.15)",
                          }}
                        >
                          <div>
                            <span
                              className="block text-[10px] uppercase font-semibold"
                              style={{ color: COLORS.secondaryText }}
                            >
                              Experience
                            </span>

                            <span
                              className="font-bold text-xs"
                              style={{ color: COLORS.primaryText }}
                            >
                              {p.yearsOfExperience} yrs
                            </span>
                          </div>

                          <div>
                            <span
                              className="block text-[10px] uppercase font-semibold"
                              style={{ color: COLORS.secondaryText }}
                            >
                              Rating
                            </span>

                            <span
                              className="font-bold text-xs flex items-center gap-1"
                              style={{ color: COLORS.primaryText }}
                            >
                              <Star
                                size={11}
                                className="fill-[#C59A46]"
                                style={{ color: COLORS.accent }}
                              />

                              {p.averageRating > 0
                                ? p.averageRating.toFixed(1)
                                : "N/A"}

                              <span
                                className="font-normal"
                                style={{ color: COLORS.secondaryText }}
                              >
                                ({p.totalReviews})
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Skills Chips */}
                        {skills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {skills.slice(0, 3).map((skill, i) => (
                              <span
                                key={`${skill}-${i}`}
                                className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
                                style={{
                                  backgroundColor:
                                    "rgba(197, 154, 70, 0.08)",
                                  borderColor:
                                    "rgba(197, 154, 70, 0.25)",
                                  color: COLORS.accent,
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-auto flex flex-col gap-2 pt-1">
                          <button
                            onClick={() => setBookingPainter(p)}
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