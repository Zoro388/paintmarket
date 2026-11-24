
"use client";

import { useState, useEffect } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  apiUpdateCartItem,
  apiGetCart,
  apiRemoveFromCart,
} from "@/lib/userApi";

import { formatCurrency } from "@/lib/utils";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  Loader,
  ArrowRight,
  ArrowLeft,
  MapPin,
  CheckCircle,
  Package,
  Mail,
  Wrench,
} from "lucide-react";

import Modal from "../test/component/modal";

interface Variant {
  _id: string;
  colourName: string;
  colourCode: string;
  image?: { url: string; publicId?: string };
}

interface Product {
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

interface Tool {
  _id: string;
  name: string;
  description: string;
  price: number;
  images?: string[];
}

interface CartItem {
  itemType?: "product" | "tool";
  product?: Product | null;
  tool?: Tool | null;
  quantity: number;
  selectedColour?: string;
}

const NIGERIA_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
  "Ekiti", "Enugu", "FCT - Abuja", "Gombe", "Imo", "Jigawa",
  "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe",
  "Zamfara",
];

const STEPS = ["Cart", "Delivery", "Confirm"];

const DELIVERY_FEE_PER_BUCKET = 5500;
const FREE_DELIVERY_MINIMUM = 50;
const ABUJA_STATE = "FCT - Abuja";

const inputCls =
  "w-full bg-brand-raised border border-brand-border text-white placeholder-brand-subtle px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 transition-all";

export default function CartPage() {
  const [step, setStep] = useState(0);
  const [showPayModal, setShowPayModal] = useState(false);
  const [notes, setNotes] = useState("");

  const [delivery, setDelivery] = useState({
    fullName: "",
    phoneNumber: "",
    deliveryAddress: "",
    state: "",
    city: "",
    emailAddress: "",
  });

  const qc = useQueryClient();

  const {
    data: fetchedItems,
    isLoading,
  } = useQuery<CartItem[]>({
    queryKey: ["cart-product"],
    queryFn: async () => {
      const res = await apiGetCart();
      const rawItems = res?.cart?.items ?? res?.data ?? [];
      return rawItems as CartItem[];
    },
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartInitialized, setCartInitialized] = useState(false);

  useEffect(() => {
    if (fetchedItems) {
      setCart(fetchedItems);
      setCartInitialized(true);
    }
  }, [fetchedItems]);

  // Identify tool items
  const isToolItem = (item: CartItem) =>
    item.itemType === "tool" || !!item.tool;

  // Get item ID
  const getItemId = (item: CartItem) =>
    isToolItem(item)
      ? item.tool?._id || ""
      : item.product?._id || "";

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

  // Get item image
  const getItemImage = (item: CartItem) => {
    if (isToolItem(item)) {
      return item.tool?.images?.[0] || "";
    }

    const variant = item.product?.variants?.find(
      (v) => v._id === item.selectedColour
    );

    return (
      variant?.image?.url ||
      item.product?.productImages?.[0] ||
      ""
    );
  };

  // Get selected paint variant
  const getSelectedVariant = (
    item: CartItem
  ): Variant | undefined => {
    if (isToolItem(item)) return undefined;

    return item.product?.variants?.find(
      (v) => v._id === item.selectedColour
    );
  };

  // Update quantity
  const updateQtyMutation = useMutation({
    mutationFn: ({
      itemId,
      itemType,
      quantity,
    }: {
      itemId: string;
      itemType: "product" | "tool";
      quantity: number;
    }) =>
      apiUpdateCartItem(itemId, {
        quantity,
        itemType,
      }),

    onSuccess: (_data, variables) => {
      setCart((prev) =>
        prev.map((item) =>
          getItemId(item) === variables.itemId &&
          (isToolItem(item) ? "tool" : "product") ===
            variables.itemType
            ? { ...item, quantity: variables.quantity }
            : item
        )
      );

      qc.invalidateQueries({
        queryKey: ["cart-product"],
      });

      toast.success("Cart updated!");
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update cart"
      );
    },
  });

  // Remove item from cart
  const removeMutation = useMutation({
    mutationFn: ({
      itemId,
      itemType,
    }: {
      itemId: string;
      itemType: "product" | "tool";
    }) => apiRemoveFromCart(itemId, itemType),

    onSuccess: (_data, variables) => {
      setCart((prev) =>
        prev.filter(
          (item) =>
            !(
              getItemId(item) === variables.itemId &&
              (isToolItem(item) ? "tool" : "product") ===
                variables.itemType
            )
        )
      );

      qc.invalidateQueries({
        queryKey: ["cart-product"],
      });

      toast.success("Item removed!");
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to remove item"
      );
    },
  });

  const handleQtyChange = (
    item: CartItem,
    delta: number
  ) => {
    const nextQty = Math.max(
      1,
      item.quantity + delta
    );

    if (nextQty === item.quantity) return;

    updateQtyMutation.mutate({
      itemId: getItemId(item),
      itemType: isToolItem(item) ? "tool" : "product",
      quantity: nextQty,
    });
  };

  const handleQtyInput = (
    item: CartItem,
    rawValue: string
  ) => {
    const parsed = parseInt(rawValue, 10);

    if (Number.isNaN(parsed) || parsed < 1) return;

    updateQtyMutation.mutate({
      itemId: getItemId(item),
      itemType: isToolItem(item) ? "tool" : "product",
      quantity: parsed,
    });
  };

  // Subtotal includes both paint products and tools
  const subtotal = cart.reduce(
    (acc, item) =>
      acc + getItemPrice(item) * item.quantity,
    0
  );

  // Count paint buckets only
  const totalBuckets = cart.reduce(
    (acc, item) =>
      acc + (isToolItem(item) ? 0 : item.quantity),
    0
  );

  // Count tools
  const totalTools = cart.reduce(
    (acc, item) =>
      acc + (isToolItem(item) ? item.quantity : 0),
    0
  );

  // Abuja free delivery for 50 or more paint buckets
  const isAbuja = delivery.state === ABUJA_STATE;

  const qualifiesForFreeDelivery =
    isAbuja && totalBuckets >= FREE_DELIVERY_MINIMUM;

  // Tools do not attract per-bucket delivery fees
  const deliveryFee = qualifiesForFreeDelivery
    ? 0
    : totalBuckets * DELIVERY_FEE_PER_BUCKET;

  const total = subtotal + deliveryFee;

  const canGoToDelivery = cart.length > 0;

  const canGoToConfirm = Boolean(
    delivery.fullName.trim() &&
      delivery.phoneNumber.trim() &&
      delivery.deliveryAddress.trim() &&
      delivery.state &&
      delivery.city.trim() &&
      delivery.emailAddress.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        delivery.emailAddress
      )
  );

  const goNext = () => {
    if (step === 0 && !canGoToDelivery) {
      toast.error("Your cart is empty");
      return;
    }

    if (step === 1 && !canGoToConfirm) {
      toast.error("Please fill in all delivery fields");
      return;
    }

    setStep((s) =>
      Math.min(s + 1, STEPS.length - 1)
    );
  };

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  return (
    <main className="bg-brand-black min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8 border-b border-brand-border/40">
        <div className="max-w-5xl mx-auto">
          <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            Checkout
          </p>

          <h1 className="font-display text-4xl font-bold text-white">
            Your Cart
          </h1>
        </div>
      </section>

      {/* Stepper */}
      <section className="px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center">
            {STEPS.map((label, i) => (
              <div
                key={label}
                className="flex items-center flex-1 last:flex-none"
              >
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
                    {i < step ? (
                      <CheckCircle size={15} />
                    ) : (
                      i + 1
                    )}
                  </div>

                  <span
                    className={`text-sm font-medium hidden sm:inline ${
                      i <= step
                        ? "text-white"
                        : "text-brand-mid"
                    }`}
                  >
                    {label}
                  </span>
                </div>

                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-3 transition-colors ${
                      i < step
                        ? "bg-brand-accent"
                        : "bg-brand-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">

          {/* Main Panel */}
          <div className="lg:col-span-2 bg-brand-card border border-brand-border rounded-2xl p-6 lg:p-8">

            {/* STEP 0 - Cart */}
            {step === 0 && (
              <div className="flex flex-col gap-5">
                <h2 className="font-display text-xl font-bold text-white">
                  Review Your Items
                </h2>

                {isLoading || !cartInitialized ? (
                  <div className="py-16 flex justify-center">
                    <Loader
                      size={26}
                      className="animate-spin text-brand-accent"
                    />
                  </div>
                ) : cart.length === 0 ? (
                  <div className="py-16 text-center flex flex-col items-center gap-3">
                    <Package
                      size={40}
                      className="text-brand-border"
                    />

                    <p className="text-brand-mid text-sm">
                      Your cart is empty
                    </p>

                    <a
                      href="/shop"
                      className="text-brand-accent text-sm underline underline-offset-4"
                    >
                      Browse the shop
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {cart.map((item, index) => {
                      const toolItem = isToolItem(item);
                      const itemId = getItemId(item);
                      const itemType = toolItem
                        ? "tool"
                        : "product";

                      const itemName = getItemName(item);
                      const itemPrice = getItemPrice(item);
                      const itemImage = getItemImage(item);

                      const selectedVariant =
                        getSelectedVariant(item);

                      const isUpdating =
                        updateQtyMutation.isPending &&
                        updateQtyMutation.variables?.itemId === itemId &&
                        updateQtyMutation.variables?.itemType === itemType;

                      const isRemoving =
                        removeMutation.isPending &&
                        removeMutation.variables?.itemId === itemId &&
                        removeMutation.variables?.itemType === itemType;

                      return (
                        <div
                          key={`${itemType}-${itemId}-${item.selectedColour || ""}-${index}`}
                          className="flex flex-col sm:flex-row gap-4 bg-brand-raised border border-brand-border rounded-xl p-4"
                        >
                          {/* Image */}
                          <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-brand-card border border-brand-border flex-shrink-0">
                            {itemImage ? (
                              <img
                                src={itemImage}
                                alt={itemName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-brand-mid">
                                {toolItem ? (
                                  <Wrench size={28} />
                                ) : (
                                  <Package size={28} />
                                )}
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 flex flex-col gap-3">
                            <div className="flex justify-between items-start gap-3">
                              <div>
                                <h3 className="text-white font-semibold text-base">
                                  {itemName}
                                </h3>

                                <p className="text-brand-mid text-xs mt-1">
                                  {toolItem
                                    ? "Professional Tool"
                                    : item.product?.productCategory}
                                </p>

                                {toolItem ? (
                                  <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full bg-brand-card border border-brand-border text-xs text-brand-accent">
                                    <Wrench size={11} />
                                    Tool
                                  </span>
                                ) : (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="px-2 py-1 rounded-full bg-brand-card border border-brand-border text-xs text-brand-accent">
                                      {selectedVariant?.colourName ??
                                        "Unknown Colour"}
                                    </span>

                                    <span className="px-2 py-1 rounded-full bg-brand-card border border-brand-border text-xs text-brand-mid">
                                      {selectedVariant?.colourCode ?? ""}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <button
                                type="button"
                                disabled={isRemoving}
                                onClick={() =>
                                  removeMutation.mutate({
                                    itemId,
                                    itemType,
                                  })
                                }
                                className="text-brand-subtle hover:text-red-400 transition-colors disabled:opacity-50"
                              >
                                {isRemoving ? (
                                  <Loader
                                    size={16}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </button>
                            </div>

                            {/* Quantity */}
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-brand-mid">
                                Quantity
                              </span>

                              <div className="flex items-center bg-brand-card border border-brand-border rounded-md">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQtyChange(item, -1)
                                  }
                                  disabled={isUpdating}
                                  className="p-2 text-white disabled:opacity-40"
                                >
                                  <Minus size={12} />
                                </button>

                                <input
                                  type="number"
                                  min={1}
                                  value={item.quantity}
                                  disabled={isUpdating}
                                  onChange={(e) =>
                                    handleQtyInput(
                                      item,
                                      e.target.value
                                    )
                                  }
                                  className="bg-transparent text-white text-center w-12 outline-none"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQtyChange(item, 1)
                                  }
                                  disabled={isUpdating}
                                  className="p-2 text-white disabled:opacity-40"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              {isUpdating && (
                                <Loader
                                  size={12}
                                  className="animate-spin text-brand-accent"
                                />
                              )}
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between pt-2 border-t border-brand-border">
                              <div>
                                <p className="text-brand-mid text-xs">
                                  Unit Price
                                </p>

                                <p className="text-white font-medium">
                                  {formatCurrency(itemPrice)}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="text-brand-mid text-xs">
                                  Total
                                </p>

                                <p className="text-brand-accent font-bold text-lg">
                                  {formatCurrency(
                                    itemPrice * item.quantity
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* STEP 1 - Delivery */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-brand-accent-muted border border-brand-accent/20 flex items-center justify-center">
                    <MapPin
                      size={16}
                      className="text-brand-accent"
                    />
                  </div>

                  <div>
                    <h2 className="font-display text-xl font-bold text-white">
                      Delivery Details
                    </h2>

                    <p className="text-brand-mid text-xs mt-0.5">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                {/* Full Name + Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-brand-lt-gray text-xs font-medium">
                      Full Name *
                    </label>

                    <input
                      value={delivery.fullName}
                      onChange={(e) =>
                        setDelivery((p) => ({
                          ...p,
                          fullName: e.target.value,
                        }))
                      }
                      placeholder="John Doe"
                      className={inputCls}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-brand-lt-gray text-xs font-medium">
                      Phone Number *
                    </label>

                    <input
                      type="tel"
                      value={delivery.phoneNumber}
                      onChange={(e) =>
                        setDelivery((p) => ({
                          ...p,
                          phoneNumber: e.target.value,
                        }))
                      }
                      placeholder="08012345678"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-lt-gray text-xs font-medium">
                    Delivery Address *
                  </label>

                  <input
                    value={delivery.deliveryAddress}
                    onChange={(e) =>
                      setDelivery((p) => ({
                        ...p,
                        deliveryAddress: e.target.value,
                      }))
                    }
                    placeholder="House number, street name, area"
                    className={inputCls}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-brand-lt-gray text-xs font-medium">
                      State *
                    </label>

                    <select
                      value={delivery.state}
                      onChange={(e) =>
                        setDelivery((p) => ({
                          ...p,
                          state: e.target.value,
                        }))
                      }
                      className={`${inputCls} cursor-pointer`}
                    >
                      <option value="">Select state</option>

                      {NIGERIA_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-brand-lt-gray text-xs font-medium">
                      City *
                    </label>

                    <input
                      value={delivery.city}
                      onChange={(e) =>
                        setDelivery((p) => ({
                          ...p,
                          city: e.target.value,
                        }))
                      }
                      placeholder="e.g. Lekki, Wuse II..."
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-lt-gray text-xs font-medium">
                    Email Address *
                  </label>

                  <div className="relative">
                    <Mail
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subtle"
                    />

                    <input
                      type="email"
                      value={delivery.emailAddress}
                      onChange={(e) =>
                        setDelivery((p) => ({
                          ...p,
                          emailAddress: e.target.value,
                        }))
                      }
                      placeholder="you@example.com"
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-lt-gray text-xs font-medium">
                    Order Notes (optional)
                  </label>

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

            {/* STEP 2 - Confirm */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <h2 className="font-display text-xl font-bold text-white">
                  Confirm Your Order
                </h2>

                {/* Items */}
                <div>
                  <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider mb-3">
                    Items
                  </p>

                  <div className="flex flex-col gap-2">
                    {cart.map((item, index) => {
                      const toolItem = isToolItem(item);
                      const itemName = getItemName(item);
                      const itemPrice = getItemPrice(item);
                      const itemImage = getItemImage(item);
                      const selectedVariant =
                        getSelectedVariant(item);

                      return (
                        <div
                          key={`${getItemId(item)}-${index}`}
                          className="flex items-center justify-between bg-brand-raised border border-brand-border rounded-lg px-4 py-3 text-sm gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-brand-border bg-brand-card flex-shrink-0">
                              {itemImage ? (
                                <img
                                  src={itemImage}
                                  alt={itemName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-brand-mid">
                                  {toolItem ? (
                                    <Wrench size={18} />
                                  ) : (
                                    <Package size={18} />
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="text-white font-medium truncate">
                                {itemName}
                              </p>

                              <p className="text-brand-mid text-xs">
                                {toolItem
                                  ? "Tool"
                                  : selectedVariant?.colourName ??
                                    "Unknown Colour"}
                              </p>

                              <p className="text-brand-subtle text-[11px]">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>

                          <span className="text-brand-accent font-semibold flex-shrink-0">
                            {formatCurrency(
                              itemPrice * item.quantity
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery To */}
                <div>
                  <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider mb-3">
                    Delivery To
                  </p>

                  <div className="bg-brand-raised border border-brand-border rounded-lg p-4 text-sm flex flex-col gap-1">
                    <p className="text-white font-medium">
                      {delivery.fullName}
                    </p>

                    <p className="text-brand-mid text-xs">
                      {delivery.phoneNumber} ·{" "}
                      {delivery.emailAddress}
                    </p>

                    <p className="text-brand-mid text-xs">
                      {delivery.deliveryAddress}
                    </p>

                    <p className="text-brand-mid text-xs">
                      {delivery.city}, {delivery.state}
                    </p>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-brand-raised border border-brand-border rounded-lg p-4 flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-mid">
                      Products & Tools Subtotal
                    </span>

                    <span className="text-white">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-brand-mid">
                      Paint Buckets
                    </span>

                    <span className="text-white">
                      {totalBuckets}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-brand-mid">
                      Tools
                    </span>

                    <span className="text-white">
                      {totalTools}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-brand-mid">
                      Delivery Fee
                    </span>

                    <span className="text-white">
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
                    <p className="text-green-500 text-xs">
                      Your order qualifies for free delivery in Abuja.
                    </p>
                  )}

                  <div className="flex justify-between border-t border-brand-border pt-2 mt-1">
                    <span className="text-white font-semibold">
                      Total Amount
                    </span>

                    <span className="text-brand-accent font-bold">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                {notes && (
                  <div>
                    <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider mb-3">
                      Notes
                    </p>

                    <div className="bg-brand-raised border border-brand-border rounded-lg p-4 text-sm text-brand-lt-gray">
                      {notes}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-border/50">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 0}
                className="flex items-center gap-2 text-brand-mid hover:text-white text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-4 py-2.5 rounded-lg border border-brand-border hover:border-brand-border-lt"
              >
                <ArrowLeft size={14} />
                Back
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="flex items-center gap-2 bg-brand-accent text-brand-black font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-accent-lt transition-all text-sm"
                >
                  Continue
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPayModal(true)}
                  disabled={!canGoToConfirm}
                  className="flex items-center gap-2 bg-brand-accent text-brand-black font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-accent-lt transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pay Now
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6 h-fit flex flex-col gap-5">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <ShoppingCart
                size={18}
                className="text-brand-accent"
              />
              Order Summary
            </h2>

            <div className="flex flex-col gap-3 border-b border-brand-border/60 pb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-mid">
                  Products & Tools
                </span>

                <span className="text-white font-medium">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-mid">
                  Paint Buckets
                </span>

                <span className="text-white font-medium">
                  {totalBuckets}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-mid">
                  Delivery Fee
                </span>

                <span className="text-white font-medium">
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
                <p className="text-green-500 text-xs">
                  Abuja free delivery applied.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-semibold">
                Total Amount
              </span>

              <span className="text-brand-accent font-bold text-xl font-display">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Flutterwave Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <Modal
            customerInfo={{
              fullName: delivery.fullName,
              phoneNumber: delivery.phoneNumber,
              emailAddress: delivery.emailAddress,
              deliveryAddress: delivery.deliveryAddress,
              state: delivery.state,
              city: delivery.city,
              notes: notes,
            }}
            cartItems={cart}
            onClose={() => setShowPayModal(false)}
          />
        </div>
      )}

      <Footer />
    </main>
  );
}
