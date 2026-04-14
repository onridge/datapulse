"use client";

import { X, UserPlus, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    if (open) {
      setTimeout(() => nameRef.current?.focus(), 50);
    } else {
      setName("");
      setEmail("");
      setPlan("free");
      setError("");
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg.replace("GraphQL error: ", ""));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop — closes on click */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal — stops propagation so backdrop click doesn't fire */}
      <div
        className="relative w-full max-w-[420px] bg-surface border border-border rounded-2xl shadow-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center px-6 pt-8 pb-5 relative">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            <UserPlus size={18} className="text-primg" />
          </div>
          <h2 className="text-[16px] font-semibold text-t1">Add Customer</h2>
          <p className="text-[12px] text-t3 mt-0.5">Create a new customer record</p>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-7 h-7 rounded-lg flex items-center justify-center text-t3 hover:text-t2 hover:bg-elevated transition-colors"
          >
            <X size={15} />
          </button>
        </div>
        <div className="h-px bg-border mx-6" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="text-[12px] font-medium text-t2 block mb-1.5">Full Name</label>
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alice Johnson"
              className="w-full bg-elevated border border-border2 rounded-[10px] px-[14px] py-[11px]
                         text-[13px] text-t1 placeholder:text-t3 outline-none
                         focus:border-primary transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-[12px] font-medium text-t2 block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alice@example.com"
              className="w-full bg-elevated border border-border2 rounded-[10px] px-[14px] py-[11px]
                         text-[13px] text-t1 placeholder:text-t3 outline-none
                         focus:border-primary transition-colors font-mono"
            />
          </div>

          {/* Plan */}
          <div>
            <label className="text-[12px] font-medium text-t2 block mb-2">Plan</label>
            <div className="grid grid-cols-2 gap-2">
              {PLANS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPlan(p.value)}
                  className={cn(
                    "flex flex-col items-start px-4 py-3 rounded-xl border text-left transition-all",
                    plan === p.value
                      ? "border-primary/50 bg-primary/8 text-t1"
                      : "border-border2 bg-elevated text-t3 hover:border-border hover:text-t2"
                  )}
                >
                  <div
                    className={cn(
                      "text-[13px] font-semibold mb-0.5",
                      plan === p.value ? "text-primg" : "text-t2"
                    )}
                  >
                    {p.label}
                  </div>
                  <div className="text-[11px]">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-[12px] text-red bg-red/8 border border-red/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-[10px] rounded-xl border border-border2 bg-elevated
                         text-[13px] font-medium text-t2 hover:text-t1 hover:border-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-[10px] rounded-xl bg-primary text-white
                         text-[13px] font-semibold hover:bg-primary/90 transition-colors
                         disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Creating...
                </>
              ) : (
                "Add Customer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
