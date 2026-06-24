"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminGetOrders, adminGetOrder, adminUpdateOrderStatus } from "@/lib/adminApi";
import { formatDate, formatCurrency, getStatusColor } from "@/lib/utils";
import { Eye, ChevronDown, X, Loader, ShoppingCart, Package } from "lucide-react";
import LoadingSkeleton from "../components/Loading";
interface Order {
  _id: string; customerName: string; email: string; phoneNumber: string;
  deliveryAddress: string; state: string; city: string;
  orderedProducts: { name: string; quantity: number; selectedColour: string }[];
  totalAmount: number; paymentMethod: string; paymentStatus: string;
  orderStatus: string; notes?: string; createdAt: string;
}

console.log('omo')
const ORDER_STATUSES = ["pending","processing","delivered","cancelled"];
// const PAYMENT_STATUSES = ["unpaid","paid","refunded"];



// function OrderDetailModal({ orderId, onClose }: { orderId: string; onClose: () => void }) {
//   const { data: order, isLoading } = useQuery({

//     queryKey: ["order", orderId],
//     queryFn: async () => {
//       try { return await adminGetOrder(orderId); }
//       catch { return [] }
//     },
//   });
// console.log('detail order',order)
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative z-10 bg-brand-card border border-brand-mid rounded-xl shadow-2xl w-full max-w-xl animate-fade-in max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-5 border-b border-brand-mid/30 sticky top-0 bg-brand-card z-10">
//           <h3 className="font-display text-lg font-bold text-brand-white">Order Details</h3>
//           <button onClick={onClose} className="text-brand-mid hover:text-brand-white p-1 rounded transition-colors"><X size={18} /></button>
//         </div>
//         <div className="p-5">
//           {isLoading ? (
//             <div className="py-12 flex justify-center"><Loader size={24} className="animate-spin text-brand-accent" /></div>
//           ) : order ? (
//             <div className="flex flex-col gap-5 text-sm">
//               {/* Customer info */}
//               <div>
//                 <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider mb-3">Customer Information</p>
//                 <div className="grid grid-cols-2 gap-x-4 gap-y-2">
//                   {[["Name", order.customerName],["Email", order.email],["Phone", order.phoneNumber],["City", `${order.city}, ${order.state}`]].map(([k,v]) => (
//                     <div key={k}><p className="text-brand-mid text-xs">{k}</p><p className="text-brand-white">{v}</p></div>
//                   ))}
//                 </div>
//                 <div className="mt-2"><p className="text-brand-mid text-xs">Delivery Address</p><p className="text-brand-white">{order.deliveryAddress}</p></div>
//               </div>
//               {/* Products */}
//               <div>
//                 <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider mb-3">Ordered Products</p>
//                 <div className="flex flex-col gap-2">
//                   {order.orderedProducts?.map((p: Order["orderedProducts"][0], i: number) => (
//                     <div key={i} className="flex items-center justify-between bg-brand-black/40 rounded-lg px-4 py-3">
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-md bg-brand-accent/20 flex items-center justify-center">
//                           <Package size={14} className="text-brand-accent" />
//                         </div>
//                         <div>
//                           <p className="text-brand-white font-medium">{p.name}</p>
//                           <p className="text-brand-mid text-xs">Colour: {p.selectedColour}</p>
//                         </div>
//                       </div>
//                       <p className="text-brand-lt-gray text-sm">×{p.quantity}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               {/* Summary */}
//               <div className="flex flex-col gap-2 border-t border-brand-mid/20 pt-4">
//                 {[["Payment Method", order.paymentMethod],["Payment Status", order.paymentStatus],["Order Status", order.orderStatus]].map(([k,v]) => (
//                   <div key={k} className="flex justify-between"><span className="text-brand-mid">{k}</span><span className="text-brand-white capitalize">{v}</span></div>
//                 ))}
//                 <div className="flex justify-between border-t border-brand-mid/20 pt-2 mt-1">
//                   <span className="text-brand-mid font-semibold">Total Amount</span>
//                   <span className="text-brand-accent font-bold text-lg">{formatCurrency(order.totalAmount)}</span>
//                 </div>
//               </div>
//               {order.notes && <div className="bg-brand-black/40 rounded-lg p-3"><p className="text-brand-mid text-xs mb-1">Notes</p><p className="text-brand-lt-gray text-xs">{order.notes}</p></div>}
//             </div>
//           ) : <p className="text-brand-mid text-center py-8">Order not found</p>}
//         </div>
//       </div>
//     </div>
//   );
// }

function OrderDetailModal({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      try { 
        const res = await adminGetOrder(orderId); 
        // 👇 FIX: Dig into the response object to get the real order data
        return res?.order || res?.data || null; 
      }
      catch { 
        return null; // A single order is an object or null, not an array []
      }
    },
  });

  console.log('detail order data:', order); // This will now log the actual order object

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-brand-card border border-brand-mid rounded-xl shadow-2xl w-full max-w-xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-brand-mid/30 sticky top-0 bg-brand-card z-10">
          <h3 className="font-display text-lg font-bold text-brand-white">Order Details</h3>
          <button onClick={onClose} className="text-brand-mid hover:text-brand-white p-1 rounded transition-colors"><X size={18} /></button>
        </div>
        <div className="p-5">
          {isLoading ? (
            <div className="py-12 flex justify-center"><Loader size={24} className="animate-spin text-brand-accent" /></div>
          ) : order ? (
            <div className="flex flex-col gap-5 text-sm">
              {/* Customer info */}
              <div>
                <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider mb-3">Customer Information</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {[["Name", order.customerName],["Email", order.email],["Phone", order.phoneNumber],["City", `${order.city}, ${order.state}`]].map(([k,v]) => (
                    <div key={k}><p className="text-brand-mid text-xs">{k}</p><p className="text-brand-white">{v}</p></div>
                  ))}
                </div>
                <div className="mt-2"><p className="text-brand-mid text-xs">Delivery Address</p><p className="text-brand-white">{order.deliveryAddress}</p></div>
              </div>
              {/* Products */}
              <div>
                <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider mb-3">Ordered Products</p>
                <div className="flex flex-col gap-2">
                  {order.orderedProducts?.map((p: Order["orderedProducts"][0], i: number) => (
                    <div key={i} className="flex items-center justify-between bg-brand-black/40 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-brand-accent/20 flex items-center justify-center">
                          <Package size={14} className="text-brand-accent" />
                        </div>
                        <div>
                          <p className="text-brand-white font-medium">{p.name}</p>
                          <p className="text-brand-mid text-xs">Colour: {p.selectedColour}</p>
                        </div>
                      </div>
                      <p className="text-brand-lt-gray text-sm">×{p.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Summary */}
              <div className="flex flex-col gap-2 border-t border-brand-mid/20 pt-4">
                {[["Payment Method", order.paymentMethod],["Payment Status", order.paymentStatus],["Order Status", order.orderStatus]].map(([k,v]) => (
                  <div key={k} className="flex justify-between"><span className="text-brand-mid">{k}</span><span className="text-brand-white capitalize">{v}</span></div>
                ))}
                <div className="flex justify-between border-t border-brand-mid/20 pt-2 mt-1">
                  <span className="text-brand-mid font-semibold">Total Amount</span>
                  <span className="text-brand-accent font-bold text-lg">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
              {order.notes && <div className="bg-brand-black/40 rounded-lg p-3"><p className="text-brand-mid text-xs mb-1">Notes</p><p className="text-brand-lt-gray text-xs">{order.notes}</p></div>}
            </div>
          ) : <p className="text-brand-mid text-center py-8">Order not found</p>}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const qc = useQueryClient();
  const [detailId, setDetailId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        const res = await adminGetOrders();
        return (res?.orders ?? res?.data ?? []) as Order[];
      } catch { return []; }
    },
  });

  console.log('data',data)

//   •	GET /orders/:id
// •	PATCH /orders/:id/status
// {
//   "orderStatus":"processing"
// }

  const statusMutation = useMutation({
    mutationFn: ({ id, orderStatus }: { id: string; orderStatus: string }) => adminUpdateOrderStatus(id, { orderStatus }),
    onSuccess: (_, { id, orderStatus }) => {
      qc.setQueryData(["orders"], (old: Order[] = []) => old.map((o) => o._id === id ? { ...o, orderStatus: orderStatus } : o));
      toast.success("Order status updated");
    },
    onError: (err: Error) => toast.error(err.message || "Update failed"),
  });

  const list = data ?? [];
  const filtered = list
    .filter((o) => statusFilter === "all" || o.orderStatus === statusFilter)
    .filter((o) => !search || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase()));

  const totalRevenue = list.filter((o) => o.paymentStatus === "paid").reduce((acc, o) => acc + o.totalAmount, 0);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-white">Orders</h1>
          <p className="text-brand-mid text-sm mt-1">Track and manage all customer orders</p>
        </div>
        <div className="flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/30 rounded-lg px-4 py-2">
          <span className="text-brand-mid text-xs">Total Revenue:</span>
          <span className="text-brand-accent font-bold">{formatCurrency(totalRevenue)}</span>
        </div>
      </div>


      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {["all", ...ORDER_STATUSES].map((s) => {
          const count = s === "all" ? list.length : list.filter((o) => o.orderStatus === s).length;
          const active = statusFilter === s;
          const colors: Record<string,string> = { all:"border-brand-accent/40 bg-brand-accent/10 text-brand-accent", pending:"border-yellow-700/40 bg-yellow-900/20 text-yellow-400", confirmed:"border-blue-700/40 bg-blue-900/20 text-blue-400", processing:"border-purple-700/40 bg-purple-900/20 text-purple-400", delivered:"border-green-700/40 bg-green-900/20 text-green-400", cancelled:"border-red-700/40 bg-red-900/20 text-red-400" };
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`flex flex-col items-center py-3 rounded-xl border transition-all text-center ${active ? colors[s]+" ring-1 ring-current/30" : "border-brand-mid/20 bg-brand-card text-brand-mid hover:border-brand-mid/50"}`}>
              <span className="text-xl font-bold font-display">{count}</span>
              <span className="text-[10px] capitalize mt-0.5">{s}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-brand-card border border-brand-mid/30 rounded-lg px-4 py-2.5 max-w-sm">
        <ShoppingCart size={14} className="text-brand-mid" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..."
          className="bg-transparent text-brand-white text-sm placeholder-brand-mid outline-none flex-1" />
      </div>

      {/* Table */}
      <div className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-brand-mid/20 bg-brand-black/40">
                {["Order ID","Customer","Amount","Payment","Order Status","Date","Action"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-brand-mid font-medium text-xs whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="py-16 text-center"><Loader size={22} className="animate-spin text-brand-accent mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-brand-mid">No orders found</td></tr>
              ) : filtered.map((order) => (
                <tr key={order._id} className="border-b border-brand-mid/10 hover:bg-brand-black/20 transition-colors">
                  <td className="px-5 py-4 text-brand-accent font-medium font-mono text-xs">{order._id.toUpperCase()}</td>
                  <td className="px-5 py-4">
                    <p className="text-brand-white font-medium whitespace-nowrap">{order.customerName}</p>
                    <p className="text-brand-mid text-xs">{order.email}</p>
                  </td>
                  <td className="px-5 py-4 text-brand-white font-semibold whitespace-nowrap">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.paymentStatus)}`}>{order.paymentStatus}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative w-fit">
                      <select value={order.orderStatus} disabled={statusMutation.isPending}
                        onChange={(e) => statusMutation.mutate({ id: order._id, orderStatus: e.target.value })}
                        className={`appearance-none text-xs font-medium px-3 py-1.5 pr-7 rounded-full border cursor-pointer focus:outline-none bg-transparent ${getStatusColor(order.orderStatus)}`}>
                        {ORDER_STATUSES.map((s) => <option key={s} value={s} className="bg-brand-card text-brand-white capitalize">{s}</option>)}
                      </select>
                      <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-brand-mid text-xs whitespace-nowrap">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => setDetailId(order._id)}
                      className="flex items-center gap-1.5 text-brand-mid hover:text-brand-white hover:bg-brand-black/50 px-3 py-1.5 rounded-md text-xs transition-colors">
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {detailId && <OrderDetailModal orderId={detailId} onClose={() => setDetailId(null)} />}
    </div>
  );
}
