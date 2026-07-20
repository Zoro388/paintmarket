// "use client";
// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { formatDate, formatCurrency, getStatusColor, cn } from "@/lib/utils";
// import { Eye, X, ShoppingCart, Package } from "lucide-react";
// import LoadingSkeleton from "../components/Loading";
// import { userGetOrderss } from "@/lib/userApi";

// interface Order {
//   _id: string; customerName: string; email: string; phoneNumber: string;
//   deliveryAddress: string; state: string; city: string;
//   orderedProducts: { 
//     product?: { _id: string; price: number };
//     productName: string; 
//     quantity: number; 
//     selectedColour: string;
//     subtotal?: number;
//     unitPrice?: number;
//   }[];
//   totalAmount: number; paymentMethod: string; paymentStatus: string;
//   orderStatus: string; notes?: string; createdAt: string;
// }

// const ORDER_STATUSES = ["pending","processing","delivered","cancelled"];

// function ProductDetailsModal({ orderId, orders, onClose }: { orderId: string | null; orders: Order[]; onClose: () => void }) {
//   if (!orderId) return null;
  
//   const order = orders.find((o) => o._id === orderId);
//   if (!order) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative z-10 bg-brand-card border border-brand-border rounded-xl shadow-2xl w-full max-w-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-6 border-b border-brand-border/30 sticky top-0 bg-brand-card z-10">
//           <h2 className="text-xl font-bold text-brand-white">Order Items</h2>
//           <button 
//             onClick={onClose} 
//             className="text-brand-mid hover:text-brand-white transition-colors p-1 rounded"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="p-6">
//           {order.orderedProducts && order.orderedProducts.length > 0 ? (
//             <div className="flex flex-col gap-4">
//               {order.orderedProducts.map((item, idx) => (
//                 <div 
//                   key={idx} 
//                   className="bg-brand-raised border border-brand-border rounded-lg p-4"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <p className="text-brand-white font-semibold text-lg">{item.productName || "N/A"}</p>
//                       {item.product?._id && (
//                         <p className="text-brand-mid text-xs mt-1 font-mono">
//                           ID: {item.product._id.slice(-12)}
//                         </p>
//                       )}
//                     </div>
//                     <Package size={24} className="text-brand-accent" />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4 mb-4">
//                     <div className="bg-brand-black/40 rounded-lg p-3">
//                       <p className="text-brand-mid text-xs uppercase tracking-wider mb-1">Quantity</p>
//                       <p className="text-brand-white text-lg font-bold">{item.quantity || 0}</p>
//                     </div>
//                     <div className="bg-brand-black/40 rounded-lg p-3">
//                       <p className="text-brand-mid text-xs uppercase tracking-wider mb-1">Colour</p>
//                       <div className="flex items-center gap-2">
//                         <div 
//                           className="w-4 h-4 rounded border border-brand-border"
//                           style={{ backgroundColor: item.selectedColour?.toLowerCase() || '#ccc' }}
//                         />
//                         <p className="text-brand-white font-medium capitalize">{item.selectedColour || "N/A"}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-3 gap-3 border-t border-brand-border/20 pt-4">
//                     <div>
//                       <p className="text-brand-mid text-xs uppercase tracking-wider mb-2">Unit Price</p>
//                       <p className="text-brand-accent font-bold text-sm">
//                         {item.unitPrice ? formatCurrency(item.unitPrice) : item.product?.price ? formatCurrency(item.product.price) : "N/A"}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-brand-mid text-xs uppercase tracking-wider mb-2">Quantity</p>
//                       <p className="text-brand-white font-bold text-sm">×{item.quantity}</p>
//                     </div>
//                     <div className="bg-brand-accent/10 rounded-lg p-2">
//                       <p className="text-brand-mid text-xs uppercase tracking-wider mb-2">Subtotal</p>
//                       <p className="text-brand-accent font-bold text-sm">
//                         {item.subtotal ? formatCurrency(item.subtotal) : "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               <div className="border-t border-brand-border/30 pt-4 mt-4">
//                 <div className="flex justify-between items-center">
//                   <p className="text-brand-white font-semibold text-lg">Order Total</p>
//                   <p className="text-brand-accent font-bold text-2xl">{formatCurrency(order.totalAmount || 0)}</p>
//                 </div>
//               </div>

//               <button
//                 onClick={onClose}
//                 className="w-full bg-brand-accent text-brand-black font-semibold py-2.5 rounded-lg hover:bg-brand-accent-lt transition-colors mt-4"
//               >
//                 Close
//               </button>
//             </div>
//           ) : (
//             <p className="text-brand-mid text-center py-8">No products in this order</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function OrdersPage() {
//   const [detailId, setDetailId] = useState<string | null>(null);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [search, setSearch] = useState("");

//   const { data, isLoading, isError, error } = useQuery({
//     queryKey: ["orders"],
//     queryFn: async () => {
//       try {
//         const res = await userGetOrderss();
//         return (res?.orders ?? []) as Order[];
//       } catch (error) {
//         console.error("userGetOrderss failed:", error);
//         throw error;
//       }
//     },
//     retry: 1,
//   });

//   const list = data ?? [];
//   const filtered = list
//     .filter((o) => statusFilter === "all" || o.orderStatus === statusFilter)
//     .filter((o) => !search || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase()));

//   const totalRevenue = list.filter((o) => o.paymentStatus === "paid").reduce((acc, o) => acc + o.totalAmount, 0);

//   if (isLoading) return <LoadingSkeleton />;

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex flex-col gap-2">
//         <h1 className="text-3xl font-bold text-brand-white">Order History</h1>
//         <p className="text-brand-mid">Manage and track all your orders</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-brand-card border border-brand-border rounded-lg p-4">
//           <p className="text-brand-mid text-sm mb-2">Total Orders</p>
//           <p className="text-2xl font-bold text-brand-white">{list.length}</p>
//         </div>
//         <div className="bg-brand-card border border-brand-border rounded-lg p-4">
//           <p className="text-brand-mid text-sm mb-2">Total paid orders</p>
//           <p className="text-2xl font-bold text-brand-accent">{list.filter((o) => o.paymentStatus === "paid").length}</p>
//         </div>
//         <div className="bg-brand-card border border-brand-border rounded-lg p-4">
//           <p className="text-brand-mid text-sm mb-2">Total spent</p>
//           <p className="text-2xl font-bold text-brand-accent">{formatCurrency(totalRevenue)}</p>
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row gap-3">
//         <input
//           type="text"
//           placeholder="Search by name or email..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="flex-1 bg-brand-raised border border-brand-border rounded-lg px-4 py-2.5 text-brand-white placeholder-brand-mid focus:outline-none focus:border-brand-accent"
//         />
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="bg-brand-raised border border-brand-border rounded-lg px-4 py-2.5 text-brand-white focus:outline-none focus:border-brand-accent"
//         >
//           <option value="all">All Statuses</option>
//           {ORDER_STATUSES.map((s) => (
//             <option key={s} value={s}>
//               {s.charAt(0).toUpperCase() + s.slice(1)}
//             </option>
//           ))}
//         </select>
//       </div>

//       {isError && (
//         <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
//           <p className="text-red-200 text-sm font-medium">Error loading orders</p>
//           <p className="text-red-100 text-xs mt-1">{error instanceof Error ? error.message : "Unknown error"}</p>
//         </div>
//       )}

//       {filtered.length > 0 ? (
//         <div className="overflow-x-auto rounded-lg border border-brand-border">
//           <table className="w-full text-sm">
//             <thead className="bg-brand-raised border-b border-brand-border">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Order ID</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Customer</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Amount</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Order Status</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Payment</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Date</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-brand-border">
//               {filtered.map((order) => (
//                 <tr key={order._id} className="hover:bg-brand-raised/50 transition-colors">
//                   <td className="px-4 py-3">
//                     <span className="text-brand-white font-mono text-xs bg-brand-black/40 px-2 py-1 rounded">
//                       {order._id?.slice(-8) || "N/A"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     <div>
//                       <p className="text-brand-white font-medium">{order.customerName || "N/A"}</p>
//                       <p className="text-brand-mid text-xs">{order.email || "N/A"}</p>
//                     </div>
//                   </td>
//                   <td className="px-4 py-3">
//                     <p className="text-brand-accent font-semibold">{formatCurrency(order.totalAmount || 0)}</p>
//                   </td>
//                   <td className="px-4 py-3">
//                     <span className={cn(
//                       "px-3 py-1.5 rounded-md text-xs font-semibold capitalize",
//                       getStatusColor(order.orderStatus)
//                     )}>
//                       {order.orderStatus || "pending"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     <span className={cn(
//                       "px-3 py-1.5 rounded-md text-xs font-semibold capitalize",
//                       order.paymentStatus === "paid" 
//                         ? "bg-green-500/20 text-green-200" 
//                         : "bg-yellow-500/20 text-yellow-200"
//                     )}>
//                       {order.paymentStatus || "unpaid"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-brand-mid text-xs">
//                     {order.createdAt ? formatDate(order.createdAt) : "N/A"}
//                   </td>
//                   <td className="px-4 py-3">
//                     <button
//                       onClick={() => setDetailId(order._id)}
//                       className="inline-flex items-center gap-1 text-brand-accent hover:text-brand-white transition-colors text-xs font-medium"
//                     >
//                       <Eye size={14} />
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="bg-brand-card border border-brand-border rounded-lg p-8 text-center">
//           <ShoppingCart size={32} className="mx-auto mb-3 text-brand-mid opacity-50" />
//           <p className="text-brand-white font-medium mb-1">No orders found</p>
//           <p className="text-brand-mid text-sm">
//             {search || statusFilter !== "all" ? "Try adjusting your filters" : "You haven't placed any orders yet"}
//           </p>
//         </div>
//       )}

//       <ProductDetailsModal orderId={detailId} orders={list} onClose={() => setDetailId(null)} />
//     </div>
//   );
// }

//       {/* Search & Filter */}
//       // <div className="flex flex-col md:flex-row gap-3">
//       //   <input
//       //     type="text"
//       //     placeholder="Search by name or email..."
//       //     value={search}
//       //     onChange={(e) => setSearch(e.target.value)}
//       //     className="flex-1 bg-brand-raised border border-brand-border rounded-lg px-4 py-2.5 text-brand-white placeholder-brand-mid focus:outline-none focus:border-brand-accent"
//       //   />
//       //   <select
//       //     value={statusFilter}
//       //     onChange={(e) => setStatusFilter(e.target.value)}
//       //     className="bg-brand-raised border border-brand-border rounded-lg px-4 py-2.5 text-brand-white focus:outline-none focus:border-brand-accent"
//       //   >
//       //     <option value="all">All Statuses</option>
//       //     {ORDER_STATUSES.map((s) => (
//       //       <option key={s} value={s}>
//       //         {s.charAt(0).toUpperCase() + s.slice(1)}
//       //       </option>
//       //     ))}
//       //   </select>
//       // </div>

// //       {/* Error State */}
// //       {isError && (
// //         <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
// //           <p className="text-red-200 text-sm font-medium">Error loading orders</p>
// //           <p className="text-red-100 text-xs mt-1">{error instanceof Error ? error.message : "Unknown error"}</p>
// //         </div>
// //       )}

// //       {/* Loading State */}
// //       {isLoading && <LoadingSkeleton />}

// //       {/* Orders Table */}
// //       {!isLoading && !isError && (
// //         <>
// //           {filtered.length > 0 ? (
// //             <div className="overflow-x-auto rounded-lg border border-brand-border">
// //               <table className="w-full text-sm">
// //                 <thead className="bg-brand-raised border-b border-brand-border">
// //                   <tr>
// //                     <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Order ID</th>
// //                     <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Customer</th>
// //                     <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Amount</th>
// //                     <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Order Status</th>
// //                     <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Payment</th>
// //                     <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Date</th>
// //                     <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Action</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-brand-border">
// //                   {filtered.map((order) => (
// //                     <tr key={order._id} className="hover:bg-brand-raised/50 transition-colors">
// //                       <td className="px-4 py-3">
// //                         <span className="text-brand-white font-mono text-xs bg-brand-black/40 px-2 py-1 rounded">
// //                           {order._id?.slice(-8) || "N/A"}
// //                         </span>
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         <div>
// //                           <p className="text-brand-white font-medium">{order.customerName || "N/A"}</p>
// //                           <p className="text-brand-mid text-xs">{order.email || "N/A"}</p>
// //                         </div>
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         <p className="text-brand-accent font-semibold">{formatCurrency(order.totalAmount || 0)}</p>
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         <span className={cn(
// //                           "px-3 py-1.5 rounded-md text-xs font-semibold capitalize",
// //                           getStatusColor(order.orderStatus)
// //                         )}>
// //                           {order.orderStatus || "pending"}
// //                         </span>
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         <span className={cn(
// //                           "px-3 py-1.5 rounded-md text-xs font-semibold capitalize",
// //                           order.paymentStatus === "paid" 
// //                             ? "bg-green-500/20 text-green-200" 
// //                             : "bg-yellow-500/20 text-yellow-200"
// //                         )}>
// //                           {order.paymentStatus || "unpaid"}
// //                         </span>
// //                       </td>
// //                       <td className="px-4 py-3 text-brand-mid text-xs">
// //                         {order.createdAt ? formatDate(order.createdAt) : "N/A"}
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         <button
// //                           onClick={() => setDetailId(order._id)}
// //                           className="inline-flex items-center gap-1 text-brand-accent hover:text-brand-white transition-colors text-xs font-medium"
// //                         >
// //                           <Eye size={14} />
// //                           View
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           ) : (
// //             <div className="bg-brand-card border border-brand-border rounded-lg p-8 text-center">
// //               <ShoppingCart size={32} className="mx-auto mb-3 text-brand-mid opacity-50" />
// //               <p className="text-brand-white font-medium mb-1">No orders found</p>
// //               <p className="text-brand-mid text-sm">
// //                 {search || statusFilter !== "all" ? "Try adjusting your filters" : "You haven't placed any orders yet"}
// //               </p>
// //             </div>
// //           )}
// //         </>
// //       )}

// //       {/* Product Details Modal */}
// //       <ProductDetailsModal orderId={detailId} orders={list} onClose={() => setDetailId(null)} />
// //     </div>
// //   );
// // }
// // function setStatusFilter(value: string): void {
// //   throw new Error("Function not implemented.");
// // }


"use client";
import { useState, useEffect } from "react";
import { getMyBookedPainters, apiAddReview } from "../../../lib/userApi"; // Ensure correct path for review submission
import { Star, Calendar, MessageSquare, Phone, Mail, CheckCircle, MapPin, X, StarHalf } from "lucide-react";
import toast from "react-hot-toast";

interface PainterUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface ImageObj {
  url: string;
  publicId: string;
  _id?: string;
}

interface PainterProfile {
  _id: string;
  user: PainterUser;
  profileImage?: ImageObj;
  bio: string;
  yearsOfExperience: number;
  state: string;
  city: string;
  averageRating: number;
  totalReviews: number;
  portfolioImages: ImageObj[];
}

interface BookingRecord {
  requestId: string;
  bookingDate: string;
  status: string;
  hasReviewed: boolean;
  canReview: boolean;
  painter: PainterProfile;
}

export default function BookedPaintersPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Review Modal Tracking States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activePainterId, setActivePainterId] = useState<string>("");
  const [activeRequestId, setActiveRequestId] = useState<string>("");
  const [activePainterName, setActivePainterName] = useState<string>("");
  
  // Review Field Data States
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string>("");

  useEffect(() => {
    fetchBookedPainters();
  }, []);

  const fetchBookedPainters = async () => {
    try {
      setLoading(true);
      const res = await getMyBookedPainters();
      if (res?.success) {
        setBookings(res.painters || []);
      } else {
        setError("Failed to locate booking records.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (painterId: string, requestId: string, name: string) => {
    setActivePainterId(painterId);
    setActiveRequestId(requestId);
    setActivePainterName(name);
    setRating(5);
    setComment("");
    setReviewError("");
    setIsModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsModalOpen(false);
    setActivePainterId("");
    setActiveRequestId("");
    setActivePainterName("");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setReviewError("Please include a brief comment about your service experience.");
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError("");

    const reviewPayload = {
  requestId: activeRequestId,
  rating,
  comment: comment.trim(),
  review: comment.trim() // Maps the text to 'review' to satisfy the strict TS compiler error
};

      await apiAddReview(reviewPayload);
      
      // Close the modal and refresh datasets to update conditional buttons dynamically
      closeReviewModal();
      fetchBookedPainters();
      toast.success('review submitted succesfully')
    } catch (err: unknown) {
      setReviewError(err instanceof Error ? err.message : "Could not post your review application.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-brand-black text-white ">
      <div className="">
        <header className="mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight">Booked Service Professionals</h1>
          <p className="text-brand-mid text-sm mt-1">Review, monitor, and manage operations history with your paint installers.</p>
        </header>

        {error && (
          <div className="bg-red-950/40 border border-red-900/50 text-red-400 p-4 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="text-center bg-brand-card border border-brand-border rounded-2xl p-12">
            <MessageSquare className="mx-auto text-brand-subtle mb-4" size={40} />
            <h3 className="text-lg font-medium text-brand-lt-gray">No bookings found</h3>
            <p className="text-brand-subtle text-sm mt-1">When you hire painters from our platform, they will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {bookings.map((record) => {
              const { painter, bookingDate, status, canReview, hasReviewed, requestId } = record;
              const fullName = `${painter.user.firstName} ${painter.user.lastName}`;

              return (
                <div key={requestId} className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-xl transition-all hover:border-brand-border/80">
                  <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start justify-between">
                    
                    {/* Left: Avatar Details & Metadata */}
                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                      <div className="w-20 h-20 rounded-xl overflow-hidden border border-brand-border bg-brand-raised flex-shrink-0">
                        {painter.profileImage?.url ? (
                          <img src={painter.profileImage.url} alt={fullName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-brand-accent/10 text-brand-accent font-bold text-xl uppercase">
                            {painter.user.firstName[0]}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h2 className="font-display text-xl font-bold text-white">{fullName}</h2>
                          <span className={`inline-flex items-center gap-1 text-[11px] font-medium uppercase px-2 py-0.5 rounded-full ${
                            status === "accepted" ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800/40" : "bg-brand-raised text-brand-mid"
                          }`}>
                            <CheckCircle size={10} />
                            {status}
                          </span>
                        </div>

                        <p className="text-brand-lt-gray text-sm line-clamp-2 max-w-xl">{painter.bio}</p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-brand-subtle mt-1.5">
                          <span className="flex items-center gap-1.5 text-brand-accent font-medium">
                            <Star size={13} className="fill-brand-accent" />
                            {painter.averageRating} ({painter.totalReviews} reviews)
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={13} />
                            {painter.city}, {painter.state}
                          </span>
                          <span>• {painter.yearsOfExperience} years exp</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Interactive Action Panel Context */}
                    <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-3 justify-end items-stretch sm:items-center md:items-end border-t border-brand-border/40 md:border-0 pt-4 md:pt-0">
                      <div className="flex flex-col gap-1 text-left md:text-right">
                        <span className="text-[10px] text-brand-subtle uppercase tracking-wider font-semibold">Booking Reference Date</span>
                        <span className="text-xs text-brand-lt-gray flex items-center gap-1.5 md:justify-end">
                          <Calendar size={13} />
                          {new Date(bookingDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                        </span>
                      </div>

                      <div className="mt-2 w-full">
                        {canReview && !hasReviewed ? (
                          <button type="button" onClick={() => openReviewModal(painter._id, requestId, fullName)}
                            className="w-full text-center bg-brand-accent text-brand-black text-xs font-bold py-2.5 px-5 rounded-lg hover:bg-brand-accent-lt transition-all shadow-md">
                            Submit Service Review
                          </button>
                        ) : hasReviewed ? (
                          <div className="text-center md:text-right text-xs font-semibold text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 py-2 px-4 rounded-lg">
                            ✓ Review Submitted
                          </div>
                        ) : (
                          <div className="text-center md:text-right text-xs font-medium text-brand-subtle bg-brand-raised py-2 px-4 rounded-lg border border-brand-border/50">
                            Review window locked
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Optional Bottom Portfolio Image Tray Component */}
                  {painter.portfolioImages && painter.portfolioImages.length > 0 && (
                    <div className="border-t border-brand-border/30 bg-brand-black/20 p-4 px-6 sm:px-8">
                      <p className="text-[10px] uppercase font-bold text-brand-subtle tracking-wider mb-2">Attached Project Gallery</p>
                      <div className="flex gap-3 overflow-x-auto pb-1">
                        {painter.portfolioImages.map((img) => (
                          <div key={img.publicId} className="w-16 h-16 rounded-lg overflow-hidden border border-brand-border bg-brand-raised flex-shrink-0">
                            <img src={img.url} alt="Project portfolio snapshot" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Workflow Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeReviewModal} />
          
          <div className="bg-brand-card border border-brand-border w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-brand-border/60 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-white">Write a Review</h3>
                <p className="text-xs text-brand-mid">Share your feedback for {activePainterName}</p>
              </div>
              <button type="button" onClick={closeReviewModal} className="text-brand-subtle hover:text-white transition-colors p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-5 flex flex-col gap-4">
              
              {/* Star Selection Track */}
              <div className="flex flex-col items-center gap-1.5 py-2 bg-brand-raised rounded-xl border border-brand-border/40">
                <label className="text-xs text-brand-lt-gray font-medium">Rate Service Quality</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setRating(index)}
                      onMouseEnter={() => setHoverRating(index)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-brand-accent p-1 transition-transform transform hover:scale-110 focus:outline-none"
                    >
                      <Star size={26} className={`${
                        index <= (hoverRating || rating) ? "fill-brand-accent" : "text-brand-subtle fill-transparent"
                      } transition-colors`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input Block */}
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-lt-gray text-xs font-medium">Your Review Comment</label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe the speed, quality of finish, cleanliness, and overall experience..."
                  className="w-full bg-brand-raised border border-brand-border text-white placeholder-brand-subtle px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 focus:bg-brand-card transition-all resize-none"
                />
              </div>

              {reviewError && (
                <div className="bg-red-950/50 border border-red-900/40 rounded-lg p-3 text-xs text-red-400">
                  {reviewError}
                </div>
              )}

              <div className="flex items-center gap-3 justify-end mt-2">
                <button type="button" onClick={closeReviewModal}
                  className="px-4 py-2 rounded-lg text-xs font-medium border border-brand-border text-brand-lt-gray hover:bg-brand-raised hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submittingReview}
                  className="bg-brand-accent text-brand-black px-5 py-2 rounded-lg text-xs font-bold hover:bg-brand-accent-lt transition-all disabled:opacity-50 flex items-center gap-1.5">
                  {submittingReview && <div className="w-3 h-3 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />}
                  {submittingReview ? "Posting..." : "Submit Review"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

