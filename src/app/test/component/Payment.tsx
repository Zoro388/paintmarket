"use client";
import React, { useState } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { apiCreateOrder, apiClearCart } from "@/lib/userApi";
import toast from "react-hot-toast";
import { Loader, ShoppingBag } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

// ── Types ─────────────────────────────────────────────────────────────────────
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
  phone_number: string;   // required by Flutterwave
}

interface CartCheckoutProps {
  cartItems: CheckoutCartItem[];
  customerInfo: CheckoutCustomerInfo;
  deliveryAddress: string;
  state: string;
  city: string;
  notes?: string;
  onSuccess: () => void;  // called after order is placed — parent shows success screen
}

// ── Component ─────────────────────────────────────────────────────────────────
const CartCheckout: React.FC<CartCheckoutProps> = ({
  cartItems, customerInfo, deliveryAddress, state, city, notes, onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient(); // <-- Query client instance

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY||'',
    tx_ref:     `PM-${Date.now()}-${Math.floor(Math.random() * 999999)}`,
    amount:     total,
    currency:   "NGN",
    payment_options: "card,ussd,bank_transfer",
    customer: {
      email:        customerInfo.email,
      phone_number: customerInfo.phone_number,
      name:         customerInfo.name,
    },
    customizations: {
      title:       "Smart Choice PaintMarket",
      description: `Payment for ${cartItems.length} item${cartItems.length !== 1 ? "s" : ""}`,
      logo:        "",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePay = () => {
    if (!customerInfo.email) { toast.error("Email is required"); return; }
    if (!customerInfo.name)  { toast.error("Full name is required"); return; }
    if (!customerInfo.phone_number) { toast.error("Phone number is required"); return; }
    if (cartItems.length === 0) { toast.error("Your cart is empty"); return; }

    handleFlutterPayment({
      callback: async (response) => {
        closePaymentModal();

        if (response.status === "successful" || response.status === "completed") {
          setLoading(true);
          try {
            // Place order with Flutterwave reference
            await apiCreateOrder({
  deliveryAddress,
  state,
  city,
  orderedProducts: cartItems.map((item) => ({
    productId: item.id,
    selectedColour: item.selectedColour,
    quantity: item.quantity,
  })),
  paymentMethod: "flutterwave",
  paymentReference: String(
    response.transaction_id ?? response.tx_ref ?? ""
  ),
  notes: notes || undefined,
});

            

            // Clear the backend cart
            try { 
              await apiClearCart(); 
            } catch { 
              /* non-fatal fallback */ 
            }

            // Immediately invalidate the query cache so cart badge updates instantly
            await queryClient.invalidateQueries({ queryKey: ["cart-product"] });

            toast.success("Order placed successfully!");
            onSuccess();

          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Order failed. Contact support.";
            toast.error(msg);
          } finally {
            setLoading(false);
          }
        } else {
          toast.error("Payment was not completed. Please try again.");
        }
      },
      onClose: () => {
        toast("Payment cancelled", { icon: "ℹ️" });
      },
    });
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading || cartItems.length === 0}
      className="w-full flex items-center justify-center gap-2 bg-brand-accent text-brand-black
        font-bold py-3.5 rounded-xl hover:bg-brand-accent-lt transition-all text-sm
        disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
    >
      {loading
        ? <><Loader size={16} className="animate-spin" /> Processing Order…</>
        : <><ShoppingBag size={16} /> Pay ₦{total.toLocaleString()} with Flutterwave</>
      }
    </button>
  );
};

export default CartCheckout;