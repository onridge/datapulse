"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

import { useDashboardStats } from "@/hooks/useDashboard";
import { cn } from "@/lib/utils";

import type { DashboardStats } from "@/types";

const fmt = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(0)}`);

function StatCard({
  label,
  value,
  change,
  prefix = "",
}: {
  label: string;
  value: string;
  change: number;
  prefix?: string;
}) {
  const positive = change >= 0;
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="text-[12px] text-t3 font-medium mb-3">{label}</div>
      <div className="text-[24px] font-bold tracking-[-0.5px] text-t1 mb-2">
        {prefix}
        {value}
      </div>
      <div
        className={cn(
          "text-[12px] font-medium inline-flex items-center gap-1 py-0.5 px-2 rounded-full",
          positive ? "text-green bg-green/10" : "text-red bg-red/10"
        )}
      >
        {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        {Math.abs(change)}%
      </div>
      <p className="text-[11px] text-t3 mt-1">vs last month</p>
    </div>
  );
}

export function StatsGrid() {
  const { data, isLoading } = useDashboardStats();
  const s = (data as { dashboardStats: DashboardStats } | undefined)?.dashboardStats;

  if (isLoading)
    return (
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-surface border border-border rounded-xl p-5 h-[110px] animate-pulse"
          />
        ))}
      </div>
    );

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        label="Total Revenue"
        value={fmt(s?.totalRevenue ?? 0)}
        change={s?.revenueChange ?? 0}
      />
      <StatCard
        label="Total Users"
        value={String(s?.totalUsers ?? 0)}
        change={s?.usersChange ?? 0}
      />
      <StatCard
        label="Total Orders"
        value={String(s?.totalOrders ?? 0)}
        change={s?.ordersChange ?? 0}
      />
      <StatCard
        label="Avg Order Value"
        value={fmt(s?.avgOrderValue ?? 0)}
        change={s?.avgOrderChange ?? 0}
      />
    </div>
  );
}
