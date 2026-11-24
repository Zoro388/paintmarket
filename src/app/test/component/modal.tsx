
"use client";

import React, { useState } from "react";
import CartCheckout from "./Payment";
import OrderSuccess from "./OrdeScuccess";
import { formatCurrency } from "@/lib/utils";
import { X, Wrench } from "lucide-react";

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

export interface Tool {
  _id: string;
  name: string;
  description: string;
  price: number;
  images?: string[];
}

export interface CartItem {
  itemType?: "product" | "tool";
  product?: Product | null;
  tool?: Tool | null;
  quantity: number;
  selectedColour?: string;
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

const DELIVERY_FEE_PER_BUCKET = 5500;
const ABUJA_STATE = "FCT - Abuja";
const FREE_DELIVERY_MINIMUM = 50;

const inputCls =
  "w-full border border-brand-border bg-brand-black text-brand-white placeholder-brand-mid " +
  "px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 transition-all";

const Modal: React.FC<ModalProps> = ({
  customerInfo,
  cartItems,
  onClose,
}) => {
  const [fullName, setFullName] = useState(
    customerInfo?.fullName || ""
  );

  const [phoneNumber, setPhoneNumber] = useState(
    customerInfo?.phoneNumber || ""
  );

  const [email, setEmail] = useState(
    customerInfo?.emailAddress || ""
  );

  const [orderSuccess, setOrderSuccess] = useState(false);

  // Identify tool cart items
  const isToolItem = (item: CartItem) =>
    item.itemType === "tool" || !!item.tool;

  // Get item name
  const getItemName = (item: CartItem) =>
    isToolItem(item)
      ? item.tool?.name || "Tool"
      : item.product?.productName || "Paint Product";

  // Get item price
  const getItemPrice = (item: CartItem) =>
    Number(
      isToolItem(item)
        ? item.tool?.price || 0
        : item.product?.price || 0
    );

  // Get item ID
  const getItemId = (item: CartItem) =>
    isToolItem(item)
      ? item.tool?._id || ""
      : item.product?._id || "";

  // Calculate subtotal for ALL items
  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + getItemPrice(item) * item.quantity,
    0
  );

  // Count PAINT BUCKETS ONLY
  const totalBuckets = cartItems.reduce(
    (sum, item) =>
      sum + (isToolItem(item) ? 0 : item.quantity),
    0
  );

  // Abuja free delivery applies to paint buckets only
  const qualifiesForFreeDelivery =
    customerInfo?.state === ABUJA_STATE &&
    totalBuckets >= FREE_DELIVERY_MINIMUM;

  // Delivery fee excludes tools
  const deliveryFee = qualifiesForFreeDelivery
    ? 0
    : totalBuckets * DELIVERY_FEE_PER_BUCKET;

  // Grand total includes products, tools and delivery
  const total = subtotal + deliveryFee;

  // Format mixed cart items for Payment component
  const formattedCartItems = cartItems.map((item) => {
    const toolItem = isToolItem(item);

    return {
      id: getItemId(item),
      itemType: toolItem ? "tool" as const : "product" as const,
      productName: getItemName(item),
      name: getItemName(item),
      price: getItemPrice(item),
      quantity: item.quantity,
      selectedColour: toolItem
        ? undefined
        : item.selectedColour || "",
    };
  });

  // Show success screen after successful order
  if (orderSuccess) {
    return (
      <div className="bg-brand-card border border-brand-border rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
        <OrderSuccess customerName={fullName} />
      </div>
    );
  }

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border/40">
        <h2 className="font-display text-lg font-bold text-brand-white">
          Complete Payment
        </h2>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-brand-mid hover:text-brand-white p-1 rounded transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="p-6 flex flex-col gap-5">

        {/* Customer Details */}
        <div className="flex flex-col gap-3">
          <p className="text-brand-accent text-[10px] font-bold uppercase tracking-widest">
            Your Details
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">
              Full Name *
            </label>

            <input
              type="text"
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">
              Phone Number *
            </label>

            <input
              type="tel"
              placeholder="08012345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">
              Email Address *
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="flex flex-col gap-2">
          <p className="text-brand-accent text-[10px] font-bold uppercase tracking-widest">
            Order Summary
          </p>

          <div className="bg-brand-raised border border-brand-border/30 rounded-xl p-4 flex flex-col gap-3">

            {cartItems.map((item, index) => {
              const toolItem = isToolItem(item);

              const itemName = getItemName(item);
              const itemPrice = getItemPrice(item);

              const variant = !toolItem
                ? item.product?.variants?.find(
                    (v) => v._id === item.selectedColour
                  )
                : undefined;

              const colourLabel = toolItem
                ? "Tool"
                : variant?.colourName ??
                  item.selectedColour ??
                  "Default";

              const image = toolItem
                ? item.tool?.images?.[0]
                : item.product?.productImages?.[0];

              return (
                <div
                  key={`${getItemId(item)}-${index}`}
                  className="flex items-center justify-between text-xs gap-3"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {image ? (
                      <img
                        src={image}
                        alt={itemName}
                        className="w-9 h-9 rounded-md object-cover flex-shrink-0 border border-brand-border/30"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-md flex items-center justify-center bg-brand-black border border-brand-border/30 flex-shrink-0">
                        {toolItem ? (
                          <Wrench
                            size={16}
                            className="text-brand-mid"
                          />
                        ) : (
                          <span className="text-brand-mid text-[10px]">
                            Paint
                          </span>
                        )}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-brand-white font-medium truncate">
                        {itemName}
                      </p>

                      <p className="text-brand-mid truncate">
                        {colourLabel} · ×{item.quantity}
                      </p>

                      {toolItem && (
                        <span className="text-brand-accent text-[9px] uppercase font-bold tracking-wider">
                          Tool
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-brand-accent font-semibold ml-2 flex-shrink-0">
                    {formatCurrency(
                      itemPrice * item.quantity
                    )}
                  </span>
                </div>
              );
            })}

            {/* Price Breakdown */}
            <div className="border-t border-brand-border/30 pt-3 mt-1 flex flex-col gap-2">

              <div className="flex justify-between text-xs text-brand-mid">
                <span>Products & Tools Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between text-xs text-brand-mid">
                <span>
                  Paint Buckets ({totalBuckets})
                </span>
                <span>{totalBuckets} buckets</span>
              </div>

              <div className="flex justify-between text-xs text-brand-mid">
                <span>Delivery Fee</span>

                <span>
                  {qualifiesForFreeDelivery ? (
                    <span className="text-green-500 font-bold">
                      FREE
                    </span>
                  ) : (
                    formatCurrency(deliveryFee)
                  )}
                </span>
              </div>

              {qualifiesForFreeDelivery && (
                <p className="text-green-500 text-[10px] font-medium">
                  Congratulations! Your order qualifies for free delivery in Abuja.
                </p>
              )}

              <div className="flex justify-between text-sm font-bold text-brand-white border-t border-brand-border/30 pt-2 mt-1">
                <span>Total</span>

                <span className="text-brand-accent">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Flutterwave Payment */}
        <CartCheckout
          cartItems={formattedCartItems}
          deliveryFee={deliveryFee}
          customerInfo={{
            email:
              email || customerInfo?.emailAddress || "",
            name:
              fullName || customerInfo?.fullName || "",
            phone_number:
              phoneNumber || customerInfo?.phoneNumber || "",
          }}
          deliveryAddress={
            customerInfo?.deliveryAddress || ""
          }
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
