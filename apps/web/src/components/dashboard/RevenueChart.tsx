"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
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
import { cn } from "@/lib/utils";

const PERIODS = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

export const RevenueChart = () => {
  const [days, setDays] = useState(30);
  const { data, isLoading } = useRevenueChart(days);
  const points = (data as any)?.revenueChart ?? [];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }
      );
    }, ref);
    return () => ctx.revert();
  }, [isLoading]);

  if (isLoading)
    return (
      <div className="bg-surface border border-border rounded-xl p-5 h-[300px] animate-pulse" />
    );

  return (
    <div ref={ref} className="bg-surface border border-border rounded-xl p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <div className="text-[14px] font-semibold text-t1">Revenue Overview</div>
          <div className="text-[12px] text-t3">Daily revenue for the last {days} days</div>
        </div>
        {/* Period switcher */}
        <div className="flex items-center gap-1 bg-elevated rounded-lg p-1">
          {PERIODS.map(({ label, days: d }) => (
            <button
              key={label}
              onClick={() => setDays(d)}
              className={cn(
                "px-3 py-1 rounded-md text-[11px] font-semibold transition-colors",
                days === d ? "bg-primary text-white" : "text-t3 hover:text-t2"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-[11px] text-t3">Revenue</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-cyan" />
          <span className="text-[11px] text-t3">Orders</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={points}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ord" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1e2640" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#475569", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => {
              const d = new Date(v);
              return `${d.toLocaleString("en", { month: "short" })} ${d.getDate()}`;
            }}
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
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#06b6d4"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="url(#ord)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
