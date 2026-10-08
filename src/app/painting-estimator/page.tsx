"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createPaintingEstimate,
  initializePaintingEstimatePayment,
  getPaintingEstimate,
  getPaintingEstimatePainters,
  createPaintingPainterBooking,
} from "@/lib/paintingEstimatorApi";

type Painter = {
  _id: string;
  fullName: string;
  profileImage?: string;
  bio?: string;
  yearsOfExperience?: number;
  state: string;
  city: string;
  averageRating?: number;
  totalReviews?: number;
  completedJobs?: number;
  availabilityStatus?: string;
  isVerified?: boolean;
};

type Estimate = {
  _id?: string;
  id?: string;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  buildingType: string;
  bedrooms: number;
  area: number;
  paintType: string;
  finishLevel: string;
  location: string;
  extras: string[];
  paintQuantity?: number;
  bucketQuantity?: number;
  litresPerBucket?: number;
  materialCost?: number;
  labourCost?: number;
  extrasCost?: number;
  estimatedBudget?: number;
  lowEstimate?: number;
  highEstimate?: number;
  specification?: string;
  paymentStatus?: string;
  estimateStatus?: string;
};

const STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const BUILDINGS = [
  {
    name: "Bungalow",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Duplex",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Block of Flats",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80",
  },
];

const PAINT_TYPES = [
  {
    name: "Matt",
    image:
      "https://images.unsplash.com/photo-1562259949-56d5d8a9d7f6?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Trowel",
    image:
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Satin",
    image:
      "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?auto=format&fit=crop&w=900&q=80",
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

const BEDROOMS = [
  { value: 2, area: 135 },
  { value: 3, area: 165 },
  { value: 4, area: 195 },
  { value: 5, area: 225 },
  { value: 6, area: 255 },
];

const STEPS = [
  "Personal",
  "Building",
  "Bedrooms",
  "Paint",
  "Finish",
  "Location",
  "Extras",
  "Email",
  "Payment",
];

const formatMoney = (amount?: number) => {
  if (amount === undefined || amount === null) {
    return "₦ — — — — — — — —";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function PaintingEstimatorPage() {
  const [step, setStep] = useState(0);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const [buildingType, setBuildingType] = useState("");
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [paintType, setPaintType] = useState("");
  const [finishLevel, setFinishLevel] = useState("");
  const [location, setLocation] = useState("");
  const [extras, setExtras] = useState<string[]>([]);

  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [paid, setPaid] = useState(false);

  const [painters, setPainters] = useState<Painter[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPainters, setLoadingPainters] = useState(false);

  const [error, setError] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [showBooking, setShowBooking] = useState(false);
  const [selectedPainter, setSelectedPainter] =
    useState<Painter | null>(null);

  const [additionalNotes, setAdditionalNotes] = useState("");

  const bedroomArea = bedrooms
    ? BEDROOMS.find(
        (item) => item.value === bedrooms,
      )?.area || 0
    : 0;

  const previewEstimate = useMemo(() => {
    if (!bedrooms) {
      return null;
    }

    return {
      area: bedroomArea,
      buildingType,
      bedrooms,
      paintType,
      finishLevel,
      location,
      extras,
    };
  }, [
    bedrooms,
    bedroomArea,
    buildingType,
    paintType,
    finishLevel,
    location,
    extras,
  ]);

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search,
    );

    const estimateId = params.get("estimateId");
    const paidParam = params.get("paid");

    if (
      estimateId &&
      paidParam === "true"
    ) {
      loadPaidEstimate(estimateId);
    }
  }, []);

  async function loadPaidEstimate(
    estimateId: string,
  ) {
    try {
      setLoading(true);
      setError("");

      const result =
        await getPaintingEstimate(
          estimateId,
        );

      if (!result.success) {
        throw new Error(
          result.message ||
            "Unable to load estimate.",
        );
      }

      setEstimate(result.estimate);
      setPaid(Boolean(result.paid));

      if (result.paid) {
        setStep(STEPS.length - 1);

        setFullName(
          result.estimate?.fullName || "",
        );

        setPhoneNumber(
          result.estimate?.phoneNumber || "",
        );

        setEmail(
          result.estimate?.email || "",
        );

        setBuildingType(
          result.estimate?.buildingType || "",
        );

        setBedrooms(
          result.estimate?.bedrooms || null,
        );

        setPaintType(
          result.estimate?.paintType || "",
        );

        setFinishLevel(
          result.estimate?.finishLevel || "",
        );

        setLocation(
          result.estimate?.location || "",
        );

        setExtras(
          result.estimate?.extras || [],
        );

        await loadPainters(estimateId);
      }
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to load estimate.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadPainters(
    estimateId: string,
  ) {
    try {
      setLoadingPainters(true);

      const result =
        await getPaintingEstimatePainters(
          estimateId,
        );

      setPainters(
        Array.isArray(result?.painters)
          ? result.painters
          : [],
      );
    } catch (err) {
      console.error(
        "Painter loading error:",
        err,
      );

      setPainters([]);
    } finally {
      setLoadingPainters(false);
    }
  }

  function validateStep() {
    setError("");

    if (step === 0) {
      if (
        !fullName.trim() ||
        !phoneNumber.trim()
      ) {
        setError(
          "Please enter your full name and phone number.",
        );
        return false;
      }
    }

    if (step === 1) {
      if (!buildingType) {
        setError(
          "Please select a building type.",
        );
        return false;
      }
    }

    if (step === 2) {
      if (!bedrooms) {
        setError(
          "Please select the number of bedrooms.",
        );
        return false;
      }
    }

    if (step === 3) {
      if (!paintType) {
        setError(
          "Please select a paint type.",
        );
        return false;
      }
    }

    if (step === 4) {
      if (!finishLevel) {
        setError(
          "Please select a finish level.",
        );
        return false;
      }
    }

    if (step === 5) {
      if (!location) {
        setError(
          "Please select your project state.",
        );
        return false;
      }
    }

    if (step === 6) {
      if (!extras.length) {
        setError(
          "Please select an additional work option, or select None.",
        );
        return false;
      }
    }

    if (step === 7) {
      if (!email.trim()) {
        setError(
          "Please enter your email address.",
        );
        return false;
      }

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          email.trim(),
        )
      ) {
        setError(
          "Please enter a valid email address.",
        );
        return false;
      }
    }

    return true;
  }

  function nextStep() {
    if (!validateStep()) {
      return;
    }

    setStep(
      (current) =>
        Math.min(
          current + 1,
          STEPS.length - 1,
        ),
    );
  }

  function previousStep() {
    setError("");

    setStep(
      (current) =>
        Math.max(current - 1, 0),
    );
  }

  function toggleExtra(extra: string) {
    setExtras((current) => {
      if (extra === "None") {
        return current.includes("None")
          ? []
          : ["None"];
      }

      const withoutNone =
        current.filter(
          (item) => item !== "None",
        );

      if (
        withoutNone.includes(extra)
      ) {
        return withoutNone.filter(
          (item) => item !== extra,
        );
      }

      return [
        ...withoutNone,
        extra,
      ];
    });
  }

  async function createEstimateAndPay() {
    if (!validateStep()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const created =
        await createPaintingEstimate({
          fullName,
          phoneNumber,
          email,
          buildingType,
          bedrooms: bedrooms as number,
          paintType,
          finishLevel,
          location,
          extras,
        });

      const estimateId =
        created?.estimate?.id ||
        created?.estimate?._id;

      if (!estimateId) {
        throw new Error(
          "Unable to create your painting estimate.",
        );
      }

      const payment =
        await initializePaintingEstimatePayment(
          estimateId,
        );

      if (
        !payment?.payment?.paymentLink
      ) {
        throw new Error(
          "Unable to create Flutterwave payment.",
        );
      }

      window.location.href =
        payment.payment.paymentLink;
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to start payment.",
      );

      setLoading(false);
    }
  }

  async function bookPainter() {
    if (
      !selectedPainter ||
      !estimate
    ) {
      return;
    }

    try {
      setLoading(true);
      setBookingMessage("");

      const result =
        await createPaintingPainterBooking({
          fullName:
            estimate.fullName ||
            fullName,

          phoneNumber:
            estimate.phoneNumber ||
            phoneNumber,

          email:
            estimate.email ||
            email,

          propertyLocation:
            estimate.location,

          projectType:
            "Painting Estimate",

          propertyType:
            estimate.buildingType,

          projectDescription: [
            `Painting estimate for ${estimate.buildingType}.`,
            `${estimate.bedrooms} bedrooms.`,
            `Approximate area: ${estimate.area} sqm.`,
            `Paint type: ${estimate.paintType}.`,
            `Finish: ${estimate.finishLevel}.`,
            `Estimated project range: ${formatMoney(
              estimate.lowEstimate,
            )} - ${formatMoney(
              estimate.highEstimate,
            )}.`,
            `Extras: ${
              estimate.extras?.length
                ? estimate.extras.join(", ")
                : "None"
            }.`,
          ].join(" "),

          estimatedCost:
            estimate.estimatedBudget ||
            0,

          selectedPainter:
            selectedPainter._id,

          additionalNotes,
        });

      if (!result.success) {
        throw new Error(
          result.message ||
            "Unable to submit painter request.",
        );
      }

      setBookingMessage(
        "Your painter request has been submitted successfully. The painter will be notified.",
      );

      setAdditionalNotes("");
      setShowBooking(false);
    } catch (err: any) {
      setBookingMessage(
        err?.message ||
          "Unable to submit painter request.",
      );
    } finally {
      setLoading(false);
    }
  }

  function printEstimate() {
    window.print();
  }

  const isPaidResult =
    paid && Boolean(estimate);

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#171717]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B8892E]">
            PaintMarket
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#171717] sm:text-4xl">
            Painting Project Estimate
          </h1>

          <p className="mt-2 max-w-2xl text-[#666666]">
            Build your painting project
            specification and unlock a
            detailed project estimate for
            ₦50.
          </p>
        </div>

        {/* Progress */}
        {!isPaidResult && (
          <div className="mb-8 grid gap-3 md:grid-cols-9">
            {STEPS.map(
              (label, index) => (
                <div
                  key={label}
                  className="flex items-center gap-2"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition ${
                      index <= step
                        ? "bg-[#171717] text-white"
                        : "bg-[#EAE8E2] text-[#888888]"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <span
                    className={`hidden text-xs font-medium lg:block ${
                      index <= step
                        ? "text-[#171717]"
                        : "text-[#999999]"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              ),
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* Main */}
          <section className="rounded-2xl border border-[#D8D8D4] bg-white p-5 shadow-sm sm:p-8">

            {/* IMPORTANT: direct paid && estimate check */}
            {paid && estimate ? (
              <PaidResult
                estimate={estimate}
                painters={painters}
                loadingPainters={
                  loadingPainters
                }
                printEstimate={
                  printEstimate
                }
                onBook={(painter) => {
                  setSelectedPainter(
                    painter,
                  );

                  setShowBooking(
                    true,
                  );

                  setBookingMessage(
                    "",
                  );
                }}
                bookingMessage={
                  bookingMessage
                }
              />
            ) : (
              <>
                {/* Step 1 */}
                {step === 0 && (
                  <div>
                    <StepHeading
                      title="Personal information"
                      description="Tell us who the project estimate is for."
                    />

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        label="Full Name"
                        value={fullName}
                        onChange={
                          setFullName
                        }
                        placeholder="John Doe"
                      />

                      <Field
                        label="Phone Number"
                        value={
                          phoneNumber
                        }
                        onChange={
                          setPhoneNumber
                        }
                        placeholder="08012345678"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {step === 1 && (
                  <div>
                    <StepHeading
                      title="What type of building are you painting?"
                      description="Select the property type that best matches your project."
                    />

                    <div className="grid gap-5 md:grid-cols-3">
                      {BUILDINGS.map(
                        (building) => (
                          <ImageCard
                            key={
                              building.name
                            }
                            title={
                              building.name
                            }
                            image={
                              building.image
                            }
                            selected={
                              buildingType ===
                              building.name
                            }
                            onClick={() =>
                              setBuildingType(
                                building.name,
                              )
                            }
                          />
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {step === 2 && (
                  <div>
                    <StepHeading
                      title="How many bedrooms?"
                      description="The bedroom count is used to estimate the approximate painting area."
                    />

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {BEDROOMS.map(
                        (item) => (
                          <button
                            key={
                              item.value
                            }
                            type="button"
                            onClick={() =>
                              setBedrooms(
                                item.value,
                              )
                            }
                            className={`rounded-2xl border p-5 text-left transition ${
                              bedrooms ===
                              item.value
                                ? "border-[#B8892E] bg-[#171717] text-white shadow-md"
                                : "border-[#D8D8D4] bg-white text-[#171717] hover:border-[#B8892E]"
                            }`}
                          >
                            <div className="text-2xl font-bold">
                              {item.value}
                            </div>

                            <div className="mt-1 text-sm opacity-80">
                              Bedroom
                              {item.value >
                              1
                                ? "s"
                                : ""}
                            </div>

                            <div className="mt-4 text-sm font-medium">
                              Approximately{" "}
                              {item.area}{" "}
                              sqm
                            </div>
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4 */}
                {step === 3 && (
                  <div>
                    <StepHeading
                      title="Choose your paint type"
                      description="Select the finish type you want us to use for the estimate."
                    />

                    <div className="grid gap-5 md:grid-cols-3">
                      {PAINT_TYPES.map(
                        (paint) => (
                          <ImageCard
                            key={
                              paint.name
                            }
                            title={
                              paint.name
                            }
                            image={
                              paint.image
                            }
                            selected={
                              paintType ===
                              paint.name
                            }
                            onClick={() =>
                              setPaintType(
                                paint.name,
                              )
                            }
                          />
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Step 5 */}
                {step === 4 && (
                  <div>
                    <StepHeading
                      title="Choose your finish level"
                      description="This changes the quality allowance used in the project estimate."
                    />

                    <div className="grid gap-4 md:grid-cols-3">
                      {[
                        {
                          name: "Budget",
                          text: "Practical finish and standard materials.",
                        },
                        {
                          name: "Mid-Range",
                          text: "Better materials and improved preparation.",
                        },
                        {
                          name: "High-End",
                          text: "Premium materials and higher-quality finishing.",
                        },
                      ].map(
                        (item) => (
                          <button
                            type="button"
                            key={
                              item.name
                            }
                            onClick={() =>
                              setFinishLevel(
                                item.name,
                              )
                            }
                            className={`rounded-2xl border p-6 text-left transition ${
                              finishLevel ===
                              item.name
                                ? "border-[#B8892E] bg-[#171717] text-white shadow-md"
                                : "border-[#D8D8D4] bg-white text-[#171717] hover:border-[#B8892E]"
                            }`}
                          >
                            <div className="text-lg font-bold">
                              {
                                item.name
                              }
                            </div>

                            <p className="mt-2 text-sm opacity-80">
                              {
                                item.text
                              }
                            </p>
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Step 6 */}
                {step === 5 && (
                  <div>
                    <StepHeading
                      title="Where is the project?"
                      description="Choose the Nigerian state where the painting work will take place."
                    />

                    <select
                      value={location}
                      onChange={(event) =>
                        setLocation(
                          event.target
                            .value,
                        )
                      }
                      className="w-full rounded-xl border border-[#D8D8D4] bg-white px-4 py-4 text-[#171717] outline-none transition focus:border-[#B8892E] focus:ring-1 focus:ring-[#B8892E]"
                    >
                      <option value="">
                        Select state
                      </option>

                      {STATES.map(
                        (state) => (
                          <option
                            key={state}
                            value={state}
                          >
                            {state}
                          </option>
                        ),
                      )}
                    </select>

                    <p className="mt-3 text-sm text-[#777777]">
                      Your state is also used
                      to match you with approved
                      painters serving that
                      location.
                    </p>
                  </div>
                )}

                {/* Step 7 */}
                {step === 6 && (
                  <div>
                    <StepHeading
                      title="Additional work"
                      description="Select any extra painting work you want included in the estimate."
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
                      {EXTRAS.map(
                        (extra) => {
                          const selected =
                            extras.includes(
                              extra,
                            );

                          return (
                            <button
                              type="button"
                              key={
                                extra
                              }
                              onClick={() =>
                                toggleExtra(
                                  extra,
                                )
                              }
                              className={`rounded-xl border px-4 py-4 text-left text-sm font-medium transition ${
                                selected
                                  ? "border-[#B8892E] bg-[#171717] text-white"
                                  : "border-[#D8D8D4] bg-white text-[#444444] hover:border-[#B8892E]"
                              }`}
                            >
                              {extra}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}

                {/* Step 8 */}
                {step === 7 && (
                  <div>
                    <StepHeading
                      title="Where should we send your estimate?"
                      description="We'll use this email for your painting estimate and payment confirmation."
                    />

                    <Field
                      label="Email Address"
                      value={email}
                      onChange={
                        setEmail
                      }
                      placeholder="you@example.com"
                      type="email"
                    />
                  </div>
                )}

                {/* Step 9 */}
                {step === 8 && (
                  <div>
                    <StepHeading
                      title="Unlock your detailed estimate"
                      description="Pay ₦50 through Flutterwave to reveal your complete painting project estimate and approved painters in your state."
                    />

                    <div className="rounded-2xl border border-[#D8D8D4] bg-[#FAF9F6] p-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#666666]">
                          Estimate unlock
                        </span>

                        <strong className="text-2xl text-[#171717]">
                          ₦50
                        </strong>
                      </div>

                      <div className="mt-6 space-y-3 text-sm text-[#666666]">
                        <div className="flex justify-between">
                          <span>
                            Building
                          </span>

                          <strong className="text-[#171717]">
                            {
                              buildingType ||
                              "—"
                            }
                          </strong>
                        </div>

                        <div className="flex justify-between">
                          <span>
                            Bedrooms
                          </span>

                          <strong className="text-[#171717]">
                            {
                              bedrooms ||
                              "—"
                            }
                          </strong>
                        </div>

                        <div className="flex justify-between">
                          <span>
                            State
                          </span>

                          <strong className="text-[#171717]">
                            {
                              location ||
                              "—"
                            }
                          </strong>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={
                        createEstimateAndPay
                      }
                      className="mt-6 w-full rounded-xl bg-[#171717] px-5 py-4 font-semibold text-white transition hover:bg-[#2A2A2A] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading
                        ? "Preparing payment..."
                        : "Pay ₦50 & Unlock Estimate"}
                    </button>

                    <p className="mt-3 text-center text-xs text-[#999999]">
                      Secure payment powered by
                      Flutterwave.
                    </p>
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-10 flex items-center justify-between border-t border-[#E5E3DE] pt-6">
                  <button
                    type="button"
                    onClick={
                      previousStep
                    }
                    disabled={
                      step === 0 ||
                      loading
                    }
                    className="rounded-xl border border-[#D8D8D4] bg-white px-5 py-3 text-sm font-semibold text-[#444444] transition hover:border-[#B8892E] disabled:opacity-40"
                  >
                    Back
                  </button>

                  {step < 8 && (
                    <button
                      type="button"
                      onClick={
                        nextStep
                      }
                      disabled={
                        loading
                      }
                      className="rounded-xl bg-[#171717] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2A2A2A] disabled:opacity-50"
                    >
                      Continue
                    </button>
                  )}
                </div>
              </>
            )}
          </section>

          {/* Summary */}
          {!isPaidResult && (
            <aside className="h-fit rounded-2xl border border-[#D8D8D4] bg-[#FAF9F6] p-6 lg:sticky lg:top-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[#171717]">
                    Project summary
                  </h2>

                  <p className="mt-1 text-sm text-[#777777]">
                    Your selections appear
                    here as you build the
                    project.
                  </p>
                </div>

                <div className="h-2 w-2 rounded-full bg-[#B8892E]" />
              </div>

              <div className="mt-6 space-y-4 text-sm">
                <SummaryRow
                  label="Building"
                  value={
                    previewEstimate?.buildingType ||
                    "Not selected"
                  }
                />

                <SummaryRow
                  label="Bedrooms"
                  value={
                    previewEstimate?.bedrooms
                      ? `${previewEstimate.bedrooms} bedrooms`
                      : "Not selected"
                  }
                />

                <SummaryRow
                  label="Area"
                  value={
                    previewEstimate?.area
                      ? `${previewEstimate.area} sqm`
                      : "Not calculated"
                  }
                />

                <SummaryRow
                  label="Paint"
                  value={
                    paintType ||
                    "Not selected"
                  }
                />

                <SummaryRow
                  label="Finish"
                  value={
                    finishLevel ||
                    "Not selected"
                  }
                />

                <SummaryRow
                  label="State"
                  value={
                    location ||
                    "Not selected"
                  }
                />

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#999999]">
                    Additional work
                  </div>

                  <div className="mt-2 text-[#444444]">
                    {extras.length
                      ? extras.join(", ")
                      : "None selected"}
                  </div>
                </div>
              </div>

              {/* Locked budget */}
              <div className="mt-7 rounded-xl border border-[#D8D8D4] bg-white p-5">
                <div className="text-xs font-semibold uppercase tracking-wide text-[#999999]">
                  Detailed project budget
                </div>

                <div className="mt-2 text-2xl font-bold tracking-wide text-[#171717]">
                  ₦ — — — — — — — —
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#B8892E]" />

                  <span className="text-xs text-[#777777]">
                    Unlock for ₦50
                  </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-[#777777]">
                  Detailed pricing, paint
                  quantity, labour, materials
                  and project budget are
                  locked until the ₦50 estimate
                  unlock payment is completed.
                </p>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking &&
        selectedPainter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl border border-[#D8D8D4] bg-white p-6 shadow-2xl">
              <div className="h-1 w-12 rounded-full bg-[#B8892E]" />

              <h2 className="mt-5 text-xl font-bold text-[#171717]">
                Book{" "}
                {
                  selectedPainter.fullName
                }
              </h2>

              <p className="mt-2 text-sm text-[#777777]">
                Submit this project to the
                selected painter.
              </p>

              <textarea
                value={
                  additionalNotes
                }
                onChange={(event) =>
                  setAdditionalNotes(
                    event.target.value,
                  )
                }
                rows={5}
                placeholder="Additional notes about your project..."
                className="mt-5 w-full rounded-xl border border-[#D8D8D4] bg-white p-4 text-[#171717] outline-none transition placeholder:text-[#AAAAAA] focus:border-[#B8892E] focus:ring-1 focus:ring-[#B8892E]"
              />

              {bookingMessage && (
                <div className="mt-4 rounded-xl border border-[#E5E3DE] bg-[#FAF9F6] p-4 text-sm text-[#555555]">
                  {bookingMessage}
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowBooking(false);
                    setBookingMessage("");
                  }}
                  className="rounded-xl border border-[#D8D8D4] bg-white px-5 py-3 text-sm font-semibold text-[#444444] transition hover:border-[#B8892E]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={
                    bookPainter
                  }
                  className="rounded-xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2A2A2A] disabled:opacity-50"
                >
                  {loading
                    ? "Submitting..."
                    : "Submit Request"}
                </button>
              </div>
            </div>
          </div>
        )}
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Step Heading
|--------------------------------------------------------------------------
*/

function StepHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <h2 className="text-2xl font-bold text-[#171717]">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#666666]">
        {description}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Input Field
|--------------------------------------------------------------------------
*/

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
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
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        placeholder={
          placeholder
        }
        className="w-full rounded-xl border border-[#D8D8D4] bg-white px-4 py-3.5 text-[#171717] outline-none transition placeholder:text-[#AAAAAA] focus:border-[#B8892E] focus:ring-1 focus:ring-[#B8892E]"
      />
    </label>
  );
}

/*
|--------------------------------------------------------------------------
| Image Card
|--------------------------------------------------------------------------
*/

function ImageCard({
  title,
  image,
  selected,
  onClick,
}: {
  title: string;
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
        <div className="font-semibold text-[#171717]">
          {title}
        </div>

        {selected && (
          <div className="mt-1 text-xs font-medium text-[#B8892E]">
            Selected
          </div>
        )}
      </div>
    </button>
  );
}

/*
|--------------------------------------------------------------------------
| Summary Row
|--------------------------------------------------------------------------
*/

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#E5E3DE] pb-3">
      <span className="text-[#777777]">
        {label}
      </span>

      <span className="text-right font-semibold text-[#171717]">
        {value}
      </span>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Paid Result
|--------------------------------------------------------------------------
*/

function PaidResult({
  estimate,
  painters,
  loadingPainters,
  printEstimate,
  onBook,
  bookingMessage,
}: {
  estimate: Estimate;
  painters: Painter[];
  loadingPainters: boolean;
  printEstimate: () => void;
  onBook: (
    painter: Painter,
  ) => void;
  bookingMessage: string;
}) {
  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#E5E3DE] pb-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#B8892E]">
            Estimate unlocked
          </p>

          <h2 className="mt-1 text-3xl font-bold text-[#171717]">
            Your Painting Project Estimate
          </h2>

          <p className="mt-2 text-sm text-[#777777]">
            {estimate.location}
          </p>
        </div>

        <button
          type="button"
          onClick={
            printEstimate
          }
          className="rounded-xl border border-[#D8D8D4] bg-white px-5 py-3 text-sm font-semibold text-[#444444] transition hover:border-[#B8892E]"
        >
          Download / Save PDF
        </button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Approx. Area"
          value={`${estimate.area} sqm`}
        />

        <Stat
          label="Paint"
          value={`${estimate.paintQuantity || 0} litres`}
        />

        <Stat
          label="20L Buckets"
          value={`${estimate.bucketQuantity || 0}`}
        />
      </div>

      {/* Estimate range */}
      <div className="rounded-2xl bg-[#171717] p-6 text-white">
        <div className="text-sm text-[#D8D8D4]">
          Estimated Project Range
        </div>

        <div className="mt-2 text-3xl font-bold">
          <span className="text-[#D7B46A]">
            {formatMoney(
              estimate.lowEstimate,
            )}
          </span>

          <span className="text-white">
            {" "}–{" "}
          </span>

          <span className="text-[#D7B46A]">
            {formatMoney(
              estimate.highEstimate,
            )}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-[#BDBDBD]">
          This is an estimate based on
          the information supplied and
          should be confirmed by the
          painter after project
          inspection.
        </p>
      </div>

      {/* Specification */}
      <div>
        <h3 className="text-xl font-bold text-[#171717]">
          Project specification
        </h3>

        <div className="mt-4 rounded-2xl border border-[#D8D8D4] bg-white p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryRow
              label="Building"
              value={
                estimate.buildingType
              }
            />

            <SummaryRow
              label="Bedrooms"
              value={`${estimate.bedrooms}`}
            />

            <SummaryRow
              label="Paint Type"
              value={
                estimate.paintType
              }
            />

            <SummaryRow
              label="Finish"
              value={
                estimate.finishLevel
              }
            />

            <SummaryRow
              label="State"
              value={
                estimate.location
              }
            />

            <SummaryRow
              label="Material"
              value={formatMoney(
                estimate.materialCost,
              )}
            />

            <SummaryRow
              label="Labour"
              value={formatMoney(
                estimate.labourCost,
              )}
            />

            <SummaryRow
              label="Additional Work"
              value={formatMoney(
                estimate.extrasCost,
              )}
            />
          </div>

          <div className="mt-6 rounded-xl border border-[#E5E3DE] bg-[#FAF9F6] p-5 text-sm leading-6 text-[#555555]">
            {estimate.specification}
          </div>

          {estimate.extras?.length >
            0 && (
            <div className="mt-5">
              <h4 className="font-semibold text-[#171717]">
                Additional work
              </h4>

              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[#666666]">
                {estimate.extras.map(
                  (extra) => (
                    <li
                      key={extra}
                    >
                      {extra}
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Painters */}
      <div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#171717]">
              Approved painters in{" "}
              {estimate.location}
            </h3>

            <p className="mt-1 text-sm text-[#777777]">
              These are real approved and
              active painters registered in
              the selected state.
            </p>
          </div>
        </div>

        {bookingMessage && (
          <div className="mt-4 rounded-xl border border-[#E5E3DE] bg-[#FAF9F6] p-4 text-sm text-[#555555]">
            {bookingMessage}
          </div>
        )}

        {loadingPainters ? (
          <div className="mt-6 rounded-2xl border border-[#D8D8D4] bg-white p-8 text-center text-sm text-[#777777]">
            Loading approved painters...
          </div>
        ) : painters.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-[#D8D8D4] bg-white p-8 text-center">
            <div className="mx-auto h-2 w-12 rounded-full bg-[#B8892E]" />

            <h4 className="mt-4 font-semibold text-[#171717]">
              No approved painters found yet
            </h4>

            <p className="mt-2 text-sm leading-6 text-[#777777]">
              We currently don't have
              an approved active painter
              available in this state.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {painters.map(
              (painter) => (
                <div
                  key={
                    painter._id
                  }
                  className="overflow-hidden rounded-2xl border border-[#D8D8D4] bg-white transition hover:border-[#B8892E]"
                >
                  <div className="flex gap-4 p-5">
                    {painter.profileImage ? (
                      <img
                        src={
                          painter.profileImage
                        }
                        alt={
                          painter.fullName
                        }
                        className="h-20 w-20 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[#F0EEE8] text-xl font-bold text-[#777777]">
                        {painter.fullName
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[#171717]">
                          {
                            painter.fullName
                          }
                        </h4>

                        {painter.isVerified && (
                          <span className="rounded-full bg-[#F7F0E2] px-2 py-0.5 text-[10px] font-semibold text-[#9A7125]">
                            Verified
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-[#777777]">
                        {painter.city},{" "}
                        {painter.state}
                      </p>

                      <p className="mt-2 text-sm font-medium text-[#444444]">
                        <span className="text-[#B8892E]">
                          ★
                        </span>{" "}
                        {painter.averageRating ||
                          0}{" "}
                        / 5

                        <span className="text-[#999999]">
                          {" "}
                          ·{" "}
                          {
                            painter.totalReviews ||
                            0
                          }{" "}
                          reviews
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#EAE8E2] p-5">
                    <p className="line-clamp-3 text-sm leading-6 text-[#666666]">
                      {painter.bio ||
                        "Approved PaintMarket painter."}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-[#777777]">
                        {
                          painter.yearsOfExperience ||
                          0
                        }{" "}
                        years experience
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          onBook(
                            painter,
                          )
                        }
                        className="rounded-xl bg-[#171717] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2A2A2A]"
                      >
                        Book Painter
                      </button>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Statistic Card
|--------------------------------------------------------------------------
*/

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#D8D8D4] bg-white p-5">
      <div className="text-xs font-semibold uppercase tracking-wide text-[#999999]">
        {label}
      </div>

      <div className="mt-2 text-xl font-bold text-[#171717]">
        {value}
      </div>
    </div>
  );
}