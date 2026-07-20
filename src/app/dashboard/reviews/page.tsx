

// "use client";
// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import { adminGetAllReviews, adminToggleReview, adminDeleteReview } from "../../../lib/adminApi";
// import { Star, Eye, EyeOff, Trash2, Loader, MessageSquare, Search, CheckCircle, X, User } from "lucide-react";

// interface PainterDetails {
//   _id: string;
//   bio?: string;
//   city?: string;
//   isVerified?: boolean;
//   approvalStatus?: string;
//   averageRating?: number;
// }

// interface Review {
//   _id: string;
//   customerName: string;
//   customerEmail: string;
//   customerPhone?: string;
//   rating: number;
//   review?: string;
//   isVisible: boolean;
//   createdAt: string;
//   painter?: PainterDetails;
// }

// function StarRow({ rating }: { rating: number }) {
//   return (
//     <div className="flex gap-0.5">
//       {[1, 2, 3, 4, 5].map((n) => (
//         <Star key={n} size={12}
//           className={n <= rating ? "fill-brand-accent text-brand-accent" : "text-brand-border"} />
//       ))}
//     </div>
//   );
// }

// export default function AdminReviewsPage() {
//   const qc = useQueryClient();
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");
  
//   // State to manage the active review modal popup
//   const [selectedReview, setSelectedReview] = useState<Review | null>(null);

//   const { data, isLoading } = useQuery<Review[]>({
//     queryKey: ["admin-reviews"],
//     queryFn: async () => {
//       const res = await adminGetAllReviews();
//       console.log('res', res);
//       return (res?.reviews ?? []) as Review[];
//     },
//   });

//   const toggleMutation = useMutation({
//     mutationFn: (id: string) => adminToggleReview(id),
//     onSuccess: (_, id) => {
//       qc.setQueryData(["admin-reviews"], (old: Review[] = []) =>
//         old.map((r) => r._id === id ? { ...r, isVisible: !r.isVisible } : r)
//       );
//       // Keep the modal data in sync if it happens to be open
//       if (selectedReview && selectedReview._id === id) {
//         setSelectedReview((prev) => prev ? { ...prev, isVisible: !prev.isVisible } : null);
//       }
//       toast.success("Review visibility toggled");
//     },
//     onError: (err: Error) => toast.error(err.message || "Toggle failed"),
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id: string) => adminDeleteReview(id),
//     onSuccess: (_, id) => {
//       qc.setQueryData(["admin-reviews"], (old: Review[] = []) => old.filter((r) => r._id !== id));
//       if (selectedReview && selectedReview._id === id) {
//         setSelectedReview(null);
//       }
//       toast.success("Review deleted");
//     },
//     onError: (err: Error) => toast.error(err.message || "Delete failed"),
//   });

//   const list = data ?? [];
//   const filtered = list
//     .filter((r) => filter === "all" ? true : filter === "hidden" ? !r.isVisible : r.isVisible)
//     .filter((r) => {
//       if (!search) return true;
//       const s = search.toLowerCase();
//       return (
//         r.customerName.toLowerCase().includes(s) ||
//         r.customerEmail.toLowerCase().includes(s) ||
//         (r.review && r.review.toLowerCase().includes(s))
//       );
//     });

//   const visibleCount = list.filter((r) => r.isVisible).length;
//   const hiddenCount  = list.length - visibleCount;

//   return (
//     <div className="flex flex-col gap-6 relative">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div>
//           <h1 className="font-display text-2xl font-bold text-white">Reviews</h1>
//           <p className="text-brand-mid text-sm mt-1">Manage all customer reviews across painters</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <div className="text-center bg-brand-card border border-brand-mid/30 rounded-lg px-4 py-2">
//             <p className="text-brand-accent font-bold">{list.length}</p>
//             <p className="text-brand-mid text-xs">Total</p>
//           </div>
//           <div className="text-center bg-brand-card border border-emerald-800/30 rounded-lg px-4 py-2">
//             <p className="text-emerald-400 font-bold">{visibleCount}</p>
//             <p className="text-brand-mid text-xs">Visible</p>
//           </div>
//           <div className="text-center bg-brand-card border border-brand-border/30 rounded-lg px-4 py-2">
//             <p className="text-brand-subtle font-bold">{hiddenCount}</p>
//             <p className="text-brand-mid text-xs">Hidden</p>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-3">
//         <div className="flex items-center gap-2 bg-brand-card border border-brand-mid/30 rounded-lg px-4 py-2.5 max-w-sm">
//           <Search size={14} className="text-brand-mid" />
//           <input value={search} onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search reviews or customer..."
//             className="bg-transparent text-white text-sm placeholder-brand-mid outline-none flex-1" />
//         </div>
//         <div className="flex gap-2">
//           {(["all", "visible", "hidden"] as const).map((f) => (
//             <button key={f} onClick={() => setFilter(f)}
//               className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition-colors border
//                 ${filter === f
//                   ? "bg-brand-accent text-brand-black border-brand-accent"
//                   : "bg-brand-card border-brand-mid/30 text-brand-mid hover:text-white"
//                 }`}>
//               {f}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Table Layout */}
//       <div className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm min-w-[850px]">
//             <thead>
//               <tr className="border-b border-brand-mid/20 bg-brand-black/40">
//                 {["Customer Info", "Rating", "Review Snippet", "Date", "Status", "Inspection", "Actions"].map((h) => (
//                   <th key={h} className="text-left px-5 py-3.5 text-brand-mid font-medium text-xs whitespace-nowrap">
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading ? (
//                 <tr>
//                   <td colSpan={7} className="py-16 text-center">
//                     <Loader size={22} className="animate-spin text-brand-accent mx-auto" />
//                   </td>
//                 </tr>
//               ) : filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="py-16 text-center">
//                     <div className="flex flex-col items-center gap-2">
//                       <MessageSquare size={32} className="text-brand-mid" />
//                       <p className="text-brand-mid text-sm">No reviews found</p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((r) => (
//                   <tr key={r._id}
//                     className={`border-b border-brand-mid/10 transition-colors hover:bg-brand-black/20
//                       ${!r.isVisible ? "opacity-50" : ""}`}>
                    
//                     {/* Customer Info */}
//                     <td className="px-5 py-4 text-white text-xs">
//                       <div className="font-medium text-white">{r.customerName}</div>
//                       <div className="text-brand-mid text-[11px]">{r.customerEmail}</div>
//                     </td>

//                     {/* Rating */}
//                     <td className="px-5 py-4">
//                       <StarRow rating={r.rating} />
//                     </td>

//                     {/* Review Text Snippet */}
//                     <td className="px-5 py-4 text-brand-lt-gray text-xs max-w-[260px]">
//                       <p className="truncate">{r.review || "—"}</p>
//                     </td>

//                     {/* Date */}
//                     <td className="px-5 py-4 text-brand-mid text-xs whitespace-nowrap">
//                       {new Date(r.createdAt).toLocaleDateString("en-GB", {
//                         day: "numeric", month: "short", year: "numeric",
//                       })}
//                     </td>

//                     {/* Status badge */}
//                     <td className="px-5 py-4">
//                       {r.isVisible ? (
//                         <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
//                           <Eye size={11} /> Visible
//                         </span>
//                       ) : (
//                         <span className="flex items-center gap-1 text-brand-subtle text-[11px]">
//                           <EyeOff size={11} /> Hidden
//                         </span>
//                       )}
//                     </td>

//                     {/* View Details Target */}
//                     <td className="px-5 py-4">
//                       <button
//                         onClick={() => setSelectedReview(r)}
//                         className="px-3 py-1 bg-brand-raised hover:bg-brand-mid/20 text-brand-accent text-xs rounded-md border border-brand-mid/20 transition-all font-medium"
//                       >
//                         View Details
//                       </button>
//                     </td>

//                     {/* Primary Operations (Toggle/Delete) */}
//                     <td className="px-5 py-4">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => toggleMutation.mutate(r._id)}
//                           disabled={toggleMutation.isPending && toggleMutation.variables === r._id}
//                           className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border transition-colors disabled:opacity-40
//                             ${!r.isVisible
//                               ? "border-emerald-800/40 text-emerald-400 hover:bg-emerald-900/20"
//                               : "border-brand-border text-brand-mid hover:text-white"
//                             }`}
//                         >
//                           {toggleMutation.isPending && toggleMutation.variables === r._id ? (
//                             <Loader size={11} className="animate-spin" />
//                           ) : r.isVisible ? (
//                             <EyeOff size={11} />
//                           ) : (
//                             <Eye size={11} />
//                           )}
//                           {r.isVisible ? "Hide" : "Show"}
//                         </button>

//                         <button
//                           onClick={() => { if (window.confirm("Are you sure you want to permanently delete this review?")) deleteMutation.mutate(r._id); }}
//                           disabled={deleteMutation.isPending && deleteMutation.variables === r._id}
//                           className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-red-900/40 text-red-500 hover:bg-red-900/10 transition-colors"
//                         >
//                           <Trash2 size={11} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Details Modal Overlay */}
//       {selectedReview && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-brand-card border border-brand-mid/40 rounded-xl max-w-2xl w-full text-white shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            
//             {/* Modal Header */}
//             <div className="p-5 border-b border-brand-mid/20 flex items-center justify-between bg-brand-black/30">
//               <div>
//                 <h3 className="font-display font-bold text-lg text-white">Review Detailed Analysis</h3>
//                 <p className="text-xs text-brand-mid mt-0.5">ID Reference: {selectedReview._id}</p>
//               </div>
//               <button 
//                 onClick={() => setSelectedReview(null)}
//                 className="p-1.5 rounded-lg bg-brand-raised text-brand-mid hover:text-white border border-brand-mid/20"
//               >
//                 <X size={16} />
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6 overflow-y-auto flex flex-col gap-6">
              
//               {/* Top Row: Customer Overview & Rating */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-brand-black/20 p-4 rounded-lg border border-brand-mid/10">
//                 <div>
//                   <span className="text-[11px] font-bold text-brand-accent uppercase tracking-wider block mb-1">Customer Info</span>
//                   <p className="font-medium text-white text-sm">{selectedReview.customerName}</p>
//                   <p className="text-xs text-brand-mid mt-0.5">{selectedReview.customerEmail}</p>
//                   {selectedReview.customerPhone && (
//                     <p className="text-xs font-mono text-brand-subtle mt-1">{selectedReview.customerPhone}</p>
//                   )}
//                 </div>
//                 <div>
//                   <span className="text-[11px] font-bold text-brand-accent uppercase tracking-wider block mb-1">Metrics & Score</span>
//                   <div className="mt-1 flex items-center gap-2">
//                     <StarRow rating={selectedReview.rating} />
//                     <span className="text-xs text-white font-bold bg-brand-raised px-1.5 py-0.5 rounded">
//                       {selectedReview.rating}/5
//                     </span>
//                   </div>
//                   <p className="text-xs text-brand-mid mt-2">
//                     Date Logged: {new Date(selectedReview.createdAt).toLocaleString("en-GB")}
//                   </p>
//                 </div>
//               </div>

//               {/* Middle Section: Full Written Assessment Review */}
//               <div>
//                 <span className="text-[11px] font-bold text-brand-mid uppercase tracking-wider block mb-2">Full Review Content</span>
//                 <div className="bg-brand-raised/40 p-4 rounded-lg border border-brand-mid/20 text-brand-lt-gray text-sm leading-relaxed whitespace-pre-wrap">
//                   {selectedReview.review || <span className="text-brand-subtle italic">No written comment text provided with this rating score.</span>}
//                 </div>
//               </div>

//               {/* Bottom Section: Attached Painter Info Details Block */}
//               <div>
//                 <span className="text-[11px] font-bold text-brand-mid uppercase tracking-wider block mb-2">Linked Painter Ownership</span>
//                 {selectedReview.painter ? (
//                   <div className="border border-brand-mid/20 bg-brand-black/40 rounded-lg p-4 flex flex-col gap-3">
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-center gap-2.5">
//                         <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20">
//                           <User size={14} className="text-brand-accent" />
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-white flex items-center gap-1.5">
//                             {selectedReview.painter.bio || "Unnamed Specialist"}
//                             {selectedReview.painter.isVerified && (
//                               <CheckCircle size={13} className="text-emerald-400" />
//                             )}
//                           </div>
//                           <p className="text-xs text-brand-mid">Location Base: {selectedReview.painter.city || "Unknown Operations Area"}</p>
//                         </div>
//                       </div>
//                       <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
//                         selectedReview.painter.approvalStatus === "approved" 
//                           ? "border-emerald-900 text-emerald-400 bg-emerald-950/20" 
//                           : "border-brand-mid/30 text-brand-mid"
//                       }`}>
//                         {selectedReview.painter.approvalStatus || "Pending"}
//                       </span>
//                     </div>

//                     <div className="pt-2 border-t border-brand-mid/10 grid grid-cols-2 text-[11px] text-brand-subtle font-mono">
//                       <div>Painter System ID: {selectedReview.painter._id}</div>
//                       <div className="text-right text-brand-mid">Avg Score Metric: {selectedReview.painter.averageRating || 0}★</div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="p-4 bg-brand-raised/20 border border-dashed border-brand-mid/20 rounded-lg text-center text-xs text-brand-subtle italic">
//                     No matching painter profile record could be discovered for this specific review pipeline entry.
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Modal Footer Controls */}
//             <div className="p-4 bg-brand-black/40 border-t border-brand-mid/20 flex items-center justify-end gap-3">
//               <button
//                 onClick={() => {
//                   if (window.confirm("Delete this entry permanently?")) {
//                     deleteMutation.mutate(selectedReview._id);
//                   }
//                 }}
//                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-900 text-red-400 text-xs hover:bg-red-950/30 transition-colors"
//               >
//                 <Trash2 size={12} /> Delete Entry
//               </button>
//               <button 
//                 onClick={() => setSelectedReview(null)}
//                 className="px-4 py-1.5 bg-brand-accent hover:opacity-90 text-brand-black text-xs font-bold rounded-lg transition-all"
//               >
//                 Dismiss Window
//               </button>
//             </div>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminGetAllReviews, adminToggleReview, adminDeleteReview } from "../../../lib/adminApi";
import { Star, Eye, EyeOff, Trash2, Loader, MessageSquare, Search, CheckCircle, X } from "lucide-react";

interface CloudinaryImage {
  url: string;
  publicId?: string;
}

interface PainterUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface PainterDetails {
  _id: string;
  bio?: string;
  city?: string;
  state?: string;
  isVerified?: boolean;
  approvalStatus?: string;
  averageRating?: number;
  profileImage?: CloudinaryImage;
  user?: PainterUser;
}

interface Review {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  rating: number;
  review?: string;
  isVisible: boolean;
  createdAt: string;
  painter?: PainterDetails;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={12}
          className={n <= rating ? "fill-brand-accent text-brand-accent" : "text-brand-border"} />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");
  
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const { data, isLoading } = useQuery<Review[]>({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const res = await adminGetAllReviews();
      console.log('res', res);
      return (res?.reviews ?? []) as Review[];
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminToggleReview(id),
    onSuccess: (_, id) => {
      qc.setQueryData(["admin-reviews"], (old: Review[] = []) =>
        old.map((r) => r._id === id ? { ...r, isVisible: !r.isVisible } : r)
      );
      if (selectedReview && selectedReview._id === id) {
        setSelectedReview((prev) => prev ? { ...prev, isVisible: !prev.isVisible } : null);
      }
      toast.success("Review visibility toggled");
    },
    onError: (err: Error) => toast.error(err.message || "Toggle failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeleteReview(id),
    onSuccess: (_, id) => {
      qc.setQueryData(["admin-reviews"], (old: Review[] = []) => old.filter((r) => r._id !== id));
      if (selectedReview && selectedReview._id === id) {
        setSelectedReview(null);
      }
      toast.success("Review deleted");
    },
    onError: (err: Error) => toast.error(err.message || "Delete failed"),
  });

  const list = data ?? [];
  const filtered = list
    .filter((r) => filter === "all" ? true : filter === "hidden" ? !r.isVisible : r.isVisible)
    .filter((r) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        r.customerName.toLowerCase().includes(s) ||
        r.customerEmail.toLowerCase().includes(s) ||
        (r.review && r.review.toLowerCase().includes(s))
      );
    });

  const visibleCount = list.filter((r) => r.isVisible).length;
  const hiddenCount  = list.length - visibleCount;

  return (
    <div className="flex flex-col gap-6 relative px-2 sm:px-4 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Reviews</h1>
          <p className="text-brand-mid text-sm mt-1">Manage all customer reviews across painters</p>
        </div>
        <div className="grid grid-cols-3 sm:flex items-center gap-2 sm:gap-3 w-full md:w-auto">
          <div className="text-center bg-brand-card border border-brand-mid/30 rounded-lg p-2 sm:px-4 sm:py-2">
            <p className="text-brand-accent font-bold text-base sm:text-lg">{list.length}</p>
            <p className="text-brand-mid text-[10px] sm:text-xs">Total</p>
          </div>
          <div className="text-center bg-brand-card border border-emerald-800/30 rounded-lg p-2 sm:px-4 sm:py-2">
            <p className="text-emerald-400 font-bold text-base sm:text-lg">{visibleCount}</p>
            <p className="text-brand-mid text-[10px] sm:text-xs">Visible</p>
          </div>
          <div className="text-center bg-brand-card border border-brand-border/30 rounded-lg p-2 sm:px-4 sm:py-2">
            <p className="text-brand-subtle font-bold text-base sm:text-lg">{hiddenCount}</p>
            <p className="text-brand-mid text-[10px] sm:text-xs">Hidden</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="flex items-center gap-2 bg-brand-card border border-brand-mid/30 rounded-lg px-4 py-2.5 w-full sm:max-w-sm">
          <Search size={14} className="text-brand-mid" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews or customer..."
            className="bg-transparent text-white text-sm placeholder-brand-mid outline-none flex-1" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(["all", "visible", "hidden"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition-colors border whitespace-nowrap flex-1 sm:flex-none
                ${filter === f
                  ? "bg-brand-accent text-brand-black border-brand-accent"
                  : "bg-brand-card border-brand-mid/30 text-brand-mid hover:text-white"
                }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm min-w-[640px] md:min-w-[900px]">
            <thead>
              <tr className="border-b border-brand-mid/20 bg-brand-black/40">
                <th className="text-left px-4 py-3.5 text-brand-mid font-medium text-xs whitespace-nowrap">Customer Info</th>
                <th className="text-left px-4 py-3.5 text-brand-mid font-medium text-xs whitespace-nowrap">Rating</th>
                <th className="text-left px-4 py-3.5 text-brand-mid font-medium text-xs whitespace-nowrap">Review Snippet</th>
                <th className="text-left px-4 py-3.5 text-brand-mid font-medium text-xs whitespace-nowrap hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3.5 text-brand-mid font-medium text-xs whitespace-nowrap hidden sm:table-cell">Status</th>
                <th className="text-left px-4 py-3.5 text-brand-mid font-medium text-xs whitespace-nowrap">Inspection</th>
                <th className="text-center px-4 py-3.5 text-brand-mid font-medium text-xs whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Loader size={22} className="animate-spin text-brand-accent mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <MessageSquare size={32} className="text-brand-mid" />
                      <p className="text-brand-mid text-sm">No reviews found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r._id}
                    className={`border-b border-brand-mid/10 transition-colors hover:bg-brand-black/20
                      ${!r.isVisible ? "opacity-60 bg-brand-black/10" : ""}`}>
                    
                    {/* Customer Info */}
                    <td className="px-4 py-4 text-white text-xs">
                      <div className="font-semibold text-white">{r.customerName}</div>
                      <div className="text-brand-mid text-[11px] truncate max-w-[140px] sm:max-w-none">{r.customerEmail}</div>
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StarRow rating={r.rating} />
                    </td>

                    {/* Review Text Snippet */}
                    <td className="px-4 py-4 text-brand-lt-gray text-xs max-w-[160px] md:max-w-[240px]">
                      <p className="truncate">{r.review || "—"}</p>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-brand-mid text-xs whitespace-nowrap hidden md:table-cell">
                      {new Date(r.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                      {r.isVisible ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-900/40">
                          <Eye size={11} /> Visible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-brand-subtle text-[11px] bg-brand-raised px-2 py-0.5 rounded-full border border-brand-mid/20">
                          <EyeOff size={11} /> Hidden
                        </span>
                      )}
                    </td>

                    {/* View Details Target */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedReview(r)}
                        className="px-2.5 py-1 bg-brand-raised hover:bg-brand-mid/30 text-brand-accent text-xs font-semibold rounded border border-brand-mid/20 transition-all"
                      >
                        View
                      </button>
                    </td>

                    {/* Primary Operations */}
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => toggleMutation.mutate(r._id)}
                          disabled={toggleMutation.isPending}
                          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded border transition-colors disabled:opacity-40
                            ${!r.isVisible
                              ? "border-emerald-800/40 text-emerald-400 hover:bg-emerald-900/20"
                              : "border-brand-border text-brand-mid hover:text-white"
                            }`}
                        >
                          {r.isVisible ? "Hide" : "Show"}
                        </button>

                        <button
                          onClick={() => { if (window.confirm("Are you sure you want to permanently delete this review?")) deleteMutation.mutate(r._id); }}
                          disabled={deleteMutation.isPending}
                          className="p-1.5 rounded border border-red-900/40 text-red-500 hover:bg-red-900/10 transition-colors"
                        >
                          <Trash2 size={12} />
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

      {/* Details Modal Overlay */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-brand-card border border-brand-mid/40 rounded-xl max-w-xl w-full text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-brand-mid/20 flex items-center justify-between bg-brand-black/40">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-white">Review Detailed Analysis</h3>
                <p className="text-[10px] text-brand-subtle font-mono mt-0.5 truncate max-w-[200px] sm:max-w-none">ID: {selectedReview._id}</p>
              </div>
              <button 
                onClick={() => setSelectedReview(null)}
                className="p-1.5 rounded-lg bg-brand-raised text-brand-mid hover:text-white border border-brand-mid/20"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-5 overflow-y-auto flex flex-col gap-5">
              
              {/* Top Section: Customer Overview & Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-brand-black/20 p-3.5 rounded-lg border border-brand-mid/10">
                <div>
                  <span className="text-[10px] font-bold text-brand-accent uppercase tracking-wider block mb-1">Customer Info</span>
                  <p className="font-semibold text-white text-sm">{selectedReview.customerName}</p>
                  <p className="text-xs text-brand-mid mt-0.5 break-all">{selectedReview.customerEmail}</p>
                  {selectedReview.customerPhone && (
                    <p className="text-xs font-mono text-brand-subtle mt-1">{selectedReview.customerPhone}</p>
                  )}
                </div>
                <div className="pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-brand-mid/10 sm:pl-4">
                  <span className="text-[10px] font-bold text-brand-accent uppercase tracking-wider block mb-1">Metrics & Score</span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <StarRow rating={selectedReview.rating} />
                    <span className="text-[11px] text-white font-bold bg-brand-raised px-1.5 py-0.5 rounded">
                      {selectedReview.rating}/5
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-mid mt-2">
                    Date: {new Date(selectedReview.createdAt).toLocaleString("en-GB")}
                  </p>
                </div>
              </div>

              {/* Middle Section: Full Written Assessment Review */}
              <div>
                <span className="text-[10px] font-bold text-brand-mid uppercase tracking-wider block mb-1.5">Full Review Content</span>
                <div className="bg-brand-raised/30 p-3.5 rounded-lg border border-brand-mid/20 text-brand-lt-gray text-xs sm:text-sm leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {selectedReview.review || <span className="text-brand-subtle italic">No written comment text provided with this rating score.</span>}
                </div>
              </div>

              {/* Bottom Section: Attached Painter Info Details Block */}
              <div>
                <span className="text-[10px] font-bold text-brand-mid uppercase tracking-wider block mb-1.5">Linked Painter Ownership</span>
                {selectedReview.painter ? (
                  <div className="border border-brand-mid/20 bg-brand-black/40 rounded-lg p-3.5 flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Profile Image View */}
                        {selectedReview.painter.profileImage?.url ? (
                          <img 
                            src={selectedReview.painter.profileImage.url} 
                            alt="Painter avatar" 
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-brand-accent/40 shadow-inner flex-shrink-0 bg-brand-black"
                          />
                        ) : (
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-accent/10 flex items-center justify-center border-2 border-brand-accent/20 flex-shrink-0">
                            <span className="text-xs font-bold text-brand-accent uppercase">
                              {selectedReview.painter.user?.firstName?.charAt(0) || "P"}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-1">
                            {selectedReview.painter.user 
                              ? `${selectedReview.painter.user.firstName} ${selectedReview.painter.user.lastName}`
                              : "Unnamed Painter"}
                            {selectedReview.painter.isVerified && (
                              <CheckCircle size={13} className="text-emerald-400 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-brand-mid mt-0.5 font-medium">
                            Location: {selectedReview.painter.city || "N/A"}, {selectedReview.painter.state || "N/A"}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border self-start sm:self-center ${
                        selectedReview.painter.approvalStatus === "approved" 
                          ? "border-emerald-900 text-emerald-400 bg-emerald-950/20" 
                          : "border-brand-mid/30 text-brand-mid bg-brand-raised"
                      }`}>
                        {selectedReview.painter.approvalStatus || "Pending"}
                      </span>
                    </div>

                    {selectedReview.painter.bio && (
                      <p className="text-[11px] sm:text-xs italic text-brand-lt-gray bg-brand-raised/20 p-2 rounded border border-brand-mid/10">
                        "{selectedReview.painter.bio}"
                      </p>
                    )}

                    <div className="pt-2 border-t border-brand-mid/10 flex flex-col sm:flex-row justify-between text-[10px] font-mono text-brand-subtle gap-1">
                      <div>Painter ID: {selectedReview.painter._id}</div>
                      <div>Avg Score Metric: {selectedReview.painter.averageRating ?? 0}★</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-brand-raised/20 border border-dashed border-brand-mid/20 rounded-lg text-center text-xs text-brand-subtle italic">
                    No matching painter profile record found for this review entry.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-3 bg-brand-black/50 border-t border-brand-mid/20 flex items-center justify-end gap-2.5">
              <button
                onClick={() => {
                  if (window.confirm("Delete this entry permanently?")) {
                    deleteMutation.mutate(selectedReview._id);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-900 text-red-400 text-xs font-medium hover:bg-red-950/30 transition-colors"
              >
                <Trash2 size={12} /> Delete Entry
              </button>
              <button 
                onClick={() => setSelectedReview(null)}
                className="px-4 py-1.5 bg-brand-accent hover:opacity-90 text-brand-black text-xs font-bold rounded-lg transition-all"
              >
                Dismiss
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}