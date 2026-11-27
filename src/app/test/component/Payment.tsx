// "use client";

// import React, { useState } from "react";
// import {
//   useFlutterwave,
//   closePaymentModal,
// } from "flutterwave-react-v3";
// import {
//   apiCreateOrder,
//   apiClearCart,
// } from "@/lib/userApi";
// import toast from "react-hot-toast";
// import {
//   Loader,
//   ShoppingBag,
// } from "lucide-react";
// import {
//   useQueryClient,
// } from "@tanstack/react-query";

// // Types

// interface CheckoutCartItem {
//   id: string;
//   itemType?: "product" | "tool";
//   productName: string;
//   name: string;
//   price: number;
//   quantity: number;
//   selectedColour?: string;
// }
// export interface CheckoutCustomerInfo {
//   email: string;
//   name: string;
//   phone_number: string;
// }

// interface CartCheckoutProps {
//   cartItems: CheckoutCartItem[];
//   customerInfo: CheckoutCustomerInfo;
//   deliveryAddress: string;
//   state: string;
//   city: string;
//   notes?: string;
//   deliveryFee: number;
//   onSuccess: () => void;
// }

// // Component

// const CartCheckout: React.FC<CartCheckoutProps> = ({
//   cartItems,
//   customerInfo,
//   deliveryAddress,
//   state,
//   city,
//   notes,
//   deliveryFee,
//   onSuccess,
// }) => {
//   const [loading, setLoading] = useState(false);

//   const queryClient = useQueryClient();

//   // Calculate total

//   const subtotal = cartItems.reduce(
//     (sum, item) =>
//       sum + item.price * item.quantity,
//     0
//   );

//   const total = subtotal + deliveryFee;

//   // Flutterwave configuration

//   const config = {
//     public_key:
//       process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "",

//     tx_ref: `PM-${Date.now()}-${Math.floor(
//       Math.random() * 999999
//     )}`,

//     amount: total,

//     currency: "NGN",

//     payment_options:
//       "card,ussd,bank_transfer",

//     customer: {
//       email: customerInfo.email,
//       phone_number:
//         customerInfo.phone_number,
//       name: customerInfo.name,
//     },

//     customizations: {
//       title: "Smart Choice PaintMarket",

//       description: `Payment for ${
//         cartItems.length
//       } item${
//         cartItems.length !== 1
//           ? "s"
//           : ""
//       }`,

//       logo: "",
//     },
//   };

//   const handleFlutterPayment =
//     useFlutterwave(config);

//   // Handle payment

//   const handlePay = () => {
//     console.log("=================================");
//     console.log("PAY BUTTON CLICKED");
//     console.log("=================================");

//     console.log(
//       "Cart items:",
//       cartItems
//     );

//     console.log(
//       "Customer info:",
//       customerInfo
//     );

//     console.log(
//       "Paint subtotal:",
//       subtotal
//     );

//     console.log(
//       "Delivery fee:",
//       deliveryFee
//     );

//     console.log(
//       "Grand total:",
//       total
//     );

//     console.log(
//       "Flutterwave public key:",
//       process.env
//         .NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY
//     );

//     // Validate email

//     if (!customerInfo.email) {
//       toast.error(
//         "Email is required"
//       );
//       return;
//     }

//     // Validate name

//     if (!customerInfo.name) {
//       toast.error(
//         "Full name is required"
//       );
//       return;
//     }

//     // Validate phone number

//     if (!customerInfo.phone_number) {
//       toast.error(
//         "Phone number is required"
//       );
//       return;
//     }

//     // Validate cart

//     if (
//       !cartItems ||
//       cartItems.length === 0
//     ) {
//       toast.error(
//         "Your cart is empty"
//       );
//       return;
//     }

//     // Validate total

//     if (total <= 0) {
//       toast.error(
//         "Invalid payment amount"
//       );
//       return;
//     }

//     // Validate Flutterwave public key

//     if (
//       !process.env
//         .NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY
//     ) {
//       toast.error(
//         "Flutterwave public key is missing. Please contact support."
//       );

//       console.error(
//         "NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY is missing."
//       );

//       return;
//     }

//     console.log(
//       "Starting Flutterwave payment..."
//     );

//     console.log(
//       "Payment amount:",
//       total
//     );

//     // Open Flutterwave

//     handleFlutterPayment({
//       callback: async (response) => {
//         console.log(
//           "================================="
//         );

//         console.log(
//           "FLUTTERWAVE RESPONSE"
//         );

//         console.log(
//           response
//         );

//         console.log(
//           "================================="
//         );

//         // Close Flutterwave modal

//         closePaymentModal();

//         // Check payment status

//         if (
//           response.status ===
//             "successful" ||
//           response.status ===
//             "completed"
//         ) {
//           setLoading(true);

//           try {
//             // Get payment reference

//             const paymentReference =
//               String(
//                 response.transaction_id ??
//                   response.tx_ref ??
//                   ""
//               );

//             console.log(
//               "Payment reference:",
//               paymentReference
//             );

//             if (!paymentReference) {
//               throw new Error(
//                 "Payment was successful, but no payment reference was received."
//               );
//             }

//             // Create order

//             console.log(
//               "Creating order..."
//             );

//             await apiCreateOrder({
//               deliveryAddress,

//               state,

//               city,

//               orderedProducts: cartItems.map((item) => ({
//   itemType: item.itemType || "product",
//   ...(item.itemType === "tool"
//     ? { toolId: item.id }
//     : {
//         productId: item.id,
//         selectedColour: item.selectedColour || "",
//       }),
//   quantity: item.quantity,
// })),

//               paymentMethod:
//                 "flutterwave",

//               paymentReference,

//               notes:
//                 notes || undefined,
//             });

//             console.log(
//               "Order created successfully."
//             );

//             // Clear backend cart

//             try {
//               console.log(
//                 "Clearing backend cart..."
//               );

//               await apiClearCart();

//               console.log(
//                 "Backend cart cleared successfully."
//               );
//             } catch (cartError) {
//               console.error(
//                 "Cart clearing failed:",
//                 cartError
//               );

//               // Cart clearing failure should
//               // not cancel the successful order.
//             }

//             // Refresh cart query

//             await queryClient.invalidateQueries(
//               {
//                 queryKey: [
//                   "cart-product",
//                 ],
//               }
//             );

//             console.log(
//               "Cart query refreshed."
//             );

//             // Success message

//             toast.success(
//               "Order placed successfully!"
//             );

//             // Tell parent component

//             onSuccess();
//           } catch (err: unknown) {
//             console.error(
//               "ORDER CREATION ERROR:",
//               err
//             );

//             const message =
//               err instanceof Error
//                 ? err.message
//                 : "Order failed. Contact support.";

//             toast.error(message);
//           } finally {
//             setLoading(false);
//           }
//         } else {
//           console.log(
//             "Payment was not successful:",
//             response
//           );

//           toast.error(
//             "Payment was not completed. Please try again."
//           );
//         }
//       },

//       // Flutterwave modal closed

//       onClose: () => {
//         console.log(
//           "Flutterwave payment window closed."
//         );

//         toast(
//           "Payment cancelled",
//           {
//             icon: "ℹ️",
//           }
//         );
//       },
//     });
//   };

//   // Render

//   return (
//     <button
//       type="button"
//       onClick={handlePay}
//       disabled={loading}
//       className="w-full flex items-center justify-center gap-2
//         bg-brand-accent text-brand-black
//         font-bold py-3.5 rounded-xl
//         hover:bg-brand-accent-lt
//         transition-all text-sm
//         disabled:opacity-50
//         disabled:cursor-not-allowed
//         shadow-md"
//     >
//       {loading ? (
//         <>
//           <Loader
//             size={16}
//             className="animate-spin"
//           />

//           Processing Order…
//         </>
//       ) : (
//         <>
//           <ShoppingBag size={16} />

//           Pay ₦
//           {total.toLocaleString()}
//           {" "}
//           with Flutterwave
//         </>
//       )}
//     </button>
//   );
// };

// export default CartCheckout;





"use client";

import { useState } from "react";
import { Loader2, ShoppingBag } from "lucide-react";
import { apiInitializeNombaPayment } from "@/lib/userApi";

interface CheckoutCartItem {
  id: string;
  itemType?: "product" | "tool";
  productName: string;
  name: string;
  price: number;
  quantity: number;
  selectedColour?: string;
}

interface CheckoutCustomerInfo {
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
  deliveryFee: number;
  onSuccess: () => void;
}

export default function Payment({
  cartItems,
  customerInfo,
  deliveryAddress,
  state,
  city,
  notes,
  deliveryFee,
}: CartCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const totalAmount = subtotal + deliveryFee;

  const handlePayment = async () => {
    if (isLoading) return;

    setError("");

    if (!cartItems.length) {
      setError("Your cart is empty.");
      return;
    }

    if (
      !customerInfo.email ||
      !deliveryAddress ||
      !state ||
      !city
    ) {
      setError("Please complete your delivery information.");
      return;
    }

    if (totalAmount <= 0) {
      setError("Your order total is invalid.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiInitializeNombaPayment({
        deliveryAddress,
        state,
        city,
        notes,
        orderedProducts: cartItems.map((item) => {
          const isTool = item.itemType === "tool";

          return {
            itemType: isTool ? "tool" : "product",
            ...(isTool
              ? { toolId: item.id }
              : {
                  productId: item.id,
                  selectedColour: item.selectedColour || "Default",
                }),
            quantity: item.quantity,
          };
        }),
      });

      if (!response?.success || !response?.checkoutLink) {
        throw new Error(
          response?.message ||
            "Unable to start your Nomba payment."
        );
      }

      window.location.assign(response.checkoutLink);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Payment could not be initialized. Please try again.";

      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>
            ₦{subtotal.toLocaleString("en-NG")}
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery fee</span>
          <span>
            ₦{deliveryFee.toLocaleString("en-NG")}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span>
            ₦{totalAmount.toLocaleString("en-NG")}
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handlePayment}
        disabled={isLoading || cartItems.length === 0}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#1B5E20] px-5 py-4 font-semibold text-white transition hover:bg-[#144a19] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Preparing secure payment...
          </>
        ) : (
          <>
            <ShoppingBag className="h-5 w-5" />
            Pay ₦{totalAmount.toLocaleString("en-NG")} with Nomba
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-500">
        Secure payment powered by Nomba.
      </p>
    </div>
  );
}
