import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[linear-gradient(135deg,var(--primary),#4f46e5)] text-white shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:opacity-90",
  secondary: "bg-elevated border border-border2 text-t2 hover:border-border hover:text-t1",
  ghost: "text-t2 hover:bg-elevated hover:text-t1",
  danger: "bg-red/10 border border-red/20 text-red hover:bg-red/20",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-[12px] rounded-lg",
  md: "px-4 py-2.5 text-[13px] rounded-[10px]",
  lg: "px-5 py-3 text-[14px] rounded-[10px]",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "font-semibold transition-all duration-150 flex items-center justify-center gap-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
