"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  User, MapPin, Calendar, X, AlertTriangle, ArrowLeft, Search, Filter 
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { 
  painterRequests, 
  acceptPainterRequest, 
  declinePainterRequest 
} from "@/lib/painterApi";
import LoadingSkeleton from "../components/Loading"; // adjust path to point to your component folder
import { formatDate } from "@/lib/utils";

const statusPill: Record<string, string> = {
  accepted: "bg-emerald-950/60 text-emerald-400 border border-emerald-800/50",
  pending:  "bg-yellow-950/60 text-yellow-400 border border-yellow-800/50",
  declined: "bg-red-950/60 text-red-400 border border-red-800/50",
};

interface PainterRequest {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  propertyLocation: string;
  propertyType: string;
  projectType: string;
  projectDescription: string;
  preferredStartDate: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

export default function AllPainterRequestsPage() {
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [declineId, setDeclineId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");

  // Fetch Requests Data
  const { data: requestsData, isLoading } = useQuery<PainterRequest[]>({
    queryKey: ["painter-requests"],
    queryFn: async () => {
      try {
        const res = await painterRequests();
        return (res?.requests ?? []) as PainterRequest[];
      } catch { return []; }
    },
  });

  // Action Mutations
  const acceptMutation = useMutation({
    mutationFn: (id: string) => acceptPainterRequest(id),
    onSuccess: (data) => {
      toast.success(data?.message || "Request accepted successfully.");
      qc.invalidateQueries({ queryKey: ["painter-requests"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err.message || "Failed to accept request");
    }
  });

  const declineMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => declinePainterRequest(id, reason),
    onSuccess: (data) => {
      toast.success(data?.message || "Request declined successfully.");
      setDeclineId(null);
      setDeclineReason("");
      qc.invalidateQueries({ queryKey: ["painter-requests"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err.message || "Failed to decline request");
    }
  });

  if (isLoading) return <LoadingSkeleton />;

  // Search & Filter Logic Execution
  const filteredRequests = (requestsData ?? []).filter((r) => {
    const matchesSearch = 
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.projectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.propertyLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 sm:gap-8 max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-xs text-brand-mid hover:text-white transition-colors w-fit">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Project Request Pipelines</h1>
          <p className="text-brand-mid text-sm mt-0.5">
            Browse, search, filter, and handle all client project offers assigned to your profile.
          </p>
        </div>
      </div>

      {/* Control Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-brand-card p-4 rounded-xl border border-brand-border/60">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-mid" />
          <input
            type="text"
            placeholder="Search by client name, type, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-black border border-brand-border rounded-lg text-xs pl-9 pr-3 py-2.5 text-white placeholder-brand-mid focus:outline-none focus:border-brand-accent transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter size={14} className="text-brand-mid hidden sm:inline" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-40 bg-brand-black border border-brand-border rounded-lg text-xs px-3 py-2.5 text-white focus:outline-none focus:border-brand-accent"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Datatable Wrapper Container */}
      <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-brand-border/30 bg-brand-black/20">
                {["Client Name", "Project Details", "Location", "Desired Start", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-gray-300 font-medium text-[11px] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-brand-mid text-xs">
                    No requests found matching the current search parameters.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((r) => (
                  <tr key={r._id} className="border-b border-brand-border/30 hover:bg-brand-raised/40 transition-colors">
                    {/* Client Information */}
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col">
                        <span className="text-white font-medium text-sm flex items-center gap-1.5"><User size={13} className="text-brand-mid" /> {r.fullName}</span>
                        <span className="text-brand-mid text-xs mt-0.5">{r.phoneNumber}</span>
                      </div>
                    </td>
                    
                    {/* Project Scope Context */}
                    <td className="px-5 py-3.5 max-w-xs">
                      <div className="flex flex-col">
                        <span className="text-brand-accent text-xs font-semibold">{r.projectType} ({r.propertyType})</span>
                        <p className="text-brand-lt-gray text-xs truncate mt-0.5">{r.projectDescription}</p>
                      </div>
                    </td>

                    {/* Geography Meta */}
                    <td className="px-5 py-3.5 text-brand-lt-gray text-sm">
                      <span className="flex items-center gap-1 text-xs text-white"><MapPin size={12} className="text-brand-mid" /> {r.propertyLocation}</span>
                    </td>

                    {/* Calendar Datestamp */}
                    <td className="px-5 py-3.5 text-brand-mid text-xs">
                      <span className="flex items-center gap-1 text-white"><Calendar size={12} className="text-brand-mid" /> {formatDate(r.preferredStartDate)}</span>
                    </td>

                    {/* Request Processing State Flag */}
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize ${statusPill[r.status]}`}>
                        {r.status}
                      </span>
                    </td>

                    {/* Operational Triggers */}
                    <td className="px-5 py-3.5">
                      {r.status === "pending" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { if(confirm("Accept this job request assignment?")) acceptMutation.mutate(r._id); }}
                            disabled={acceptMutation.isPending || declineMutation.isPending}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-brand-black font-semibold rounded-md text-xs transition-colors disabled:opacity-40"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => setDeclineId(r._id)}
                            disabled={acceptMutation.isPending || declineMutation.isPending}
                            className="px-3 py-1.5 bg-red-950/80 border border-red-800 text-red-400 hover:bg-red-900/60 rounded-md text-xs transition-colors disabled:opacity-40"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span className="text-brand-mid text-xs italic">
                          Closed ({formatDate(r.createdAt)})
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decline Reason Action Overlay Backdrop */}
      {declineId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeclineId(null)} />
          <div className="relative z-10 bg-brand-card border border-brand-border rounded-xl p-5 max-w-md w-full shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-400" /> Decline Project Assignment
              </h4>
              <button onClick={() => setDeclineId(null)} className="text-brand-mid hover:text-white transition-colors"><X size={16} /></button>
            </div>
            <p className="text-xs text-brand-mid mb-4">Provide a cancellation statement or availability conflict reasoning below to decline this client request assignment.</p>
            <textarea
              rows={4}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="E.g., I am currently unavailable for the specified window due to prior booking conflicts..."
              className="w-full bg-brand-black border border-brand-border rounded-lg text-sm p-3 text-white placeholder-brand-mid focus:outline-none focus:border-red-500 resize-none mb-4"
            />
            <div className="flex items-center gap-3">
              <button onClick={() => setDeclineId(null)} className="flex-1 py-2 text-xs border border-brand-border text-brand-mid rounded-md hover:text-white transition-colors">Cancel</button>
              <button
                disabled={!declineReason.trim() || declineMutation.isPending}
                onClick={() => declineMutation.mutate({ id: declineId, reason: declineReason })}
                className="flex-1 py-2 text-xs bg-red-600 hover:bg-red-500 text-white font-semibold rounded-md transition-colors disabled:opacity-50"
              >
                {declineMutation.isPending ? "Declining..." : "Confirm Decline"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}