"use client";

import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "▦" },
  { href: "/analytics", label: "Analytics", icon: "↗" },
  { href: "/transactions", label: "Transactions", icon: "⇄" },
  { href: "/customers", label: "Customers", icon: "◎" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }
      );
      gsap.fromTo(
        ".nav-item",
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.07, delay: 0.15, ease: "power2.out" }
      );
      gsap.fromTo(
        userRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.5, ease: "power2.out" }
      );
    }, navRef);
    return () => ctx.revert();
  }, []);

  return (
    <aside
      ref={navRef}
      className="w-[220px] h-screen sticky top-0 bg-[#090c13] border-r border-border flex flex-col"
    >
      <div
        ref={logoRef}
        className="px-5 py-5 border-b border-border flex items-center gap-2.5 flex-shrink-0"
      >
        <div className="w-7 h-7 rounded-lg bg-[linear-gradient(135deg,var(--primary),#06b6d4)] flex items-center justify-center">
          <span className="text-white text-[11px] font-bold">D</span>
        </div>
        <span className="text-[14px] font-bold tracking-[-0.3px] text-t1">DataPulse</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors",
                active ? "bg-primary/10 text-primg" : "text-t3 hover:text-t2 hover:bg-elevated"
              )}
            >
              <span className="text-[15px]">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div ref={userRef} className="px-3 py-4 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-elevated transition-colors cursor-pointer">
          <Avatar firstName={user?.firstName} lastName={user?.lastName} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-t1 truncate">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-[10px] text-t3 truncate">{user?.jobTitle ?? "Admin"}</div>
          </div>
          <button onClick={logout} className="text-t3 hover:text-red transition-colors text-[12px]">
            ⏻
          </button>
        </div>
      </div>
    </aside>
  );
}
