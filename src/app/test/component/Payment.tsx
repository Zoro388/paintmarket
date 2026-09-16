"use client";

import React, { useState } from "react";
import {
  useFlutterwave,
  closePaymentModal,
} from "flutterwave-react-v3";
import {
  apiCreateOrder,
  apiClearCart,
} from "@/lib/userApi";
import toast from "react-hot-toast";
import {
  Loader,
  ShoppingBag,
} from "lucide-react";
import {
  useQueryClient,
} from "@tanstack/react-query";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface CheckoutCartItem {
  id: string;
  productName: string;
  name: string;
  price: number;
  quantity: number;
  selectedColour: string;
}

export interface CheckoutCustomerInfo {
  email: string;
  name: string;
  phone_number: string;
}

interface CartCheckoutProps {
  cartItems: CheckoutCartItem[];
  customerInfo: CheckoutCustomerInfo;
  deliveryAddress: string;
  state: string;
  city: string;
  notes?: string;
  onSuccess: () => void;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

const CartCheckout: React.FC<CartCheckoutProps> = ({
  cartItems,
  customerInfo,
  deliveryAddress,
  state,
  city,
  notes,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  // ───────────────────────────────────────────────────────────
  // Calculate total
  // ───────────────────────────────────────────────────────────

  const total = cartItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  // ───────────────────────────────────────────────────────────
  // Flutterwave configuration
  // ───────────────────────────────────────────────────────────

  const config = {
    public_key:
      process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "",

    tx_ref: `PM-${Date.now()}-${Math.floor(
      Math.random() * 999999
    )}`,

    amount: total,

    currency: "NGN",

    payment_options:
      "card,ussd,bank_transfer",

    customer: {
      email: customerInfo.email,
      phone_number:
        customerInfo.phone_number,
      name: customerInfo.name,
    },

    customizations: {
      title: "Smart Choice PaintMarket",

      description: `Payment for ${
        cartItems.length
      } item${
        cartItems.length !== 1
          ? "s"
          : ""
      }`,

      logo: "",
    },
  };

  const handleFlutterPayment =
    useFlutterwave(config);

  // ───────────────────────────────────────────────────────────
  // Handle payment
  // ───────────────────────────────────────────────────────────

  const handlePay = () => {
    console.log("=================================");
    console.log("PAY BUTTON CLICKED");
    console.log("=================================");

    console.log(
      "Cart items:",
      cartItems
    );

    console.log(
      "Customer info:",
      customerInfo
    );

    console.log(
      "Total:",
      total
    );

    console.log(
      "Flutterwave public key:",
      process.env
        .NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY
    );

    // ─────────────────────────────────────
    // Validate email
    // ─────────────────────────────────────

    if (!customerInfo.email) {
      toast.error(
        "Email is required"
      );
      return;
    }

    // ─────────────────────────────────────
    // Validate name
    // ─────────────────────────────────────

    if (!customerInfo.name) {
      toast.error(
        "Full name is required"
      );
      return;
    }

    // ─────────────────────────────────────
    // Validate phone number
    // ─────────────────────────────────────

    if (!customerInfo.phone_number) {
      toast.error(
        "Phone number is required"
      );
      return;
    }

    // ─────────────────────────────────────
    // Validate cart
    // ─────────────────────────────────────

    if (
      !cartItems ||
      cartItems.length === 0
    ) {
      toast.error(
        "Your cart is empty"
      );
      return;
    }

    // ─────────────────────────────────────
    // Validate total
    // ─────────────────────────────────────

    if (total <= 0) {
      toast.error(
        "Invalid payment amount"
      );
      return;
    }

    // ─────────────────────────────────────
    // Validate Flutterwave public key
    // ─────────────────────────────────────

    if (
      !process.env
        .NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY
    ) {
      toast.error(
        "Flutterwave public key is missing. Please contact support."
      );

      console.error(
        "NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY is missing."
      );

      return;
    }

    console.log(
      "Starting Flutterwave payment..."
    );

    console.log(
      "Payment amount:",
      total
    );

    // ─────────────────────────────────────
    // Open Flutterwave
    // ─────────────────────────────────────

    handleFlutterPayment({
      callback: async (response) => {
        console.log(
          "================================="
        );

        console.log(
          "FLUTTERWAVE RESPONSE"
        );

        console.log(
          response
        );

        console.log(
          "================================="
        );

        // Close Flutterwave modal
        closePaymentModal();

        // ─────────────────────────────────
        // Check payment status
        // ─────────────────────────────────

        if (
          response.status ===
            "successful" ||
          response.status ===
            "completed"
        ) {
          setLoading(true);

          try {
            // ─────────────────────────────
            // Get payment reference
            // ─────────────────────────────

            const paymentReference =
              String(
                response.transaction_id ??
                  response.tx_ref ??
                  ""
              );

            console.log(
              "Payment reference:",
              paymentReference
            );

            if (!paymentReference) {
              throw new Error(
                "Payment was successful, but no payment reference was received."
              );
            }

            // ─────────────────────────────
            // Create order
            // ─────────────────────────────

            console.log(
              "Creating order..."
            );

            await apiCreateOrder({
              deliveryAddress,

              state,

              city,

              orderedProducts:
                cartItems.map(
                  (item) => ({
                    productId:
                      item.id,

                    selectedColour:
                      item.selectedColour,

                    quantity:
                      item.quantity,
                  })
                ),

              paymentMethod:
                "flutterwave",

              paymentReference,

              notes:
                notes || undefined,
            });

            console.log(
              "Order created successfully."
            );

            // ─────────────────────────────
            // Clear backend cart
            // ─────────────────────────────

            try {
              console.log(
                "Clearing backend cart..."
              );

              await apiClearCart();

              console.log(
                "Backend cart cleared successfully."
              );
            } catch (cartError) {
              console.error(
                "Cart clearing failed:",
                cartError
              );

              // Cart clearing failure should
              // not cancel the successful order.
            }

            // ─────────────────────────────
            // Refresh cart query
            // ─────────────────────────────

            await queryClient.invalidateQueries(
              {
                queryKey: [
                  "cart-product",
                ],
              }
            );

            console.log(
              "Cart query refreshed."
            );

            // ─────────────────────────────
            // Success message
            // ─────────────────────────────

            toast.success(
              "Order placed successfully!"
            );

            // ─────────────────────────────
            // Tell parent component
            // ─────────────────────────────

            onSuccess();
          } catch (err: unknown) {
            console.error(
              "ORDER CREATION ERROR:",
              err
            );

            const message =
              err instanceof Error
                ? err.message
                : "Order failed. Contact support.";

            toast.error(message);
          } finally {
            setLoading(false);
          }
        } else {
          console.log(
            "Payment was not successful:",
            response
          );

          toast.error(
            "Payment was not completed. Please try again."
          );
        }
      },

      // ─────────────────────────────────────
      // Flutterwave modal closed
      // ─────────────────────────────────────

      onClose: () => {
        console.log(
          "Flutterwave payment window closed."
        );

        toast(
          "Payment cancelled",
          {
            icon: "ℹ️",
          }
        );
      },
    });
  };

  // ───────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────

  return (
    <button
      type="button"
      onClick={handlePay}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2
        bg-brand-accent text-brand-black
        font-bold py-3.5 rounded-xl
        hover:bg-brand-accent-lt
        transition-all text-sm
        disabled:opacity-50
        disabled:cursor-not-allowed
        shadow-md"
    >
      {loading ? (
        <>
          <Loader
            size={16}
            className="animate-spin"
          />

          Processing Order…
        </>
      ) : (
        <>
          <ShoppingBag size={16} />

          Pay ₦
          {total.toLocaleString()}
          {" "}
          with Flutterwave
        </>
      )}
    </button>
  );
};

export default CartCheckout;
