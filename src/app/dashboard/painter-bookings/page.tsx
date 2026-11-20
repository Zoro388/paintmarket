
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  RefreshCw,
  Search,
  AlertCircle,
  Users,
  Brush,
  MapPin,
  CalendarDays,
  Eye,
} from "lucide-react";
import endpointRoute from "@/lib/endpointRoute";

interface PainterUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

interface SelectedPainter {
  _id?: string;
  user?: PainterUser;
}

interface PainterRequest {
  _id: string;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  propertyLocation?: string;
  projectType?: string;
  propertyType?: string;
  projectDescription?: string;
  preferredStartDate?: string;
  additionalNotes?: string;
  status?: string;
  selectedPainter?: SelectedPainter | null;
  createdAt?: string;
}

function formatDate(value?: string) {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not specified";

  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function StatusBadge({ value }: { value?: string }) {
  const status = (value || "pending").toLowerCase();

  let styles = "border-amber-500/30 bg-amber-500/10 text-amber-400";

  if (["accepted", "completed", "work_in_progress"].includes(status)) {
    styles = "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  } else if (["declined", "cancelled"].includes(status)) {
    styles = "border-red-500/30 bg-red-500/10 text-red-400";
  } else if (["inspection_booked", "quotation_sent"].includes(status)) {
    styles = "border-blue-500/30 bg-blue-500/10 text-blue-400";
  }

  const label = value
    ? value.replace(/_/g, " ").replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      )
    : "Pending";

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${styles}`}
    >
      {label}
    </span>
  );
}

function getPainterName(request: PainterRequest) {
  const user = request.selectedPainter?.user;

  if (!user) return "No painter selected";

  return [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    "Unnamed painter";
}

export default function PainterBookingsPage() {
  const [bookings, setBookings] = useState<PainterRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await endpointRoute.get("/painter-requests");
      const data = response.data;

      if (!data?.success || !Array.isArray(data.requests)) {
        throw new Error(
          data?.message || "The server returned an unexpected response."
        );
      }

      setBookings(data.requests);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load painter bookings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredBookings = bookings.filter((booking) => {
    const painter = booking.selectedPainter?.user;

    const searchableValues = [
      booking.fullName,
      booking.phoneNumber,
      booking.email,
      booking.propertyLocation,
      booking.projectType,
      booking.propertyType,
      booking.projectDescription,
      booking.status,
      booking._id,
      painter?.firstName,
      painter?.lastName,
      painter?.email,
      painter?.phoneNumber,
    ];

    return searchableValues.some((value) =>
      String(value || "").toLowerCase().includes(normalizedSearch)
    );
  });

  const pendingCount = bookings.filter(
    (booking) => (booking.status || "pending").toLowerCase() === "pending"
  ).length;

  const acceptedCount = bookings.filter(
    (booking) => (booking.status || "").toLowerCase() === "accepted"
  ).length;

  const selectedPainterCount = bookings.filter(
    (booking) => Boolean(booking.selectedPainter)
  ).length;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-accent">
            Booking management
          </p>

          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Painter Bookings
          </h1>

          <p className="mt-2 text-sm text-brand-mid">
            View customers who have requested painters, the selected painters,
            project details and booking status.
          </p>
        </div>

        <button
          onClick={() => void loadBookings()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-sm text-white transition-colors hover:border-brand-accent/50 disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-brand-border bg-brand-card p-4">
          <Users size={19} className="mb-3 text-brand-accent" />
          <p className="font-display text-2xl font-bold text-white">
            {bookings.length}
          </p>
          <p className="mt-1 text-xs text-brand-mid">Total requests</p>
        </div>

        <div className="rounded-xl border border-brand-border bg-brand-card p-4">
          <Brush size={19} className="mb-3 text-violet-400" />
          <p className="font-display text-2xl font-bold text-white">
            {selectedPainterCount}
          </p>
          <p className="mt-1 text-xs text-brand-mid">With selected painter</p>
        </div>

        <div className="rounded-xl border border-brand-border bg-brand-card p-4">
          <CalendarDays size={19} className="mb-3 text-amber-400" />
          <p className="font-display text-2xl font-bold text-white">
            {pendingCount}
          </p>
          <p className="mt-1 text-xs text-brand-mid">Pending requests</p>
        </div>

        <div className="rounded-xl border border-brand-border bg-brand-card p-4">
          <Users size={19} className="mb-3 text-emerald-400" />
          <p className="font-display text-2xl font-bold text-white">
            {acceptedCount}
          </p>
          <p className="mt-1 text-xs text-brand-mid">Accepted requests</p>
        </div>
      </div>

      <div className="rounded-xl border border-brand-border bg-brand-card p-4 sm:p-5">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-mid"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customer, painter, phone, project or location..."
            className="w-full rounded-lg border border-brand-border bg-brand-black py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-brand-accent"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle size={21} className="mt-0.5 text-red-400" />
            <div>
              <h2 className="font-semibold text-white">
                Unable to load painter bookings
              </h2>
              <p className="mt-1 break-words text-sm text-brand-mid">
                {error}
              </p>
              <button
                onClick={() => void loadBookings()}
                className="mt-3 text-sm font-semibold text-brand-accent hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-brand-border bg-brand-card">
        <div className="flex flex-col gap-2 border-b border-brand-border/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Brush size={18} className="text-brand-accent" />
            <h2 className="font-semibold text-white">All painter requests</h2>
          </div>

          <p className="text-xs text-brand-mid">
            Showing {filteredBookings.length} of {bookings.length} requests
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 px-5 py-16 text-sm text-brand-mid">
            <RefreshCw size={18} className="animate-spin" />
            Loading painter bookings...
          </div>
        ) : error ? (
          <div className="px-5 py-10 text-center text-sm text-brand-mid">
            Resolve the loading error above to view bookings.
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <Brush size={32} className="mx-auto mb-3 text-brand-mid" />
            <h3 className="font-semibold text-white">
              {bookings.length === 0
                ? "No painter bookings yet"
                : "No matching bookings"}
            </h3>
            <p className="mt-2 text-sm text-brand-mid">
              {bookings.length === 0
                ? "Customer painter requests will appear here."
                : "Try changing your search."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px] text-left text-sm">
              <thead>
                <tr className="border-b border-brand-border/60">
                  {[
                    "Customer",
                    "Selected painter",
                    "Project",
                    "Location",
                    "Preferred start",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-brand-mid"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => {
                  const painterUser = booking.selectedPainter?.user;

                  return (
                    <tr
                      key={booking._id}
                      className="border-b border-brand-border/30 transition-colors hover:bg-brand-raised/40"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">
                          {booking.fullName || "Unnamed customer"}
                        </p>
                        <p className="mt-1 text-xs text-brand-mid">
                          {booking.phoneNumber || "No phone number"}
                        </p>
                        <p className="mt-1 text-xs text-brand-mid">
                          {booking.email || "No email"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">
                          {getPainterName(booking)}
                        </p>
                        <p className="mt-1 text-xs text-brand-mid">
                          {painterUser?.phoneNumber || "No phone number"}
                        </p>
                        <p className="mt-1 text-xs text-brand-mid">
                          {painterUser?.email || "No email"}
                        </p>
                      </td>

                      <td className="max-w-xs px-5 py-4">
                        <p className="font-medium text-white">
                          {booking.projectType || "Project not specified"}
                        </p>
                        <p className="mt-1 text-xs text-brand-mid">
                          {booking.propertyType || "Property type not specified"}
                        </p>
                        <p className="mt-1 line-clamp-3 text-xs leading-5 text-brand-mid">
                          {booking.projectDescription || "No project description"}
                        </p>
                      </td>

                      <td className="max-w-xs px-5 py-4">
                        <p className="flex items-start gap-1.5 text-xs leading-5 text-white">
                          <MapPin
                            size={14}
                            className="mt-0.5 shrink-0 text-brand-accent"
                          />
                          <span>
                            {booking.propertyLocation || "Location not provided"}
                          </span>
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-brand-lt-gray">
                        {formatDate(booking.preferredStartDate)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge value={booking.status} />
                        <p className="mt-2 text-xs text-brand-mid">
                          Submitted: {formatDate(booking.createdAt)}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
