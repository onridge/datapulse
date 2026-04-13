"use client";

import gsap from "gsap";
import { CheckCircle, Clock, XCircle, Banknote, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useRef } from "react";

import { TransactionsFullTable } from "@/components/transactions/TransactionsFullTable";
import { useTransactionStats } from "@/hooks/useDashboard";

import type { TransactionStats } from "@/types";

const fmt = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(0)}`);

const STAT_CONFIG = [
  {
    key: "completed" as const,
    label: "Completed",
    icon: CheckCircle,
    iconClass: "bg-green/10 text-green",
    colorClass: "from-green/60 to-cyan/60",
    badgeClass: "bg-green/10 text-green",
    desc: "of total transactions",
  },
  {
    key: "pending" as const,
    label: "Pending",
    icon: Clock,
    iconClass: "bg-yellow/10 text-yellow",
    colorClass: "from-yellow/60 to-yellow/30",
    badgeClass: "bg-yellow/10 text-yellow",
    desc: "awaiting confirmation",
  },
  {
    key: "failed" as const,
    label: "Failed",
    icon: XCircle,
    iconClass: "bg-red/10 text-red",
    colorClass: "from-red/60 to-red/30",
    badgeClass: "bg-red/10 text-red",
    desc: "require attention",
  },
  {
    key: "totalVolume" as const,
    label: "Total Volume",
    icon: Banknote,
    iconClass: "bg-primary/10 text-primg",
    colorClass: "from-primary/60 to-primg/60",
    badgeClass: "bg-primary/10 text-primg",
    desc: "vs last month",
    isVolume: true,
  },
];

export default function TransactionsPage() {
  const { data, isLoading } = useTransactionStats();
  const stats = (data as { transactionStats: TransactionStats } | undefined)?.transactionStats;

  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
      gsap.fromTo(
        ".txn-card",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, delay: 0.1, ease: "power3.out" }
      );
      gsap.fromTo(
        ".txn-table",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, delay: 0.45, ease: "power2.out" }
      );
    });
    return () => ctx.revert();
  }, [isLoading]);

  const total = stats ? stats.completed + stats.pending + stats.failed : 0;

  return (
    <div className="p-6 space-y-6">
      <div ref={headerRef}>
        <h1 className="text-[22px] font-bold tracking-[-0.4px] text-t1">Transactions</h1>
        <p className="text-t3 text-[13px] mt-0.5">All payment records and transaction history.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {isLoading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="txn-card bg-surface border border-border rounded-xl p-5 h-[140px] animate-pulse"
              />
            ))
          : STAT_CONFIG.map((cfg) => {
              const raw = stats?.[cfg.key] ?? 0;
              const value = cfg.isVolume ? fmt(raw as number) : (raw as number).toLocaleString();
              const pct = cfg.isVolume
                ? (stats?.volumeChange ?? 0)
                : total > 0
                  ? Math.round(((raw as number) / total) * 100)
                  : 0;
              const isPositive = cfg.key === "failed" ? false : pct >= 0;

              return (
                <div
                  key={cfg.key}
                  className="txn-card bg-surface border border-border rounded-xl p-5 relative overflow-hidden"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${cfg.colorClass}`}
                  />
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${cfg.iconClass}`}
                  >
                    <cfg.icon size={16} />
                  </div>
                  <div className="text-[11px] font-semibold text-t3 uppercase tracking-wider mb-1">
                    {cfg.label}
                  </div>
                  <div className="text-[28px] font-bold tracking-[-0.5px] text-t1 mb-2">
                    {value}
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg.badgeClass}`}
                  >
                    {cfg.isVolume &&
                      (isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />)}
                    {cfg.isVolume ? `${Math.abs(pct)}%` : `${pct}%`}
                  </div>
                  <div className="text-[11px] text-t3 mt-1">{cfg.desc}</div>
                </div>
              );
            })}
      </div>

      {/* Table */}
      <div className="txn-table">
        <TransactionsFullTable />
      </div>
    </div>
  );
}
