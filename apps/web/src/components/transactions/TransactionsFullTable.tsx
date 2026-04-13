"use client";

import { Search, MoreHorizontal, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { useState } from "react";

import { useTransactions } from "@/hooks/useDashboard";
import { cn } from "@/lib/utils";

import type { Transaction, TransactionsResult } from "@/types";

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green/10 text-green",
  pending: "bg-yellow/10 text-yellow",
  failed: "bg-red/10 text-red",
};

const FILTERS = ["all", "completed", "pending", "failed"] as const;

interface Props {
  initialStatus?: string;
}

export function TransactionsFullTable({ initialStatus }: Props) {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>(initialStatus);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useTransactions(page, 15, status);
  const result = (data as { transactions: TransactionsResult } | undefined)?.transactions;

  const rows = result?.items ?? [];
  const filtered = search
    ? rows.filter(
        (t) =>
          t.customerName.toLowerCase().includes(search.toLowerCase()) ||
          t.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
          t.id.toLowerCase().includes(search.toLowerCase())
      )
    : rows;

  const handleFilterChange = (f: string) => {
    setStatus(f === "all" ? undefined : f);
    setPage(1);
  };

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-border flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-elevated border border-border2 rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-[320px]">
          <Search size={14} className="text-t3 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, ID..."
            className="bg-transparent text-[12px] text-t2 placeholder:text-t3 outline-none w-full"
          />
        </div>

        <div className="flex gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors capitalize border",
                status === f || (f === "all" && !status)
                  ? "bg-primary/10 text-primg border-primary/25"
                  : "bg-elevated text-t3 border-border2 hover:text-t2"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <button className="ml-auto flex items-center gap-1.5 bg-primary text-white text-[12px] font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">
          <Upload size={13} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {["ID", "Customer", "Amount", "Method", "Status", "Date", ""].map((h) => (
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
            ? [...Array(15)].map((_, i) => (
                <tr key={i} className="border-b border-border/50">
                  {[...Array(7)].map((__, j) => (
                    <td key={j} className="px-5 py-3">
                      <div className="h-4 bg-elevated rounded animate-pulse w-20" />
                    </td>
                  ))}
                </tr>
              ))
            : filtered.map((t: Transaction) => (
                <tr
                  key={t.id}
                  className="border-b border-border/50 hover:bg-elevated/40 transition-colors"
                >
                  <td className="px-5 py-3 text-[11px] text-t3 font-mono">
                    {t.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-[13px] font-medium text-t1">{t.customerName}</div>
                    <div className="text-[11px] text-t3">{t.customerEmail}</div>
                  </td>
                  <td className="px-5 py-3 text-[13px] font-semibold text-t1">
                    ${t.amount.toFixed(2)}
                  </td>
                  <td className="px-5 py-3 text-[12px] text-t2">{t.method}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "text-[11px] font-semibold px-2 py-1 rounded-full capitalize",
                        STATUS_STYLES[t.status]
                      )}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[12px] text-t3">
                    {new Date(t.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3 text-t3 cursor-pointer hover:text-t2 transition-colors">
                    <MoreHorizontal size={16} />
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="px-5 py-3 border-t border-border flex items-center justify-between">
        <div className="text-[12px] text-t3">
          {result
            ? `Showing ${(page - 1) * 15 + 1}–${Math.min(page * 15, result.total)} of ${result.total.toLocaleString()} transactions`
            : "Loading..."}
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-3 py-1.5 bg-elevated border border-border2 rounded-lg text-[12px] text-t2
                       disabled:opacity-40 hover:border-border transition-colors"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          {result &&
            [...Array(Math.min(5, result.totalPages))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-[12px] border transition-colors",
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
            <span className="px-2 py-1.5 text-[12px] text-t3">…</span>
          )}
          <button
            onClick={() => setPage((p) => Math.min(result?.totalPages ?? 1, p + 1))}
            disabled={page === result?.totalPages}
            className="flex items-center gap-1 px-3 py-1.5 bg-elevated border border-border2 rounded-lg text-[12px] text-t2
                       disabled:opacity-40 hover:border-border transition-colors"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
