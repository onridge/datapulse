"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { useCustomers } from "@/hooks/useDashboard";
import { cn } from "@/lib/utils";

import type { Customer, CustomersResult } from "@/types";

const STATUS_STYLES: Record<string, string> = {
  premium: "bg-primary/10 text-primg",
  free: "bg-green/10 text-green",
  churned: "bg-red/10 text-red",
};

const STATUS_LABEL: Record<string, string> = {
  premium: "premium",
  free: "active",
  churned: "churned",
};

const PLAN_LABEL: Record<string, string> = {
  premium: "Premium",
  free: "Free",
  churned: "—",
};

interface Props {
  plan?: string;
  search?: string;
}

export function CustomersTable({ plan, search }: Props) {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useCustomers(page, 15, plan, search);
  const result = (data as { customers: CustomersResult } | undefined)?.customers;
  const rows = result?.items ?? [];

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-elevated">
            {["Name", "Email", "Plan", "Total Spent", "Orders", "Joined", "Status"].map((h) => (
              <th
                key={h}
                className="text-left px-5 py-[10px] text-[10px] font-semibold text-t3 uppercase tracking-[0.08em]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? [...Array(15)].map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {[...Array(7)].map((__, j) => (
                    <td key={j} className="px-5 py-3">
                      <div className="h-4 bg-elevated rounded animate-pulse w-20" />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((c: Customer) => (
                <tr
                  key={c.id}
                  className="border-b border-border hover:bg-white/[0.015] transition-colors"
                >
                  <td className="px-5 py-3 text-[12px] font-medium text-t1">{c.customerName}</td>
                  <td className="px-5 py-3 text-[11px] text-t2 font-mono">{c.customerEmail}</td>
                  <td className="px-5 py-3 text-[12px] text-t2">{PLAN_LABEL[c.plan] ?? c.plan}</td>
                  <td className="px-5 py-3 text-[12px] font-semibold text-t1 font-mono">
                    ${c.totalSpent.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </td>
                  <td className="px-5 py-3 text-[11px] text-t2 font-mono">{c.orderCount}</td>
                  <td className="px-5 py-3 text-[11px] text-t3 font-mono">
                    {new Date(c.firstOrder).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full",
                        STATUS_STYLES[c.plan] ?? "bg-elevated text-t3"
                      )}
                    >
                      <span className="text-[6px]">●</span>
                      {STATUS_LABEL[c.plan] ?? c.plan}
                    </span>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="px-5 py-[14px] border-t border-border flex items-center justify-between">
        <div className="text-[12px] text-t3">
          {result
            ? `Showing ${(page - 1) * 15 + 1}–${Math.min(page * 15, result.total)} of ${result.total.toLocaleString()} customers`
            : "Loading..."}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-7 h-7 flex items-center justify-center bg-elevated border border-border2 rounded-md text-t2
                       disabled:opacity-40 hover:border-border transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          {result &&
            [...Array(Math.min(5, result.totalPages))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    "w-7 h-7 rounded-md text-[11px] border transition-colors",
                    page === pageNum
                      ? "bg-primary border-primary text-white"
                      : "bg-elevated border-border2 text-t2 hover:border-border"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
          {result && result.totalPages > 5 && (
            <span className="px-1.5 py-1 text-[12px] text-t3">…</span>
          )}
          <button
            onClick={() => setPage((p) => Math.min(result?.totalPages ?? 1, p + 1))}
            disabled={page === result?.totalPages}
            className="w-7 h-7 flex items-center justify-center bg-elevated border border-border2 rounded-md text-t2
                       disabled:opacity-40 hover:border-border transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
