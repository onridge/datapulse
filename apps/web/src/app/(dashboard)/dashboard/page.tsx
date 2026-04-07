"use client";

import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { getGreeting } from "@/lib/date";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardPage() {
  const { user } = useAuthStore();
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-[13px] text-t1 font-bold tracking-[-0.4px]">
          {getGreeting(user?.firstName ?? "")}
        </h1>
        <p className="text-t3 text-[13px]">Welcome back — here's what's happening.</p>
      </div>
      <StatsGrid />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <RevenueChart />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
      <TransactionsTable />
    </div>
  );
}
