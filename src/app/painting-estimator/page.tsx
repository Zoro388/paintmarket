
"use client";

import { useEffect, useRef, useState } from "react";
import endpointRoute from "@/lib/endpointRoute";

const STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi",
  "Bayelsa", "Benue", "Borno", "Cross River", "Delta",
  "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
  "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
  "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const BUILDINGS = [
  { name: "Bungalow", image: "/images/bungalow.jpg" },
  { name: "Duplex", image: "/images/duplex.jpg" },
  { name: "Block of Flats", image: "/images/block-of-flats.jpg" },
];


const PAINT_TYPES = [
  {
    name: "Marble Trowel Paint",
    description: "Decorative marble-effect wall finish.",
    image: "/images/paints/marble-trowel.jpg",
  },
  {
    name: "Gravitex Paint",
    description: "Textured exterior coating.",
    image: "/images/paints/gravitex.jpg",
  },
  {
    name: "Epoxy Floor Paint",
    description: "Smooth, durable resin floor finish.",
    image: "/images/paints/epoxy-floor.jpg",
  },
];


const EXTRAS = [
  "Exterior Painting",
  "Ceiling Painting",
  "Fence / Perimeter Wall",
  "Gate Painting",
  "Doors & Frames",
  "Feature / Accent Walls",
  "Textured / Decorative Finish",
  "Waterproof / Damp Protection",
  "Repainting Existing Walls",
  "None",
];

const BEDROOMS = [2, 3, 4, 5, 6];

const STEPS = [
  "Personal",
  "Building",
  "Bedrooms",
  "Paint",
  "Location",
  "Extras",
  "Estimate",
];

type PriceRange = {
  low: number;
  high: number;
};

type SavedEstimate = {
  _id?: string;
  id?: string;
  lowEstimate?: number;
  highEstimate?: number;
  estimatedBudget?: number;
};

type InspectionBookingResponse = {
  success?: boolean;
  message?: string;
  booking?: {
    id?: string;
    inspectionFee?: number;
    paymentStatus?: string;
    bookingStatus?: string;
  };
  paymentLink?: string;
  bookingId?: string;
};

const PRICES: Record<string, Record<number, PriceRange>> = {
  "Marble Trowel Paint": {
    2: { low: 2250000, high: 2450000 },
    3: { low: 2750000, high: 3000000 },
    4: { low: 3250000, high: 3500000 },
    5: { low: 3800000, high: 4100000 },
    6: { low: 4200000, high: 4550000 },
  },
  "Gravitex Paint": {
    2: { low: 2250000, high: 2550000 },
    3: { low: 2950000, high: 3350000 },
    4: { low: 3750000, high: 4250000 },
    5: { low: 4650000, high: 5300000 },
    6: { low: 5550000, high: 6350000 },
  },
  "Epoxy Floor Paint": {
    2: { low: 1650000, high: 1950000 },
    3: { low: 2250000, high: 2650000 },
    4: { low: 2950000, high: 3450000 },
    5: { low: 3650000, high: 4250000 },
    6: { low: 4350000, high: 5100000 },
  },
};

// Keep these amounts aligned with the backend controller.
const INSPECTION_FEES: Record<string, number> = {
  "FCT - Abuja": 45000,

  Lagos: 180000,
  Ogun: 180000,
  Ondo: 180000,
  Osun: 180000,
  Oyo: 180000,
  Ekiti: 180000,

  Kogi: 130000,
  Kwara: 130000,

  Abia: 150000,
  Anambra: 150000,
  Ebonyi: 150000,
  Enugu: 150000,
  Imo: 150000,

  Adamawa: 150000,
  Bauchi: 150000,
  Benue: 150000,
  Borno: 150000,
  Gombe: 150000,
  Jigawa: 150000,
  Kaduna: 150000,
  Kano: 150000,
  Katsina: 150000,
  Kebbi: 150000,
  Nasarawa: 150000,
  Niger: 150000,
  Plateau: 150000,
  Sokoto: 150000,
  Taraba: 150000,
  Yobe: 150000,
  Zamfara: 150000,

  "Akwa Ibom": 95000,
  Bayelsa: 95000,
  "Cross River": 95000,
  Delta: 95000,
  Edo: 95000,
  Rivers: 100,
};

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getLocalDateString() {
  const now = new Date();
  const localDate = new Date(
    now.getTime() - now.getTimezoneOffset() * 60_000,
  );
  return localDate.toISOString().slice(0, 10);
}

export default function PaintingEstimatorPage() {
  const [step, setStep] = useState(0);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const [buildingType, setBuildingType] = useState("");
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [paintType, setPaintType] = useState("");
  const [location, setLocation] = useState("");
  const [extras, setExtras] = useState<string[]>([]);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [estimateId, setEstimateId] = useState("");

  const [inspectionDate, setInspectionDate] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [bookingFee, setBookingFee] = useState<number | null>(null);

  const verificationStarted = useRef(false);

  const priceRange =
    bedrooms && paintType
      ? PRICES[paintType]?.[bedrooms] ?? null
      : null;

  const inspectionFee = INSPECTION_FEES[location] ?? null;

  // Flutterwave returns the customer to this page after payment.
  // Verify the transaction with our backend before showing confirmation.
  useEffect(() => {
    if (verificationStarted.current) return;

    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get("transaction_id");
    const returnedBookingId = params.get("bookingId");
    const paymentStatus = params.get("status");

    if (!transactionId || !returnedBookingId) return;

    verificationStarted.current = true;
    setIsVerifyingPayment(true);
    setError("");
    setNotice("Verifying your inspection payment. Please wait.");

    async function verifyPayment() {
      try {
        const response = await endpointRoute.post<{
          success?: boolean;
          message?: string;
          booking?: {
            id?: string;
            inspectionFee?: number;
            paymentStatus?: string;
            bookingStatus?: string;
          };
        }>(
          `/inspection-bookings/${encodeURIComponent(
            returnedBookingId!,
          )}/verify-payment`,
          { transactionId },
        );

        if (
          response.data?.success &&
          response.data.booking?.paymentStatus === "paid" &&
          response.data.booking?.bookingStatus === "confirmed"
        ) {
          setBookingConfirmed(true);
          setBookingId(returnedBookingId!);
          setBookingFee(response.data.booking.inspectionFee ?? null);
          setNotice(
            "Your payment has been verified and your inspection booking is confirmed.",
          );
          setError("");
        } else {
          throw new Error(
            response.data?.message ||
              "We could not confirm this payment yet.",
          );
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Payment verification failed.";

        setError(
          paymentStatus === "cancelled"
            ? "The payment was cancelled or could not be completed. Your booking has not been confirmed."
            : `${message} Your booking is not confirmed until payment is verified.`,
        );
        setNotice("");
      } finally {
        setIsVerifyingPayment(false);

        // Remove the payment parameters from the address bar after processing.
        window.history.replaceState(
          {},
          "",
          window.location.pathname,
        );
      }
    }

    void verifyPayment();
  }, []);

  function invalidateSavedEstimate() {
    setEstimateId("");
    setBookingConfirmed(false);
    setBookingId("");
    setBookingFee(null);
  }

  function validateStep() {
    setError("");
    setNotice("");

    if (step === 0) {
      if (!fullName.trim() || !phoneNumber.trim() || !email.trim()) {
        setError(
          "Please enter your full name, WhatsApp number, and email address.",
        );
        return false;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError("Please enter a valid email address.");
        return false;
      }
    }

    if (step === 1 && !buildingType) {
      setError("Please select a building type.");
      return false;
    }

    if (step === 2 && !bedrooms) {
      setError("Please select the number of bedrooms.");
      return false;
    }

    if (step === 3 && !paintType) {
      setError("Please select a paint type.");
      return false;
    }

    if (step === 4 && !location) {
      setError("Please select your project state.");
      return false;
    }

    if (step === 5 && extras.length === 0) {
      setError("Please select an additional work option, or select None.");
      return false;
    }

    return true;
  }

  async function saveEstimate() {
    if (!priceRange || bedrooms === null) {
      setError("Please select a valid bedroom count and paint type.");
      return false;
    }

    if (isSaving) return false;

    setIsSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await endpointRoute.post("/painting-estimator", {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        buildingType,
        bedrooms,
        paintType,
        finishLevel: "Mid-Range",
        location,
        extras,
      });

      const data = response.data;
      const savedEstimate: SavedEstimate | undefined = data?.estimate;

      if (!data?.success || !savedEstimate) {
        throw new Error(
          data?.message || "The server did not return the saved estimate.",
        );
      }

      const id = savedEstimate._id || savedEstimate.id;

      if (!id) {
        throw new Error(
          "The estimate response did not include a reference ID.",
        );
      }

      setEstimateId(id);
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "We could not save your estimate. Please try again.";

      setError(
        `${message} Your estimate has not been confirmed as saved. Please try again.`,
      );

      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function nextStep() {
    if (!validateStep()) return;

    if (step === 5) {
      const saved = await saveEstimate();
      if (!saved) return;
    }

    setStep((current) => Math.min(current + 1, STEPS.length - 1));
    setError("");
    setNotice("");
  }

  function previousStep() {
    setError("");
    setNotice("");
    setStep((current) => Math.max(current - 1, 0));
  }

  function toggleExtra(extra: string) {
    invalidateSavedEstimate();

    setExtras((current) => {
      if (extra === "None") {
        return current.includes("None") ? [] : ["None"];
      }

      const withoutNone = current.filter((item) => item !== "None");

      if (withoutNone.includes(extra)) {
        return withoutNone.filter((item) => item !== extra);
      }

      return [...withoutNone, extra];
    });
  }

  async function bookInspection() {
    setError("");
    setNotice("");

    if (!estimateId) {
      setError(
        "Your estimate reference is missing. Please return to the previous step and save your estimate again.",
      );
      return;
    }

    if (!inspectionDate) {
      setError("Please select your preferred inspection date.");
      return;
    }

    if (inspectionDate < getLocalDateString()) {
      setError("Please select today or a future date.");
      return;
    }

    if (!inspectionFee) {
      setError(
        "The inspection fee for this state has not yet been configured. Please contact Paintdomain before booking.",
      );
      return;
    }

    if (isBooking) return;

    setIsBooking(true);

    try {
      // Only send the estimate ID and date.
      // The backend retrieves customer details and calculates the fee.
      const response =
        await endpointRoute.post<InspectionBookingResponse>(
          "/inspection-bookings",
          {
            paintingEstimateId: estimateId,
            inspectionDate: new Date(
              `${inspectionDate}T12:00:00`,
            ).toISOString(),
          },
        );

      const data = response.data;

      if (!data?.success || !data.paymentLink) {
        throw new Error(
          data?.message ||
            "The booking was created, but a payment link was not returned.",
        );
      }

      setBookingId(data.booking?.id || data.bookingId || "");
      setBookingFee(data.booking?.inspectionFee ?? inspectionFee);
      setNotice("Opening Flutterwave to complete your inspection payment.");

      // Send the customer to the payment page returned by the backend.
      window.location.assign(data.paymentLink);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "We could not start your inspection booking.";

      setError(message);
      setNotice("");
    } finally {
      setIsBooking(false);
    }
  }

  function printEstimate() {
    window.print();
  }

  function startAgain() {
    setStep(0);
    setError("");
    setNotice("");
    setEstimateId("");
    setFullName("");
    setPhoneNumber("");
    setEmail("");
    setBuildingType("");
    setBedrooms(null);
    setPaintType("");
    setLocation("");
    setExtras([]);
    setInspectionDate("");
    setBookingConfirmed(false);
    setBookingId("");
    setBookingFee(null);
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#171717]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 print:hidden">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B8892E]">
            PaintMarket
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Painting Project Estimate
          </h1>

          <p className="mt-2 max-w-2xl text-[#666666]">
            Tell us about your project to receive an estimated budget.
            Viewing your estimate is free.
          </p>
        </header>

        {/* Progress */}
        <div className="mb-8 grid grid-cols-4 gap-3 md:grid-cols-7 print:hidden">
          {STEPS.map((label, index) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  index <= step
                    ? "bg-[#171717] text-white"
                    : "bg-[#EAE8E2] text-[#888888]"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`hidden text-xs font-medium lg:block ${
                  index <= step ? "text-[#171717]" : "text-[#999999]"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 print:hidden"
          >
            {error}
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 print:hidden"
          >
            {notice}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-[#D8D8D4] bg-white p-5 shadow-sm sm:p-8 print:border-0 print:p-0 print:shadow-none">
            {/* Step 1 */}
            {step === 0 && (
              <div>
                <StepHeading
                  title="Personal information"
                  description="Tell us who the project estimate is for."
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Full name"
                    value={fullName}
                    onChange={(value) => {
                      setFullName(value);
                      invalidateSavedEstimate();
                    }}
                    placeholder="John Doe"
                  />

                  <Field
                    label="WhatsApp number"
                    value={phoneNumber}
                    onChange={(value) => {
                      setPhoneNumber(value);
                      invalidateSavedEstimate();
                    }}
                    placeholder="08012345678"
                    type="tel"
                  />

                  <div className="sm:col-span-2">
                    <Field
                      label="Email address"
                      value={email}
                      onChange={(value) => {
                        setEmail(value);
                        invalidateSavedEstimate();
                      }}
                      placeholder="you@example.com"
                      type="email"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Building */}
            {step === 1 && (
              <div>
                <StepHeading
                  title="What type of building are you painting?"
                  description="Select the property type that best matches your project."
                />

                <div className="grid gap-5 md:grid-cols-3">
                  {BUILDINGS.map((building) => (
                    <ImageCard
                      key={building.name}
                      title={building.name}
                      image={building.image}
                      selected={buildingType === building.name}
                      onClick={() => {
                        setBuildingType(building.name);
                        invalidateSavedEstimate();
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Bedrooms */}
            {step === 2 && (
              <div>
                <StepHeading
                  title="How many bedrooms?"
                  description="Choose the number of bedrooms in your building."
                />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {BEDROOMS.map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => {
                        setBedrooms(count);
                        invalidateSavedEstimate();
                      }}
                      className={`rounded-2xl border p-5 text-left transition ${
                        bedrooms === count
                          ? "border-[#B8892E] bg-[#171717] text-white shadow-md"
                          : "border-[#D8D8D4] bg-white hover:border-[#B8892E]"
                      }`}
                    >
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="mt-1 text-sm opacity-80">Bedrooms</div>
                      {bedrooms === count && (
                        <div className="mt-4 text-xs font-semibold text-[#D7B46A]">
                          Selected
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Paint type */}
            {step === 3 && (
              <div>
                <StepHeading
                  title="Select paint type"
                  description="Choose the type of paint you want a budget estimate for."
                />

                <div className="grid gap-5 md:grid-cols-3">
                  {PAINT_TYPES.map((paint) => (
                    <ImageCard
                      key={paint.name}
                      title={paint.name}
                      description={paint.description}
                      image={paint.image}
                      selected={paintType === paint.name}
                      onClick={() => {
                        setPaintType(paint.name);
                        invalidateSavedEstimate();
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Location */}
            {step === 4 && (
              <div>
                <StepHeading
                  title="Where is the project?"
                  description="Choose the Nigerian state where the painting work will take place."
                />

                <select
                  value={location}
                  onChange={(event) => {
                    setLocation(event.target.value);
                    invalidateSavedEstimate();
                  }}
                  className="w-full rounded-xl border border-[#D8D8D4] bg-white px-4 py-4 outline-none focus:border-[#B8892E] focus:ring-1 focus:ring-[#B8892E]"
                >
                  <option value="">Select state</option>
                  {STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Step 6: Additional work */}
            {step === 5 && (
              <div>
                <StepHeading
                  title="Additional work"
                  description="Select any additional work relevant to your project."
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  {EXTRAS.map((extra) => {
                    const selected = extras.includes(extra);

                    return (
                      <button
                        type="button"
                        key={extra}
                        onClick={() => toggleExtra(extra)}
                        className={`rounded-xl border px-4 py-4 text-left text-sm font-medium transition ${
                          selected
                            ? "border-[#B8892E] bg-[#171717] text-white"
                            : "border-[#D8D8D4] bg-white text-[#444444] hover:border-[#B8892E]"
                        }`}
                      >
                        {extra}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 7: Estimate and inspection booking */}
            {step === 6 && (
              <div id="painting-estimate" className="space-y-8">
                <div className="flex flex-col justify-between gap-4 border-b border-[#E5E3DE] pb-6 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#B8892E]">
                      Your estimate
                    </p>
                    <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                      Your Painting Project Budget
                    </h2>
                    <p className="mt-2 text-sm text-[#777777]">
                      {location}
                    </p>
                    {estimateId && (
                      <p className="mt-2 text-xs text-[#777777]">
                        Estimate reference: {estimateId}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={printEstimate}
                    className="rounded-xl border border-[#D8D8D4] bg-white px-5 py-3 text-sm font-semibold text-[#444444] hover:border-[#B8892E] print:hidden"
                  >
                    Download / Save PDF
                  </button>
                </div>

                {priceRange ? (
                  <>
                    <div className="rounded-2xl bg-[#171717] p-6 text-white sm:p-8">
                      <div className="text-sm text-[#D8D8D4]">
                        Estimated project budget
                      </div>

                      <div className="mt-3 break-words text-2xl font-bold leading-relaxed sm:text-3xl">
                        <span className="text-[#D7B46A]">
                          {formatMoney(priceRange.low)}
                        </span>
                        <span> – </span>
                        <span className="text-[#D7B46A]">
                          {formatMoney(priceRange.high)}
                        </span>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-[#D8D8D4]">
                        This estimated range is based on your selected
                        bedroom count and paint type. Your final quotation
                        may vary after the property and full scope of work
                        have been assessed.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold">
                        Project specification
                      </h3>

                      <div className="mt-4 rounded-2xl border border-[#D8D8D4] p-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <SummaryRow label="Full name" value={fullName} />
                          <SummaryRow label="WhatsApp" value={phoneNumber} />
                          <SummaryRow label="Email" value={email} />
                          <SummaryRow label="Building" value={buildingType} />
                          <SummaryRow
                            label="Bedrooms"
                            value={String(bedrooms)}
                          />
                          <SummaryRow label="Paint type" value={paintType} />
                          <SummaryRow label="State" value={location} />
                        </div>

                        <div className="mt-5 border-t border-[#E5E3DE] pt-5">
                          <div className="text-xs font-semibold uppercase tracking-wide text-[#999999]">
                            Additional work
                          </div>
                          <div className="mt-2 text-sm leading-6 text-[#444444]">
                            {extras.length ? extras.join(", ") : "None selected"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Book an Inspection */}
                    <div className="rounded-2xl border border-[#E7D7B3] bg-[#FAF6EC] p-5 sm:p-6 print:hidden">
                      {bookingConfirmed ? (
                        <div>
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
                            ✓
                          </div>
                          <h3 className="mt-4 text-xl font-bold">
                            Inspection booking confirmed
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-[#555555]">
                            Flutterwave has verified your payment. Your
                            inspection booking is confirmed.
                          </p>
                          {bookingId && (
                            <p className="mt-3 break-all text-xs text-[#777777]">
                              Booking reference: {bookingId}
                            </p>
                          )}
                          {bookingFee !== null && (
                            <p className="mt-3 font-semibold">
                              Inspection fee paid: {formatMoney(bookingFee)}
                            </p>
                          )}
                        </div>
                      ) : isVerifyingPayment ? (
                        <div>
                          <h3 className="text-xl font-bold">
                            Verifying your payment
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-[#555555]">
                            Please wait while we verify your transaction with
                            Flutterwave. Do not refresh this page.
                          </p>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-xl font-bold">
                            Book an Inspection
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-[#555555]">
                            Schedule a property inspection so the project
                            scope and final painting quotation can be
                            assessed more accurately. Your painting estimate
                            remains free.
                          </p>

                          <div className="mt-5">
                            <label
                              htmlFor="inspectionDate"
                              className="mb-2 block text-sm font-semibold text-[#444444]"
                            >
                              Preferred inspection date
                            </label>
                            <input
                              id="inspectionDate"
                              type="date"
                              min={getLocalDateString()}
                              value={inspectionDate}
                              onChange={(event) => {
                                setInspectionDate(event.target.value);
                                setError("");
                              }}
                              className="w-full rounded-xl border border-[#D8D8D4] bg-white px-4 py-3.5 outline-none focus:border-[#B8892E] focus:ring-1 focus:ring-[#B8892E]"
                            />
                          </div>

                          <div className="mt-5 rounded-xl border border-[#E7D7B3] bg-white p-4">
                            <div className="text-xs font-semibold uppercase tracking-wide text-[#999999]">
                              Inspection fee
                            </div>
                            {inspectionFee !== null ? (
                              <div className="mt-2 text-2xl font-bold text-[#171717]">
                                {formatMoney(inspectionFee)}
                              </div>
                            ) : (
                              <div className="mt-2 text-sm font-semibold text-[#8A4B08]">
                                Fee not yet configured for this state
                              </div>
                            )}
                            <p className="mt-2 text-xs leading-5 text-[#777777]">
                              State: {location}. The backend independently
                              calculates the payable fee before initializing
                              payment.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={bookInspection}
                            disabled={
                              isBooking ||
                              !inspectionDate ||
                              !estimateId ||
                              inspectionFee === null
                            }
                            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[#171717] px-5 py-4 text-center font-semibold text-white transition hover:bg-[#2A2A2A] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isBooking
                              ? "Preparing Secure Payment..."
                              : "Book an Inspection & Pay"}
                          </button>

                          <p className="mt-3 text-center text-xs leading-5 text-[#777777]">
                            You will be redirected to Flutterwave for secure
                            payment. Your booking is not confirmed until the
                            payment is verified.
                          </p>
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 print:hidden">
                      <button
                        type="button"
                        onClick={startAgain}
                        className="rounded-xl border border-[#D8D8D4] bg-white px-5 py-3 text-sm font-semibold text-[#444444] hover:border-[#B8892E]"
                      >
                        Start Again
                      </button>

                      <button
                        type="button"
                        onClick={printEstimate}
                        className="rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2A2A2A]"
                      >
                        Print Estimate
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                    We couldn't find a price for your selection. Please
                    return to the previous steps and select a bedroom count
                    and paint type.
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            {step < 6 && (
              <div className="mt-10 flex items-center justify-between border-t border-[#E5E3DE] pt-6 print:hidden">
                <button
                  type="button"
                  onClick={previousStep}
                  disabled={step === 0 || isSaving}
                  className="rounded-xl border border-[#D8D8D4] bg-white px-5 py-3 text-sm font-semibold text-[#444444] hover:border-[#B8892E] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isSaving}
                  className="rounded-xl bg-[#171717] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2A2A2A] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving
                    ? "Saving Estimate..."
                    : step === 5
                      ? "View My Estimate"
                      : "Continue"}
                </button>
              </div>
            )}

            {step === 6 && (
              <div className="mt-6 border-t border-[#E5E3DE] pt-6 print:hidden">
                <button
                  type="button"
                  onClick={previousStep}
                  className="rounded-xl border border-[#D8D8D4] bg-white px-5 py-3 text-sm font-semibold text-[#444444] hover:border-[#B8892E]"
                >
                  Back to Edit Selections
                </button>
              </div>
            )}
          </section>

          {/* Live summary */}
          {step < 6 && (
            <aside className="h-fit rounded-2xl border border-[#D8D8D4] bg-[#FAF9F6] p-6 lg:sticky lg:top-6 print:hidden">
              <h2 className="text-lg font-bold">Project summary</h2>
              <p className="mt-1 text-sm text-[#777777]">
                Your selections appear here as you build your project.
              </p>

              <div className="mt-6 space-y-4 text-sm">
                <SummaryRow
                  label="Building"
                  value={buildingType || "Not selected"}
                />
                <SummaryRow
                  label="Bedrooms"
                  value={bedrooms ? `${bedrooms} bedrooms` : "Not selected"}
                />
                <SummaryRow
                  label="Paint"
                  value={paintType || "Not selected"}
                />
                <SummaryRow
                  label="State"
                  value={location || "Not selected"}
                />

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#999999]">
                    Additional work
                  </div>
                  <div className="mt-2 leading-6 text-[#444444]">
                    {extras.length ? extras.join(", ") : "None selected"}
                  </div>
                </div>
              </div>

              <div className="mt-7 rounded-xl border border-[#D8D8D4] bg-white p-5">
                <div className="text-xs font-semibold uppercase tracking-wide text-[#999999]">
                  Estimated budget
                </div>

                {priceRange ? (
                  <div className="mt-3 text-lg font-bold leading-7">
                    {formatMoney(priceRange.low)} – {formatMoney(priceRange.high)}
                  </div>
                ) : (
                  <div className="mt-3 text-sm font-semibold">
                    Select bedroom count and paint type
                  </div>
                )}

                <p className="mt-3 text-xs leading-5 text-[#777777]">
                  Your estimate will appear at the final step.
                </p>
              </div>
            </aside>
          )}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          main {
            min-height: 0 !important;
            background: white !important;
          }

          @page {
            margin: 15mm;
          }
        }
      `}</style>
    </main>
  );
}

function StepHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <h2 className="text-2xl font-bold text-[#171717]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#666666]">
        {description}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#444444]">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#D8D8D4] bg-white px-4 py-3.5 text-[#171717] outline-none transition placeholder:text-[#AAAAAA] focus:border-[#B8892E] focus:ring-1 focus:ring-[#B8892E]"
      />
    </label>
  );
}

function ImageCard({
  title,
  description,
  image,
  selected,
  onClick,
}: {
  title: string;
  description?: string;
  image: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`overflow-hidden rounded-2xl border bg-white text-left transition ${
        selected
          ? "border-[#B8892E] ring-2 ring-[#B8892E]"
          : "border-[#D8D8D4] hover:border-[#B8892E]"
      }`}
    >
      <img
        src={image}
        alt={title}
        className="h-44 w-full object-cover"
      />

      <div className="p-4">
        <div className="font-semibold text-[#171717]">{title}</div>

        {description && (
          <p className="mt-2 text-sm leading-5 text-[#666666]">
            {description}
          </p>
        )}

        {selected && (
          <div className="mt-2 text-xs font-medium text-[#B8892E]">
            Selected
          </div>
        )}
      </div>
    </button>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#E5E3DE] pb-3">
      <span className="text-[#777777]">{label}</span>
      <span className="break-words text-right font-semibold text-[#171717]">
        {value}
      </span>
    </div>
  );
}
