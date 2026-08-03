


// "use client";

// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import {
//   adminGetPendingPainters,
//   adminGetApprovedPainters,
//   adminApprovePainter,
//   adminRejectPainter,
//   adminTogglePinater,
// } from "@/lib/adminApi";
// import { formatDate } from "@/lib/utils";
// import {
//   Eye, X, Loader, Brush, CheckCircle2, XCircle, Video,
//   Image as ImageIcon, UserCheck, ToggleLeft, ToggleRight, Users,
// } from "lucide-react";

// // ── Types ─────────────────────────────────────────────────────────────────────
// interface ImageObject { url: string; publicId: string; }
// interface UserObject {
//   _id: string; firstName: string; lastName: string;
//   email: string; phoneNumber: string;
// }
// interface Painter {
//   _id: string; user: UserObject; bio: string; state: string; city: string;
//   yearsOfExperience: number; approvalStatus: "pending" | "approved" | "rejected";
//   availabilityStatus: string; profileCompletion: number;
//   profileImage?: ImageObject; verificationVideo?: ImageObject;
//   portfolioImages?: ImageObject[]; createdAt: string; applicationDate?: string;
//   isActive?: boolean;
// }

// type Tab = "pending" | "approved";

// // ── Reject Modal ──────────────────────────────────────────────────────────────
// function RejectModal({ painter, onClose }: { painter: Painter; onClose: () => void }) {
//   const qc = useQueryClient();
//   const [reason, setReason] = useState("");

//   const rejectMutation = useMutation({
//     mutationFn: (r: string) => adminRejectPainter(painter._id, { reason: r }),
//     onSuccess: () => {
//       qc.setQueryData(["pending-painters"], (old: Painter[] = []) =>
//         old.filter((p) => p._id !== painter._id)
//       );
//       toast.success(`Application rejected for ${painter.user.firstName}`);
//       onClose();
//     },
//     onError: (err: Error) => toast.error(err.message || "Failed to reject"),
//   });

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative z-10 bg-brand-card border border-brand-mid/30 rounded-xl shadow-2xl w-full max-w-lg animate-fade-in">
//         <div className="flex items-center justify-between p-5 border-b border-brand-mid/30">
//           <div>
//             <h3 className="text-lg font-semibold text-brand-white font-display">Reject Painter Application</h3>
//             <p className="text-brand-mid text-xs mt-0.5">
//               {painter.user.firstName} {painter.user.lastName} · {painter.user.email}
//             </p>
//           </div>
//           <button onClick={onClose} className="text-brand-mid hover:text-brand-white p-1 rounded transition-colors">
//             <X size={18} />
//           </button>
//         </div>
//         <div className="p-5 flex flex-col gap-4">
//           <div className="flex flex-col gap-1.5">
//             <label className="text-brand-lt-gray text-sm font-medium">Reason for Rejection</label>
//             <textarea
//               value={reason} onChange={(e) => setReason(e.target.value)} rows={4}
//               placeholder="State the reason (e.g. Invalid document video, incomplete experience details...)"
//               className="bg-brand-black border border-brand-mid text-brand-white placeholder-brand-mid/60
//                 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-red-500 resize-none transition-colors"
//             />
//           </div>
//           <div className="flex gap-3 mt-2">
//             <button onClick={onClose}
//               className="flex-1 border border-brand-mid/50 text-brand-mid py-2.5 rounded-md text-sm
//                 hover:border-brand-white hover:text-brand-white transition-colors">
//               Cancel
//             </button>
//             <button
//               onClick={() => rejectMutation.mutate(reason)}
//               disabled={rejectMutation.isPending || !reason.trim()}
//               className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700
//                 text-white font-semibold py-2.5 rounded-md text-sm transition-colors disabled:opacity-50">
//               {rejectMutation.isPending ? <Loader size={15} className="animate-spin" /> : <XCircle size={15} />}
//               {rejectMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Detail Modal ──────────────────────────────────────────────────────────────
// function DetailModal({ painter, onClose }: { painter: Painter; onClose: () => void }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative z-10 bg-brand-card border border-brand-mid/30 rounded-xl shadow-2xl
//         w-full max-w-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-5 border-b border-brand-mid/30 sticky top-0 bg-brand-card z-10">
//           <div className="flex items-center gap-3">
//             {painter.profileImage?.url ? (
//               <img src={painter.profileImage.url} alt="Profile"
//                 className="w-10 h-10 rounded-full object-cover border border-brand-accent/40" />
//             ) : (
//               <div className="w-10 h-10 rounded-full bg-brand-black flex items-center justify-center text-brand-accent font-bold">
//                 {painter.user.firstName[0]}
//               </div>
//             )}
//             <div>
//               <h3 className="text-lg font-semibold text-brand-white font-display">
//                 {painter.user.firstName} {painter.user.lastName}
//               </h3>
//               <p className="text-brand-mid text-xs">{painter.city}, {painter.state}</p>
//             </div>
//           </div>
//           <button onClick={onClose} className="text-brand-mid hover:text-brand-white p-1 rounded transition-colors">
//             <X size={18} />
//           </button>
//         </div>

//         <div className="p-5 flex flex-col gap-6">
//           <div className="grid grid-cols-2 gap-4 text-xs bg-brand-black/40 rounded-lg p-4 border border-brand-mid/20">
//             <div><span className="text-brand-mid block mb-0.5">Email:</span><span className="text-brand-white font-medium">{painter.user.email}</span></div>
//             <div><span className="text-brand-mid block mb-0.5">Phone:</span><span className="text-brand-white font-medium">{painter.user.phoneNumber}</span></div>
//             <div><span className="text-brand-mid block mb-0.5">Experience:</span><span className="text-brand-white font-medium">{painter.yearsOfExperience} years</span></div>
//             <div><span className="text-brand-mid block mb-0.5">Profile Completion:</span><span className="text-brand-accent font-medium">{painter.profileCompletion}%</span></div>
//             <div><span className="text-brand-mid block mb-0.5">Status:</span>
//               <span className={`font-medium capitalize ${painter.approvalStatus === "approved" ? "text-green-400" : "text-yellow-400"}`}>
//                 {painter.approvalStatus}
//               </span>
//             </div>
//             <div><span className="text-brand-mid block mb-0.5">Applied:</span><span className="text-brand-white font-medium">{formatDate(painter.applicationDate || painter.createdAt)}</span></div>
//           </div>

//           <div>
//             <p className="text-brand-mid font-medium text-xs mb-1.5">Bio / Overview</p>
//             <p className="text-brand-lt-gray leading-relaxed text-xs bg-brand-black/40 rounded-lg p-3 border border-brand-mid/10">
//               {painter.bio || "No bio provided."}
//             </p>
//           </div>

//           <div>
//             <div className="flex items-center gap-2 mb-2 text-brand-accent">
//               <Video size={16} />
//               <p className="font-semibold text-xs uppercase tracking-wider">Verification Video</p>
//             </div>
//             {painter.verificationVideo?.url ? (
//               <div className="rounded-lg overflow-hidden border border-brand-mid/30 bg-black max-h-[300px]">
//                 <video src={painter.verificationVideo.url} controls className="w-full h-full max-h-[300px] object-contain" />
//               </div>
//             ) : (
//               <div className="p-4 rounded-lg bg-brand-black/30 border border-brand-mid/20 text-brand-mid text-xs italic text-center">
//                 No verification video submitted.
//               </div>
//             )}
//           </div>

//           <div>
//             <div className="flex items-center gap-2 mb-2 text-brand-accent">
//               <ImageIcon size={16} />
//               <p className="font-semibold text-xs uppercase tracking-wider">
//                 Portfolio Showcase ({painter.portfolioImages?.length || 0})
//               </p>
//             </div>
//             {painter.portfolioImages && painter.portfolioImages.length > 0 ? (
//               <div className="grid grid-cols-3 gap-2">
//                 {painter.portfolioImages.map((img, i) => (
//                   <a key={i} href={img.url} target="_blank" rel="noreferrer"
//                     className="aspect-square rounded-lg overflow-hidden border border-brand-mid/30 bg-brand-black hover:opacity-80 transition-opacity">
//                     <img src={img.url} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover" />
//                   </a>
//                 ))}
//               </div>
//             ) : (
//               <div className="p-4 rounded-lg bg-brand-black/30 border border-brand-mid/20 text-brand-mid text-xs italic text-center">
//                 No portfolio images provided.
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Shared table headers ───────────────────────────────────────────────────────
// const PENDING_HEADERS = ["Painter", "Contact", "Location", "Experience", "Video", "Applied Date", "Actions"];
// const APPROVED_HEADERS = ["Painter", "Contact", "Location", "Experience", "Status", "Joined", "Actions"];

// // ── Main Page ─────────────────────────────────────────────────────────────────
// export default function PaintersAdminPage() {
//   const qc = useQueryClient();
//   const [activeTab, setActiveTab]             = useState<Tab>("pending");
//   const [rejectTarget, setRejectTarget]       = useState<Painter | null>(null);
//   const [detailTarget, setDetailTarget]       = useState<Painter | null>(null);
//   const [deleteVideoOnApprove, setDeleteVideoOnApprove] = useState(false);

//   // ── Pending painters ────────────────────────────────────────────────────────
//   const { data: pendingData, isLoading: pendingLoading } = useQuery({
//     queryKey: ["pending-painters"],
//     queryFn: async () => {
//       const res = await adminGetPendingPainters();
//       return (res?.painters ?? res ?? []) as Painter[];
//     },
//   });

//   // ── Approved painters ───────────────────────────────────────────────────────
//   const { data: approvedData, isLoading: approvedLoading } = useQuery({
//     queryKey: ["approved-painters"],
//     queryFn: async () => {
//       const res = await adminGetApprovedPainters();
//         console.log('res', res)

//       return (res?.painters ?? res ?? []) as Painter[];
//     },
    
//     enabled: activeTab === "approved", // only fetch when tab is active
//   });

//   // ── Approve mutation ────────────────────────────────────────────────────────
//   const approveMutation = useMutation({
//     mutationFn: (id: string) => adminApprovePainter(id, { deleteVerificationVideo: deleteVideoOnApprove }),
//     onSuccess: (_, id) => {
//       qc.setQueryData(["pending-painters"], (old: Painter[] = []) => old.filter((p) => p._id !== id));
//       qc.invalidateQueries({ queryKey: ["approved-painters"] });
//       toast.success("Painter approved successfully!");
//     },
//     onError: (err: Error) => toast.error(err.message || "Approval failed"),
//   });

//   // ── Toggle mutation ─────────────────────────────────────────────────────────
//   const toggleMutation = useMutation({
//     mutationFn: (id: string) => adminTogglePinater(id),
//     onSuccess: (res, id) => {
//       // Optimistically flip isActive on the approved list
//       qc.setQueryData(["approved-painters"], (old: Painter[] = []) =>
//         old.map((p) => p._id === id ? { ...p, isActive: !p.isActive } : p)
//       );
//           console.log('id',id)

//       // Show the new status from the response if available, fallback to generic
//       const newStatus = res?.painter?.availabilityStatus ?? res?.status;
//       toast.success(newStatus
//         ? `Painter status set to: ${newStatus}`
//         : "Painter status toggled"
//       );
//       console.log('res', res)
//       toast.success(res?.message)
//     },
//     onError: (err: Error) => toast.error(err.message || "Toggle failed"),
//   });

//   const pendingList  = Array.isArray(pendingData)  ? pendingData  : [];
//   const approvedList = Array.isArray(approvedData) ? approvedData : [];
//   const isLoading    = activeTab === "pending" ? pendingLoading : approvedLoading;
// console.log('active', approvedList)

//   return (
//     <div className="flex flex-col gap-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div>
//           <h1 className="font-display text-2xl font-bold text-brand-white flex items-center gap-2">
//             <UserCheck className="text-brand-accent" /> Painter Management
//           </h1>
//           <p className="text-brand-mid text-sm mt-1">Review applications and manage active painters</p>
//         </div>
//         <div className="flex items-center gap-2 text-xs text-brand-mid bg-brand-card border border-brand-mid/30 rounded-lg px-3 py-2">
//           <Brush size={13} className="text-brand-accent" />
//           <span>{pendingList.length} pending · {approvedList.length} approved</span>
//         </div>
//       </div>

//       {/* Tab switcher */}
//       <div className="flex gap-2">
//         <button
//           onClick={() => setActiveTab("pending")}
//           className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border transition-all ${
//             activeTab === "pending"
//               ? "bg-brand-accent text-brand-black border-brand-accent"
//               : "bg-brand-card border-brand-mid/30 text-brand-mid hover:text-brand-white"
//           }`}
//         >
//           <XCircle size={15} />
//           Pending Applications
//           {pendingList.length > 0 && (
//             <span className={`ml-1 text-[11px] font-bold px-1.5 py-0.5 rounded-full
//               ${activeTab === "pending" ? "bg-brand-black/20 text-brand-black" : "bg-brand-accent/20 text-brand-accent"}`}>
//               {pendingList.length}
//             </span>
//           )}
//         </button>
//         <button
//           onClick={() => setActiveTab("approved")}
//           className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border transition-all ${
//             activeTab === "approved"
//               ? "bg-brand-accent text-brand-black border-brand-accent"
//               : "bg-brand-card border-brand-mid/30 text-brand-mid hover:text-brand-white"
//           }`}
//         >
//           <Users size={15} />
//           All Painters
//           {approvedList.length > 0 && activeTab === "approved" && (
//             <span className="ml-1 text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-brand-black/20 text-brand-black">
//               {approvedList.length}
//             </span>
//           )}
//         </button>
//       </div>

//       {/* Delete video option — only relevant for pending tab */}
//       {activeTab === "pending" && (
//         <div className="flex items-center gap-2 bg-brand-card/50 border border-brand-mid/20 p-3 rounded-lg text-xs text-brand-lt-gray w-fit">
//           <input type="checkbox" id="deleteVideoOption" checked={deleteVideoOnApprove}
//             onChange={(e) => setDeleteVideoOnApprove(e.target.checked)}
//             className="rounded accent-brand-accent cursor-pointer" />
//           <label htmlFor="deleteVideoOption" className="cursor-pointer">
//             Automatically remove verification video upon approval
//           </label>
//         </div>
//       )}

//       {/* Table */}
//       {isLoading ? (
//         <div className="py-16 flex justify-center">
//           <Loader size={26} className="animate-spin text-brand-accent" />
//         </div>
//       ) : (
//         <div className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm min-w-[860px]">
//               <thead>
//                 <tr className="border-b border-brand-mid/20 bg-brand-black/40">
//                   {(activeTab === "pending" ? PENDING_HEADERS : APPROVED_HEADERS).map((h) => (
//                     <th key={h} className="text-left px-5 py-3.5 text-brand-mid font-medium text-xs whitespace-nowrap">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {/* ── PENDING TAB ── */}
//                 {activeTab === "pending" && (
//                   pendingList.length === 0 ? (
//                     <tr>
//                       <td colSpan={7} className="py-16 text-center text-brand-mid">
//                         No pending painter applications
//                       </td>
//                     </tr>
//                   ) : (
//                     pendingList.map((painter) => (
//                       <tr key={painter._id}
//                         className="border-b border-brand-mid/10 hover:bg-brand-black/20 transition-colors">
//                         <td className="px-5 py-4">
//                           <div className="flex items-center gap-3">
//                             {painter.profileImage?.url ? (
//                               <img src={painter.profileImage.url} alt="Profile"
//                                 className="w-8 h-8 rounded-full object-cover border border-brand-border" />
//                             ) : (
//                               <div className="w-8 h-8 rounded-full bg-brand-raised flex items-center justify-center text-xs text-brand-accent font-bold border border-brand-border">
//                                 {painter.user.firstName[0]}
//                               </div>
//                             )}
//                             <div>
//                               <p className="text-brand-white font-medium whitespace-nowrap">
//                                 {painter.user.firstName} {painter.user.lastName}
//                               </p>
//                               <p className="text-brand-mid text-xs">Completion: {painter.profileCompletion}%</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-5 py-4">
//                           <p className="text-brand-lt-gray text-xs whitespace-nowrap">{painter.user.phoneNumber}</p>
//                           <p className="text-brand-mid text-xs truncate max-w-[150px]">{painter.user.email}</p>
//                         </td>
//                         <td className="px-5 py-4 text-brand-lt-gray text-xs whitespace-nowrap">
//                           {painter.city}, {painter.state}
//                         </td>
//                         <td className="px-5 py-4 text-brand-lt-gray text-xs whitespace-nowrap">
//                           {painter.yearsOfExperience} yrs
//                         </td>
//                         <td className="px-5 py-4">
//                           {painter.verificationVideo?.url ? (
//                             <span className="inline-flex items-center gap-1 text-[11px] text-green-400 bg-green-950/40 border border-green-800/40 px-2 py-0.5 rounded-full">
//                               <Video size={10} /> Attached
//                             </span>
//                           ) : (
//                             <span className="text-brand-mid text-[11px] italic">None</span>
//                           )}
//                         </td>
//                         <td className="px-5 py-4 text-brand-mid text-xs whitespace-nowrap">
//                           {formatDate(painter.applicationDate || painter.createdAt)}
//                         </td>
//                         <td className="px-5 py-4">
//                           <div className="flex items-center gap-2 whitespace-nowrap">
//                             <button onClick={() => setDetailTarget(painter)} title="View Details"
//                               className="p-1.5 text-brand-mid hover:text-brand-white hover:bg-brand-black/50 rounded-md transition-colors">
//                               <Eye size={15} />
//                             </button>
//                             <button onClick={() => setRejectTarget(painter)}
//                               className="flex items-center gap-1 bg-red-950/30 hover:bg-red-900/40 border border-red-800/40
//                                 text-red-400 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all">
//                               <XCircle size={13} /> Reject
//                             </button>
//                             <button
//                               onClick={() => approveMutation.mutate(painter._id)}
//                               disabled={approveMutation.isPending && approveMutation.variables === painter._id}
//                               className="flex items-center gap-1 bg-green-950/40 hover:bg-green-900/50 border border-green-800/50
//                                 text-green-400 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all disabled:opacity-50">
//                               {approveMutation.isPending && approveMutation.variables === painter._id
//                                 ? <Loader size={13} className="animate-spin" />
//                                 : <CheckCircle2 size={13} />}
//                               Approve
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )
//                 )}

//                 {/* ── APPROVED TAB ── */}
//                 {activeTab === "approved" && (
//                   approvedList.length === 0 ? (
//                     <tr>
//                       <td colSpan={7} className="py-16 text-center text-brand-mid">
//                         No approved painters found
//                       </td>
//                     </tr>
//                   ) : (
//                     approvedList.map((painter) => {
//                       const isActive   = painter.availabilityStatus !== "unavailable" && painter.isActive !== false;
//                       const isToggling = toggleMutation.isPending && toggleMutation.variables === painter._id;
//                       return (
//                         <tr key={painter._id}
//                           className="border-b border-brand-mid/10 hover:bg-brand-black/20 transition-colors">
//                           <td className="px-5 py-4">
//                             <div className="flex items-center gap-3">
//                               {painter.profileImage?.url ? (
//                                 <img src={painter.profileImage.url} alt="Profile"
//                                   className="w-8 h-8 rounded-full object-cover border border-brand-border" />
//                               ) : (
//                                 <div className="w-8 h-8 rounded-full bg-brand-raised flex items-center justify-center text-xs text-brand-accent font-bold border border-brand-border">
//                                   {painter.user.firstName[0]}
//                                 </div>
//                               )}
//                               <div>
//                                 <p className="text-brand-white font-medium whitespace-nowrap">
//                                   {painter.user.firstName} {painter.user.lastName}
//                                 </p>
//                                 <p className="text-brand-mid text-xs">Completion: {painter.profileCompletion}%</p>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-5 py-4">
//                             <p className="text-brand-lt-gray text-xs whitespace-nowrap">{painter.user.phoneNumber}</p>
//                             <p className="text-brand-mid text-xs truncate max-w-[150px]">{painter.user.email}</p>
//                           </td>
//                           <td className="px-5 py-4 text-brand-lt-gray text-xs whitespace-nowrap">
//                             {painter.city}, {painter.state}
//                           </td>
//                           <td className="px-5 py-4 text-brand-lt-gray text-xs whitespace-nowrap">
//                             {painter.yearsOfExperience} yrs
//                           </td>

//                           {/* Status badge */}
//                           <td className="px-5 py-4">
//                             <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border capitalize
//                               ${isActive
//                                 ? "text-green-400 bg-green-950/40 border-green-800/40"
//                                 : "text-brand-subtle bg-brand-raised border-brand-border"
//                               }`}>
//                               {isActive ? "Active" : "Inactive"}
//                             </span>
//                           </td>

//                           <td className="px-5 py-4 text-brand-mid text-xs whitespace-nowrap">
//                             {formatDate(painter.createdAt)}
//                           </td>

//                           {/* Actions */}
//                           <td className="px-5 py-4">
//                             <div className="flex items-center gap-2 whitespace-nowrap">
//                               <button onClick={() => setDetailTarget(painter)} title="View Details"
//                                 className="p-1.5 text-brand-mid hover:text-brand-white hover:bg-brand-black/50 rounded-md transition-colors">
//                                 <Eye size={15} />
//                               </button>

//                               {/* Toggle active/inactive */}
//                               <button
//                                 onClick={() => toggleMutation.mutate(painter._id)}
//                                 disabled={isToggling}
//                                 title={isActive ? "Deactivate painter" : "Activate painter"}
//                                 className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium
//                                   border transition-all disabled:opacity-50 ${
//                                     isActive
//                                       ? "bg-yellow-950/30 hover:bg-yellow-900/40 border-yellow-800/40 text-yellow-400"
//                                       : "bg-green-950/30 hover:bg-green-900/40 border-green-800/40 text-green-400"
//                                   }`}
//                               >
//                                 {isToggling
//                                   ? <Loader size={13} className="animate-spin" />
//                                   : isActive
//                                   ? <ToggleRight size={14} />
//                                   : <ToggleLeft size={14} />
//                                 }
//                                 {isActive ? "Deactivate" : "Activate"}
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })
//                   )
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Modals */}
//       {rejectTarget && <RejectModal painter={rejectTarget} onClose={() => setRejectTarget(null)} />}
//       {detailTarget && <DetailModal painter={detailTarget} onClose={() => setDetailTarget(null)} />}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  adminGetPendingPainters,
  adminGetApprovedPainters,
  adminApprovePainter,
  adminRejectPainter,
  adminTogglePinater,
} from "@/lib/adminApi";
import { formatDate } from "@/lib/utils";
import {
  Eye, X, Loader, Brush, CheckCircle2, XCircle, Video,
  Image as ImageIcon, UserCheck, ToggleLeft, ToggleRight, Users,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ImageObject { url: string; publicId: string; }
interface UserObject {
  _id: string; firstName: string; lastName: string;
  email: string; phoneNumber: string;
}
interface Painter {
  _id: string; user: UserObject; bio: string; state: string; city: string;
  yearsOfExperience: number; approvalStatus: "pending" | "approved" | "rejected";
  availabilityStatus: string;
  status: "active" | "inactive";   // ← real field from API
  profileCompletion: number;
  profileImage?: ImageObject; verificationVideo?: ImageObject;
  portfolioImages?: ImageObject[]; createdAt: string; applicationDate?: string;
}

type Tab = "pending" | "approved";

// ── Reject Modal ──────────────────────────────────────────────────────────────
function RejectModal({ painter, onClose }: { painter: Painter; onClose: () => void }) {
  const qc = useQueryClient();
  const [reason, setReason] = useState("");

  const rejectMutation = useMutation({
    mutationFn: (r: string) => adminRejectPainter(painter._id, { reason: r }),
    onSuccess: () => {
      qc.setQueryData(["pending-painters"], (old: Painter[] = []) =>
        old.filter((p) => p._id !== painter._id)
      );
      toast.success(`Application rejected for ${painter.user.firstName}`);
      onClose();
    },
    onError: (err: Error) => toast.error(err.message || "Failed to reject"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-brand-card border border-brand-mid/30 rounded-xl shadow-2xl w-full max-w-lg animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-brand-mid/30">
          <div>
            <h3 className="text-lg font-semibold text-brand-white font-display">Reject Painter Application</h3>
            <p className="text-brand-mid text-xs mt-0.5">
              {painter.user.firstName} {painter.user.lastName} · {painter.user.email}
            </p>
          </div>
          <button onClick={onClose} className="text-brand-mid hover:text-brand-white p-1 rounded transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-sm font-medium">Reason for Rejection</label>
            <textarea
              value={reason} onChange={(e) => setReason(e.target.value)} rows={4}
              placeholder="State the reason (e.g. Invalid document video, incomplete experience details...)"
              className="bg-brand-black border border-brand-mid text-brand-white placeholder-brand-mid/60
                px-4 py-3 rounded-md text-sm focus:outline-none focus:border-red-500 resize-none transition-colors"
            />
          </div>
          <div className="flex gap-3 mt-2">
            <button onClick={onClose}
              className="flex-1 border border-brand-mid/50 text-brand-mid py-2.5 rounded-md text-sm
                hover:border-brand-white hover:text-brand-white transition-colors">
              Cancel
            </button>
            <button
              onClick={() => rejectMutation.mutate(reason)}
              disabled={rejectMutation.isPending || !reason.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700
                text-white font-semibold py-2.5 rounded-md text-sm transition-colors disabled:opacity-50">
              {rejectMutation.isPending ? <Loader size={15} className="animate-spin" /> : <XCircle size={15} />}
              {rejectMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function DetailModal({ painter, onClose }: { painter: Painter; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-brand-card border border-brand-mid/30 rounded-xl shadow-2xl
        w-full max-w-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-brand-mid/30 sticky top-0 bg-brand-card z-10">
          <div className="flex items-center gap-3">
            {painter.profileImage?.url ? (
              <img src={painter.profileImage.url} alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-brand-accent/40" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-brand-black flex items-center justify-center text-brand-accent font-bold">
                {painter.user.firstName[0]}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-brand-white font-display">
                {painter.user.firstName} {painter.user.lastName}
              </h3>
              <p className="text-brand-mid text-xs">{painter.city}, {painter.state}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-brand-mid hover:text-brand-white p-1 rounded transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4 text-xs bg-brand-black/40 rounded-lg p-4 border border-brand-mid/20">
            <div><span className="text-brand-mid block mb-0.5">Email:</span><span className="text-brand-white font-medium">{painter.user.email}</span></div>
            <div><span className="text-brand-mid block mb-0.5">Phone:</span><span className="text-brand-white font-medium">{painter.user.phoneNumber}</span></div>
            <div><span className="text-brand-mid block mb-0.5">Experience:</span><span className="text-brand-white font-medium">{painter.yearsOfExperience} years</span></div>
            <div><span className="text-brand-mid block mb-0.5">Profile Completion:</span><span className="text-brand-accent font-medium">{painter.profileCompletion}%</span></div>
            <div>
              <span className="text-brand-mid block mb-0.5">Approval Status:</span>
              <span className={`font-medium capitalize ${painter.approvalStatus === "approved" ? "text-green-400" : "text-yellow-400"}`}>
                {painter.approvalStatus}
              </span>
            </div>
            <div>
              <span className="text-brand-mid block mb-0.5">Active Status:</span>
              <span className={`font-medium capitalize ${painter.status === "active" ? "text-green-400" : "text-red-400"}`}>
                {painter.status}
              </span>
            </div>
            <div><span className="text-brand-mid block mb-0.5">Applied:</span><span className="text-brand-white font-medium">{formatDate(painter.applicationDate || painter.createdAt)}</span></div>
          </div>

          <div>
            <p className="text-brand-mid font-medium text-xs mb-1.5">Bio / Overview</p>
            <p className="text-brand-lt-gray leading-relaxed text-xs bg-brand-black/40 rounded-lg p-3 border border-brand-mid/10">
              {painter.bio || "No bio provided."}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2 text-brand-accent">
              <Video size={16} />
              <p className="font-semibold text-xs uppercase tracking-wider">Verification Video</p>
            </div>
            {painter.verificationVideo?.url ? (
              <div className="rounded-lg overflow-hidden border border-brand-mid/30 bg-black max-h-[300px]">
                <video src={painter.verificationVideo.url} controls className="w-full h-full max-h-[300px] object-contain" />
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-brand-black/30 border border-brand-mid/20 text-brand-mid text-xs italic text-center">
                No verification video submitted.
              </div>
            )}
          </div>

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
                  <a key={i} href={img.url} target="_blank" rel="noreferrer"
                    className="aspect-square rounded-lg overflow-hidden border border-brand-mid/30 bg-brand-black hover:opacity-80 transition-opacity">
                    <img src={img.url} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover" />
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

const PENDING_HEADERS  = ["Painter", "Contact", "Location", "Experience", "Video", "Applied Date", "Actions"];
const APPROVED_HEADERS = ["Painter", "Contact", "Location", "Experience", "Status", "Joined", "Actions"];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PaintersAdminPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab]           = useState<Tab>("pending");
  const [rejectTarget, setRejectTarget]     = useState<Painter | null>(null);
  const [detailTarget, setDetailTarget]     = useState<Painter | null>(null);
  const [deleteVideoOnApprove, setDeleteVideoOnApprove] = useState(false);

  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: ["pending-painters"],
    queryFn: async () => {
      const res = await adminGetPendingPainters();
      return (res?.painters ?? res ?? []) as Painter[];
    },
  });

  const { data: approvedData, isLoading: approvedLoading } = useQuery({
    queryKey: ["approved-painters"],
    queryFn: async () => {
      const res = await adminGetApprovedPainters();
      return (res?.painters ?? res ?? []) as Painter[];
    },
    enabled: activeTab === "approved",
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminApprovePainter(id, { deleteVerificationVideo: deleteVideoOnApprove }),
    onSuccess: (_, id) => {
      qc.setQueryData(["pending-painters"], (old: Painter[] = []) => old.filter((p) => p._id !== id));
      qc.invalidateQueries({ queryKey: ["approved-painters"] });
      toast.success("Painter approved successfully!");
    },
    onError: (err: Error) => toast.error(err.message || "Approval failed"),
  });

  // ── Toggle — reads `status` field, single toast only ──────────────────────
  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminTogglePinater(id),
    onSuccess: (res, id) => {
      // Flip status in cached list immediately so UI updates without a refetch
      qc.setQueryData(["approved-painters"], (old: Painter[] = []) =>
        old.map((p) =>
          p._id === id
            ? { ...p, status: p.status === "active" ? "inactive" : "active" }
            : p
        )
      );
      // Single toast — use API message if present, otherwise derive from returned status
      const nextStatus = res?.painter?.status ?? res?.data?.status ?? res?.status;
      toast.success(
        res?.message
          ? res.message
          : nextStatus
          ? `Painter is now ${nextStatus}`
          : "Painter status updated"
      );
    },
    onError: (err: Error) => toast.error(err.message || "Toggle failed"),
  });

  const pendingList  = Array.isArray(pendingData)  ? pendingData  : [];
  const approvedList = Array.isArray(approvedData) ? approvedData : [];
  const isLoading    = activeTab === "pending" ? pendingLoading : approvedLoading;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-white flex items-center gap-2">
            <UserCheck className="text-brand-accent" /> Painter Management
          </h1>
          <p className="text-brand-mid text-sm mt-1">Review applications and manage active painters</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-brand-mid bg-brand-card border border-brand-mid/30 rounded-lg px-3 py-2">
          <Brush size={13} className="text-brand-accent" />
          <span>{pendingList.length} pending · {approvedList.length} approved</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border transition-all ${
            activeTab === "pending"
              ? "bg-brand-accent text-brand-black border-brand-accent"
              : "bg-brand-card border-brand-mid/30 text-brand-mid hover:text-brand-white"
          }`}>
          <XCircle size={15} /> Pending Applications
          {pendingList.length > 0 && (
            <span className={`ml-1 text-[11px] font-bold px-1.5 py-0.5 rounded-full
              ${activeTab === "pending" ? "bg-brand-black/20 text-brand-black" : "bg-brand-accent/20 text-brand-accent"}`}>
              {pendingList.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border transition-all ${
            activeTab === "approved"
              ? "bg-brand-accent text-brand-black border-brand-accent"
              : "bg-brand-card border-brand-mid/30 text-brand-mid hover:text-brand-white"
          }`}>
          <Users size={15} /> All Painters
          {approvedList.length > 0 && activeTab === "approved" && (
            <span className="ml-1 text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-brand-black/20 text-brand-black">
              {approvedList.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "pending" && (
        <div className="flex items-center gap-2 bg-brand-card/50 border border-brand-mid/20 p-3 rounded-lg text-xs text-brand-lt-gray w-fit">
          <input type="checkbox" id="deleteVideoOption" checked={deleteVideoOnApprove}
            onChange={(e) => setDeleteVideoOnApprove(e.target.checked)}
            className="rounded accent-brand-accent cursor-pointer" />
          <label htmlFor="deleteVideoOption" className="cursor-pointer">
            Automatically remove verification video upon approval
          </label>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="py-16 flex justify-center">
          <Loader size={26} className="animate-spin text-brand-accent" />
        </div>
      ) : (
        <div className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[860px]">
              <thead>
                <tr className="border-b border-brand-mid/20 bg-brand-black/40">
                  {(activeTab === "pending" ? PENDING_HEADERS : APPROVED_HEADERS).map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-brand-mid font-medium text-xs whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>

                {/* ── PENDING ── */}
                {activeTab === "pending" && (
                  pendingList.length === 0 ? (
                    <tr><td colSpan={7} className="py-16 text-center text-brand-mid">No pending applications</td></tr>
                  ) : pendingList.map((painter) => (
                    <tr key={painter._id} className="border-b border-brand-mid/10 hover:bg-brand-black/20 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {painter.profileImage?.url ? (
                            <img src={painter.profileImage.url} alt="Profile"
                              className="w-8 h-8 rounded-full object-cover border border-brand-border" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-brand-raised flex items-center justify-center text-xs text-brand-accent font-bold border border-brand-border">
                              {painter.user.firstName[0]}
                            </div>
                          )}
                          <div>
                            <p className="text-brand-white font-medium whitespace-nowrap">{painter.user.firstName} {painter.user.lastName}</p>
                            <p className="text-brand-mid text-xs">Completion: {painter.profileCompletion}%</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-brand-lt-gray text-xs whitespace-nowrap">{painter.user.phoneNumber}</p>
                        <p className="text-brand-mid text-xs truncate max-w-[150px]">{painter.user.email}</p>
                      </td>
                      <td className="px-5 py-4 text-brand-lt-gray text-xs whitespace-nowrap">{painter.city}, {painter.state}</td>
                      <td className="px-5 py-4 text-brand-lt-gray text-xs whitespace-nowrap">{painter.yearsOfExperience} yrs</td>
                      <td className="px-5 py-4">
                        {painter.verificationVideo?.url ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-green-400 bg-green-950/40 border border-green-800/40 px-2 py-0.5 rounded-full">
                            <Video size={10} /> Attached
                          </span>
                        ) : (
                          <span className="text-brand-mid text-[11px] italic">None</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-brand-mid text-xs whitespace-nowrap">
                        {formatDate(painter.applicationDate || painter.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <button onClick={() => setDetailTarget(painter)} title="View Details"
                            className="p-1.5 text-brand-mid hover:text-brand-white hover:bg-brand-black/50 rounded-md transition-colors">
                            <Eye size={15} />
                          </button>
                          <button onClick={() => setRejectTarget(painter)}
                            className="flex items-center gap-1 bg-red-950/30 hover:bg-red-900/40 border border-red-800/40
                              text-red-400 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all">
                            <XCircle size={13} /> Reject
                          </button>
                          <button
                            onClick={() => approveMutation.mutate(painter._id)}
                            disabled={approveMutation.isPending && approveMutation.variables === painter._id}
                            className="flex items-center gap-1 bg-green-950/40 hover:bg-green-900/50 border border-green-800/50
                              text-green-400 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all disabled:opacity-50">
                            {approveMutation.isPending && approveMutation.variables === painter._id
                              ? <Loader size={13} className="animate-spin" />
                              : <CheckCircle2 size={13} />}
                            Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}

                {/* ── APPROVED ── */}
                {activeTab === "approved" && (
                  approvedList.length === 0 ? (
                    <tr><td colSpan={7} className="py-16 text-center text-brand-mid">No approved painters found</td></tr>
                  ) : approvedList.map((painter) => {
                    // Use the `status` field directly — "active" or "inactive"
                    const isActive   = painter.status === "active";
                    const isToggling = toggleMutation.isPending && toggleMutation.variables === painter._id;

                    return (
                      <tr key={painter._id}
                        className={`border-b border-brand-mid/10 transition-colors ${
                          isActive ? "hover:bg-brand-black/20" : "bg-red-950/10 hover:bg-red-950/20"
                        }`}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {painter.profileImage?.url ? (
                              <img src={painter.profileImage.url} alt="Profile"
                                className="w-8 h-8 rounded-full object-cover border border-brand-border" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-brand-raised flex items-center justify-center text-xs text-brand-accent font-bold border border-brand-border">
                                {painter.user.firstName[0]}
                              </div>
                            )}
                            <div>
                              <p className={`font-medium whitespace-nowrap text-sm ${isActive ? "text-brand-white" : "text-brand-mid"}`}>
                                {painter.user.firstName} {painter.user.lastName}
                              </p>
                              <p className="text-brand-mid text-xs">Completion: {painter.profileCompletion}%</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-brand-lt-gray text-xs whitespace-nowrap">{painter.user.phoneNumber}</p>
                          <p className="text-brand-mid text-xs truncate max-w-[150px]">{painter.user.email}</p>
                        </td>
                        <td className="px-5 py-4 text-brand-lt-gray text-xs whitespace-nowrap">{painter.city}, {painter.state}</td>
                        <td className="px-5 py-4 text-brand-lt-gray text-xs whitespace-nowrap">{painter.yearsOfExperience} yrs</td>

                        {/* Status badge — vivid green or vivid red */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-bold border capitalize ${
                            isActive
                              ? "text-green-300 bg-green-950/60 border-green-700/60"
                              : "text-red-300 bg-red-950/60 border-red-700/60"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-400" : "bg-red-400"}`} />
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-brand-mid text-xs whitespace-nowrap">
                          {formatDate(painter.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <button onClick={() => setDetailTarget(painter)} title="View Details"
                              className="p-1.5 text-brand-mid hover:text-brand-white hover:bg-brand-black/50 rounded-md transition-colors">
                              <Eye size={15} />
                            </button>

                            {/* Toggle button — green when inactive (to activate), red when active (to deactivate) */}
                            <button
                              onClick={() => toggleMutation.mutate(painter._id)}
                              disabled={isToggling}
                              title={isActive ? "Click to deactivate" : "Click to activate"}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold
                                border transition-all disabled:opacity-50 ${
                                  isActive
                                    ? "bg-red-950/40 hover:bg-red-900/60 border-red-700/50 text-red-300"
                                    : "bg-green-950/40 hover:bg-green-900/60 border-green-700/50 text-green-300"
                                }`}>
                              {isToggling
                                ? <Loader size={13} className="animate-spin" />
                                : isActive
                                ? <ToggleRight size={14} />
                                : <ToggleLeft size={14} />
                              }
                              {isActive ? "Deactivate" : "Activate"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}

              </tbody>
            </table>
          </div>
        </div>
      )}

      {rejectTarget && <RejectModal painter={rejectTarget} onClose={() => setRejectTarget(null)} />}
      {detailTarget && <DetailModal painter={detailTarget} onClose={() => setDetailTarget(null)} />}
    </div>
  );
}