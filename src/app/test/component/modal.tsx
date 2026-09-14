"use client";
import React, { useState } from "react";
import CartCheckout from "./Payment";
import OrderSuccess from "./OrdeScuccess";
import { formatCurrency } from "@/lib/utils";
import { X } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Variant {
  _id: string;
  colourName: string;
  colourCode: string;
  image?: { url: string; publicId?: string };
}

export interface Product {
  _id: string;
  productName: string;
  productCategory: string;
  productDescription: string;
  price: number;
  stockQuantity: number;
  coverageInformation: string;
  productFeatures: string[];
  status: string;
  productImages?: string[];
  variants: Variant[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColour: string;
}

export interface CustomerInfo {
  deliveryAddress?: string;
  state?: string;
  city?: string;
  emailAddress?: string;
  fullName?: string;
  phoneNumber?: string;
  notes?: string;
}

interface ModalProps {
  customerInfo: CustomerInfo;
  cartItems: CartItem[];
  onClose?: () => void;
}

const inputCls =
  "w-full border border-brand-border bg-brand-black text-brand-white placeholder-brand-mid " +
  "px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 transition-all";

// ── Modal Component ───────────────────────────────────────────────────────────
const Modal: React.FC<ModalProps> = ({ customerInfo, cartItems, onClose }) => {
  const [fullName,     setFullName]     = useState(customerInfo?.fullName    || "");
  const [phoneNumber,  setPhoneNumber]  = useState(customerInfo?.phoneNumber || "");
  const [email,        setEmail]        = useState(customerInfo?.emailAddress || "");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const subtotal  = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= 50000 ? 0 : 3500;
  const total     = subtotal + deliveryFee;

  // Formatted items for Payment component
  const formattedCartItems = cartItems.map((item) => ({
    id:             item.product._id,
    productName:    item.product.productName,
    name:           item.product.productName,
    price:          item.product.price,
    quantity:       item.quantity,
    selectedColour: item.selectedColour,
  }));

  // If order placed successfully, show success screen
  if (orderSuccess) {
    return (
      <div className="bg-brand-card border border-brand-border rounded-2xl shadow-2xl
        w-full max-w-md mx-auto overflow-hidden">
        <OrderSuccess customerName={fullName} />
      </div>
    );
  }

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl shadow-2xl
      w-full max-w-md mx-auto overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border/40">
        <h2 className="font-display text-lg font-bold text-brand-white">Complete Payment</h2>
        {onClose && (
          <button onClick={onClose}
            className="text-brand-mid hover:text-brand-white p-1 rounded transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="p-6 flex flex-col gap-5">

        {/* ── Customer details form ── */}
        <div className="flex flex-col gap-3">
          <p className="text-brand-accent text-[10px] font-bold uppercase tracking-widest">
            Your Details
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">Phone Number *</label>
            <input
              type="tel"
              placeholder="08012345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">Email Address *</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        {/* ── Order summary ── */}
        <div className="flex flex-col gap-2">
          <p className="text-brand-accent text-[10px] font-bold uppercase tracking-widest">
            Order Summary
          </p>

          <div className="bg-brand-raised border border-brand-border/30 rounded-xl p-4 flex flex-col gap-2">
            {cartItems.map((item) => {
              const variant = item.product.variants?.find((v) => v._id === item.selectedColour);
              const colourLabel = variant?.colourName ?? item.selectedColour;
              return (
                <div key={`${item.product._id}-${item.selectedColour}`}
                  className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    {item.product.productImages?.[0] && (
                      <img src={item.product.productImages[0]} alt=""
                        className="w-8 h-8 rounded-md object-cover flex-shrink-0 border border-brand-border/30" />
                    )}
                    <div className="min-w-0">
                      <p className="text-brand-white font-medium truncate">{item.product.productName}</p>
                      <p className="text-brand-mid truncate">{colourLabel} · ×{item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-brand-accent font-semibold ml-3 flex-shrink-0">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              );
            })}

            <div className="border-t border-brand-border/30 pt-2 mt-1 flex flex-col gap-1">
              <div className="flex justify-between text-xs text-brand-mid">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-brand-mid">
                <span>Delivery</span>
                <span>
                  {deliveryFee === 0
                    ? <span className="text-emerald-400 font-semibold">Free</span>
                    : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-brand-white border-t border-brand-border/30 pt-1.5 mt-0.5">
                <span>Total</span>
                <span className="text-brand-accent">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Pay button — Flutterwave ── */}
        <CartCheckout
          cartItems={formattedCartItems}
          customerInfo={{
            email:        email || customerInfo?.emailAddress || "",
            name:         fullName || customerInfo?.fullName || "",
            phone_number: phoneNumber || customerInfo?.phoneNumber || "",
          }}
          deliveryAddress={customerInfo?.deliveryAddress || ""}
          state={customerInfo?.state || ""}
          city={customerInfo?.city || ""}
          notes={customerInfo?.notes}
          onSuccess={() => setOrderSuccess(true)}
        />

        <p className="text-brand-subtle text-[11px] text-center">
          Secured by Flutterwave. Your payment info is never stored.
        </p>
      </div>
    </div>
  );
};

export default Modal;