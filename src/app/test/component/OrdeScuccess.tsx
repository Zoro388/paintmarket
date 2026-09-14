"use client";
import React from "react";
import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";

interface OrderSuccessProps {
  customerName: string;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ customerName }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4 gap-6">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-950/50 border border-emerald-700/50
        flex items-center justify-center">
        <CheckCircle size={40} className="text-emerald-400" />
      </div>

      {/* Message */}
      <div>
        <h2 className="font-display text-2xl font-bold text-brand-white">
          Order Placed!
        </h2>
        <p className="text-brand-mid text-sm mt-2 leading-relaxed max-w-xs mx-auto">
          Thank you{customerName ? `, ${customerName.split(" ")[0]}` : ""}! Your payment was
          successful and your order is being processed. You'll receive a confirmation shortly.
        </p>
      </div>

      {/* Info strip */}
      <div className="w-full max-w-xs bg-brand-raised border border-brand-border rounded-xl p-4 text-xs text-brand-mid text-left flex flex-col gap-2">
        <p>✓ Payment confirmed</p>
        <p>✓ Order received by our team</p>
        <p>✓ Delivery will be arranged shortly</p>
      </div>

      {/* CTA */}
      <Link
        href="/shop"
        className="flex items-center gap-2 bg-brand-accent text-brand-black font-semibold
          px-6 py-3 rounded-xl hover:bg-brand-accent-lt transition-all text-sm shadow-md"
      >
        <ShoppingBag size={15} /> Continue Shopping <ArrowRight size={14} />
      </Link>
    </div>
  );
};

export default OrderSuccess;