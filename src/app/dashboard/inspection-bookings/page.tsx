"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  RefreshCw,
  Search,
  Eye,
  AlertCircle,
  CreditCard,
  Users,
  CheckCircle2,
  Clock,
} from "lucide-react";
import endpointRoute from "@/lib/endpointRoute";

interface InspectionBooking {
  _id: string;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  buildingType?: string;
  bedrooms?: number | string;
  paintType?: string;
  location?: string;
  inspectionDate?: string;
  inspectionFee?: number;
  currency?: string;
  paymentStatus?: string;
  bookingStatus?: string;
  createdAt?: string;
}

function formatDate(value?: string) {
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not scheduled";

  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatMoney(amount?: number, currency = "NGN") {
  if (amount === undefined || amount === null) return "—";

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function StatusBadge({ value }: { value?: string }) {
  const status = (value || "unknown").toLowerCase();

  let styles = "border-gray-500/30 bg-gray-500/10 text-gray-300";

  if (["paid", "confirmed"].includes(status)) {
    styles = "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  } else if (["pending", "pending_payment"].includes(status)) {
    styles = "border-amber-500/30 bg-amber-500/10 text-amber-400";
  } else if (["failed", "cancelled"].includes(status)) {
    styles = "border-red-500/30 bg-red-500/10 text-red-400";
  }

  const label = value
    ? value.replace(/_/g, " ").replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      )
    : "Unknown";

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${styles}`}
    >
      {label}
    </span>
  );
}

export default function InspectionBookingsPage() {
  const [bookings, setBookings] = useState<InspectionBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [bookingFilter, setBookingFilter] = useState("all");

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await endpointRoute.get("/inspection-bookings");
      const data = response.data;

      if (!data?.success || !Array.isArray(data.bookings)) {
        throw new Error(
          data?.message || "The server returned an unexpected response."
        );
      }

      setBookings(data.bookings);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load inspection bookings."
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
    const matchesSearch = [
      booking.fullName,
      booking.email,
      booking.phoneNumber,
      booking.location,
      booking._id,
      booking.paymentStatus,
      booking.bookingStatus,
    ].some((value) =>
      String(value || "").toLowerCase().includes(normalizedSearch)
    );

    const matchesPayment =
      paymentFilter === "all" ||
      (booking.paymentStatus || "").toLowerCase() === paymentFilter;

    const matchesBooking =
      bookingFilter === "all" ||
      (booking.bookingStatus || "").toLowerCase() === bookingFilter;

    return matchesSearch && matchesPayment && matchesBooking;
  });

  const paidCount = bookings.filter(
    (booking) => (booking.paymentStatus || "").toLowerCase() === "paid"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => (booking.bookingStatus || "").toLowerCase() === "confirmed"
  ).length;

  const pendingCount = bookings.filter((booking) =>
    ["pending", "pending_payment"].includes(
      (booking.bookingStatus || "").toLowerCase()
    )
  ).length;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-accent">
            Booking management
          </p>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Inspection Bookings
          </h1>
          <p className="mt-2 text-sm text-brand-mid">
            Review customer bookings, inspection schedules, fees, and payment
            status.
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
          <p className="mt-1 text-xs text-brand-mid">Total bookings</p>
        </div>

        <div className="rounded-xl border border-brand-border bg-brand-card p-4">
          <CreditCard size={19} className="mb-3 text-emerald-400" />
          <p className="font-display text-2xl font-bold text-white">
            {paidCount}
          </p>
          <p className="mt-1 text-xs text-brand-mid">Paid bookings</p>
        </div>

        <div className="rounded-xl border border-brand-border bg-brand-card p-4">
          <CheckCircle2 size={19} className="mb-3 text-violet-400" />
          <p className="font-display text-2xl font-bold text-white">
            {confirmedCount}
          </p>
          <p className="mt-1 text-xs text-brand-mid">Confirmed bookings</p>
        </div>

        <div className="rounded-xl border border-brand-border bg-brand-card p-4">
          <Clock size={19} className="mb-3 text-amber-400" />
          <p className="font-display text-2xl font-bold text-white">
            {pendingCount}
          </p>
          <p className="mt-1 text-xs text-brand-mid">Pending bookings</p>
        </div>
      </div>

      <div className="rounded-xl border border-brand-border bg-brand-card p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="relative md:col-span-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-mid"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, phone, email or ID..."
              className="w-full rounded-lg border border-brand-border bg-brand-black py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-brand-accent"
            />
          </div>

          <select
            value={paymentFilter}
            onChange={(event) => setPaymentFilter(event.target.value)}
            className="rounded-lg border border-brand-border bg-brand-black px-3 py-2.5 text-sm text-white outline-none focus:border-brand-accent"
          >
            <option value="all">All payment statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={bookingFilter}
            onChange={(event) => setBookingFilter(event.target.value)}
            className="rounded-lg border border-brand-border bg-brand-black px-3 py-2.5 text-sm text-white outline-none focus:border-brand-accent"
          >
            <option value="all">All booking statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending_payment">Pending payment</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle size={21} className="mt-0.5 text-red-400" />
            <div>
              <h2 className="font-semibold text-white">
                Unable to load inspection bookings
              </h2>
              <p className="mt-1 break-words text-sm text-brand-mid">{error}</p>
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
            <CalendarDays size={18} className="text-brand-accent" />
            <h2 className="font-semibold text-white">All bookings</h2>
          </div>
          <p className="text-xs text-brand-mid">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 px-5 py-16 text-sm text-brand-mid">
            <RefreshCw size={18} className="animate-spin" />
            Loading bookings...
          </div>
        ) : error ? (
          <div className="px-5 py-10 text-center text-sm text-brand-mid">
            Resolve the loading error above to view bookings.
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <CalendarDays
              size={32}
              className="mx-auto mb-3 text-brand-mid"
            />
            <h3 className="font-semibold text-white">
              {bookings.length === 0
                ? "No inspection bookings yet"
                : "No matching bookings"}
            </h3>
            <p className="mt-2 text-sm text-brand-mid">
              {bookings.length === 0
                ? "Bookings will appear here when customers make them."
                : "Try changing your search or filters."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead>
                <tr className="border-b border-brand-border/60">
                  {[
                    "Customer",
                    "Property",
                    "Inspection date",
                    "Fee",
                    "Payment",
                    "Booking status",
                    "Action",
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
                {filteredBookings.map((booking) => (
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
                      <p className="text-white">
                        {booking.buildingType || "Not specified"}
                      </p>
                      <p className="mt-1 text-xs text-brand-mid">
                        {booking.bedrooms !== undefined
                          ? `${booking.bedrooms} bedrooms`
                          : "Bedrooms not specified"}
                      </p>
                      <p className="mt-1 text-xs text-brand-mid">
                        {booking.location || "No location"}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-brand-lt-gray">
                      {formatDate(booking.inspectionDate)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-white">
                      {formatMoney(
                        booking.inspectionFee,
                        booking.currency || "NGN"
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge value={booking.paymentStatus} />
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge value={booking.bookingStatus} />
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/dashboard/inspection-bookings/${encodeURIComponent(
                          booking._id
                        )}`}
                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-brand-accent/30 bg-brand-accent-muted/20 px-3 py-2 text-xs font-semibold text-brand-accent transition-colors hover:border-brand-accent/60"
                      >
                        <Eye size={14} />
                        View details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
