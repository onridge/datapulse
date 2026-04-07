import { cn } from "@/lib/utils";

interface AvatarProps {
  firstName?: string;
  lastName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  className?: string;
}

const COLORS = [
  "#6366f1",
  "#06b6d4",
  "#22c55e",
  "#eab308",
  "#ef4444",
  "#a855f7",
  "#f97316",
  "#ec4899",
];

function getColor(name: string) {
  return COLORS[name.charCodeAt(0) % COLORS.length];
}

const sizes = {
  sm: "w-7 h-7 text-[11px]",
  md: "w-9 h-9 text-[13px]",
  lg: "w-11 h-11 text-[15px]",
  xl: "w-14 h-14 text-[18px]",
};

export function Avatar({
  firstName = "",
  lastName = "",
  size = "md",
  color,
  className,
}: AvatarProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";
  const bg = color ?? getColor(firstName || "A");

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold flex-shrink-0",
        sizes[size],
        className
      )}
      style={{ background: bg }}
    >
      <span className="text-white">{initials}</span>
    </div>
  );
}
