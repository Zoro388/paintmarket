"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Search, User, Loader } from "lucide-react";

interface Customer {
  _id: string; firstName: string; lastName: string; email: string;
  phoneNumber: string; profileImage?: string; createdAt: string;
  totalOrders?: number; totalSpent?: number;
}

const MOCK: Customer[] = [
  { _id: "c1", firstName: "Adaeze", lastName: "Okonkwo", email: "adaeze@email.com", phoneNumber: "+234 801 234 5678", createdAt: "2025-01-15", totalOrders: 5, totalSpent: 420000 },
  { _id: "c2", firstName: "Emeka",  lastName: "Nwosu",   email: "emeka@email.com",  phoneNumber: "+234 802 345 6789", createdAt: "2025-02-20", totalOrders: 3, totalSpent: 187500 },
  { _id: "c3", firstName: "Fatima", lastName: "Bello",   email: "fatima@email.com", phoneNumber: "+234 803 456 7890", createdAt: "2025-03-10", totalOrders: 8, totalSpent: 690000 },
  { _id: "c4", firstName: "Chuka",  lastName: "Obi",     email: "chuka@email.com",  phoneNumber: "+234 804 567 8901", createdAt: "2025-04-05", totalOrders: 2, totalSpent: 95000 },
  { _id: "c5", firstName: "Yusuf",  lastName: "Tanko",   email: "yusuf@email.com",  phoneNumber: "+234 805 678 9012", createdAt: "2025-05-22", totalOrders: 1, totalSpent: 198000 },
];

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async (): Promise<Customer[]> => MOCK,
    placeholderData: MOCK,
  });

  const list = data ?? MOCK;
  const filtered = !search ? list : list.filter((c) =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalSpent = list.reduce((a, c) => a + (c.totalSpent ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-white">Customers</h1>
          <p className="text-brand-mid text-sm mt-1">All registered customer accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center bg-brand-card border border-brand-mid/30 rounded-lg px-4 py-2">
            <p className="text-brand-accent font-bold">{list.length}</p>
            <p className="text-brand-mid text-xs">Total Customers</p>
          </div>
          <div className="text-center bg-brand-card border border-brand-mid/30 rounded-lg px-4 py-2">
            <p className="text-brand-accent font-bold">{formatCurrency(totalSpent)}</p>
            <p className="text-brand-mid text-xs">Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-brand-card border border-brand-mid/30 rounded-lg px-4 py-2.5 max-w-sm">
        <Search size={14} className="text-brand-mid" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..."
          className="bg-transparent text-brand-white text-sm placeholder-brand-mid outline-none flex-1" />
      </div>

      <div className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-brand-mid/20 bg-brand-black/40">
                {["Customer","Email","Phone","Orders","Total Spent","Joined"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-brand-mid font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="py-16 text-center"><Loader size={22} className="animate-spin text-brand-accent mx-auto" /></td></tr>
              ) : filtered.map((c) => (
                <tr key={c._id} className="border-b border-brand-mid/10 hover:bg-brand-black/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-accent flex items-center justify-center text-brand-black font-bold text-sm flex-shrink-0">
                        {c.firstName[0]}{c.lastName[0]}
                      </div>
                      <div>
                        <p className="text-brand-white font-medium whitespace-nowrap">{c.firstName} {c.lastName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-brand-lt-gray text-xs">{c.email}</td>
                  <td className="px-5 py-4 text-brand-lt-gray text-xs whitespace-nowrap">{c.phoneNumber}</td>
                  <td className="px-5 py-4 text-center">
                    <span className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs px-2.5 py-0.5 rounded-full font-semibold">{c.totalOrders ?? 0}</span>
                  </td>
                  <td className="px-5 py-4 text-brand-white font-semibold">{formatCurrency(c.totalSpent ?? 0)}</td>
                  <td className="px-5 py-4 text-brand-mid text-xs whitespace-nowrap">{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
