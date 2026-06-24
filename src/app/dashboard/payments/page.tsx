"use client";
import { useQuery } from "@tanstack/react-query";
import { adminGetPayments } from "@/lib/adminApi";
import { formatDate, formatCurrency, getStatusColor } from "@/lib/utils";
import { Loader, CreditCard, TrendingUp, TrendingDown } from "lucide-react";

interface Payment {
  _id: string; orderId: string; customerName: string; email: string;
  amount: number; method: string; status: "paid" | "unpaid" | "refunded"; createdAt: string;
}

const MOCK: Payment[] = [
  { _id: "pay1", orderId: "ORD-001", customerName: "Adaeze Okonkwo", email: "adaeze@email.com", amount: 145000, method: "Bank Transfer", status: "paid", createdAt: "2025-06-10" },
  { _id: "pay2", orderId: "ORD-002", customerName: "Emeka Nwosu",    email: "emeka@email.com",  amount: 82500,  method: "Card",          status: "paid", createdAt: "2025-06-11" },
  { _id: "pay3", orderId: "ORD-003", customerName: "Fatima Bello",   email: "fatima@email.com", amount: 230000, method: "Cash on Delivery", status: "unpaid", createdAt: "2025-06-12" },
  { _id: "pay4", orderId: "ORD-004", customerName: "Chuka Obi",      email: "chuka@email.com",  amount: 67000,  method: "Bank Transfer", status: "paid", createdAt: "2025-06-09" },
  { _id: "pay5", orderId: "ORD-005", customerName: "Yusuf Tanko",    email: "yusuf@email.com",  amount: 198000, method: "Card",          status: "refunded", createdAt: "2025-06-08" },
];

export default function PaymentsPage() {
 const { data, isLoading } = useQuery({
  queryKey: ["payments"],
  queryFn: async () => {
    try { 
      const res = await adminGetPayments(); 
      
      // 🚀 Log the response here to inspect it in your browser tools
      console.log('Payments API Response:', res); 
      
      return (res ?? []) as Payment[];   
    } 
    catch (error) {
      console.error('Error fetching payments:', error); 
      return [];
    }
  },
});
  console.log('Payments data:', data);

  // const list = data ?? [];
  // const totalPaid     = list?.filter((p) => p.status === "paid").reduce((a, p) => a + p.amount, 0);
  // const totalUnpaid   = list?.filter((p) => p.status === "unpaid").reduce((a, p) => a + p.amount, 0);
  // const totalRefunded = list?.filter((p) => p.status === "refunded").reduce((a, p) => a + p.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-white">Payment History</h1>
        <p className="text-brand-mid text-sm mt-1">Monitor all transactions</p>
      </div>

      {/* Summary cards */}
      {/* <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(totalPaid), icon: TrendingUp, color: "border-green-700/40 bg-green-900/20", iconColor: "text-green-400" },
          { label: "Pending Payment", value: formatCurrency(totalUnpaid), icon: CreditCard, color: "border-yellow-700/40 bg-yellow-900/20", iconColor: "text-yellow-400" },
          { label: "Refunded", value: formatCurrency(totalRefunded), icon: TrendingDown, color: "border-red-700/40 bg-red-900/20", iconColor: "text-red-400" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`border ${s.color} rounded-xl p-5 flex items-center gap-4`}>
              <div className={`w-12 h-12 rounded-xl bg-brand-black/30 flex items-center justify-center`}>
                <Icon size={22} className={s.iconColor} />
              </div>
              <div>
                <p className="text-brand-mid text-xs">{s.label}</p>
                <p className="text-brand-white font-bold text-xl font-display">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div> */}

      {/* Table */}
      {/* <div className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-brand-mid/20 bg-brand-black/40">
                {["Transaction","Customer","Order","Amount","Method","Status","Date"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-brand-mid font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="py-16 text-center"><Loader size={22} className="animate-spin text-brand-accent mx-auto" /></td></tr>
              ) : list.map((pay) => (
                <tr key={pay._id} className="border-b border-brand-mid/10 hover:bg-brand-black/20 transition-colors">
                  <td className="px-5 py-4 text-brand-mid font-mono text-xs">{pay._id.toUpperCase()}</td>
                  <td className="px-5 py-4">
                    <p className="text-brand-white font-medium whitespace-nowrap">{pay.customerName}</p>
                    <p className="text-brand-mid text-xs">{pay.email}</p>
                  </td>
                  <td className="px-5 py-4 text-brand-accent text-xs font-semibold">{pay.orderId}</td>
                  <td className="px-5 py-4 text-brand-white font-semibold whitespace-nowrap">{formatCurrency(pay.amount)}</td>
                  <td className="px-5 py-4 text-brand-lt-gray text-xs whitespace-nowrap">{pay.method}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(pay.status)}`}>{pay.status}</span>
                  </td>
                  <td className="px-5 py-4 text-brand-mid text-xs whitespace-nowrap">{formatDate(pay.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}
