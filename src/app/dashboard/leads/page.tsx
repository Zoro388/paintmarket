"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminGetLeads, adminExportLeads } from "@/lib/adminApi";
import { formatDate } from "@/lib/utils";
import { Download, Loader, Search, Users } from "lucide-react";

interface Lead {
  _id: string; fullName: string; emailAddress: string; phoneNumber: string;
  location: string; leadSource: string; message?: string; createdAt: string;
}

const MOCK: Lead[] = [
  { _id: "l1", fullName: "Adaeze Okonkwo", emailAddress: "adaeze@email.com", phoneNumber: "+234 801 234 5678", location: "Lagos", leadSource: "Painter Request", message: "Interested in full home repaint", createdAt: "2025-06-10" },
  { _id: "l2", fullName: "Emeka Nwosu", emailAddress: "emeka@email.com", phoneNumber: "+234 802 345 6789", location: "Abuja", leadSource: "Quote Request", message: "Need quote for commercial building", createdAt: "2025-06-09" },
  { _id: "l3", fullName: "Fatima Bello", emailAddress: "fatima@email.com", phoneNumber: "+234 803 456 7890", location: "Kano", leadSource: "Newsletter", createdAt: "2025-06-08" },
  { _id: "l4", fullName: "Chuka Obi", emailAddress: "chuka@email.com", phoneNumber: "+234 804 567 8901", location: "Port Harcourt", leadSource: "Estimator Request", message: "Booked site inspection", createdAt: "2025-06-07" },
];

const SOURCE_COLORS: Record<string,string> = {
  "Newsletter": "bg-blue-900/40 text-blue-400 border-blue-700/40",
  "Quote Request": "bg-green-900/40 text-green-400 border-green-700/40",
  "Painter Request": "bg-orange-900/40 text-orange-400 border-orange-700/40",
  "Estimator Request": "bg-purple-900/40 text-purple-400 border-purple-700/40",
};

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [exporting, setExporting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      try {
        const res = await adminGetLeads();
        return (res?.leads ?? res?.data ?? []) as Lead[];
      } catch { return MOCK; }
    },
    placeholderData: MOCK,
  });

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await adminExportLeads();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "leads.csv"; a.click();
      URL.revokeObjectURL(url);
      toast.success("Leads exported successfully");
    } catch {
      toast.error("Export failed");
    } finally { setExporting(false); }
  };

  const list = data ?? MOCK;
  const sources = ["all", ...Array.from(new Set(list.map((l) => l.leadSource)))];
  const filtered = list
    .filter((l) => sourceFilter === "all" || l.leadSource === sourceFilter)
    .filter((l) => !search || l.fullName.toLowerCase().includes(search.toLowerCase()) || l.emailAddress.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-white">Customer Leads</h1>
          <p className="text-brand-mid text-sm mt-1">All captured leads across sources</p>
        </div>
        <button onClick={handleExport} disabled={exporting}
          className="flex items-center gap-2 border border-brand-accent text-brand-accent px-4 py-2.5 rounded-md text-sm font-medium hover:bg-brand-accent hover:text-brand-black transition-colors disabled:opacity-50">
          {exporting ? <Loader size={15} className="animate-spin" /> : <Download size={15} />}
          Export CSV
        </button>
      </div>

      {/* Source filter chips */}
      <div className="flex flex-wrap gap-2">
        {sources.map((s) => {
          const count = s === "all" ? list.length : list.filter((l) => l.leadSource === s).length;
          return (
            <button key={s} onClick={() => setSourceFilter(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${sourceFilter === s ? "bg-brand-accent text-brand-black" : "bg-brand-card border border-brand-mid/30 text-brand-mid hover:text-brand-white"}`}>
              <Users size={11} /> {s} ({count})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-brand-card border border-brand-mid/30 rounded-lg px-4 py-2.5 max-w-sm">
        <Search size={14} className="text-brand-mid" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads..."
          className="bg-transparent text-brand-white text-sm placeholder-brand-mid outline-none flex-1" />
      </div>

      {/* Table */}
      <div className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-brand-mid/20 bg-brand-black/40">
                {["Name","Email","Phone","Location","Source","Message","Date"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-brand-mid font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="py-16 text-center"><Loader size={22} className="animate-spin text-brand-accent mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-brand-mid">No leads found</td></tr>
              ) : filtered.map((lead) => (
                <tr key={lead._id} className="border-b border-brand-mid/10 hover:bg-brand-black/20 transition-colors">
                  <td className="px-5 py-4 text-brand-white font-medium whitespace-nowrap">{lead.fullName}</td>
                  <td className="px-5 py-4 text-brand-lt-gray text-xs">{lead.emailAddress}</td>
                  <td className="px-5 py-4 text-brand-lt-gray text-xs whitespace-nowrap">{lead.phoneNumber}</td>
                  <td className="px-5 py-4 text-brand-lt-gray text-xs">{lead.location}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${SOURCE_COLORS[lead.leadSource] ?? "bg-gray-900/40 text-gray-400 border-gray-700/40"}`}>
                      {lead.leadSource}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-brand-mid text-xs max-w-[180px] truncate">{lead.message ?? "—"}</td>
                  <td className="px-5 py-4 text-brand-mid text-xs whitespace-nowrap">{formatDate(lead.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
