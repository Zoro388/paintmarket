"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getAdminPaintingEstimates,
} from "@/lib/paintingEstimatorApi";

type Estimate = {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;

  buildingType: string;
  bedrooms: number;
  area: number;

  paintType: string;
  finishLevel: string;

  location: string;

  extras: string[];

  paintQuantity: number;
  bucketQuantity: number;

  materialCost: number;
  labourCost: number;
  extrasCost: number;

  estimatedBudget: number;
  lowEstimate: number;
  highEstimate: number;

  paymentStatus: string;
  estimateStatus: string;

  createdAt: string;
};

const money = (
  value: number,
) =>
  new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    },
  ).format(value || 0);

export default function PaintingEstimatesAdminPage() {
  const [estimates, setEstimates] =
    useState<Estimate[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selected, setSelected] =
    useState<Estimate | null>(null);

  useEffect(() => {
    loadEstimates();
  }, []);

  async function loadEstimates() {
    try {
      setLoading(true);
      setError("");

      const result =
        await getAdminPaintingEstimates(
          1,
          100,
        );

      setEstimates(
        result.estimates || [],
      );
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to load painting estimates.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Admin
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Painting Estimates
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Customer painting estimate orders, payment status and project information.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 p-10 text-center">
          Loading painting estimates...
        </div>
      ) : estimates.length ===
        0 ? (
        <div className="rounded-2xl border border-slate-200 p-10 text-center">
          <h2 className="font-semibold">
            No painting estimates yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            New painting estimate orders will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    Customer
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Project
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    State
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Estimate
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Payment
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Date
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {estimates.map(
                  (estimate) => (
                    <tr
                      key={
                        estimate._id
                      }
                      className="border-t border-slate-100"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold">
                          {
                            estimate.fullName
                          }
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {
                            estimate.email
                          }
                        </div>

                        <div className="text-xs text-slate-500">
                          {
                            estimate.phoneNumber
                          }
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          {
                            estimate.buildingType
                          }
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {
                            estimate.bedrooms
                          }{" "}
                          bedrooms ·{" "}
                          {
                            estimate.area
                          }{" "}
                          sqm
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {
                          estimate.location
                        }
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-semibold">
                          {money(
                            estimate.lowEstimate,
                          )}
                        </div>

                        <div className="text-xs text-slate-500">
                          to{" "}
                          {money(
                            estimate.highEstimate,
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            estimate.paymentStatus ===
                            "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {
                            estimate.paymentStatus
                          }
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-500">
                        {new Date(
                          estimate.createdAt,
                        ).toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            setSelected(
                              estimate,
                            )
                          }
                          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {
                    selected.fullName
                  }
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Painting Estimate
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelected(
                    null,
                  )
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                Close
              </button>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Info
                label="Customer"
                value={
                  selected.fullName
                }
              />

              <Info
                label="Phone"
                value={
                  selected.phoneNumber
                }
              />

              <Info
                label="Email"
                value={
                  selected.email
                }
              />

              <Info
                label="State"
                value={
                  selected.location
                }
              />

              <Info
                label="Building"
                value={
                  selected.buildingType
                }
              />

              <Info
                label="Bedrooms"
                value={String(
                  selected.bedrooms,
                )}
              />

              <Info
                label="Area"
                value={`${selected.area} sqm`}
              />

              <Info
                label="Paint"
                value={
                  selected.paintType
                }
              />

              <Info
                label="Finish"
                value={
                  selected.finishLevel
                }
              />

              <Info
                label="Paint Quantity"
                value={`${selected.paintQuantity} litres`}
              />

              <Info
                label="20L Buckets"
                value={String(
                  selected.bucketQuantity,
                )}
              />

              <Info
                label="Payment"
                value={
                  selected.paymentStatus
                }
              />
            </div>

            <div className="mt-7 rounded-2xl bg-slate-900 p-6 text-white">
              <div className="text-sm text-slate-300">
                Project Estimate
              </div>

              <div className="mt-2 text-3xl font-bold">
                {money(
                  selected.lowEstimate,
                )}{" "}
                –{" "}
                {money(
                  selected.highEstimate,
                )}
              </div>
            </div>

            <div className="mt-7">
              <h3 className="font-bold">
                Cost breakdown
              </h3>

              <div className="mt-3 space-y-3 rounded-xl border border-slate-200 p-5">
                <Info
                  label="Materials"
                  value={money(
                    selected.materialCost,
                  )}
                />

                <Info
                  label="Labour"
                  value={money(
                    selected.labourCost,
                  )}
                />

                <Info
                  label="Additional Work"
                  value={money(
                    selected.extrasCost,
                  )}
                />

                <Info
                  label="Estimated Budget"
                  value={money(
                    selected.estimatedBudget,
                  )}
                />
              </div>
            </div>

            <div className="mt-7">
              <h3 className="font-bold">
                Additional work
              </h3>

              <div className="mt-3 text-sm text-slate-600">
                {selected.extras?.length
                  ? selected.extras.join(
                      ", ",
                    )
                  : "None"}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </div>

      <div className="mt-1 font-medium text-slate-900">
        {value}
      </div>
    </div>
  );
}