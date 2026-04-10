"use client";

import { useActivity } from "@/hooks/useDashboard";

import type { ActivityItem } from "@/types";

const TYPE_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  completed: { label: "New subscription", color: "text-green", dot: "bg-green" },
  pending: { label: "Payment pending", color: "text-yellow", dot: "bg-yellow" },
  failed: { label: "Payment failed", color: "text-red", dot: "bg-red" },
};

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.floor(m / 60)}h ago`;
  return `${Math.floor(m / 1440)}d ago`;
};

export const ActivityFeed = () => {
  const { data, isLoading } = useActivity();
  const items = (data as { activity: ActivityItem[] } | undefined)?.activity ?? [];

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <div className="text-[14px] font-semibold text-t1">Activity</div>
        <div className="text-[12px] text-t3">Recent events</div>
      </div>

      <div className="divide-y divide-border/50">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className="w-2 h-2 rounded-full bg-elevated animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-elevated rounded animate-pulse w-3/4" />
                  <div className="h-2.5 bg-elevated rounded animate-pulse w-1/3" />
                </div>
              </div>
            ))
          : items.map((item: ActivityItem) => {
              const cfg = TYPE_CONFIG[item.type] ?? {
                label: "Event",
                color: "text-t2",
                dot: "bg-t3",
              };
              const amount = item.message.match(/\$[\d.]+/)?.[0];
              const name = item.message.split(" — ")[0];
              const isNeg = item.type === "failed";

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-elevated/50 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-t1 truncate">{cfg.label}</div>
                    <div className="text-[11px] text-t3">
                      {name} • {timeAgo(item.time)}
                    </div>
                  </div>
                  {amount && (
                    <span
                      className={`text-[12px] font-semibold flex-shrink-0 ${isNeg ? "text-red" : "text-green"}`}
                    >
                      {isNeg ? "" : "+"}
                      {amount}
                    </span>
                  )}
                </div>
              );
            })}
      </div>
    </div>
  );
};
