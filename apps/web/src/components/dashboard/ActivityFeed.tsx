"use client";

import { Avatar } from "@/components/ui/Avatar";
import { useActivity } from "@/hooks/useDashboard";

export function ActivityFeed() {
  const { data, isLoading } = useActivity();
  const items = (data as any)?.activity ?? [];

  const STATUS_COLORS: Record<string, string> = {
    completed: "text-green",
    pending: "text-yellow",
    failed: "text-red",
  };

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <div className="text-[14px] font-semibold text-t1">Activity Feed</div>
      </div>

      <div className="divide-y divide-border/50">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4">
                <div className="w-8 h-8 rounded-full bg-elevated animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-elevated rounded animate-pulse w-3/4" />
                  <div className="h-2.5 bg-elevated rounded animate-pulse w-1/3" />
                </div>
              </div>
            ))
          : items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-4 hover:bg-elevated/50 transition-colors"
              >
                <Avatar
                  firstName={item.message.split(" ")[0]}
                  lastName={item.message.split(" ")[1]}
                  color={item.avatarColor}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-[12px] font-medium truncate ${STATUS_COLORS[item.type] ?? "text-t2"}`}
                  >
                    {item.message}
                  </div>
                  <div className="text-[11px] text-t3 mt-0.5">
                    {new Date(item.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
