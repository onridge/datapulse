"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const DATA = [
  { name: "Subscription", value: 40, color: "#6366f1" },
  { name: "One-time", value: 24, color: "#06b6d4" },
  { name: "Upgrade", value: 15, color: "#22c55e" },
  { name: "Other", value: 21, color: "#2a3352" },
];

const TOTAL = "$124k";

export const CategoryDonut = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }
      );
      gsap.fromTo(
        ".donut-row",
        { opacity: 0, x: 12 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.07, delay: 0.2, ease: "power2.out" }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="bg-surface border border-border rounded-xl p-5">
      <div className="mb-4">
        <div className="text-[14px] font-semibold text-t1">By Category</div>
        <div className="text-[12px] text-t3">Revenue breakdown</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-[120px] h-[120px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={DATA}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={56}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#181e2e",
                  border: "1px solid #1e2640",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value: any) => [`${value}%`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[13px] font-bold text-t1">{TOTAL}</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {DATA.map((item) => (
            <div key={item.name} className="donut-row flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ background: item.color }}
                />
                <span className="text-[12px] text-t2">{item.name}</span>
              </div>
              <span className="text-[12px] font-semibold text-primg">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
