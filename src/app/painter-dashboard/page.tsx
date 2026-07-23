


// "use client";
// import Link from "next/link";
// import {
//   ShoppingCart, Package, Users, CreditCard,
//   TrendingUp, Brush, Calculator, MessageSquare,
// } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import {  adminGetOrders } from "@/lib/adminApi";
// import { painterGetDashboardStats,painterRequests } from "@/lib/painterApi";

// import LoadingSkeleton from "./components/Loading";
// import { formatDate, formatCurrency } from "@/lib/utils";

// const statusPill: Record<string, string> = {
//   Delivered:  "bg-emerald-950/60 text-emerald-400 border border-emerald-800/50",
//   Processing: "bg-blue-950/60 text-blue-400 border border-blue-800/50",
//   Pending:    "bg-yellow-950/60 text-yellow-400 border border-yellow-800/50",
//   Confirmed:  "bg-violet-950/60 text-violet-400 border border-violet-800/50",
//   Cancelled:  "bg-red-950/60 text-red-400 border border-red-800/50",
// };

// const quickLinks = [
//   { label: "Manage Orders",     href: "/dashboard/orders",         dot: "bg-blue-500" },
//   { label: "Add Product",       href: "/dashboard/products",         dot: "bg-emerald-500" },
//   { label: "Painter Requests", href: "/dashboard/painter-requests", dot: "bg-orange-500" },
//   { label: "Site Estimators",  href: "/dashboard/site-estimators",  dot: "bg-cyan-500" },
// ];

// interface Order {
//   _id: string; customerName: string; email: string; phoneNumber: string;
//   deliveryAddress: string; state: string; city: string;
//   orderedProducts: { name: string; quantity: number; selectedColour: string }[];
//   totalAmount: number; paymentMethod: string; paymentStatus: string;
//   orderStatus: string; notes?: string; createdAt: string;
// }

// export interface DashboardStats {
//   totalUsers: number;
//   totalProducts: number;
//   totalOrders: number;
//   totalRevenue: number;
//   totalLeads: number;
//   totalPainterRequests: number;
//   totalEstimatorRequests: number;
//   totalContacts: number;
// }

// export default function DashboardPage() {
//   // Fetch Orders
//   const { data: orders, isLoading: isOrdersLoading } = useQuery({
//     queryKey: ["painter-request"],
//     queryFn: async () => {
//       try {
//         const res = await painterRequests();
//         return (res )
//       } catch { return null }
//     },
//   });
//   console.log('req', orders)

//   // Fetch Stats cleanly without setting internal useState inside queryFn
//   const { data: statsData, isLoading: isStatsLoading } = useQuery({
//     queryKey: ["painters-stats"],
//     queryFn: async () => {
//       try {
//         const res = await painterGetDashboardStats();
//         return  res as DashboardStats;
//       } catch { return null }
//     },
//   });
// console.log('painter',statsData)
//   if (isOrdersLoading || isStatsLoading) return <LoadingSkeleton />;

//   const stattistics = [
//     { label: "Total Orders",       value: statsData?.totalOrders ?? "0", change: "+12%", icon: ShoppingCart, ring: "border-blue-800/50",   bg: "bg-blue-950/40",   text: "text-blue-400",    ch: "text-blue-500" },
//     { label: "Products",           value: statsData?.totalProducts ?? "0",    change: "+3",   icon: Package,      ring: "border-emerald-800/50", bg: "bg-emerald-950/40", text: "text-emerald-400", ch: "text-emerald-500" },
//     { label: "Customers",          value: statsData?.totalUsers ?? "0", change: "+8%",  icon: Users,        ring: "border-violet-800/50",  bg: "bg-violet-950/40",  text: "text-violet-400",  ch: "text-violet-500" },
//     { label: "Revenue",            value: formatCurrency(statsData?.totalRevenue ?? 0), change: "+22%", icon: CreditCard,   ring: "border-brand-accent/30", bg: "bg-brand-accent-muted", text: "text-brand-accent", ch: "text-brand-accent" },
//     { label: "Painter Requests",   value: statsData?.totalPainterRequests ?? "0",    change: "+5",   icon: Brush,        ring: "border-orange-800/50",  bg: "bg-orange-950/40",  text: "text-orange-400",  ch: "text-orange-500" },
//     { label: "Estimator Bookings", value: statsData?.totalEstimatorRequests ?? "0",    change: "+7",   icon: Calculator,   ring: "border-cyan-800/50",    bg: "bg-cyan-950/40",    text: "text-cyan-400",    ch: "text-cyan-500" },
//     { label: "Leads",              value: statsData?.totalLeads ?? "0",    change: "+2",   icon: TrendingUp,   ring: "border-pink-800/50",    bg: "bg-pink-950/40",    text: "text-pink-400",    ch: "text-pink-500" },
//     { label: "Enquiries",          value: statsData?.totalContacts ?? "0",    change: "-2",   icon: MessageSquare, ring: "border-pink-800/50",    bg: "bg-pink-950/40",    text: "text-pink-400",    ch: "text-pink-500" },
//   ];

//   return (
//     <div className="flex flex-col gap-6 sm:gap-8 max-w-full overflow-hidden">
//       {/* Page header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div>
//           <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
//           <p className="text-brand-mid text-sm mt-0.5">
//             Welcome back, Admin — here&apos;s your overview.
//           </p>
//         </div>
//         <div className="self-start sm:self-center flex items-center gap-2 text-xs text-brand-mid bg-brand-card
//           border border-brand-border rounded-lg px-3 py-2">
//           <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
//           All systems operational
//         </div>
//       </div>

//       {/* Stats grid (with added xs-breakpoint micro refinement) */}
//       {/* <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-3"> */}
//         {/* Starts at 1 column on tiny screens, drops into 2 columns at 400px, and 4 columns on tablets */}
// {/*  */}
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  Briefcase, Star, Eye, CheckCircle2, 
  User, MapPin, Calendar, Clock, X, AlertTriangle 
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { 
  painterGetDashboardStats, 
  painterRequests, 
  acceptPainterRequest, 
  declinePainterRequest ,
  painterGetStatus
} from "@/lib/painterApi";
import LoadingSkeleton from "./components/Loading";
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
  additionalNotes?: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

interface PainterProfile {
  firstName: string;
  lastName: string;
  availabilityStatus: string;
  profileCompletion: number;
}

interface DashboardStats {
  completedJobs: number;
  averageRating: number;
  profileViews: number;
  totalReviews: number;
}

export default function PainterDashboard() {
  const qc = useQueryClient();
  const [declineId, setDeclineId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");

  // Fetch Stats Data
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["painters-stats"],
    queryFn: async () => {
      try {
        const res = await painterGetDashboardStats();
        return res as { painter: PainterProfile; statistics: DashboardStats };
      } catch { return null; }
    },
  });
// 
 const { data: status } = useQuery({
  queryKey: ["painters-status"],
  queryFn: async () => {
    try {
      const res = await painterGetStatus();
      console.log("r", res);
      return res;
    } catch (error) {
      console.error("painterGetStatus failed:", error); // <-- Add this!
      return null;
    }
  },
});

console.log("status", status);
  // Fetch Requests Data
  const { data: requestsData, isLoading: isRequestsLoading } = useQuery<PainterRequest[]>({
    queryKey: ["painter-requests"],
    queryFn: async () => {
      try {
        const res = await painterRequests();
        return (res?.requests ?? []) as PainterRequest[];
      } catch { return []; }
    },
  });

  // Mutation Handlers for Action Triggers
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

  if (isStatsLoading || isRequestsLoading) return <LoadingSkeleton />;

  const stats = statsData?.statistics;
  const painter = statsData?.painter;

  const statCards = [
    { label: "Completed Jobs", value: stats?.completedJobs ?? 0, icon: Briefcase, ring: "border-blue-800/50", bg: "bg-blue-950/40", text: "text-blue-400" },
    { label: "Average Rating", value: `${stats?.averageRating ?? 0} / 5`, icon: Star, ring: "border-amber-800/50", bg: "bg-amber-950/40", text: "text-amber-400" },
    { label: "Profile Views", value: stats?.profileViews ?? 0, icon: Eye, ring: "border-violet-800/50", bg: "bg-violet-950/40", text: "text-violet-400" },
    { label: "Profile Completion", value: `${painter?.profileCompletion ?? 0}%`, icon: CheckCircle2, ring: "border-emerald-800/50", bg: "bg-emerald-950/40", text: "text-emerald-400" },
  ];

  // Slice requests array to display recent entries on dashboard overview
  const recentRequests = requestsData?.slice(0, 5) ?? [];

  return (
    <div className="flex flex-col gap-6 sm:gap-8 max-w-full overflow-hidden">
      {/* Header section */}
      {!status.verificationVideoUploaded ? (
  <div className="rounded-md border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
    {status?.message}
  </div>
) : status?.approvalStatus === 'approved' ? (
  <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
    Verification approved
  </div>
) : null}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            Welcome back, {painter?.firstName || "Painter"}
          </h1>
          <p className="text-brand-mid text-sm mt-0.5">
            Here is your current performance overview and job pipeline status.
          </p>
        </div>
        {/* <div className="self-start sm:self-center flex items-center gap-2 text-xs text-brand-mid bg-brand-card border border-brand-border rounded-lg px-3 py-2">
          <span className={`w-1.5 h-1.5 rounded-full ${painter?.availabilityStatus === "available" ? "bg-emerald-400" : "bg-red-400"}`} />
          Status: <span className="capitalize text-white font-medium">{painter?.availabilityStatus || "unknown"}</span>
        </div> */}
      </div>

      {/* Dynamic Statistics Cards Grid */}
      <div className="grid grid-cols-1 @[400px]:grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`border rounded-xl p-4 flex flex-col gap-3 transition-transform duration-200 ${s.ring} ${s.bg}`}>
              <div className="flex items-center justify-between">
                <Icon size={17} className={s.text} />
              </div>
              <div>
                <p className={`font-bold text-xl sm:text-2xl font-display tracking-tight text-white`}>{s.value}</p>
                <p className="text-brand-mid text-[11px] mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Container Layer */}
      <div className="grid lg:grid-cols-1 gap-5">
        <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border/60">
            <h3 className="text-white font-semibold text-sm">Recent Incoming Job Requests</h3>
            <Link href="/painter-dashboard/painter-requests" className="text-brand-accent text-xs hover:underline underline-offset-2">
              View all requests ({requestsData?.length || 0}) →
            </Link>
          </div>

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
                {recentRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-brand-mid text-xs">No project requests assigned yet.</td>
                  </tr>
                ) : (
                  recentRequests.map((r) => (
                    <tr key={r._id} className="border-b border-brand-border/30 hover:bg-brand-raised/40 transition-colors">
                      {/* Client Identity Block */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col">
                          <span className="text-white font-medium text-sm flex items-center gap-1.5"><User size={13} className="text-brand-mid" /> {r.fullName}</span>
                          <span className="text-brand-mid text-xs mt-0.5">{r.phoneNumber}</span>
                        </div>
                      </td>
                      
                      {/* Project Meta Info */}
                      <td className="px-5 py-3.5 max-w-xs">
                        <div className="flex flex-col">
                          <span className="text-brand-accent text-xs font-semibold">{r.projectType} ({r.propertyType})</span>
                          <p className="text-brand-lt-gray text-xs truncate mt-0.5">{r.projectDescription}</p>
                        </div>
                      </td>

                      {/* Location Badge */}
                      <td className="px-5 py-3.5 text-brand-lt-gray text-sm">
                        <span className="flex items-center gap-1 text-xs text-white"><MapPin size={12} className="text-brand-mid" /> {r.propertyLocation}</span>
                      </td>

                      {/* Date Indicator */}
                      <td className="px-5 py-3.5 text-brand-mid text-xs">
                        <span className="flex items-center gap-1 text-white"><Calendar size={12} className="text-brand-mid" /> {formatDate(r.preferredStartDate)}</span>
                      </td>

                      {/* Status Column */}
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize ${statusPill[r.status]}`}>
                          {r.status}
                        </span>
                      </td>

                      {/* Dynamic Action Controls */}
                      <td className="px-5 py-3.5">
                        {r.status === "pending" ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { if(confirm("Accept this job assignment?")) acceptMutation.mutate(r._id); }}
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
                            Handled {formatDate(r.createdAt)}
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
      </div>

      {/* Decline Reason Modal Overlay */}
      {declineId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeclineId(null)} />
          <div className="relative z-10 bg-brand-card border border-brand-border rounded-xl p-5 max-w-md w-full shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-400" /> Decline Project Request
              </h4>
              <button onClick={() => setDeclineId(null)} className="text-brand-mid hover:text-white transition-colors"><X size={16} /></button>
            </div>
            <p className="text-xs text-brand-mid mb-4">Provide a cancellation statement or reasoning below to decline this client request assignment.</p>
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