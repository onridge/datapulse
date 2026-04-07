"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/UI/Logo";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

import { Avatar } from "@/components/ui/Avatar";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/analytics", label: "Analytics", icon: "📈" },
  { href: "/transactions", label: "Transactions", icon: "💳" },
  { href: "/customers", label: "Customers", icon: "👥" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-[220px] min-h-screen bg-[#090c13] border-r border-border flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border flex items-center gap-2.5">
        <Logo />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors",
                active ? "bg-primary/10 text-primg" : "text-t3 hover:text-t2 hover:bg-elevated"
              )}
            >
              <span className="text-[15px]">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-elevated transition-colors cursor-pointer">
          <Avatar firstName={user?.firstName} lastName={user?.lastName} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-t1 truncate">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-[10px] text-t3 truncate">{user?.email}</div>
          </div>
          <button
            onClick={logout}
            className="text-t3 hover:text-red transition-colors text-[12px]"
            title="Logout"
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>
  );
}
