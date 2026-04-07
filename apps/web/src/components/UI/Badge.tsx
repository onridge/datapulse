import { cn } from "@/lib/utils";

type Variant = "success" | "warning" | "error" | "info" | "default";

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<Variant, string> = {
  success: "bg-green/10 text-green",
  warning: "bg-yellow/10 text-yellow",
  error: "bg-red/10 text-red",
  info: "bg-primary/10 text-primg",
  default: "bg-elevated text-t2",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
