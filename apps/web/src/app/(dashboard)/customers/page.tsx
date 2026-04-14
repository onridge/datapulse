"use client";

import gsap from "gsap";
import { Users, UserPlus, Crown, UserMinus, TrendingUp, TrendingDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AddCustomerModal } from "@/components/customers/AddCustomerModal";
import { CustomerCards } from "@/components/customers/CustomerCards";
import { CustomersTable } from "@/components/customers/CustomersTable";
import { useCustomerStats } from "@/hooks/useDashboard";
import { cn } from "@/lib/utils";

import type { CustomerStats } from "@/types";

const STAT_CONFIG = [
  {
    key: "total" as const,
    changeKey: "totalChange" as const,
    label: "Total Customers",
    icon: Users,
    iconClass: "bg-primary/10 text-primg",
    colorClass: "from-primary/60 to-primg/60",
    badgeClass: "bg-primary/10 text-primg",
    desc: "all time",
  },
  {
    key: "newCustomers" as const,
    changeKey: "newChange" as const,
    label: "New (30d)",
    icon: UserPlus,
    iconClass: "bg-green/10 text-green",
    colorClass: "from-green/60 to-cyan/60",
    badgeClass: "bg-green/10 text-green",
    desc: "joined this month",
  },
  {
    key: "premium" as const,
    changeKey: "premiumChange" as const,
    label: "Premium",
    icon: Crown,
    iconClass: "bg-cyan/10 text-cyan",
    colorClass: "from-cyan/60 to-cyan/30",
    badgeClass: "bg-cyan/10 text-cyan",
    desc: "paid customers",
  },
  {
    key: "churned" as const,
    changeKey: "churnedChange" as const,
    label: "Churned",
    icon: UserMinus,
    iconClass: "bg-red/10 text-red",
    colorClass: "from-red/60 to-red/30",
    badgeClass: "bg-red/10 text-red",
    desc: "inactive 90+ days",
    invertTrend: true,
  },
];

const FILTERS = ["all", "premium", "free", "churned"] as const;

export default function CustomersPage() {
  const { data, isLoading } = useCustomerStats();
  const stats = (data as { customerStats: CustomerStats } | undefined)?.customerStats;

  const [modalOpen, setModalOpen] = useState(false);
  const [plan, setPlan] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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
        ".cust-card",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, delay: 0.1, ease: "power3.out" }
      );
      gsap.fromTo(
        ".cust-table",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, delay: 0.45, ease: "power2.out" }
      );
    });
    return () => ctx.revert();
  }, [isLoading]);

  const handleSearch = (value: string) => {
    setSearch(value);
    clearTimeout((handleSearch as unknown as { _t?: ReturnType<typeof setTimeout> })._t);
    (handleSearch as unknown as { _t?: ReturnType<typeof setTimeout> })._t = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
  };

  const handleFilter = (f: string) => {
    setPlan(f === "all" ? undefined : f);
  };

  return (
    <div className="p-6 space-y-6">
      <div ref={headerRef}>
        <h1 className="text-[22px] font-bold tracking-[-0.4px] text-t1">Customers</h1>
        <p className="text-t3 text-[13px] mt-0.5">Manage and analyze your customer base.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {isLoading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="cust-card bg-surface border border-border rounded-xl p-5 h-[140px] animate-pulse"
              />
            ))
          : STAT_CONFIG.map((cfg) => {
              const value = (stats?.[cfg.key] ?? 0).toLocaleString();
              const change = stats?.[cfg.changeKey] ?? 0;
              const isPositive = cfg.invertTrend ? change <= 0 : change >= 0;

              return (
                <div
                  key={cfg.key}
                  className="cust-card bg-surface border border-border rounded-xl p-5 relative overflow-hidden"
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
                    {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {Math.abs(change)}%
                  </div>
                  <div className="text-[11px] text-t3 mt-1">{cfg.desc}</div>
                </div>
              );
            })}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 bg-elevated border border-border2 rounded-lg px-3 py-2 flex-1 max-w-[300px]">
          <Search size={14} className="text-t3 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search customers..."
            className="bg-transparent text-[12px] text-t2 placeholder:text-t3 outline-none w-full"
          />
        </div>

        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => handleFilter(f)}
            className={cn(
              "px-3.5 py-[7px] rounded-lg text-[12px] font-medium transition-colors capitalize border",
              plan === f || (f === "all" && !plan)
                ? "bg-primary/10 text-primg border-primary/25"
                : "bg-elevated text-t3 border-border2 hover:text-t2"
            )}
          >
            {f}
          </button>
        ))}

        <button
          onClick={() => setModalOpen(true)}
          className="ml-auto flex items-center gap-1.5 bg-primary text-white text-[12px] font-semibold px-4 py-[7px] rounded-lg hover:bg-primary/90 transition-colors"
        >
          + Add Customer
        </button>
      </div>

      {/* Customer Cards */}
      <div className="cust-table">
        <CustomerCards plan={plan} search={debouncedSearch || undefined} />
      </div>

      {/* Table */}
      <div className="cust-table">
        <div className="mb-3">
          <h2 className="text-[15px] font-semibold text-t1">All Customers</h2>
          <p className="text-[12px] text-t3">Complete list</p>
        </div>
        <CustomersTable plan={plan} search={debouncedSearch || undefined} />
      </div>
      <AddCustomerModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
