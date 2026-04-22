"use client";

import { X, UserPlus, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useCreateCustomer } from "@/hooks/useDashboard";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

const PLANS = [
  { value: "free", label: "Free", desc: "Basic access" },
  { value: "premium", label: "Premium", desc: "Full access" },
];

export function AddCustomerModal({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("free");
  const [error, setError] = useState("");

  const { mutateAsync, isPending } = useCreateCustomer();
  const nameRef = useRef<HTMLInputElement>(null);

  /* reset + focus on open */
  useEffect(() => {
    if (open) {
      setTimeout(() => nameRef.current?.focus(), 60);
    } else {
      setName("");
      setEmail("");
      setPlan("free");
      setError("");
    }
  }, [open]);

  /* close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Name is required.");
    if (!email.trim() || !email.includes("@")) return setError("Valid email is required.");
    try {
      await mutateAsync({ name: name.trim(), email: email.trim(), plan });
      onClose();
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : "Something went wrong.";
      setError(raw.replace(/GraphQL error:\s*/i, ""));
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-[440px] mx-4 bg-surface border border-border rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="relative flex flex-col items-center pt-8 pb-6 border-b border-border">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
            <UserPlus size={20} className="text-primg" />
          </div>
          <h2 className="text-[17px] font-semibold text-t1 tracking-[-0.2px]">Add Customer</h2>
          <p className="text-[12px] text-t3 mt-1">Fill in the details below to create a record</p>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center
                       text-t3 hover:text-t2 hover:bg-elevated transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-t2 block">Full Name</label>
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alice Johnson"
              className="w-full bg-elevated border border-border2 rounded-xl px-4 py-3
                         text-[13px] text-t1 placeholder:text-t3 outline-none
                         focus:border-primary transition-colors duration-150"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-t2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alice@example.com"
              className="w-full bg-elevated border border-border2 rounded-xl px-4 py-3
                         text-[13px] text-t1 placeholder:text-t3 outline-none font-mono
                         focus:border-primary transition-colors duration-150"
            />
          </div>

          {/* Plan */}
          <div className="space-y-2">
            <label className="text-[12px] font-medium text-t2 block">Plan</label>
            <div className="grid grid-cols-2 gap-2">
              {PLANS.map((p) => {
                const active = plan === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPlan(p.value)}
                    className={cn(
                      "flex flex-col items-start px-4 py-3.5 rounded-xl border text-left transition-all duration-150",
                      active
                        ? "border-primary/40 bg-primary/10"
                        : "border-border2 bg-elevated hover:border-border"
                    )}
                  >
                    <span
                      className={cn("text-[13px] font-semibold", active ? "text-primg" : "text-t2")}
                    >
                      {p.label}
                    </span>
                    <span className="text-[11px] text-t3 mt-0.5">{p.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 text-[12px] text-red bg-red/10 border border-red/20 rounded-xl px-3.5 py-2.5">
              <span className="mt-px">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-border2 bg-elevated
                         text-[13px] font-medium text-t2 hover:text-t1 hover:border-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3 rounded-xl bg-primary text-white text-[13px] font-semibold
                         hover:bg-primary/90 disabled:opacity-60 transition-colors
                         flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Creating…
                </>
              ) : (
                "Add Customer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
