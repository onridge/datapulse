import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="text-[12px] font-medium text-t2 block mb-1.5">{label}</label>}
      <input
        className={cn(
          "w-full bg-elevated border rounded-[10px] px-[14px] py-[11px]",
          "text-[13px] text-t1 outline-none transition-colors duration-150",
          "placeholder:text-t3",
          error ? "border-red focus:border-red" : "border-border2 focus:border-primary",
          className
        )}
        {...props}
      />
      {error && <div className="text-[11px] text-red mt-1">{error}</div>}
      {hint && !error && <div className="text-[11px] text-t3 mt-1">{hint}</div>}
    </div>
  );
}
