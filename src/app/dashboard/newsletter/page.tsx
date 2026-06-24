"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminGetSubscribers } from "@/lib/adminApi";
import { formatDate } from "@/lib/utils";
import {  Loader, Mail, Search } from "lucide-react";

interface Subscriber { _id: string; email: string; createdAt: string; }



export default function NewsletterPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["subscribers"],
    queryFn: async () => {
      try { const res = await adminGetSubscribers(); return (res?.subscribers ?? res?.data ?? []) as Subscriber[]; }
      catch { return []; }
    },
  });

  // const handleExport = async () => {
  //   setExporting(true);
  //   try {
  //     const blob = await adminExportSubscribers();
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a"); a.href = url; a.download = "subscribers.csv"; a.click();
  //     URL.revokeObjectURL(url);
  //     toast.success("Subscribers exported");
  //   } catch { toast.error("Export failed"); }
  //   finally { setExporting(false); }
  // };

  const list = data ?? [];
  const filtered = !search ? list : list.filter((s) => s.email.toLowerCase().includes(search.toLowerCase()));

  if (isLoading) return (
    <div className="flex items-center justify-center h-full">
      <Loader size={22} className="animate-spin text-brand-accent" />
    </div>
  );
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-white">Newsletter Subscribers</h1>
          <p className="text-brand-mid text-sm mt-1">All email subscribers</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-lg px-4 py-2 text-center">
            <p className="text-brand-accent font-bold text-xl">{list.length}</p>
            <p className="text-brand-mid text-xs">Subscribers</p>
          </div>
         
        </div>
      </div>

      <div className="flex items-center gap-2 bg-brand-card border border-brand-mid/30 rounded-lg px-4 py-2.5 max-w-sm">
        <Search size={14} className="text-brand-mid" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search subscribers..."
          className="bg-transparent text-brand-white text-sm placeholder-brand-mid outline-none flex-1" />
      </div>

      <div className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-mid/20 bg-brand-black/40">
                <th className="text-left px-5 py-3.5 text-brand-mid font-medium text-xs">#</th>
                <th className="text-left px-5 py-3.5 text-brand-mid font-medium text-xs">Email Address</th>
                <th className="text-left px-5 py-3.5 text-brand-mid font-medium text-xs">Subscribed Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={3} className="py-16 text-center"><Loader size={22} className="animate-spin text-brand-accent mx-auto" /></td></tr>
              ) : filtered.map((sub, i) => (
                <tr key={sub._id} className="border-b border-brand-mid/10 hover:bg-brand-black/20 transition-colors">
                  <td className="px-5 py-4 text-brand-mid text-xs">{i + 1}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center">
                        <Mail size={13} className="text-brand-accent" />
                      </div>
                      <span className="text-brand-white">{sub.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-brand-mid text-xs">{formatDate(sub.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
