// "use client";
// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import LoadingSkeleton from "../components/Loading";
// import {
//   adminGetPainterRequests,
//   adminUpdatePainterRequestStatus,
//   adminReplyPainterRequest,
// } from "@/lib/adminApi";
// import { formatDate, getStatusColor } from "@/lib/utils";
// import { MessageCircle, Eye, ChevronDown, Send, X, Loader, Brush } from "lucide-react";

// interface PainterRequest {
//   _id: string; fullName: string; phoneNumber: string; emailAddress: string;
//   propertyLocation: string; projectType: string; propertyType: string;
//   projectDescription: string; preferredStartDate: string;
//   additionalNotes?: string; status: string; createdAt: string;
// }


// // const STATUSES = ["pending", "confirmed", "processing", "completed", "cancelled", "scheduled"];

// const STATUSES = [   "completed", "cancelled", "scheduled"];

// // ─── Reply Modal ──────────────────────────────────────────────────────────────
// function ReplyModal({ request, onClose }: { request: PainterRequest; onClose: () => void }) {
//   const [message, setMessage] = useState("");
//   const [sent, setSent] = useState(false);

//   const replyMutation = useMutation({
//     mutationFn: (msg: string) => adminReplyPainterRequest(request._id, { message: msg }),
//     onSuccess: () => {
//       setSent(true);
//       toast.success(`Reply sent to ${request.fullName}`);
//     },
//     onError: (err: Error) => toast.error(err.message+'omo' || "Failed to send reply"),
//   });

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative z-10 bg-brand-card border border-brand-mid rounded-xl shadow-2xl w-full max-w-lg animate-fade-in">
//         <div className="flex items-center justify-between p-5 border-b border-brand-mid/30">
//           <div>
//             <h3 className="text-lg font-semibold text-brand-white font-display">Reply to Painter Request</h3>
//             <p className="text-brand-mid text-xs mt-0.5">{request.fullName} · {request.emailAddress}</p>
//           </div>
//           <button onClick={onClose} className="text-brand-mid hover:text-brand-white p-1 rounded transition-colors">
//             <X size={18} />
//           </button>
//         </div>

//         <div className="p-5 flex flex-col gap-4">
//           {/* Summary */}
//           <div className="bg-brand-black/50 border border-brand-mid/20 rounded-lg p-4">
//             <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider mb-3">Request Summary</p>
//             <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
//               <span className="text-brand-mid">Project Type:</span><span className="text-brand-white">{request.projectType}</span>
//               <span className="text-brand-mid">Property Type:</span><span className="text-brand-white">{request.propertyType}</span>
//               <span className="text-brand-mid">Location:</span><span className="text-brand-white">{request.propertyLocation}</span>
//               <span className="text-brand-mid">Start Date:</span><span className="text-brand-white">{formatDate(request.preferredStartDate)}</span>
//             </div>
//             {request.projectDescription && (
//               <div className="mt-3 pt-3 border-t border-brand-mid/20">
//                 <p className="text-brand-mid text-xs mb-1">Project Description:</p>
//                 <p className="text-brand-lt-gray text-xs leading-relaxed line-clamp-3">{request.projectDescription}</p>
//               </div>
//             )}
//           </div>

//           {sent ? (
//             <div className="bg-green-900/30 border border-green-700 rounded-lg p-5 text-center flex flex-col items-center gap-2">
//               <div className="w-10 h-10 rounded-full bg-green-700/30 flex items-center justify-center">
//                 <Send size={18} className="text-green-400" />
//               </div>
//               <p className="text-green-400 font-semibold">Reply Sent!</p>
//               <p className="text-brand-mid text-xs">Message delivered to {request.fullName}</p>
//               <button onClick={onClose} className="text-brand-accent text-sm mt-1 hover:underline">Close</button>
//             </div>
//           ) : (
//             <>
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-brand-lt-gray text-sm font-medium">Your Reply Message</label>
//                 <textarea
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   rows={6}
//                   placeholder={`Dear ${request.fullName},\n\nThank you for your painter request. We have reviewed your project details...`}
//                   className="bg-brand-black border border-brand-mid text-brand-white placeholder-brand-mid/60 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-brand-accent resize-none transition-colors"
//                 />
//                 <p className="text-brand-mid text-xs text-right">{message.length} chars</p>
//               </div>

//               <div className="flex gap-3">
//                 <button onClick={onClose} className="flex-1 border border-brand-mid text-brand-mid py-2.5 rounded-md text-sm hover:border-brand-white hover:text-brand-white transition-colors">
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => replyMutation.mutate(message)}
//                   disabled={replyMutation.isPending || !message.trim()}
//                   className="flex-1 flex items-center justify-center gap-2 bg-brand-accent text-brand-black font-semibold py-2.5 rounded-md text-sm hover:bg-brand-accent-lt transition-colors disabled:opacity-50"
//                 >
//                   {replyMutation.isPending ? <Loader size={15} className="animate-spin" /> : <Send size={15} />}
//                   {replyMutation.isPending ? "Sending..." : "Send Reply"}
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Detail Modal ─────────────────────────────────────────────────────────────
// function DetailModal({ request, onClose }: { request: PainterRequest; onClose: () => void }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative z-10 bg-brand-card border border-brand-mid rounded-xl shadow-2xl w-full max-w-lg animate-fade-in max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-5 border-b border-brand-mid/30 sticky top-0 bg-brand-card z-10">
//           <h3 className="text-lg font-semibold text-brand-white font-display">Request Details</h3>
//           <button onClick={onClose} className="text-brand-mid hover:text-brand-white p-1 rounded transition-colors"><X size={18} /></button>
//         </div>
//         <div className="p-5 flex flex-col gap-0.5 text-sm">
//           {([
//             ["Full Name", request.fullName], ["Phone", request.phoneNumber],
//             ["Email", request.emailAddress], ["Location", request.propertyLocation],
//             ["Project Type", request.projectType], ["Property Type", request.propertyType],
//             ["Preferred Start", formatDate(request.preferredStartDate)],
//             ["Status", request.status], ["Submitted", formatDate(request.createdAt)],
//           ] as [string, string][]).map(([k, v]) => (
//             <div key={k} className="flex justify-between py-2.5 border-b border-brand-mid/10">
//               <span className="text-brand-mid">{k}</span>
//               <span className="text-brand-white capitalize text-right max-w-[240px]">{v}</span>
//             </div>
//           ))}
//           <div className="pt-4">
//             <p className="text-brand-mid font-medium mb-2">Project Description</p>
//             <p className="text-brand-lt-gray leading-relaxed text-xs bg-brand-black/40 rounded-lg p-3">{request.projectDescription}</p>
//           </div>
//           {request.additionalNotes && (
//             <div className="pt-3">
//               <p className="text-brand-mid font-medium mb-2">Additional Notes</p>
//               <p className="text-brand-lt-gray leading-relaxed text-xs bg-brand-black/40 rounded-lg p-3">{request.additionalNotes}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────
// export default function PainterRequestsPage() {
//   const qc = useQueryClient();
//   const [replyTarget, setReplyTarget]   = useState<PainterRequest | null>(null);
//   const [detailTarget, setDetailTarget] = useState<PainterRequest | null>(null);
//   const [statusFilter, setStatusFilter] = useState("all");

//   const { data, isLoading } = useQuery({
//     queryKey: ["painter-requests"],
//     queryFn: async () => {
//       try {
//         const res = await adminGetPainterRequests();
//         console.log('res', res.painters);
//         return (res?.painters ??  []) as PainterRequest[];
//       } catch { return toast.error("Failed to fetch painter requests") }

//     },
//   });

//   const statusMutation = useMutation({
//     mutationFn: ({ id, status }: { id: string; status: string }) =>
//       adminUpdatePainterRequestStatus(id, { status }),
//     onSuccess: (_, { id, status }) => {
//       qc.setQueryData(["painter-requests"], (old: PainterRequest[] = []) =>
//         old.map((r) => (r._id === id ? { ...r, status } : r))
//       );
//       toast.success("Status updated successfully");
//     },
//     onError: (err: Error) => toast.error(err.message || "Update failed"),
//   });

//   // const list     = data ?? [];
//   const list: PainterRequest[] = Array.isArray(data) ? data : [];
//   const filtered = statusFilter === "all" ? list : list.filter((r) => r.status === statusFilter);

//   if (isLoading) return <LoadingSkeleton />;
//   return (
//     <div className="flex flex-col gap-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div>
//           <h1 className="font-display text-2xl font-bold text-brand-white">Painter Requests</h1>
//           <p className="text-brand-mid text-sm mt-1">Manage and respond to customer painter requests</p>
//         </div>
//         <div className="flex items-center gap-2 text-xs text-brand-mid bg-brand-card border border-brand-mid/30 rounded-lg px-3 py-2">
//           <Brush size={13} className="text-brand-accent" />
//           <span>{filtered.length} request{filtered.length !== 1 ? "s" : ""}</span>
//         </div>
//       </div>

//       {/* Stat chips */}
//       <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
//         {["all", ...STATUSES].map((s) => {
//           const count = s === "all" ? list.length : list?.filter((r) => r.status === s).length;
//           const active = statusFilter === s;
//           return (
//             <button key={s} onClick={() => setStatusFilter(s)}
//               className={`flex flex-col items-center py-2.5 px-2 rounded-xl border text-center transition-all ${
//                 active
//                   ? "bg-brand-accent text-brand-black border-brand-accent font-semibold"
//                   : "bg-brand-card border-brand-mid/30 text-brand-mid hover:border-brand-mid"
//               }`}
//             >
//               <span className="text-lg font-bold font-display">{count}</span>
//               <span className="text-[10px] capitalize mt-0.5 leading-tight">{s}</span>
//             </button>
//           );
//         })}
//       </div>

//       {/* Table */}
//       <div className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm min-w-[860px]">
//             <thead>
//               <tr className="border-b border-brand-mid/20 bg-brand-black/40">
//                 {["Customer", "Contact", "Project", "Location", "Start Date", "Status", "Actions"].map((h) => (
//                   <th key={h} className="text-left px-5 py-3.5 text-brand-mid font-medium text-xs whitespace-nowrap">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading ? (
//                 <LoadingSkeleton />
//                 // <tr><td colSpan={7} className="py-16 text-center"><Loader size={22} className="animate-spin text-brand-accent mx-auto" /></td></tr>
//               ) : filtered.length === 0 ? (
//                 <tr><td colSpan={7} className="py-16 text-center text-brand-mid">No painter requests found</td></tr>
//               ) : filtered.map((req:any) => (
//                 <tr key={req._id} className="border-b border-brand-mid/10 hover:bg-brand-black/20 transition-colors group">
//                   <td className="px-5 py-4">
//                     <p className="text-brand-white font-medium whitespace-nowrap">{req.fullName}</p>
//                     <p className="text-brand-mid text-xs mt-0.5">{req.propertyType}</p>
//                   </td>
//                   <td className="px-5 py-4">
//                     <p className="text-brand-lt-gray text-xs whitespace-nowrap">{req.phoneNumber}</p>
//                     <p className="text-brand-mid text-xs truncate max-w-[150px]">{req.emailAddress}</p>
//                   </td>
//                   <td className="px-5 py-4">
//                     <p className="text-brand-lt-gray whitespace-nowrap">{req.projectType}</p>
//                   </td>
//                   <td className="px-5 py-4 text-brand-lt-gray text-xs max-w-[140px] truncate">{req.propertyLocation}</td>
//                   <td className="px-5 py-4 text-brand-mid text-xs whitespace-nowrap">{formatDate(req.preferredStartDate)}</td>
//                   <td className="px-5 py-4">
//                     <div className="relative w-fit">
//                       <select
//                         value={req.status}
//                         disabled={statusMutation.isPending}
//                         onChange={(e) => statusMutation.mutate({ id: req._id, status: e.target.value })}
//                         className={`appearance-none text-xs font-medium px-3 py-1.5 pr-7 rounded-full border cursor-pointer focus:outline-none bg-transparent ${getStatusColor(req.status)}`}
//                       >
//                         {STATUSES.map((s) => (
//                           <option key={s} value={s} className="bg-brand-card text-brand-white capitalize">{s}</option>
//                         ))}
//                       </select>
//                       <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
//                     </div>
//                   </td>
//                   <td className="px-5 py-4">
//                     <div className="flex items-center gap-2 whitespace-nowrap">
//                       <button onClick={() => setDetailTarget(req)} title="View details"
//                         className="p-1.5 text-brand-mid hover:text-brand-white hover:bg-brand-black/50 rounded-md transition-colors">
//                         <Eye size={15} />
//                       </button>
//                       <button onClick={() => setReplyTarget(req)}
//                         className="flex items-center gap-1.5 bg-brand-accent/10 hover:bg-brand-accent/20 border border-brand-accent/30 hover:border-brand-accent/60 text-brand-accent px-3 py-1.5 rounded-md text-xs font-semibold transition-all">
//                         <MessageCircle size={13} />
//                         Reply
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {replyTarget  && <ReplyModal  request={replyTarget}  onClose={() => setReplyTarget(null)}  />}
//       {detailTarget && <DetailModal request={detailTarget} onClose={() => setDetailTarget(null)} />}
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSkeleton from "../components/Loading";
import {
  adminGetPendingPainters,
  adminApprovePainter,
  adminRejectPainter,
} from "@/lib/adminApi";
import { formatDate } from "@/lib/utils";
import {
  Eye,
  X,
  Loader,
  Brush,
  CheckCircle2,
  XCircle,
  Video,
  Image as ImageIcon,
  UserCheck,
} from "lucide-react";

// Types matching the provided API response structure
interface ImageObject {
  url: string;
  publicId: string;
}

interface UserObject {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface PendingPainter {
  _id: string;
  user: UserObject;
  bio: string;
  state: string;
  city: string;
  yearsOfExperience: number;
  approvalStatus: "pending" | "approved" | "rejected";
  availabilityStatus: string;
  profileCompletion: number;
  profileImage?: ImageObject;
  verificationVideo?: ImageObject;
  portfolioImages?: ImageObject[];
  createdAt: string;
  applicationDate?: string;
}

// ─── Reject Modal ─────────────────────────────────────────────────────────────
function RejectModal({
  painter,
  onClose,
}: {
  painter: PendingPainter;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [reason, setReason] = useState("");

  const rejectMutation = useMutation({
    mutationFn: (rejectionReason: string) =>
      adminRejectPainter(painter._id, { reason: rejectionReason }),
    onSuccess: () => {
      qc.setQueryData(["pending-painters"], (old: PendingPainter[] = []) =>
        old.filter((p) => p._id !== painter._id)
      );
      toast.success(`Application rejected for ${painter.user.firstName}`);
      onClose();
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to reject application"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 bg-brand-card border border-brand-mid/30 rounded-xl shadow-2xl w-full max-w-lg animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-brand-mid/30">
          <div>
            <h3 className="text-lg font-semibold text-brand-white font-display">
              Reject Painter Application
            </h3>
            <p className="text-brand-mid text-xs mt-0.5">
              {painter.user.firstName} {painter.user.lastName} · {painter.user.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-brand-mid hover:text-brand-white p-1 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-sm font-medium">
              Reason for Rejection
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="State the reason (e.g. Invalid document video, incomplete experience details...)"
              className="bg-brand-black border border-brand-mid text-brand-white placeholder-brand-mid/60 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-red-500 resize-none transition-colors"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={onClose}
              className="flex-1 border border-brand-mid/50 text-brand-mid py-2.5 rounded-md text-sm hover:border-brand-white hover:text-brand-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => rejectMutation.mutate(reason)}
              disabled={rejectMutation.isPending || !reason.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-md text-sm transition-colors disabled:opacity-50"
            >
              {rejectMutation.isPending ? (
                <Loader size={15} className="animate-spin" />
              ) : (
                <XCircle size={15} />
              )}
              {rejectMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({
  painter,
  onClose,
}: {
  painter: PendingPainter;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 bg-brand-card border border-brand-mid/30 rounded-xl shadow-2xl w-full max-w-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-brand-mid/30 sticky top-0 bg-brand-card z-10">
          <div className="flex items-center gap-3">
            {painter.profileImage?.url ? (
              <img
                src={painter.profileImage.url}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-brand-accent/40"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-brand-black flex items-center justify-center text-brand-accent font-bold">
                {painter.user.firstName[0]}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-brand-white font-display">
                {painter.user.firstName} {painter.user.lastName}
              </h3>
              <p className="text-brand-mid text-xs">
                {painter.city}, {painter.state}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-brand-mid hover:text-brand-white p-1 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-6">
          {/* Detailed Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-brand-black/40 rounded-lg p-4 border border-brand-mid/20">
            <div>
              <span className="text-brand-mid block mb-0.5">Email:</span>
              <span className="text-brand-white font-medium">{painter.user.email}</span>
            </div>
            <div>
              <span className="text-brand-mid block mb-0.5">Phone:</span>
              <span className="text-brand-white font-medium">{painter.user.phoneNumber}</span>
            </div>
            <div>
              <span className="text-brand-mid block mb-0.5">Experience:</span>
              <span className="text-brand-white font-medium">{painter.yearsOfExperience} years</span>
            </div>
            <div>
              <span className="text-brand-mid block mb-0.5">Profile Completion:</span>
              <span className="text-brand-accent font-medium">{painter.profileCompletion}%</span>
            </div>
            <div>
              <span className="text-brand-mid block mb-0.5">Applied Date:</span>
              <span className="text-brand-white font-medium">
                {formatDate(painter.applicationDate || painter.createdAt)}
              </span>
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="text-brand-mid font-medium text-xs mb-1.5">Bio / Overview</p>
            <p className="text-brand-lt-gray leading-relaxed text-xs bg-brand-black/40 rounded-lg p-3 border border-brand-mid/10">
              {painter.bio || "No bio provided."}
            </p>
          </div>

          {/* Verification Video Section */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-brand-accent">
              <Video size={16} />
              <p className="font-semibold text-xs uppercase tracking-wider">
                Verification Video
              </p>
            </div>
            {painter.verificationVideo?.url ? (
              <div className="rounded-lg overflow-hidden border border-brand-mid/30 bg-black max-h-[300px]">
                <video
                  src={painter.verificationVideo.url}
                  controls
                  className="w-full h-full max-h-[300px] object-contain"
                />
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-brand-black/30 border border-brand-mid/20 text-brand-mid text-xs italic text-center">
                No verification video submitted.
              </div>
            )}
          </div>

          {/* Portfolio Images Gallery */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-brand-accent">
              <ImageIcon size={16} />
              <p className="font-semibold text-xs uppercase tracking-wider">
                Portfolio Showcase ({painter.portfolioImages?.length || 0})
              </p>
            </div>
            {painter.portfolioImages && painter.portfolioImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {painter.portfolioImages.map((img, i) => (
                  <a
                    key={i}
                    href={img.url}
                    target="_blank"
                    rel="noreferrer"
                    className="aspect-square rounded-lg overflow-hidden border border-brand-mid/30 bg-brand-black hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={img.url}
                      alt={`Portfolio item ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-brand-black/30 border border-brand-mid/20 text-brand-mid text-xs italic text-center">
                No portfolio images provided.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PendingPaintersPage() {
  const qc = useQueryClient();
  const [rejectTarget, setRejectTarget] = useState<PendingPainter | null>(null);
  const [detailTarget, setDetailTarget] = useState<PendingPainter | null>(null);
  const [deleteVideoOnApprove, setDeleteVideoOnApprove] = useState(false);

  // Query pending painters
  const { data, isLoading } = useQuery({
    queryKey: ["pending-painters"],
    queryFn: async () => {
      try {
        const res = await adminGetPendingPainters();
        // Return array if nested under a key or directly
        return (res?.painters ?? res ?? []) as PendingPainter[];
      } catch {
        toast.error("Failed to fetch pending painters");
        return [];
      }
    },
  });

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: (id: string) =>
      adminApprovePainter(id, { deleteVerificationVideo: deleteVideoOnApprove }),
    onSuccess: (_, id) => {
      qc.setQueryData(["pending-painters"], (old: PendingPainter[] = []) =>
        old.filter((p) => p._id !== id)
      );
      toast.success("Painter approved successfully!");
    },
    onError: (err: Error) => toast.error(err.message || "Approval failed"),
  });

  const list: PendingPainter[] = Array.isArray(data) ? data : [];

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-white flex items-center gap-2">
            <UserCheck className="text-brand-accent" /> Pending Painter Applications
          </h1>
          <p className="text-brand-mid text-sm mt-1">
            Review and verify onboarding applications for painters
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-brand-mid bg-brand-card border border-brand-mid/30 rounded-lg px-3 py-2">
          <Brush size={13} className="text-brand-accent" />
          <span>
            {list.length} pending application{list.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Global Approval Option Toggle */}
      <div className="flex items-center gap-2 bg-brand-card/50 border border-brand-mid/20 p-3 rounded-lg text-xs text-brand-lt-gray w-fit">
        <input
          type="checkbox"
          id="deleteVideoOption"
          checked={deleteVideoOnApprove}
          onChange={(e) => setDeleteVideoOnApprove(e.target.checked)}
          className="rounded accent-brand-accent cursor-pointer"
        />
        <label htmlFor="deleteVideoOption" className="cursor-pointer">
          Automatically remove verification video upon approval
        </label>
      </div>

      {/* Main Table */}
      <div className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[860px]">
            <thead>
              <tr className="border-b border-brand-mid/20 bg-brand-black/40">
                {[
                  "Painter",
                  "Contact",
                  "Location",
                  "Experience",
                  "Video",
                  "Applied Date",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3.5 text-brand-mid font-medium text-xs whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-brand-mid">
                    No pending painter applications found
                  </td>
                </tr>
              ) : (
                list.map((painter) => (
                  <tr
                    key={painter._id}
                    className="border-b border-brand-mid/10 hover:bg-brand-black/20 transition-colors group"
                  >
                    {/* Name & Profile Picture */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {painter.profileImage?.url ? (
                          <img
                            src={painter.profileImage.url}
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover border border-brand-border"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-brand-raised flex items-center justify-center text-xs text-brand-accent font-bold border border-brand-border">
                            {painter.user.firstName[0]}
                          </div>
                        )}
                        <div>
                          <p className="text-brand-white font-medium whitespace-nowrap">
                            {painter.user.firstName} {painter.user.lastName}
                          </p>
                          <p className="text-brand-mid text-xs">
                            Completion: {painter.profileCompletion}%
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-5 py-4">
                      <p className="text-brand-lt-gray text-xs whitespace-nowrap">
                        {painter.user.phoneNumber}
                      </p>
                      <p className="text-brand-mid text-xs truncate max-w-[150px]">
                        {painter.user.email}
                      </p>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4 text-brand-lt-gray text-xs whitespace-nowrap">
                      {painter.city}, {painter.state}
                    </td>

                    {/* Experience */}
                    <td className="px-5 py-4 text-brand-lt-gray text-xs whitespace-nowrap">
                      {painter.yearsOfExperience} yrs
                    </td>

                    {/* Video Status */}
                    <td className="px-5 py-4">
                      {painter.verificationVideo?.url ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-green-400 bg-green-950/40 border border-green-800/40 px-2 py-0.5 rounded-full">
                          <Video size={10} /> Attached
                        </span>
                      ) : (
                        <span className="text-brand-mid text-[11px] italic">None</span>
                      )}
                    </td>

                    {/* Applied Date */}
                    <td className="px-5 py-4 text-brand-mid text-xs whitespace-nowrap">
                      {formatDate(painter.applicationDate || painter.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        {/* View Details */}
                        <button
                          onClick={() => setDetailTarget(painter)}
                          title="View Details & Video"
                          className="p-1.5 text-brand-mid hover:text-brand-white hover:bg-brand-black/50 rounded-md transition-colors"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Reject */}
                        <button
                          onClick={() => setRejectTarget(painter)}
                          title="Reject Application"
                          className="flex items-center gap-1 bg-red-950/30 hover:bg-red-900/40 border border-red-800/40 text-red-400 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all"
                        >
                          <XCircle size={13} />
                          Reject
                        </button>

                        {/* Approve */}
                        <button
                          onClick={() => approveMutation.mutate(painter._id)}
                          disabled={approveMutation.isPending}
                          title="Approve Painter"
                          className="flex items-center gap-1 bg-green-950/40 hover:bg-green-900/50 border border-green-800/50 text-green-400 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all disabled:opacity-50"
                        >
                          {approveMutation.isPending ? (
                            <Loader size={13} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={13} />
                          )}
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {rejectTarget && (
        <RejectModal
          painter={rejectTarget}
          onClose={() => setRejectTarget(null)}
        />
      )}
      {detailTarget && (
        <DetailModal
          painter={detailTarget}
          onClose={() => setDetailTarget(null)}
        />
      )}
    </div>
  );
}