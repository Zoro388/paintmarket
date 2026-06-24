"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  adminGetSiteEstimators,
  adminUpdateSiteEstimatorStatus,
  // adminReplySiteEstimator,
} from "@/lib/adminApi";
import LoadingSkeleton from "../components/Loading";
import { formatDate, getStatusColor } from "@/lib/utils";
import { MessageCircle, Eye, ChevronDown, Send, X, Loader, Calendar, MapPin } from "lucide-react";
import endpointRoute from "@/lib/endpointRoute";

interface SiteEstimator {
  _id: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  propertyLocation: string;
  projectType: string;
  preferredInspectionDate: string;
  additionalNotes?: string;
  status: string;
  createdAt: string;
  inspectionDate: string;
}

const statuses = [ "cancelled", "quoted"];

//  export const adminReplySiteEstimator = (id: string, body: { adminResponse: string; status: string; estimateAmount: number }) =>
//   endpointRoute.patch(`/site-estimator/${id}/respond`, body).then((r) => r.data);

 // Change the name here to something unique
const localAdminReplySiteEstimator = (id: string, body: { adminResponse: string; status: string; estimateAmount: number }) =>
  endpointRoute.patch(`/site-estimator/${id}/respond`, body).then((r) => r.data);

// ─── Reply Modal ──────────────────────────────────────────────────────────────
function ReplyModal({ estimator, onClose }: { estimator: SiteEstimator; onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [estimateAmount, setEstimateAmount] = useState(0);

 const replyMutation = useMutation({
    mutationFn: (msg: string) => {
      const payload = { 
        adminResponse: msg, 
        status: "quoted", 
        estimateAmount: estimateAmount 
      };
      
      console.log("Sending to server:", payload); // log here
      console.log("Estimator ID:", estimator._id);
      
      return localAdminReplySiteEstimator(estimator._id, payload);
    },
    onSuccess: () => {
      setSent(true);
      toast.success(`Reply sent to ${estimator.fullName}`);
    },
    onError: (err: Error) => toast.error(err.message || "Failed to send reply"),
});
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-brand-card border border-brand-mid rounded-xl shadow-2xl w-full max-w-lg animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-mid/30">
          <div>
            <h3 className="text-lg font-semibold text-brand-white font-display">Reply to Estimator Request</h3>
            <p className="text-brand-mid text-xs mt-0.5">{estimator.fullName} · {estimator.emailAddress}</p>
          </div>
          <button onClick={onClose} className="text-brand-mid hover:text-brand-white p-1 rounded transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Summary card */}
          <div className="bg-brand-black/50 border border-brand-mid/20 rounded-lg p-4">
            <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider mb-3">Booking Summary</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <span className="text-brand-mid">Project Type:</span>
              <span className="text-brand-white">{estimator.projectType}</span>
              <span className="text-brand-mid">Location:</span>
              <span className="text-brand-white">{estimator.propertyLocation}</span>
              <span className="text-brand-mid">Inspection Date:</span>
              <span className="text-brand-white">{formatDate(estimator.preferredInspectionDate)}</span>
              <span className="text-brand-mid">Status:</span>
              <span className="text-brand-white capitalize">{estimator.status}</span>
            </div>
            {estimator.additionalNotes && (
              <div className="mt-3 pt-3 border-t border-brand-mid/20">
                <p className="text-brand-mid text-xs mb-1">Notes from client:</p>
                <p className="text-brand-lt-gray text-xs leading-relaxed">{estimator.additionalNotes}</p>
              </div>
            )}
          </div>

          {sent ? (
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-5 text-center flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-700/30 flex items-center justify-center">
                <Send size={18} className="text-green-400" />
              </div>
              <p className="text-green-400 font-semibold">Reply Sent Successfully!</p>
              <p className="text-brand-mid text-xs">Your message has been sent to {estimator.fullName}</p>
              <button onClick={onClose} className="text-brand-accent text-sm mt-1 hover:underline">Close</button>
            </div>
          ) : (
            <>

            <div>
              <label className="text-brand-lt-gray text-sm font-medium">Estimated Amount (₦)</label>
              <input
                type="number"
                value={estimateAmount}
                onChange={(e) => setEstimateAmount(Number(e.target.value))}
                className="bg-brand-black border border-brand-mid text-brand-white placeholder-brand-mid/60 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-lt-gray text-sm font-medium">Your Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  placeholder={`Dear ${estimator.fullName},\n\nThank you for booking a site inspection with us. We are pleased to confirm your appointment...`}
                  className="bg-brand-black border border-brand-mid text-brand-white placeholder-brand-mid/60 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-brand-accent resize-none transition-colors"
                />
                <p className="text-brand-mid text-xs text-right">{message.length} chars</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 border border-brand-mid text-brand-mid py-2.5 rounded-md text-sm hover:border-brand-white hover:text-brand-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => replyMutation.mutate(message)}
                  disabled={replyMutation.isPending || !message.trim()}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-accent text-brand-black font-semibold py-2.5 rounded-md text-sm hover:bg-brand-accent-lt transition-colors disabled:opacity-50"
                >
                  {replyMutation.isPending ? <Loader size={15} className="animate-spin" /> : <Send size={15} />}
                  {replyMutation.isPending ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ estimator, onClose }: { estimator: SiteEstimator; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-brand-card border border-brand-mid rounded-xl shadow-2xl w-full max-w-lg animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-brand-mid/30 sticky top-0 bg-brand-card">
          <h3 className="text-lg font-semibold text-brand-white font-display">Estimator Booking Details</h3>
          <button onClick={onClose} className="text-brand-mid hover:text-brand-white p-1 rounded transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-1 text-sm">
          {([
            ["Full Name", estimator.fullName],
            ["Phone Number", estimator.phoneNumber],
            ["Email Address", estimator.emailAddress],
            ["Property Location", estimator.propertyLocation],
            ["Project Type", estimator.projectType],
            ["Inspection Date", formatDate(estimator.inspectionDate)],
            ["Status", estimator.status],
            ["Submitted", formatDate(estimator.createdAt)],
          ] as [string, string][]).map(([k, v]) => (
            <div key={k} className="flex justify-between py-2.5 border-b border-brand-mid/10">
              <span className="text-brand-mid">{k}</span>
              <span className="text-brand-white text-right max-w-[240px]">{v}</span>
            </div>
          ))}
          {estimator.additionalNotes && (
            <div className="pt-3">
              <p className="text-brand-mid mb-2 font-medium">Additional Notes</p>
              <p className="text-brand-lt-gray leading-relaxed bg-brand-black/40 rounded-lg p-3 text-xs">
                {estimator.additionalNotes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SiteEstimatorsPage() {
  const qc = useQueryClient();
  const [replyTarget, setReplyTarget]   = useState<SiteEstimator | null>(null);
  const [detailTarget, setDetailTarget] = useState<SiteEstimator | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["site-estimators"],
    queryFn: async () => {
      try {
        const res = await adminGetSiteEstimators();
        console.log(res?.requests);
        return (res?.requests ?? []) as SiteEstimator[];
      } catch {
        return [];
      }
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminUpdateSiteEstimatorStatus(id, { status }),
    onSuccess: (_, { id, status }) => {
      qc.setQueryData(["site-estimators"], (old: SiteEstimator[] = []) =>
        old.map((r) => (r._id === id ? { ...r, status } : r))
      );
      toast.success("Status updated");
    },
    onError: (err: Error) => toast.error(err.message || "Update failed"),
  });

  // const list = data ?? MOCK;
  const list: SiteEstimator[] = Array.isArray(data) ? data : [];
  const filtered = statusFilter === "all" ? list : list.filter((r) => r.status === statusFilter);

  if (isLoading) return <LoadingSkeleton />;
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-white">Site Estimator Bookings</h1>
          <p className="text-brand-mid text-sm mt-1">Manage on-site inspection requests</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-brand-mid bg-brand-card border border-brand-mid/30 rounded-lg px-3 py-2">
          <Calendar size={13} className="text-brand-accent" />
          <span>{filtered.length} booking{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Stat chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {["all", ...statuses].map((s) => {
          const count = s === "all" ? list.length : list.filter((r) => r.status === s).length;
          const colors: Record<string, string> = {
            all: "border-brand-accent/40 bg-brand-accent/10 text-brand-accent",
            pending: "border-yellow-700/40 bg-yellow-900/20 text-yellow-400",
            confirmed: "border-blue-700/40 bg-blue-900/20 text-blue-400",
            completed: "border-green-700/40 bg-green-900/20 text-green-400",
            cancelled: "border-red-700/40 bg-red-900/20 text-red-400",
          };
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex flex-col items-start px-4 py-3 rounded-xl border transition-all text-left ${
                statusFilter === s
                  ? colors[s] + " ring-1 ring-current/30"
                  : "border-brand-mid/20 bg-brand-card text-brand-mid hover:border-brand-mid/50"
              }`}
            >
              <span className="text-xl font-bold font-display">{count}</span>
              <span className="text-xs capitalize mt-0.5">{s}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-brand-mid/20 bg-brand-black/40">
                {["Customer", "Contact", "Project Type", "Location", "Inspection Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-brand-mid font-medium text-xs whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <Loader size={22} className="animate-spin text-brand-accent mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-brand-mid">
                    No estimator bookings found
                  </td>
                </tr>
              ) : filtered.map((est) => (
                <tr key={est._id} className="border-b border-brand-mid/10 hover:bg-brand-black/20 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-brand-white font-medium whitespace-nowrap">{est.fullName}</p>
                    <p className="text-brand-mid text-xs mt-0.5">{formatDate(est.createdAt)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-brand-lt-gray text-xs whitespace-nowrap">{est.phoneNumber}</p>
                    <p className="text-brand-mid text-xs">{est.emailAddress}</p>
                  </td>
                  <td className="px-5 py-4 text-brand-lt-gray whitespace-nowrap">{est.projectType}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 text-brand-lt-gray text-xs max-w-[160px]">
                      <MapPin size={11} className="text-brand-accent flex-shrink-0" />
                      <span className="truncate">{est.propertyLocation}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 text-brand-lt-gray text-xs whitespace-nowrap">
                      <Calendar size={11} className="text-brand-accent" />
                      {formatDate(est.
inspectionDate
)}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative w-fit">
                      <select
                        value={est.status}
                        disabled={statusMutation.isPending}
                        onChange={(e) => statusMutation.mutate({ id: est._id, status: e.target.value })}
                        className={`appearance-none text-xs font-medium px-3 py-1.5 pr-7 rounded-full border cursor-pointer focus:outline-none bg-transparent ${getStatusColor(est.status)}`}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s} className="bg-brand-card text-brand-white capitalize">{s}</option>
                        ))}
                      </select>
                      <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <button
                        onClick={() => setDetailTarget(est)}
                        title="View details"
                        className="p-1.5 text-brand-mid hover:text-brand-white hover:bg-brand-black/50 rounded-md transition-colors"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => setReplyTarget(est)}
                        className="flex items-center gap-1.5 bg-brand-accent/10 hover:bg-brand-accent/20 border border-brand-accent/30 hover:border-brand-accent/60 text-brand-accent px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
                      >
                        <MessageCircle size={13} />
                        Reply
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {replyTarget  && <ReplyModal  estimator={replyTarget}  onClose={() => setReplyTarget(null)}  />}
      {detailTarget && <DetailModal estimator={detailTarget} onClose={() => setDetailTarget(null)} />}
    </div>
  );
}
