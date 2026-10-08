const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001/api";

type CreatePaintingEstimatePayload = {
  fullName: string;
  phoneNumber: string;
  email: string;
  buildingType: string;
  bedrooms: number;
  paintType: string;
  finishLevel: string;
  location: string;
  extras: string[];
};

async function request(
  path: string,
  options: RequestInit = {},
) {
  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,

      headers: {
        "Content-Type":
          "application/json",

        ...(options.headers || {}),
      },
    },
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Something went wrong.",
    );
  }

  return data;
}

export const createPaintingEstimate =
  (
    body: CreatePaintingEstimatePayload,
  ) =>
    request(
      "/painting-estimator",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );

export const initializePaintingEstimatePayment =
  (estimateId: string) =>
    request(
      `/painting-estimator/${estimateId}/payment`,
      {
        method: "POST",
      },
    );

export const verifyPaintingEstimatePayment =
  (
    estimateId: string,
    transactionId: string,
  ) =>
    request(
      `/painting-estimator/${estimateId}/verify-payment`,
      {
        method: "POST",

        body: JSON.stringify({
          transactionId,
        }),
      },
    );

export const getPaintingEstimate =
  (estimateId: string) =>
    request(
      `/painting-estimator/${estimateId}`,
    );

export const getPaintingEstimatePainters =
  (estimateId: string) =>
    request(
      `/painting-estimator/${estimateId}/painters`,
    );

export const createPaintingPainterBooking =
  (body: {
    fullName: string;
    phoneNumber: string;
    email: string;
    propertyLocation: string;
    projectType: string;
    propertyType: string;
    projectDescription: string;
    estimatedCost: number;
    selectedPainter: string;
    additionalNotes?: string;
  }) =>
    request(
      "/painter-requests",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );

export const getAdminPaintingEstimates =
  (
    page = 1,
    limit = 20,
  ) =>
    request(
      `/painting-estimator/admin/list?page=${page}&limit=${limit}`,
    );