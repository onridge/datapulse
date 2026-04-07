"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useRevenueChart } from "@/hooks/useDashboard";

export function RevenueChart() {
  const { data, isLoading } = useRevenueChart(30);
  const points = (data as any)?.revenueChart ?? [];

  if (isLoading)
    return (
      <div className="bg-surface border border-border rounded-xl p-5 h-[300px] animate-pulse" />
    );

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="text-[14px] font-semibold text-t1 mb-4">Revenue — last 30 days</div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={points}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1e2640" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#475569", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v.slice(5)}
          />
          <YAxis
            tick={{ fill: "#475569", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              background: "#181e2e",
              border: "1px solid #1e2640",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#94a3b8" }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#rev)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
