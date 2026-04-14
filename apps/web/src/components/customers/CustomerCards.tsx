"use client";

import { useCustomers } from "@/hooks/useDashboard";

import type { Customer, CustomersResult } from "@/types";

const PLAN_BADGE: Record<string, string> = {
  premium: "bg-primary/10 text-primg border-primary/20",
  free: "bg-green/10 text-green border-green/20",
  churned: "bg-red/10 text-red border-red/20",
};

const PLAN_LABEL: Record<string, string> = {
  premium: "Premium",
  free: "Active",
  churned: "Churned",
};

const AVATAR_COLORS = [
  { bg: "rgba(99,102,241,0.15)", text: "#818cf8" },
  { bg: "rgba(6,182,212,0.15)", text: "#06b6d4" },
  { bg: "rgba(34,197,94,0.15)", text: "#22c55e" },
  { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
  { bg: "rgba(234,179,8,0.15)", text: "#eab308" },
  { bg: "rgba(168,85,247,0.15)", text: "#c084fc" },
];

function getAvatarStyle(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function durationMonths(isoDate: string) {
  const months = Math.round(
    (Date.now() - new Date(isoDate).getTime()) / (30 * 24 * 60 * 60 * 1000)
  );
  return months < 1 ? "<1mo" : `${months}mo`;
}

function fmt(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(0)}`;
}

interface Props {
  plan?: string;
  search?: string;
}

export function CustomerCards({ plan, search }: Props) {
  const { data, isLoading } = useCustomers(1, 6, plan, search);
  const result = (data as { customers: CustomersResult } | undefined)?.customers;
  const customers = result?.items ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-surface border border-border rounded-xl p-5 h-[172px] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {customers.map((c: Customer) => {
        const initial = c.customerName.charAt(0).toUpperCase();
        const avatarStyle = getAvatarStyle(c.customerName);
        const badgeClass = PLAN_BADGE[c.plan] ?? "bg-elevated text-t3 border-border2";
        const badgeLabel = PLAN_LABEL[c.plan] ?? c.plan;

        return (
          <div
            key={c.id}
            className="bg-surface border border-border rounded-xl p-5 cursor-pointer
                       hover:border-border2 hover:-translate-y-0.5 transition-all duration-200"
          >
            {/* Avatar */}
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-[17px] font-bold mb-3 flex-shrink-0"
              style={{ background: avatarStyle.bg, color: avatarStyle.text }}
            >
              {initial}
            </div>

            {/* Name & Email */}
            <div className="text-[14px] font-semibold text-t1 mb-0.5">{c.customerName}</div>
            <div className="text-[11px] text-t3 font-mono mb-3 truncate">{c.customerEmail}</div>

            {/* Plan Badge */}
            <div className="mb-3">
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${badgeClass}`}
              >
                <span className="text-[6px]">●</span>
                {badgeLabel}
              </span>
            </div>

            {/* Stats */}
            <div className="flex gap-4">
              <div>
                <div className="text-[13px] font-semibold text-t1 font-mono">
                  {fmt(c.totalSpent)}
                </div>
                <div className="text-[10px] text-t3">Total spent</div>
              </div>
              <div>
                <div className="text-[13px] font-semibold text-t1 font-mono">{c.orderCount}</div>
                <div className="text-[10px] text-t3">Orders</div>
              </div>
              <div>
                <div className="text-[13px] font-semibold text-t1 font-mono">
                  {durationMonths(c.firstOrder)}
                </div>
                <div className="text-[10px] text-t3">Customer</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
