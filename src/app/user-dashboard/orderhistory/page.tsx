"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDate, formatCurrency, getStatusColor, cn } from "@/lib/utils";
import { Eye, X, ShoppingCart, Package } from "lucide-react";
import LoadingSkeleton from "../components/Loading";
import { userGetOrderss } from "@/lib/userApi";

interface Order {
  _id: string; customerName: string; email: string; phoneNumber: string;
  deliveryAddress: string; state: string; city: string;
  orderedProducts: { 
    product?: { _id: string; price: number };
    productName: string; 
    quantity: number; 
    selectedColour: string;
    subtotal?: number;
    unitPrice?: number;
  }[];
  totalAmount: number; paymentMethod: string; paymentStatus: string;
  orderStatus: string; notes?: string; createdAt: string;
}

const ORDER_STATUSES = ["pending","processing","delivered","cancelled"];

function ProductDetailsModal({ orderId, orders, onClose }: { orderId: string | null; orders: Order[]; onClose: () => void }) {
  if (!orderId) return null;
  
  const order = orders.find((o) => o._id === orderId);
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-brand-card border border-brand-border rounded-xl shadow-2xl w-full max-w-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-brand-border/30 sticky top-0 bg-brand-card z-10">
          <h2 className="text-xl font-bold text-brand-white">Order Items</h2>
          <button 
            onClick={onClose} 
            className="text-brand-mid hover:text-brand-white transition-colors p-1 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {order.orderedProducts && order.orderedProducts.length > 0 ? (
            <div className="flex flex-col gap-4">
              {order.orderedProducts.map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-brand-raised border border-brand-border rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-brand-white font-semibold text-lg">{item.productName || "N/A"}</p>
                      {item.product?._id && (
                        <p className="text-brand-mid text-xs mt-1 font-mono">
                          ID: {item.product._id.slice(-12)}
                        </p>
                      )}
                    </div>
                    <Package size={24} className="text-brand-accent" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-brand-black/40 rounded-lg p-3">
                      <p className="text-brand-mid text-xs uppercase tracking-wider mb-1">Quantity</p>
                      <p className="text-brand-white text-lg font-bold">{item.quantity || 0}</p>
                    </div>
                    <div className="bg-brand-black/40 rounded-lg p-3">
                      <p className="text-brand-mid text-xs uppercase tracking-wider mb-1">Colour</p>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded border border-brand-border"
                          style={{ backgroundColor: item.selectedColour?.toLowerCase() || '#ccc' }}
                        />
                        <p className="text-brand-white font-medium capitalize">{item.selectedColour || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 border-t border-brand-border/20 pt-4">
                    <div>
                      <p className="text-brand-mid text-xs uppercase tracking-wider mb-2">Unit Price</p>
                      <p className="text-brand-accent font-bold text-sm">
                        {item.unitPrice ? formatCurrency(item.unitPrice) : item.product?.price ? formatCurrency(item.product.price) : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-brand-mid text-xs uppercase tracking-wider mb-2">Quantity</p>
                      <p className="text-brand-white font-bold text-sm">×{item.quantity}</p>
                    </div>
                    <div className="bg-brand-accent/10 rounded-lg p-2">
                      <p className="text-brand-mid text-xs uppercase tracking-wider mb-2">Subtotal</p>
                      <p className="text-brand-accent font-bold text-sm">
                        {item.subtotal ? formatCurrency(item.subtotal) : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="border-t border-brand-border/30 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <p className="text-brand-white font-semibold text-lg">Order Total</p>
                  <p className="text-brand-accent font-bold text-2xl">{formatCurrency(order.totalAmount || 0)}</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-brand-accent text-brand-black font-semibold py-2.5 rounded-lg hover:bg-brand-accent-lt transition-colors mt-4"
              >
                Close
              </button>
            </div>
          ) : (
            <p className="text-brand-mid text-center py-8">No products in this order</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [detailId, setDetailId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        const res = await userGetOrderss();
        return (res?.orders ?? []) as Order[];
      } catch (error) {
        console.error("userGetOrderss failed:", error);
        throw error;
      }
    },
    retry: 1,
  });

  const list = data ?? [];
  const filtered = list
    .filter((o) => statusFilter === "all" || o.orderStatus === statusFilter)
    .filter((o) => !search || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase()));

  const totalRevenue = list.filter((o) => o.paymentStatus === "paid").reduce((acc, o) => acc + o.totalAmount, 0);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-brand-white">Order History</h1>
        <p className="text-brand-mid">Manage and track all your orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-brand-card border border-brand-border rounded-lg p-4">
          <p className="text-brand-mid text-sm mb-2">Total Orders</p>
          <p className="text-2xl font-bold text-brand-white">{list.length}</p>
        </div>
        <div className="bg-brand-card border border-brand-border rounded-lg p-4">
          <p className="text-brand-mid text-sm mb-2">Total paid orders</p>
          <p className="text-2xl font-bold text-brand-accent">{list.filter((o) => o.paymentStatus === "paid").length}</p>
        </div>
        <div className="bg-brand-card border border-brand-border rounded-lg p-4">
          <p className="text-brand-mid text-sm mb-2">Total Revenue</p>
          <p className="text-2xl font-bold text-brand-accent">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-brand-raised border border-brand-border rounded-lg px-4 py-2.5 text-brand-white placeholder-brand-mid focus:outline-none focus:border-brand-accent"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-brand-raised border border-brand-border rounded-lg px-4 py-2.5 text-brand-white focus:outline-none focus:border-brand-accent"
        >
          <option value="all">All Statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {isError && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-200 text-sm font-medium">Error loading orders</p>
          <p className="text-red-100 text-xs mt-1">{error instanceof Error ? error.message : "Unknown error"}</p>
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-brand-border">
          <table className="w-full text-sm">
            <thead className="bg-brand-raised border-b border-brand-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Order Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filtered.map((order) => (
                <tr key={order._id} className="hover:bg-brand-raised/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-brand-white font-mono text-xs bg-brand-black/40 px-2 py-1 rounded">
                      {order._id?.slice(-8) || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-brand-white font-medium">{order.customerName || "N/A"}</p>
                      <p className="text-brand-mid text-xs">{order.email || "N/A"}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-brand-accent font-semibold">{formatCurrency(order.totalAmount || 0)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-3 py-1.5 rounded-md text-xs font-semibold capitalize",
                      getStatusColor(order.orderStatus)
                    )}>
                      {order.orderStatus || "pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-3 py-1.5 rounded-md text-xs font-semibold capitalize",
                      order.paymentStatus === "paid" 
                        ? "bg-green-500/20 text-green-200" 
                        : "bg-yellow-500/20 text-yellow-200"
                    )}>
                      {order.paymentStatus || "unpaid"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-brand-mid text-xs">
                    {order.createdAt ? formatDate(order.createdAt) : "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setDetailId(order._id)}
                      className="inline-flex items-center gap-1 text-brand-accent hover:text-brand-white transition-colors text-xs font-medium"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-brand-card border border-brand-border rounded-lg p-8 text-center">
          <ShoppingCart size={32} className="mx-auto mb-3 text-brand-mid opacity-50" />
          <p className="text-brand-white font-medium mb-1">No orders found</p>
          <p className="text-brand-mid text-sm">
            {search || statusFilter !== "all" ? "Try adjusting your filters" : "You haven't placed any orders yet"}
          </p>
        </div>
      )}

      <ProductDetailsModal orderId={detailId} orders={list} onClose={() => setDetailId(null)} />
    </div>
  );
}

      {/* Search & Filter */}
      // <div className="flex flex-col md:flex-row gap-3">
      //   <input
      //     type="text"
      //     placeholder="Search by name or email..."
      //     value={search}
      //     onChange={(e) => setSearch(e.target.value)}
      //     className="flex-1 bg-brand-raised border border-brand-border rounded-lg px-4 py-2.5 text-brand-white placeholder-brand-mid focus:outline-none focus:border-brand-accent"
      //   />
      //   <select
      //     value={statusFilter}
      //     onChange={(e) => setStatusFilter(e.target.value)}
      //     className="bg-brand-raised border border-brand-border rounded-lg px-4 py-2.5 text-brand-white focus:outline-none focus:border-brand-accent"
      //   >
      //     <option value="all">All Statuses</option>
      //     {ORDER_STATUSES.map((s) => (
      //       <option key={s} value={s}>
      //         {s.charAt(0).toUpperCase() + s.slice(1)}
      //       </option>
      //     ))}
      //   </select>
      // </div>

//       {/* Error State */}
//       {isError && (
//         <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
//           <p className="text-red-200 text-sm font-medium">Error loading orders</p>
//           <p className="text-red-100 text-xs mt-1">{error instanceof Error ? error.message : "Unknown error"}</p>
//         </div>
//       )}

//       {/* Loading State */}
//       {isLoading && <LoadingSkeleton />}

//       {/* Orders Table */}
//       {!isLoading && !isError && (
//         <>
//           {filtered.length > 0 ? (
//             <div className="overflow-x-auto rounded-lg border border-brand-border">
//               <table className="w-full text-sm">
//                 <thead className="bg-brand-raised border-b border-brand-border">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Order ID</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Customer</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Amount</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Order Status</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Payment</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Date</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-brand-mid uppercase tracking-wider">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-brand-border">
//                   {filtered.map((order) => (
//                     <tr key={order._id} className="hover:bg-brand-raised/50 transition-colors">
//                       <td className="px-4 py-3">
//                         <span className="text-brand-white font-mono text-xs bg-brand-black/40 px-2 py-1 rounded">
//                           {order._id?.slice(-8) || "N/A"}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div>
//                           <p className="text-brand-white font-medium">{order.customerName || "N/A"}</p>
//                           <p className="text-brand-mid text-xs">{order.email || "N/A"}</p>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <p className="text-brand-accent font-semibold">{formatCurrency(order.totalAmount || 0)}</p>
//                       </td>
//                       <td className="px-4 py-3">
//                         <span className={cn(
//                           "px-3 py-1.5 rounded-md text-xs font-semibold capitalize",
//                           getStatusColor(order.orderStatus)
//                         )}>
//                           {order.orderStatus || "pending"}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <span className={cn(
//                           "px-3 py-1.5 rounded-md text-xs font-semibold capitalize",
//                           order.paymentStatus === "paid" 
//                             ? "bg-green-500/20 text-green-200" 
//                             : "bg-yellow-500/20 text-yellow-200"
//                         )}>
//                           {order.paymentStatus || "unpaid"}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-brand-mid text-xs">
//                         {order.createdAt ? formatDate(order.createdAt) : "N/A"}
//                       </td>
//                       <td className="px-4 py-3">
//                         <button
//                           onClick={() => setDetailId(order._id)}
//                           className="inline-flex items-center gap-1 text-brand-accent hover:text-brand-white transition-colors text-xs font-medium"
//                         >
//                           <Eye size={14} />
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="bg-brand-card border border-brand-border rounded-lg p-8 text-center">
//               <ShoppingCart size={32} className="mx-auto mb-3 text-brand-mid opacity-50" />
//               <p className="text-brand-white font-medium mb-1">No orders found</p>
//               <p className="text-brand-mid text-sm">
//                 {search || statusFilter !== "all" ? "Try adjusting your filters" : "You haven't placed any orders yet"}
//               </p>
//             </div>
//           )}
//         </>
//       )}

//       {/* Product Details Modal */}
//       <ProductDetailsModal orderId={detailId} orders={list} onClose={() => setDetailId(null)} />
//     </div>
//   );
// }
// function setStatusFilter(value: string): void {
//   throw new Error("Function not implemented.");
// }

