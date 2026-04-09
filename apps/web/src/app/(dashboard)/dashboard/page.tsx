"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { CategoryDonut } from "@/components/dashboard/CategoryDonut";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { getGreeting } from "@/lib/date";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
      gsap.fromTo(
        ".dashboard-section",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.1, delay: 0.2, ease: "power2.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div ref={headerRef} className="grid gap-1">
        <h1 className="text-[20px] text-t1 font-bold tracking-[-0.4px]">
          {getGreeting(user?.firstName ?? "")}
        </h1>
        <p className="text-t3 text-[13px]">Here's what's happening with your store today.</p>
      </div>

      <div className="dashboard-section">
        <StatsGrid />
      </div>

      <div className="dashboard-section grid grid-cols-[1fr_300px] gap-6">
        <RevenueChart />
        <CategoryDonut />
      </div>

      <div className="dashboard-section grid grid-cols-[1fr_300px] gap-6">
        <TransactionsTable />
        <ActivityFeed />
      </div>
    </div>
  );
}
