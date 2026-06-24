

"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminGetEnquiries, adminReplyContact } from "@/lib/adminApi";
import { formatDate } from "@/lib/utils";
import { Eye, X, Loader, MessageSquare, Search, Send, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

interface Enquiry {
  _id: string; 
  fullName: string; 
  email: string; 
  phoneNumber: string;
  subject: string; 
  message: string; 
  status: "new" | "read" | "resolved" | "pending" | "reviewed" | "rejected"; 
  createdAt: string;
}



const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-900/40 text-blue-400 border-blue-700/40",
  pending: "bg-blue-900/40 text-blue-400 border-blue-700/40",
  read: "bg-gray-700/40 text-gray-400 border-gray-600/40",
  reviewed: "bg-gray-700/40 text-gray-400 border-gray-600/40",
  resolved: "bg-green-900/40 text-green-400 border-green-700/40",
  rejected: "bg-red-900/40 text-red-400 border-red-700/40",
};

function EnquiryModal({ enquiry, onClose }: { enquiry: Enquiry; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [adminResponse, setAdminResponse] = useState("");
  const [isSent, setIsSent] = useState(false);

  const replyMutation = useMutation({
    mutationFn: (msg: string) => adminReplyContact(enquiry._id, { adminResponse: msg }),
    onSuccess: () => {
      setIsSent(true);
      toast.success(`Reply successfully sent to ${enquiry.fullName}`);
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to deliver response message");
    },
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminResponse.trim()) return;
    replyMutation.mutate(adminResponse);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-brand-card border border-brand-mid rounded-xl shadow-2xl w-full max-w-lg animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-brand-mid/30">
          <div>
            <h3 className="font-display text-lg font-bold text-brand-white">{enquiry.subject}</h3>
            <p className="text-brand-mid text-xs mt-0.5">{formatDate(enquiry.createdAt)}</p>
          </div>
          <button onClick={onClose} className="text-brand-mid hover:text-brand-white p-1 rounded transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-5 flex flex-col gap-5">
          {/* Sender metadata profile details */}
          <div className="bg-brand-black/50 border border-brand-mid/20 rounded-lg p-4">
            <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider mb-3">From</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <span className="text-brand-mid">Name:</span><span className="text-brand-white">{enquiry.fullName}</span>
              <span className="text-brand-mid">Email:</span><span className="text-brand-white">{enquiry.email}</span>
              <span className="text-brand-mid">Phone:</span><span className="text-brand-white">{enquiry.phoneNumber}</span>
              <span className="text-brand-mid">Status:</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium w-fit border capitalize ${STATUS_COLORS[enquiry.status] || "bg-zinc-800 text-zinc-400"}`}>
                {enquiry.status}
              </span>
            </div>
          </div>

          {/* Customer Message content block */}
          <div>
            <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider mb-2">Message</p>
            <div className="bg-brand-black/40 rounded-lg p-4 border border-brand-mid/10">
              <p className="text-brand-lt-gray text-sm leading-relaxed">{enquiry.message}</p>
            </div>
          </div>

          {/* Active Reply Section Panel */}
          <div className="border-t border-brand-mid/20 pt-4">
            <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MessageSquare size={12} /> Respond to Sender
            </p>

            {isSent ? (
              <div className="bg-green-950/30 border border-green-800/40 rounded-lg p-4 text-center flex flex-col items-center gap-2">
                <CheckCircle size={20} className="text-green-400" />
                <p className="text-green-400 text-sm font-medium">Delivered successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSendReply} className="flex flex-col gap-3">
                <textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder={`Type your answer to ${enquiry.fullName}...`}
                  rows={4}
                  required
                  className="w-full bg-brand-black border border-brand-mid/40 text-brand-white placeholder-brand-mid/50 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-brand-accent resize-none transition-colors"
                />
                <div className="flex gap-2 justify-end">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="px-4 py-2 border border-brand-mid text-brand-mid rounded-md text-xs hover:border-brand-white hover:text-brand-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={replyMutation.isPending || !adminResponse.trim()}
                    className="flex items-center gap-1.5 bg-brand-accent text-brand-black font-semibold px-4 py-2 rounded-md text-xs hover:opacity-90 transition-opacity disabled:opacity-40"
                  >
                    {replyMutation.isPending ? <Loader size={13} className="animate-spin" /> : <Send size={13} />}
                    {replyMutation.isPending ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["enquiries"],
    queryFn: async () => {
      try { 
        const res = await adminGetEnquiries(); 
        console.log("Fetched enquiries:", res);
        return (res?.contacts ?? res?.data ?? []) as Enquiry[]; 
      } catch { 
        return [] as Enquiry[]; 
      }
    },
  });

  const list = data ?? [];
  const filtered = list
    .filter((e) => statusFilter === "all" || e.status?.toLowerCase() === statusFilter.toLowerCase())
    .filter((e) => !search || e.fullName.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-brand-black">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-white">Contact Enquiries</h1>
          <p className="text-brand-mid text-sm mt-1">View and manage customer messages</p>
        </div>
        
        {/* Dynamic State Badge Indicators */}
        <div className="flex flex-wrap gap-2">
          {["new", "read", "resolved", "pending", "reviewed", "rejected"].map((s) => {
            const count = list.filter((e) => e.status?.toLowerCase() === s.toLowerCase()).length;
            if (!count) return null;
            return (
              <span key={s} className={`px-2.5 py-1 rounded-full text-[11px] font-medium border capitalize ${STATUS_COLORS[s] || "bg-zinc-800 border-zinc-700 text-zinc-400"}`}>
                {count} {s}
              </span>
            );
          })}
        </div>
      </div>

      {/* Filter and Input Bars */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2 bg-brand-card border border-brand-mid/30 rounded-lg px-4 py-2 flex-1 max-w-sm">
          <Search size={14} className="text-brand-mid" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search entries..."
            className="bg-transparent text-brand-white text-sm placeholder-brand-mid outline-none flex-1" 
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["all", "new", "read", "resolved", "pending", "reviewed", "rejected"].map((s) => {
            // Only render actionable buttons for explicit categories present in database parameters
            const exists = s === "all" || list.some(item => item.status?.toLowerCase() === s.toLowerCase());
            if (!exists) return null;
            return (
              <button 
                key={s} 
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${statusFilter === s ? "bg-brand-accent text-brand-black" : "bg-brand-card border border-brand-mid/30 text-brand-mid hover:text-brand-white"}`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Grid Table Layout Workspace */}
      <div className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-brand-mid/20 bg-brand-black/40">
                {["Sender", "Subject", "Message Preview", "Status", "Date", "Action"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-brand-mid font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Loader size={22} className="animate-spin text-brand-accent mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-brand-mid">No enquiries found matching selection.</td>
                </tr>
              ) : (
                filtered.map((enq) => {
                  const isUnread = enq.status === "new" || enq.status === "pending";
                  return (
                    <tr key={enq._id} className={`border-b border-brand-mid/10 hover:bg-brand-black/20 transition-colors ${isUnread ? "bg-blue-900/5" : ""}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {isUnread && <span className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />}
                          <div>
                            <p className="text-brand-white font-medium whitespace-nowrap">{enq.fullName}</p>
                            <p className="text-brand-mid text-xs">{enq.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-brand-lt-gray whitespace-nowrap">{enq.subject}</td>
                      <td className="px-5 py-4 text-brand-mid text-xs max-w-[200px] truncate">{enq.message}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${STATUS_COLORS[enq.status] || "bg-zinc-800 border-zinc-700 text-zinc-400"}`}>
                          {enq.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-brand-mid text-xs whitespace-nowrap">{formatDate(enq.createdAt)}</td>
                      <td className="px-5 py-4">
                        <button 
                          onClick={() => setSelectedEnquiry(enq)}
                          className="flex items-center gap-1.5 text-brand-mid hover:text-brand-white hover:bg-brand-black/50 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                        >
                          <Eye size={14} /> View & Reply
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEnquiry && <EnquiryModal enquiry={selectedEnquiry} onClose={() => setSelectedEnquiry(null)} />}
    </div>
  );
}