"use client";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  current: number;
}

const STEPS = ["Account", "Profile", "Done"];

export function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="flex items-center mb-7 justify-between">
      {STEPS.map((label, i) => {
        const num = i + 1;
        const isDone = num < current;
        const isActive = num === current;

        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-[28px] h-[28px] rounded-full bg-primary flex items-center justify-center text-xs font-bold shadow-[0_0_12px_rgba(99,102,241,0.4)]",
                  isDone && "bg-green text-white",
                  isActive && "bg-primary text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]",
                  !isDone && !isActive && "bg-elevated border border-border2 text-t3"
                )}
              >
                {isDone ? "✓" : num}
              </div>
              <span
                className={cn(
                  "text-[12px] font-medium",
                  isDone && "text-green",
                  isActive && "text-primg",
                  !isDone && !isActive && "text-t3"
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("flex-1 h-px mx-3", isDone ? "bg-green/40" : "bg-border2")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
