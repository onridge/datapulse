"use client";

import gsap from "gsap";
import { DollarSign, TrendingDown, RefreshCw, Zap, TrendingUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useAnalytics } from "@/hooks/useAnalytics";
import { cn } from "@/lib/utils";

import type { AnalyticsData, FunnelItem, TopPage, TrafficItem, TrendPoint } from "@/types";

const fmt = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(0)}`);

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();
  const analytics = (data as { analytics: AnalyticsData } | undefined)?.analytics;
  const s = analytics?.stats;

  const headerRef = useRef<HTMLDivElement>(null);
  const [period, setPeriod] = useState("12M");

  const STATS = s
    ? [
        {
          label: "MRR",
          value: fmt(s.mrr),
          change: s.mrrChange,
          positive: s.mrrChange >= 0,
          icon: DollarSign,
        },
        {
          label: "CHURN RATE",
          value: `${s.churnRate}%`,
          change: s.churnChange,
          positive: s.churnChange <= 0,
          icon: TrendingDown,
        },
        {
          label: "RETENTION",
          value: `${s.retention}%`,
          change: s.retentionChange,
          positive: s.retentionChange >= 0,
          icon: RefreshCw,
        },
        {
          label: "LTV",
          value: fmt(s.ltv),
          change: s.ltvChange,
          positive: s.ltvChange >= 0,
          icon: Zap,
        },
      ]
    : [];

  const trendData: TrendPoint[] = analytics?.trend
    ? period === "6M"
      ? analytics.trend.slice(-6)
      : analytics.trend
    : [];

  useEffect(() => {
    if (isLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
      gsap.fromTo(
        ".analytics-card",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, delay: 0.1, ease: "power3.out" }
      );
      gsap.fromTo(
        ".analytics-section",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.1, delay: 0.3, ease: "power2.out" }
      );
    });
    return () => ctx.revert();
  }, [isLoading]);

  return (
    <div className="p-6 space-y-6">
      <div ref={headerRef}>
        <h1 className="text-[22px] font-bold tracking-[-0.4px] text-t1">Analytics</h1>
        <p className="text-t3 text-[13px] mt-0.5">Deep dive into your performance metrics.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {isLoading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="analytics-card bg-surface border border-border rounded-xl p-5 h-[140px] animate-pulse"
              />
            ))
          : STATS.map((stat) => (
              <div
                key={stat.label}
                className="analytics-card bg-surface border border-border rounded-xl p-5 relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] ${
                    stat.positive
                      ? "bg-gradient-to-r from-green/60 to-cyan/60"
                      : "bg-gradient-to-r from-red/60 to-yellow/60"
                  }`}
                />
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${stat.positive ? "bg-primary/10 text-primg" : "bg-red/10 text-red"}`}
                >
                  <stat.icon size={16} />
                </div>
                <div className="text-[11px] font-semibold text-t3 uppercase tracking-wider mb-1">
                  {stat.label}
                </div>
                <div className="text-[28px] font-bold tracking-[-0.5px] text-t1 mb-2">
                  {stat.value}
                </div>
                <div
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    stat.positive ? "bg-green/10 text-green" : "bg-red/10 text-red"
                  }`}
                >
                  {stat.positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {Math.abs(stat.change)}%
                </div>
                <div className="text-[11px] text-t3 mt-1">vs last month</div>
              </div>
            ))}
      </div>

      {/* Row 1 — Trend + Funnel */}
      <div className="analytics-section grid grid-cols-[1fr_400px] gap-6">
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-start justify-between mb-1">
            <div>
              <div className="text-[14px] font-semibold text-t1">Revenue Trend</div>
              <div className="text-[12px] text-t3">Monthly comparison</div>
            </div>
            <div className="flex gap-1 bg-elevated rounded-lg p-1">
              {["6M", "12M"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "px-3 py-1 rounded-md text-[11px] font-semibold transition-colors",
                    period === p ? "bg-primary text-white" : "text-t3 hover:text-t2"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[11px] text-t3">Current year</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-t3" />
              <span className="text-[11px] text-t3">Previous year</span>
            </div>
          </div>

          {isLoading ? (
            <div className="h-[240px] bg-elevated rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="gCur" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#475569" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#475569" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e2640" strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#475569", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "#475569", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#181e2e",
                    border: "1px solid #1e2640",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                  formatter={(v) => [`$${Number(v).toFixed(0)}`, ""]}
                />
                <Area
                  type="monotone"
                  dataKey="current"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#gCur)"
                />
                <Area
                  type="monotone"
                  dataKey="previous"
                  stroke="#475569"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="url(#gPrev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Conversion Funnel */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="text-[14px] font-semibold text-t1 mb-1">Conversion Funnel</div>
          <div className="text-[12px] text-t3 mb-5">User journey breakdown</div>
          <div className="space-y-3">
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 bg-elevated rounded-full animate-pulse" />
                ))
              : analytics?.funnel.map((item: FunnelItem) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="text-[12px] text-t2 w-[70px] flex-shrink-0">{item.label}</div>
                    <div className="flex-1 bg-elevated rounded-full h-[28px] overflow-hidden">
                      <div
                        className="h-full rounded-full flex items-center px-3"
                        style={{ width: `${item.pct}%`, background: item.color }}
                      >
                        <span className="text-[11px] font-semibold text-white">
                          {item.value.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-[12px] font-semibold text-t3 w-[36px] text-right">
                      {item.pct}%
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* Row 2 — Top Pages + Traffic */}
      <div className="analytics-section grid grid-cols-[1fr_400px] gap-6">
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="p-5 border-b border-border">
            <div className="text-[14px] font-semibold text-t1">Top Pages</div>
            <div className="text-[12px] text-t3">By pageviews this month</div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["PAGE", "VIEWS", "BOUNCE", "AVG TIME"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-[11px] font-semibold text-t3 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-border/50">
                      {[...Array(4)].map((_v, j) => (
                        <td key={j} className="px-5 py-3">
                          <div className="h-4 bg-elevated rounded animate-pulse w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                : analytics?.topPages.map((row: TopPage) => (
                    <tr
                      key={row.page}
                      className="border-b border-border/50 hover:bg-elevated/50 transition-colors"
                    >
                      <td className="px-5 py-3 text-[13px] font-medium text-t1">{row.page}</td>
                      <td className="px-5 py-3 text-[13px] text-t2">
                        {row.views.toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                            row.bouncePos ? "bg-green/10 text-green" : "bg-red/10 text-red"
                          )}
                        >
                          {row.bouncePos ? "+" : ""}
                          {row.bounce}%
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[12px] text-t3">{row.avgTime}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="text-[14px] font-semibold text-t1 mb-1">Traffic Sources</div>
          <div className="text-[12px] text-t3 mb-5">Where users come from</div>
          <div className="space-y-4">
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 bg-elevated rounded animate-pulse" />
                ))
              : analytics?.traffic.map((item: TrafficItem) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] text-t2">{item.label}</span>
                      <span className="text-[12px] font-semibold text-t1">{item.pct}%</span>
                    </div>
                    <div className="w-full bg-elevated rounded-full h-[4px]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.pct}%`, background: item.color }}
                      />
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
