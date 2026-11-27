
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import {
  apiClearCart,
  apiVerifyNombaPayment,
} from "@/lib/userApi";

type PaymentResult = {
  success?: boolean;
  paid?: boolean;
  message?: string;
  orderId?: string;
  reference?: string;
  totalAmount?: number;
};

export default function PaymentCallbackPage() {
  const queryClient = useQueryClient();
  const verificationStarted = useRef(false);

  const [status, setStatus] = useState<
    "verifying" | "success" | "failed"
  >("verifying");

  const [message, setMessage] = useState(
    "Please wait while we confirm your payment with Nomba."
  );

  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (verificationStarted.current) return;

    const params = new URLSearchParams(window.location.search);

    const reference =
  params.get("reference") ||
  params.get("orderReference") ||
  params.get("order_reference");

if (reference === null || reference.trim() === "") {
  setStatus("failed");
  setMessage("Payment reference was not found. Please contact support if you have been charged.");
  return;
}

verificationStarted.current = true;

    async function verifyPayment() {
      try {
        const result: PaymentResult =
          await apiVerifyNombaPayment(reference as string);

        if (!result?.success || !result?.paid) {
          throw new Error(
            result?.message ||
              "Payment has not been confirmed. Please contact support if money was deducted."
          );
        }

        setOrderId(result.orderId || "");

        setStatus("success");
        setMessage(
          "Your payment has been verified successfully. Your order is confirmed."
        );

        // Clear the cart only after the backend confirms payment.
        try {
          await apiClearCart();
        } catch (cartError) {
          console.error(
            "Payment succeeded, but the cart could not be cleared:",
            cartError
          );
        }

        await queryClient.invalidateQueries({
          queryKey: ["cart-product"],
        });

        await queryClient.invalidateQueries({
          queryKey: ["cart"],
        });

        // Remove payment details from the browser URL.
        window.history.replaceState(
          {},
          "",
          window.location.pathname
        );
      } catch (error: unknown) {
        console.error("Nomba payment verification error:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "We could not verify your payment.";

        setStatus("failed");
        setMessage(
          `${errorMessage} Your order will not be treated as paid until Nomba verification succeeds.`
        );
      }
    }

    void verifyPayment();
  }, [queryClient]);

  return (
    <main className="min-h-screen bg-[#F8F5F0] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm border border-gray-100">
        {status === "verifying" && (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Verifying Payment
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {message}
            </p>

            <p className="mt-5 text-xs text-gray-400">
              Please do not close this page.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Payment Successful!
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {message}
            </p>

            {orderId && (
              <p className="mt-4 text-sm text-gray-500">
                Order ID:{" "}
                <span className="font-semibold text-gray-800">
                  {orderId}
                </span>
              </p>
            )}

            <Link
              href="/"
              className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-[#173F35] px-6 py-3 font-semibold text-white transition hover:bg-[#245B4C]"
            >
              Continue Shopping
            </Link>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Payment Not Confirmed
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {message}
            </p>

            <p className="mt-4 text-xs leading-5 text-gray-400">
              If you were debited, please contact Paintdomain support
              with your payment reference before attempting another payment.
            </p>

            <Link
              href="/cart"
              className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-[#173F35] px-6 py-3 font-semibold text-white transition hover:bg-[#245B4C]"
            >
              Return to Cart
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
