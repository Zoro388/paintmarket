"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { apiGetProfile } from "@/lib/userApi";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: profile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await apiGetProfile();
      return (res?.user ?? res?.data ?? res) as { firstName?: string; lastName?: string };
    },
    retry: false,
  });

  const userName = profile?.firstName
    ? `${profile.firstName}${profile.lastName ? ` ${profile.lastName}` : ""}`.trim()
    : undefined;

  return (
    <div className="min-h-screen bg-brand-black">
      <DashboardSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:ml-60">
        <DashboardHeader onMenuClick={() => setMobileOpen(true)} userName={userName} />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
