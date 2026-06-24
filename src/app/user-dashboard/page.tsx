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
import OrdersPage from "./components/Orders";









export default function DashboardPage() {
   

  

  // { label: "Enquiries",          value: "28",    change: "-2",   icon: MessageSquare,ring: "border-pink-800/50",    bg: "bg-pink-950/40",    text: "text-pink-400",    ch: "text-pink-500" },
  // { label: "Growth",             value: "+18%",  change: "YoY",  icon: TrendingUp,   ring: "border-teal-800/50",    bg: "bg-teal-950/40",    text: "text-teal-400",    ch: "text-teal-500" },





 

  return (
    <div className="flex flex-col gap-8">
     <OrdersPage />
    </div>
  );
}
