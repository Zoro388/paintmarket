"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  CheckCircle,
  Loader2,
  XCircle,
} from "lucide-react";

import {
  apiVerifyPaintingEstimatePayment,
} from "@/lib/userApi";

type PaymentStatus =
  | "verifying"
  | "success"
  | "failed";

function PaintingEstimatePaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasVerified = useRef(false);

  const [status, setStatus] =
    useState<PaymentStatus>("verifying");

  const [message, setMessage] =
    useState("Verifying your payment...");

  useEffect(() => {
    if (hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    const verifyPayment = async () => {
      console.log(
        "======================================",
      );

      console.log(
        "1️⃣ PAINTING PAYMENT CALLBACK STARTED",
      );

      console.log(
        "======================================",
      );

      try {
        // ==================================================
        // STEP 1 — READ FLUTTERWAVE CALLBACK
        // ==================================================

        const flutterwaveStatus =
          searchParams.get("status") || "";

        const transactionId =
          searchParams.get("transaction_id") ||
          searchParams.get("transactionId") ||
          "";

        const txRef =
          searchParams.get("tx_ref") ||
          searchParams.get("txRef") ||
          "";

        console.log(
          "2️⃣ FLUTTERWAVE CALLBACK DATA",
        );

        console.log({
          fullUrl: window.location.href,
          status: flutterwaveStatus,
          transactionId,
          txRef,

          allParams:
            Object.fromEntries(
              searchParams.entries(),
            ),
        });

        // ==================================================
        // STEP 2 — CHECK TRANSACTION DATA
        // ==================================================

        if (!transactionId || !txRef) {
          console.error(
            "❌ STEP 2 FAILED",
          );

          console.error(
            "Missing transactionId or txRef",
          );

          setStatus("failed");

          setMessage(
            "Flutterwave did not return the required transaction information.",
          );

          return;
        }

        console.log(
          "✅ STEP 2 PASSED",
        );

        console.log(
          "Transaction ID:",
          transactionId,
        );

        console.log(
          "Transaction Reference:",
          txRef,
        );

        // ==================================================
        // STEP 3 — CHECK FLUTTERWAVE STATUS
        // ==================================================

        const unsuccessfulStatuses = [
          "cancelled",
          "failed",
          "canceled",
        ];

        if (
          unsuccessfulStatuses.includes(
            flutterwaveStatus.toLowerCase(),
          )
        ) {
          console.error(
            "❌ STEP 3 FAILED",
          );

          console.error(
            "Flutterwave status:",
            flutterwaveStatus,
          );

          setStatus("failed");

          setMessage(
            "Your Flutterwave payment was not completed.",
          );

          return;
        }

        console.log(
          "✅ STEP 3 PASSED",
        );

        console.log(
          "Flutterwave status:",
          flutterwaveStatus,
        );

        // ==================================================
        // STEP 4 — EXTRACT ESTIMATE ID
        // ==================================================

        console.log(
          "4️⃣ EXTRACTING ESTIMATE ID",
        );

        console.log(
          "tx_ref:",
          txRef,
        );

        const match = txRef.match(
          /^paint_estimate_([a-fA-F0-9]{24})_/,
        );

        const estimateId = match?.[1];

        console.log(
          "Extracted estimateId:",
          estimateId,
        );

        if (!estimateId) {
          console.error(
            "❌ STEP 4 FAILED",
          );

          console.error(
            "Could not extract estimateId from tx_ref.",
          );

          console.error({
            txRef,
          });

          throw new Error(
            "We could not identify the painting estimate associated with this payment.",
          );
        }

        console.log(
          "✅ STEP 4 PASSED",
        );

        console.log(
          "estimateId:",
          estimateId,
        );

        // ==================================================
        // STEP 5 — CALL BACKEND VERIFICATION
        // ==================================================

        setMessage(
          "Confirming your payment with Flutterwave...",
        );

        console.log(
          "5️⃣ CALLING BACKEND PAYMENT VERIFICATION",
        );

        console.log({
          endpoint:
            `/painting-estimator/${estimateId}/verify-payment`,

          transactionId,

          estimateId,
        });

        const response =
          await apiVerifyPaintingEstimatePayment(
            estimateId,
            transactionId,
          );

        // ==================================================
        // STEP 6 — SHOW BACKEND RESPONSE
        // ==================================================

        console.log(
          "6️⃣ BACKEND VERIFICATION RESPONSE",
        );

        console.log(
          response,
        );

        // ==================================================
        // STEP 7 — CHECK BACKEND RESPONSE
        // ==================================================

        if (
          !response?.success ||
          !response?.paid
        ) {
          console.error(
            "❌ STEP 7 FAILED",
          );

          console.error(
            "Backend did not return success:true AND paid:true",
          );

          console.error({
            success:
              response?.success,

            paid:
              response?.paid,

            response,
          });

          throw new Error(
            response?.message ||
              "Flutterwave payment verification failed.",
          );
        }

        console.log(
          "✅ STEP 7 PASSED",
        );

        console.log(
          "PAYMENT SUCCESSFULLY VERIFIED",
        );

        // ==================================================
        // STEP 8 — PREPARE RESULT PAGE URL
        // ==================================================

        setStatus("success");

        setMessage(
          "Payment verified successfully. Your detailed painting estimate is ready.",
        );

        const params =
          new URLSearchParams();

        params.set(
          "estimateId",
          estimateId,
        );

        params.set(
          "paid",
          "true",
        );

        const destination =
          `/painting-estimator?${params.toString()}`;

        console.log(
          "8️⃣ RESULT PAGE DESTINATION",
        );

        console.log(
          destination,
        );

        // ==================================================
        // STEP 9 — NAVIGATE TO RESULT PAGE
        // ==================================================

        window.setTimeout(() => {
          console.log(
            "9️⃣ EXECUTING router.replace()",
          );

          console.log(
            "Navigating to:",
            destination,
          );

          router.replace(
            destination,
          );
        }, 1200);

      } catch (error: unknown) {
        console.error(
          "======================================",
        );

        console.error(
          "❌ PAINTING PAYMENT FLOW FAILED",
        );

        console.error(
          error,
        );

        console.error(
          "======================================",
        );

        setStatus("failed");

        if (error instanceof Error) {
          setMessage(
            error.message,
          );
        } else {
          setMessage(
            "We could not verify your payment.",
          );
        }
      }
    };

    verifyPayment();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-[#D8D8D4] bg-white p-8 text-center shadow-sm">

        {/* VERIFYING */}

        {status === "verifying" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F0E2]">
              <Loader2
                size={30}
                className="animate-spin text-[#B8892E]"
              />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-[#171717]">
              Verifying Payment
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              {message}
            </p>

            <p className="mt-4 text-xs leading-5 text-[#999999]">
              Please do not close this page while
              your payment is being confirmed.
            </p>
          </>
        )}

        {/* SUCCESS */}

        {status === "success" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle
                size={34}
                className="text-green-600"
              />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-[#171717]">
              Payment Confirmed
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              {message}
            </p>

            <div className="mt-6 rounded-2xl bg-[#FAF9F6] px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#999999]">
                Next
              </p>

              <p className="mt-2 text-sm text-[#444444]">
                Opening your detailed painting
                estimate...
              </p>
            </div>
          </>
        )}

        {/* FAILED */}

        {status === "failed" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <XCircle
                size={34}
                className="text-red-600"
              />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-[#171717]">
              Payment Not Completed
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              {message}
            </p>

            <div className="mt-6 rounded-2xl border border-[#E8E8E4] bg-[#FAF9F6] px-5 py-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#777777]">
                What happens next?
              </p>

              <p className="mt-2 text-sm leading-6 text-[#555555]">
                Your detailed painting estimate
                remains locked until a successful
                payment is verified.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.replace(
                  "/painting-estimator",
                )
              }
              className="mt-6 w-full rounded-xl bg-[#171717] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Return to Estimate
            </button>
          </>
        )}

      </div>
    </main>
  );
}

export default function PaintingEstimatePaymentCallbackPageWrapper() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-6">
          <div className="w-full max-w-md rounded-3xl border border-[#D8D8D4] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F0E2]">
              <Loader2
                size={30}
                className="animate-spin text-[#B8892E]"
              />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-[#171717]">
              Verifying Payment
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              Verifying your payment...
            </p>
          </div>
        </main>
      }
    >
      <PaintingEstimatePaymentCallbackPage />
    </Suspense>
  );
}