"use client";

import { useState } from "react";

import { useTransactions } from "@/hooks/useDashboard";
import { cn } from "@/lib/utils";

import type { TransactionsResult } from "@/types";

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green/10 text-green",
  pending: "bg-yellow/10 text-yellow",
  failed: "bg-red/10 text-red",
};

export const TransactionsTable = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTransactions(page, 8);
  const result = (data as { transactions: TransactionsResult } | undefined)?.transactions;

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="text-[14px] font-semibold text-t1">Recent Transactions</div>
        <div className="text-[12px] text-t3">{result?.total ?? 0} total</div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {["Customer", "Amount", "Status", "Method", "Date"].map((h) => (
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
            ? [...Array(8)].map((_, i) => (
                <tr key={i} className="border-b border-border/50">
                  {[...Array(5)].map((__, j) => (
                    <td key={j} className="px-5 py-3">
                      <div className="h-4 bg-elevated rounded animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              ))
            : result?.items.map((t: any) => (
                <tr
                  key={t.id}
                  className="border-b border-border/50 hover:bg-elevated/50 transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="text-[13px] font-medium text-t1">{t.customerName}</div>
                    <div className="text-[11px] text-t3">{t.customerEmail}</div>
                  </td>
                  <td className="px-5 py-3 text-[13px] font-semibold text-t1">
                    ${t.amount.toFixed(2)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "text-[11px] font-semibold px-2 py-1 rounded-full",
                        STATUS_STYLES[t.status]
                      )}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[12px] text-t2">{t.method}</td>
                  <td className="px-5 py-3 text-[12px] text-t3">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {/* Pagination */}
      {result && result.totalPages > 1 && (
        <div className="p-4 flex items-center justify-between border-t border-border">
          <div className="text-[12px] text-t3">
            Page {result.page} of {result.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 bg-elevated border border-border2 rounded-lg text-[12px]
                         text-t2 disabled:opacity-40 hover:border-border transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(result.totalPages, p + 1))}
              disabled={page === result.totalPages}
              className="px-3 py-1.5 bg-elevated border border-border2 rounded-lg text-[12px]
                         text-t2 disabled:opacity-40 hover:border-border transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
