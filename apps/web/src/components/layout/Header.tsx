"use client";

import { usePathname } from "next/navigation";

import { useAuthStore } from "@/store/useAuthStore";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/analytics": "Analytics",
  "/transactions": "Transactions",
  "/customers": "Customers",
  "/settings": "Settings",
};

export function Header() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const title = TITLES[pathname] ?? "DataPulse";

  return (
    <header className="h-[56px] border-b border-border bg-bg flex items-center px-6 justify-between">
      <h2 className="text-[15px] font-semibold text-t1">{title}</h2>
      <div className="flex items-center gap-3">
        <div className="text-[12px] text-t3">
          {new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="text-[12px] text-t2 font-medium">
          {user?.firstName} {user?.lastName}
        </div>
      </div>
    </header>
  );
}
