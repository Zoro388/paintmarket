"use client";
import Link from "next/link";
import {
  ShoppingCart, Package, Users, CreditCard,
  TrendingUp, Brush, Calculator, MessageSquare,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { adminGetDashboardStats, adminGetOrders } from "@/lib/adminApi";
import LoadingSkeleton from "./components/Loading";
import { useState } from "react";
import { formatDate,formatCurrency } from "@/lib/utils";






const statusPill: Record<string, string> = {
  Delivered:  "bg-emerald-950/60 text-emerald-400 border border-emerald-800/50",
  Processing: "bg-blue-950/60 text-blue-400 border border-blue-800/50",
  Pending:    "bg-yellow-950/60 text-yellow-400 border border-yellow-800/50",
  Confirmed:  "bg-violet-950/60 text-violet-400 border border-violet-800/50",
  Cancelled:  "bg-red-950/60 text-red-400 border border-red-800/50",
};

const quickLinks = [
  { label: "Manage Orders",    href: "/dashboard/orders",           dot: "bg-blue-500" },
  { label: "Add Product",      href: "/dashboard/products",         dot: "bg-emerald-500" },
  { label: "Painter Requests", href: "/dashboard/painter-requests", dot: "bg-orange-500" },
  { label: "Site Estimators",  href: "/dashboard/site-estimators",  dot: "bg-cyan-500" },
  // { label: "View Leads",       href: "/dashboard/leads",            dot: "bg-violet-500" },
  // { label: "Blog Posts",       href: "/dashboard/blog",             dot: "bg-pink-500" },
];
interface Order {
  _id: string; customerName: string; email: string; phoneNumber: string;
  deliveryAddress: string; state: string; city: string;
  orderedProducts: { name: string; quantity: number; selectedColour: string }[];
  totalAmount: number; paymentMethod: string; paymentStatus: string;
  orderStatus: string; notes?: string; createdAt: string;
}
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalLeads: number;
  totalPainterRequests: number;
  totalEstimatorRequests: number;
  totalContacts: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
}

export default function DashboardPage() {
   const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        const res = await adminGetOrders();
        console.log('res', res);
        return (res?.orders ?? []) as Order[];
      } catch { return [] }
    },
  
  });

  
  // dashboardStats
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
   const { data:stats, isLoading:statsLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      try {
        const res = await adminGetDashboardStats();
        console.log('res', res);
        setDashboardStats(res?.stats ?? null);
        return (res?.stats ?? []) as DashboardResponse;
      } catch { return [] }
    },
  
  });

  const stattistics= [
  { label: "Total Orders",       value: dashboardStats?.totalOrders ?? "0", change: "+12%", icon: ShoppingCart, ring: "border-blue-800/50",   bg: "bg-blue-950/40",   text: "text-blue-400",    ch: "text-blue-500" },
  { label: "Products",           value: dashboardStats?.totalProducts ?? "0",    change: "+3",   icon: Package,      ring: "border-emerald-800/50", bg: "bg-emerald-950/40", text: "text-emerald-400", ch: "text-emerald-500" },
  { label: "Customers",          value: dashboardStats?.totalUsers ?? "0", change: "+8%",  icon: Users,        ring: "border-violet-800/50",  bg: "bg-violet-950/40",  text: "text-violet-400",  ch: "text-violet-500" },
  { label: "Revenue",            value: formatCurrency(dashboardStats?.totalRevenue ?? 0), change: "+22%", icon: CreditCard,   ring: "border-brand-accent/30",bg: "bg-brand-accent-muted", text: "text-brand-accent", ch: "text-brand-accent" },
  { label: "Painter Requests",   value: dashboardStats?.totalPainterRequests ?? "0",    change: "+5",   icon: Brush,        ring: "border-orange-800/50",  bg: "bg-orange-950/40",  text: "text-orange-400",  ch: "text-orange-500" },
  { label: "Estimator Bookings", value: dashboardStats?.totalEstimatorRequests ?? "0",    change: "+7",   icon: Calculator,    ring: "border-cyan-800/50",    bg: "bg-cyan-950/40",    text: "text-cyan-400",    ch: "text-cyan-500" },
  { label: "Leads",              value: dashboardStats?.totalLeads ?? "0",    change: "+2",   icon: TrendingUp,   ring: "border-pink-800/50",    bg: "bg-pink-950/40",    text: "text-pink-400",    ch: "text-pink-500" },
  { label: "Enquiries",          value: dashboardStats?.totalContacts ?? "0",    change: "-2",   icon: MessageSquare,ring: "border-pink-800/50",    bg: "bg-pink-950/40",    text: "text-pink-400",    ch: "text-pink-500" },
];
  // { label: "Enquiries",          value: "28",    change: "-2",   icon: MessageSquare,ring: "border-pink-800/50",    bg: "bg-pink-950/40",    text: "text-pink-400",    ch: "text-pink-500" },
  // { label: "Growth",             value: "+18%",  change: "YoY",  icon: TrendingUp,   ring: "border-teal-800/50",    bg: "bg-teal-950/40",    text: "text-teal-400",    ch: "text-teal-500" },





 
    if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-brand-mid text-sm mt-0.5">
            Welcome back, Admin — here&apos;s your overview.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-brand-mid bg-brand-card
          border border-brand-border rounded-lg px-3 py-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          All systems operational
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stattistics?.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label}
              className={`border rounded-xl p-4 flex flex-col gap-3 ${s.ring} ${s.bg}`}>
              <div className="flex items-center justify-between">
                <Icon size={17} className={s.text} />
                <span className={`text-[10px] font-medium ${s.ch}`}>{s.change}</span>
              </div>
              <div>
                <p className={`font-bold text-2xl font-display ${s.text}`}>{s.value}</p>
                <p className="text-brand-mid text-[11px] mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom row */}
      {/* recent orders */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent orders table */}
        <div className="lg:col-span-2 bg-brand-card border border-brand-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border/60">
            <h3 className="text-white font-semibold text-sm">Recent Orders</h3>
            <Link href="/dashboard/orders"
              className="text-brand-accent text-xs hover:underline underline-offset-2">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border/30">
                  {["Order","Customer","Payment Status","Amount","Status","Date"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-gray-300
                      font-medium text-[11px] uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.map((o) => (
                  <tr key={o._id}
                    className="border-b border-brand-border/30 hover:bg-brand-raised/40
                      transition-colors">
                    <td className="px-5 py-3.5 text-brand-accent font-medium text-xs font-mono">
                      {o._id}
                    </td>
                    <td className="px-5 py-3.5 text-brand-lt-gray text-sm">{o.customerName}</td>
                                        <td className="px-5 py-3.5 text-white font-semibold text-sm">{o.
paymentStatus}</td>

                    <td className="px-5 py-3.5 text-white font-semibold text-sm">{formatCurrency(o.totalAmount)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${statusPill[o.orderStatus]}`}>
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-white text-xs">{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-brand-card border border-brand-border rounded-xl p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-2">
            {quickLinks.map((q) => (
              <Link key={q.label} href={q.href}
                className="flex items-center gap-3 px-4 py-3 bg-brand-raised
                  border border-brand-border/60 rounded-lg
                  hover:border-brand-accent/40 hover:bg-brand-accent-muted/30
                  transition-all group">
                <div className={`w-2 h-2 rounded-full ${q.dot} flex-shrink-0`} />
                <span className="text-brand-lt-gray text-sm group-hover:text-white transition-colors">
                  {q.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
