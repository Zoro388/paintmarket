





"use client";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { apiCreateOrder, apiUpdateCartItem, apiGetCart, apiRemoveFromCart } from "@/lib/userApi";
import { formatCurrency } from "@/lib/utils";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  ShoppingCart, Trash2, Minus, Plus, Loader, ArrowRight, ArrowLeft,
  MapPin, CreditCard, CheckCircle, Package, Banknote, Mail,
} from "lucide-react";

// Paystack button — client-only
const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  { ssr: false }
);

const PAYSTACK_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
  "pk_test_b8b7d8af804f4f40170a151f7ba3173fc325c591";

// ── Types ────────────────────────────────────────────────────────────────────
interface Product {
  _id: string;
  productName: string;
  productCategory: string;
  productDescription: string;
  colourCode: string;
  colourName: string;
  price: number;
  stockQuantity: number;
  coverageInformation: string;
  productFeatures: string[];
  status: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  selectedColour: string;
}

interface PaystackSuccessResponse {
  reference?: string;
  trxref?: string;
  [key: string]: unknown;
}



const NIGERIA_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna",
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const STEPS = ["Cart", "Delivery", "Payment", "Confirm"];

const inputCls =
  "w-full bg-brand-raised border border-brand-border text-white placeholder-brand-subtle px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 transition-all";

export default function CartPage() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Delivery info
  const [delivery, setDelivery] = useState({ deliveryAddress: "", state: "", city: "", emailAddress: "" });
  // Payment info
  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "bank-transfer">("paystack");
  const [notes, setNotes] = useState("");

  const qc = useQueryClient();

  // 1. Fetch cart items from the API
  const { data: fetchedItems, isLoading } = useQuery<CartItem[]>({
    queryKey: ["cart-product"],
    queryFn: async () => {
      const res = await apiGetCart();
      const rawItems = res?.cart?.items ?? res?.data ?? [];
      return rawItems as CartItem[];
    },
  });

  // 2. Local cart state, kept in sync with server data
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartInitialized, setCartInitialized] = useState(false);

  useEffect(() => {
    if (!cartInitialized && fetchedItems && fetchedItems.length > 0) {
      setCart(fetchedItems);
      setCartInitialized(true);
    }
  }, [fetchedItems, cartInitialized]);

  // 3. Quantity update mutation — hits the real API, then reflects the new
  //    quantity immediately in local state (optimistic-on-success update)
  const updateCartItemQuantity = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      return apiUpdateCartItem(productId, { quantity });
    },
    onSuccess: (_data, variables) => {
      setCart((prev) =>
        prev.map((item) =>
          item.product._id === variables.productId
            ? { ...item, quantity: variables.quantity }
            : item
        )
      );
      qc.invalidateQueries({ queryKey: ["cart-product"] });
      toast.success("Cart quantity updated!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update product in cart");
    },
  });
// remove from cart mutation        
    const removeFromCart = useMutation({
        mutationFn: async (productId: string) => {
            return apiRemoveFromCart(productId);
        },
        onSuccess: (_data, variables) => {
            setCart((prev) => prev.filter((item) => item.product._id !== variables));
            qc.invalidateQueries({ queryKey: ["cart-product"] });
            toast.success("Item removed from cart!");
        },
        onError: (err: Error) => {
            toast.error(err.message || "Failed to remove item from cart");
        },
    });

    const handleQtyChange = (productId: string, currentQty: number, delta: number) => {
        const nextQty = Math.max(1, currentQty + delta);
        if (nextQty === currentQty) return;
        updateCartItemQuantity.mutate({ productId, quantity: nextQty });
    };

  const handleQtyInputChange = (productId: string, rawValue: string) => {
    const parsed = parseInt(rawValue, 10);
    if (Number.isNaN(parsed) || parsed < 1) return;
    updateCartItemQuantity.mutate({ productId, quantity: parsed });
  };

  const updateColour = (id: string, colour: string) => {
    setCart((prev) =>
      prev.map((item) => (item.product._id === id ? { ...item, selectedColour: colour } : item))
    );
  };

 

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  // const deliveryFee = subtotal > 50000 || subtotal === 0 ? 0 : 3500;
  const total = subtotal;

  const canGoToDelivery = cart.length > 0;
  const canGoToPayment = Boolean(
    delivery.deliveryAddress.trim() &&
      delivery.state &&
      delivery.city.trim() &&
      delivery.emailAddress.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(delivery.emailAddress)
  );
  const canSubmit = canGoToDelivery && canGoToPayment;

  // ── Bank transfer: create order directly with paymentMethod "bank-transfer" ──
  const handleBankTransferSubmit = async () => {
    if (!canSubmit) {
      toast.error("Please complete all required fields");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    try {
      await apiCreateOrder({
        deliveryAddress: delivery.deliveryAddress,
        state: delivery.state,
        city: delivery.city,
        orderedProducts: cart.map((item) => ({
          productId: item.product._id,
          selectedColour: item.selectedColour,
          quantity: item.quantity,
        })),
        paymentMethod: "bank-transfer",
        notes: notes || undefined,
      });
      setOrderSuccess(true);
      toast.success("Order placed successfully!");
      setCart([]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to place order. Please try again.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Paystack: Create order after payment succeeds ───────────────────────────
  const handlePaystackSuccess = async (referenceObj: PaystackSuccessResponse) => {
    setSubmitting(true);
    setErrorMsg("");

    const currentReference =
      referenceObj?.reference ?? referenceObj?.trxref ?? String(referenceObj ?? "");

    try {
      await apiCreateOrder({
        deliveryAddress: delivery.deliveryAddress,
        state: delivery.state,
        city: delivery.city,
        orderedProducts: cart.map((item) => ({
          productId: item.product._id,
          selectedColour: item.selectedColour,
          quantity: item.quantity,
        })),
        paymentMethod: "paystack",
        paymentReference: currentReference,
        notes: notes || undefined,
      });

      setOrderSuccess(true);
      toast.success("Payment successful — order verified and placed!");
      setCart([]);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Payment processed but failed to update order database. Please contact support.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaystackClose = () => {
    toast.error("Payment window closed. You can try again.");
  };

  const goNext = () => {
    if (step === 0 && !canGoToDelivery) {
      toast.error("Your cart is empty");
      return;
    }
    if (step === 1 && !canGoToPayment) {
      toast.error("Please fill in all delivery fields");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  // Success view
  if (orderSuccess) {
    return (
      <main className="bg-brand-black min-h-screen">
        <Navbar />
        <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto bg-brand-card border border-brand-border rounded-2xl p-10 text-center flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-800/50 flex items-center justify-center">
              <CheckCircle size={32} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white">Order Placed!</h2>
              <p className="text-brand-mid text-sm mt-2 leading-relaxed">
                Thank you for your order. We&apos;ll send you a confirmation email shortly with
                tracking details.
              </p>
            </div>
            <a
              href="/shop"
              className="flex items-center gap-2 bg-brand-accent text-brand-black font-semibold
                px-6 py-3 rounded-lg hover:bg-brand-accent-lt transition-all text-sm"
            >
              Continue Shopping <ArrowRight size={15} />
            </a>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-brand-black min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8 border-b border-brand-border/40">
        <div className="max-w-5xl mx-auto">
          <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-2">Checkout</p>
          <h1 className="font-display text-4xl font-bold text-white">Your Cart</h1>
        </div>
      </section>

      {/* Stepper */}
      <section className="px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                    ${
                      i < step
                        ? "bg-brand-accent text-brand-black"
                        : i === step
                        ? "bg-brand-accent text-brand-black ring-4 ring-brand-accent-muted"
                        : "bg-brand-raised border border-brand-border text-brand-mid"
                    }`}
                  >
                    {i < step ? <CheckCircle size={15} /> : i + 1}
                  </div>
                  <span
                    className={`text-sm font-medium hidden sm:inline ${
                      i <= step ? "text-white" : "text-brand-mid"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-3 transition-colors ${
                      i < step ? "bg-brand-accent" : "bg-brand-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Layout Grid */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Main step content form panel */}
          <div className="lg:col-span-2 bg-brand-card border border-brand-border rounded-2xl p-6 lg:p-8">
            {/* STEP 0 — Cart Review */}
            {step === 0 && (
              <div className="flex flex-col gap-5">
                <h2 className="font-display text-xl font-bold text-white">Review Your Items</h2>

                {isLoading ? (
                  <div className="py-16 flex justify-center">
                    <Loader size={26} className="animate-spin text-brand-accent" />
                  </div>
                ) : cart.length === 0 ? (
                  <div className="py-16 text-center flex flex-col items-center gap-3">
                    <Package size={40} className="text-brand-border" />
                    <p className="text-brand-mid text-sm">Your cart is empty</p>
                    <a href="/shop" className="text-brand-accent text-sm underline underline-offset-4">
                      Browse the shop
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {cart.map((item) => {
                      const isUpdatingThisItem =
                        updateCartItemQuantity.isPending &&
                        updateCartItemQuantity.variables?.productId === item.product._id;

                      return (
                        <div
                          key={item.product._id}
                          className="flex flex-col sm:flex-row gap-4 bg-brand-raised border border-brand-border
                          rounded-xl p-4"
                        >
                          <div
                            className="w-full sm:w-20 h-20 rounded-lg flex-shrink-0 relative overflow-hidden"
                            style={{ backgroundColor: item.product.colourCode }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          </div>

                          <div className="flex-1 flex flex-col gap-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="text-white font-semibold text-sm">{item.product.productName}</h3>
                                <p className="text-brand-mid text-xs mt-0.5">{item.product.productCategory}</p>
                              </div>
                              <button
                                onClick={() => 
                                    removeFromCart.mutate(item.product._id)

                                }
                                className="text-brand-subtle hover:text-red-400 transition-colors p-1"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 mt-1">
                              <div className="flex items-center gap-1.5">
                                <label className="text-brand-subtle text-xs">Colour:</label>
                                <select
                                  value={item.selectedColour}
                                  onChange={(e) => updateColour(item.product._id, e.target.value)}
                                  className="bg-brand-card border border-brand-border text-white text-xs
                                  rounded-md px-2 py-1.5 focus:outline-none focus:border-brand-accent/60 cursor-pointer"
                                >
                                    
                                    <option className="disabled">{item.selectedColour}</option>
                                 
                                </select>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <label className="text-brand-subtle text-xs">Qty:</label>
                                <div className="flex items-center bg-brand-card border border-brand-border rounded-md">
                                  <button
                                    onClick={() => handleQtyChange(item.product._id, item.quantity, -1)}
                                    disabled={isUpdatingThisItem}
                                    className="p-1.5 text-brand-mid hover:text-white transition-colors disabled:opacity-40"
                                  >
                                    <Minus size={12} />
                                  </button>

                                  <input
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                    disabled={isUpdatingThisItem}
                                    onChange={(e) => handleQtyInputChange(item.product._id, e.target.value)}
                                    className="bg-transparent text-white text-xs font-semibold w-10 text-center
                                      focus:outline-none [appearance:textfield]
                                      [&::-webkit-outer-spin-button]:appearance-none
                                      [&::-webkit-inner-spin-button]:appearance-none"
                                  />

                                  <button
                                    onClick={() => handleQtyChange(item.product._id, item.quantity, 1)}
                                    disabled={isUpdatingThisItem}
                                    className="p-1.5 text-brand-mid hover:text-white transition-colors disabled:opacity-40"
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>
                                {isUpdatingThisItem && (
                                  <Loader size={12} className="animate-spin text-brand-accent" />
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-1">
                              <span className="text-brand-mid text-xs">
                                {formatCurrency(item.product.price)} each
                              </span>
                              <span className="text-brand-accent font-bold text-sm font-display">
                                {formatCurrency(item.product.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* STEP 1 — Delivery Details */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-lg bg-brand-accent-muted border border-brand-accent/20
                    flex items-center justify-center"
                  >
                    <MapPin size={16} className="text-brand-accent" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Delivery Details</h2>
                    <p className="text-brand-mid text-xs mt-0.5">Where should we deliver your order?</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-lt-gray text-xs font-medium">Delivery Address *</label>
                  <input
                    value={delivery.deliveryAddress}
                    onChange={(e) => setDelivery((p) => ({ ...p, deliveryAddress: e.target.value }))}
                    placeholder="House number, street name, area"
                    className={inputCls}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-brand-lt-gray text-xs font-medium">State *</label>
                    <select
                      value={delivery.state}
                      onChange={(e) => setDelivery((p) => ({ ...p, state: e.target.value }))}
                      className={`${inputCls} cursor-pointer`}
                    >
                      <option value="">Select state</option>
                      {NIGERIA_STATES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-brand-lt-gray text-xs font-medium">City *</label>
                    <input
                      value={delivery.city}
                      onChange={(e) => setDelivery((p) => ({ ...p, city: e.target.value }))}
                      placeholder="e.g. Lekki, Wuse II..."
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-lt-gray text-xs font-medium">Email Address *</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subtle" />
                    <input
                      type="email"
                      value={delivery.emailAddress}
                      onChange={(e) => setDelivery((p) => ({ ...p, emailAddress: e.target.value }))}
                      placeholder="you@example.com"
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                  <p className="text-brand-subtle text-[11px]">Used for your order receipt and Paystack validation.</p>
                </div>
              </div>
            )}

            {/* STEP 2 — Payment Method */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-lg bg-brand-accent-muted border border-brand-accent/20
                    flex items-center justify-center"
                  >
                    <CreditCard size={16} className="text-brand-accent" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Payment Method</h2>
                    <p className="text-brand-mid text-xs mt-0.5">Choose how you&apos;d like to pay</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {(
                    [
                      { value: "paystack", label: "Pay with Paystack", desc: "Card, USSD, or Bank App via Paystack", icon: CreditCard },
                      { value: "bank-transfer", label: "Bank Transfer", desc: "Transfer directly to our account", icon: Banknote },
                    ] as const
                  ).map((opt) => {
                    const Icon = opt.icon;
                    const active = paymentMethod === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setPaymentMethod(opt.value)}
                        className={`text-left p-4 rounded-xl border transition-all ${
                          active
                            ? "border-brand-accent bg-brand-accent-muted"
                            : "border-brand-border bg-brand-raised hover:border-brand-border-lt"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon size={18} className={active ? "text-brand-accent" : "text-brand-mid"} />
                          {active && <CheckCircle size={15} className="text-brand-accent" />}
                        </div>
                        <p className={`text-sm font-semibold ${active ? "text-white" : "text-brand-lt-gray"}`}>
                          {opt.label}
                        </p>
                        <p className="text-brand-mid text-xs mt-1">{opt.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {paymentMethod === "bank-transfer" && (
                  <div className="bg-brand-raised border border-brand-border rounded-xl p-4 text-sm">
                    <p className="text-brand-accent font-semibold text-xs uppercase tracking-wider mb-2">Bank Details</p>
                    <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                      <span className="text-brand-mid">Bank Name:</span>
                      <span className="text-white">Paint Domain Bank Plc</span>
                      <span className="text-brand-mid">Account Number:</span>
                      <span className="text-white">0123456789</span>
                      <span className="text-brand-mid">Account Name:</span>
                      <span className="text-white">Paint Domain &amp; Primary Interior Builders</span>
                    </div>
                    <p className="text-brand-subtle text-[11px] mt-2">
                      Please use your reference details as the transfer narration.
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-lt-gray text-xs font-medium">Order Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Delivery instructions, special handling, etc."
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </div>
            )}

            {/* STEP 3 — Confirm */}
            {step === 3 && (
              <div className="flex flex-col gap-5">
                <h2 className="font-display text-xl font-bold text-white">Confirm Your Order</h2>

                <div>
                  <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider mb-3">Items</p>
                  <div className="flex flex-col gap-2">
                    {cart.map((item) => (
                      <div
                        key={item.product._id}
                        className="flex items-center justify-between bg-brand-raised
                        border border-brand-border rounded-lg px-4 py-3 text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full border border-white/20"
                            style={{ backgroundColor: item.product.colourCode }}
                          />
                          <div>
                            <p className="text-white">{item.product.productName}</p>
                            <p className="text-brand-mid text-xs">
                              {item.selectedColour} · ×{item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="text-brand-accent font-semibold">
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider mb-3">Delivery To</p>
                  <div className="bg-brand-raised border border-brand-border rounded-lg p-4 text-sm">
                    <p className="text-white">{delivery.deliveryAddress}</p>
                    <p className="text-brand-mid text-xs mt-1">
                      {delivery.city}, {delivery.state}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider mb-3">Payment</p>
                  <div className="bg-brand-raised border border-brand-border rounded-lg p-4 text-sm flex items-center gap-2">
                    {paymentMethod === "paystack" ? (
                      <CreditCard size={15} className="text-brand-accent" />
                    ) : (
                      <Banknote size={15} className="text-brand-accent" />
                    )}
                    <span className="text-white capitalize">
                      {paymentMethod === "paystack" ? "Paystack" : "Bank Transfer"}
                    </span>
                  </div>
                </div>

                {notes && (
                  <div>
                    <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider mb-3">Notes</p>
                    <div className="bg-brand-raised border border-brand-border rounded-lg p-4 text-sm text-brand-lt-gray">
                      {notes}
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3">
                    <p className="text-red-400 text-sm">{errorMsg}</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-border/50">
              <button
                onClick={goBack}
                disabled={step === 0 || submitting}
                className="flex items-center gap-2 text-brand-mid hover:text-white text-sm
                  disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-4 py-2.5 rounded-lg
                  border border-brand-border hover:border-brand-border-lt"
              >
                <ArrowLeft size={14} /> Back
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  onClick={goNext}
                  className="flex items-center gap-2 bg-brand-accent text-brand-black font-semibold
                    px-6 py-2.5 rounded-lg hover:bg-brand-accent-lt transition-all text-sm"
                >
                  Continue <ArrowRight size={14} />
                </button>
              ) : paymentMethod === "bank-transfer" ? (
                <button
                  onClick={handleBankTransferSubmit}
                  disabled={submitting || !canSubmit}
                  className="flex items-center gap-2 bg-brand-accent text-brand-black font-semibold
                    px-6 py-2.5 rounded-lg hover:bg-brand-accent-lt transition-all text-sm disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle size={14} />
                  )}
                  {submitting ? "Placing Order..." : "Place Order"}
                </button>
              ) : !canSubmit || submitting ? (
                <button
                  disabled
                  className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black
                    font-semibold px-6 py-2.5 rounded-lg text-sm opacity-50 cursor-not-allowed border-none"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CreditCard size={14} />
                  )}
                  {submitting ? "Processing..." : "Pay & Place Order"}
                </button>
              ) : (
                <PaystackButton
                  email={delivery.emailAddress}
                  amount={total * 100}
                  publicKey={PAYSTACK_PUBLIC_KEY}
                  text="Pay & Place Order"
                  onSuccess={handlePaystackSuccess}
                  onClose={handlePaystackClose}
                  className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black
                    font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-accent-lt transition-all
                    text-sm border-none cursor-pointer"
                />
              )}
            </div>
          </div>

          {/* ── Order Summary Sidebar ──────────────────────────────────────────── */}
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6 h-fit flex flex-col gap-5">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <ShoppingCart size={18} className="text-brand-accent" /> Order Summary
            </h2>

            <div className="flex flex-col gap-3 border-b border-brand-border/60 pb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-mid">
                  Subtotal ({cart.reduce((a, c) => a + c.quantity, 0)} items)
                </span>
                <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
              </div>
            
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-semibold">Total Amount</span>
              <span className="text-brand-accent font-bold text-xl font-display">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}