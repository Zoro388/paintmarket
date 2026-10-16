"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  UserRound,
  Phone,
  Mail,
  Home,
  Palette,
  RefreshCw,
  AlertCircle,
  Receipt,
} from "lucide-react";
import endpointRoute from "@/lib/endpointRoute";

interface InspectionBooking {
  _id: string;
  paintingEstimateId?: string;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  buildingType?: string;
  bedrooms?: number | string;
  paintType?: string;
  location?: string;
  extras?: string[];
  inspectionDate?: string;
  inspectionFee?: number;
  currency?: string;
  paymentStatus?: string;
  paymentReference?: string;
  flutterwaveTransactionId?: string;
  bookingStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

function formatDate(value?: string) {
  if (!value) return "Not provided";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not provided";

  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatMoney(amount?: number, currency = "NGN") {
  if (amount === undefined || amount === null) return "Not available";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function StatusBadge({
  value,
  type,
}: {
  value?: string;
  type: "payment" | "booking";
}) {
  const normalized = (value || "unknown").toLowerCase();

  let styles = "bg-gray-500/10 text-gray-300 border-gray-500/30";

  if (
    normalized === "paid" ||
    normalized === "confirmed"
  ) {
    styles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  } else if (
    normalized === "pending" ||
    normalized === "pending_payment"
  ) {
    styles = "bg-amber-500/10 text-amber-400 border-amber-500/30";
  } else if (
    normalized === "failed" ||
    normalized === "cancelled"
  ) {
    styles = "bg-red-500/10 text-red-400 border-red-500/30";
  }

  const label =
    value?.replace(/_/g, " ").replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    ) || "Unknown";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${styles}`}
    >
      {label}
    </span>
  );
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-brand-border/60 bg-brand-raised/40 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs text-brand-mid">
        {icon}
        <span>{label}</span>
      </div>
      <p className="break-words text-sm font-medium text-white">
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default function InspectionBookingDetailsPage() {
  const params = useParams<{ id: string }>();
  const bookingId = params.id;

  const [booking, setBooking] = useState<InspectionBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchBooking() {
    if (!bookingId) {
      setError("The inspection booking ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await endpointRoute.get(
        `/inspection-bookings/${encodeURIComponent(bookingId)}`
      );

      if (!response.data?.success || !response.data?.booking) {
        throw new Error("The booking details could not be found.");
      }

      setBooking(response.data.booking);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load inspection booking details.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchBooking();
    // Fetch again if the ID in the URL changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 text-brand-mid">
          <RefreshCw size={20} className="animate-spin" />
          <span>Loading inspection booking...</span>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="mx-auto max-w-3xl py-10">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-brand-accent hover:underline"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
          <AlertCircle size={28} className="mb-3 text-red-400" />
          <h1 className="text-lg font-semibold text-white">
            Unable to load booking
          </h1>
          <p className="mt-2 text-sm text-brand-mid">
            {error || "This inspection booking could not be found."}
          </p>
          <button
            onClick={() => void fetchBooking()}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-black"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  const currency = booking.currency || "NGN";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm text-brand-mid transition-colors hover:text-brand-accent"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-accent">
              Inspection booking
            </p>
            <h1 className="break-all font-display text-2xl font-bold text-white sm:text-3xl">
              Booking details
            </h1>
            <p className="mt-2 break-all font-mono text-xs text-brand-mid">
              Reference: {booking._id}
            </p>
          </div>

          <button
            onClick={() => void fetchBooking()}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-brand-border bg-brand-card px-4 py-2.5 text-sm text-white transition-colors hover:border-brand-accent/50"
          >
            <RefreshCw size={15} />
            Refresh details
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-brand-border bg-brand-card p-5">
          <div className="mb-3 flex items-center gap-2 text-brand-mid">
            <CreditCard size={18} />
            <span className="text-sm">Inspection fee</span>
          </div>
          <p className="font-display text-2xl font-bold text-white">
            {formatMoney(booking.inspectionFee, currency)}
          </p>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-brand-border/60 pt-4">
            <span className="text-sm text-brand-mid">Payment status</span>
            <StatusBadge value={booking.paymentStatus} type="payment" />
          </div>
        </div>

        <div className="rounded-xl border border-brand-border bg-brand-card p-5">
          <div className="mb-3 flex items-center gap-2 text-brand-mid">
            <CheckCircle2 size={18} />
            <span className="text-sm">Booking status</span>
          </div>
          <p className="font-display text-xl font-bold capitalize text-white">
            {(booking.bookingStatus || "Unknown").replace(/_/g, " ")}
          </p>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-brand-border/60 pt-4">
            <span className="text-sm text-brand-mid">Current status</span>
            <StatusBadge value={booking.bookingStatus} type="booking" />
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-brand-border bg-brand-card">
        <div className="flex items-center gap-3 border-b border-brand-border/60 px-5 py-4">
          <UserRound size={19} className="text-brand-accent" />
          <h2 className="font-semibold text-white">Customer information</h2>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem
            label="Full name"
            value={booking.fullName || ""}
            icon={<UserRound size={14} />}
          />
          <DetailItem
            label="Phone number"
            value={booking.phoneNumber || ""}
            icon={<Phone size={14} />}
          />
          <DetailItem
            label="Email address"
            value={booking.email || ""}
            icon={<Mail size={14} />}
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-brand-border bg-brand-card">
        <div className="flex items-center gap-3 border-b border-brand-border/60 px-5 py-4">
          <Home size={19} className="text-brand-accent" />
          <h2 className="font-semibold text-white">Property and inspection</h2>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem
            label="Building type"
            value={booking.buildingType || ""}
            icon={<Home size={14} />}
          />
          <DetailItem
            label="Number of bedrooms"
            value={
              booking.bedrooms !== undefined
                ? String(booking.bedrooms)
                : ""
            }
          />
          <DetailItem
            label="Paint type"
            value={booking.paintType || ""}
            icon={<Palette size={14} />}
          />
          <DetailItem
            label="Property location"
            value={booking.location || ""}
            icon={<MapPin size={14} />}
          />
          <DetailItem
            label="Inspection date"
            value={formatDate(booking.inspectionDate)}
            icon={<CalendarDays size={14} />}
          />
          <DetailItem
            label="Booking created"
            value={formatDate(booking.createdAt)}
            icon={<Clock size={14} />}
          />
        </div>

        <div className="border-t border-brand-border/60 p-5">
          <h3 className="mb-3 text-sm font-semibold text-white">
            Additional options
          </h3>

          {booking.extras?.length ? (
            <div className="flex flex-wrap gap-2">
              {booking.extras.map((extra, index) => (
                <span
                  key={`${extra}-${index}`}
                  className="rounded-lg border border-brand-border bg-brand-raised px-3 py-2 text-sm text-brand-lt-gray"
                >
                  {extra}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-brand-mid">
              No additional options recorded.
            </p>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-brand-border bg-brand-card">
        <div className="flex items-center gap-3 border-b border-brand-border/60 px-5 py-4">
          <Receipt size={19} className="text-brand-accent" />
          <h2 className="font-semibold text-white">Payment information</h2>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2">
          <DetailItem
            label="Payment reference"
            value={booking.paymentReference || ""}
          />
          <DetailItem
            label="Flutterwave transaction ID"
            value={booking.flutterwaveTransactionId || ""}
          />
          <DetailItem
            label="Painting estimate ID"
            value={
              typeof booking.paintingEstimateId === "string"
                ? booking.paintingEstimateId
                : booking.paintingEstimateId
                  ? JSON.stringify(booking.paintingEstimateId)
                  : ""
            }
          />
          <DetailItem
            label="Last updated"
            value={formatDate(booking.updatedAt)}
          />
        </div>
      </section>

      <p className="pb-4 text-xs text-brand-mid">
        This page displays the booking information recorded by Paintdomain.
        Refresh the details to check for the latest payment and booking status.
      </p>
    </div>
  );
}
