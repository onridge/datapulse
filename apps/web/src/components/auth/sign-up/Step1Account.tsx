"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { PasswordStrength } from "@/components/auth/sign-up/StrengthPassword";
import { Logo } from "@/components/UI/Logo";
import { cn } from "@/lib/utils";
import { useRegisterStore } from "@/store/useRegisterStore";

import { StepIndicator } from "./StepIndicator";

export function Step1Account() {
  const { nextStep, setData, step } = useRegisterStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const handleNext = () => {
    if (!firstName || !email || !password) return;
    setData({ firstName, lastName, email, password });
    nextStep();
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const match = password === confirmPassword;

  return (
    <div className="w-[460px] bg-surface border border-border rounded-[20px] p-[40px]">
      <Logo />
      <StepIndicator current={step} />

      <h1 className="text-[22px] font-bold tracking-[-0.4px] mb-1">Create your account</h1>
      <p className="text-t3 text-[13px] mb-6">Start your 14-day free trial.</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-[12px] font-medium text-t2 block mb-1.5">First name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className="w-full bg-elevated border border-border2 rounded-[10px] px-[14px] py-[11px]
                       text-[13px] text-t1 outline-none focus:border-primary transition-colors
                       placeholder:text-t3"
          />
        </div>
        <div>
          <label className="text-[12px] font-medium text-t2 block mb-1.5">Last name</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            className="w-full bg-elevated border border-border2 rounded-[10px] px-[14px] py-[11px]
                       text-[13px] text-t1 outline-none focus:border-primary transition-colors
                       placeholder:text-t3"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-[12px] font-medium text-t2 block mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full bg-elevated border border-border2 rounded-[10px] px-[14px] py-[11px]
                     text-[13px] text-t1 outline-none focus:border-primary transition-colors
                     placeholder:text-t3"
        />
      </div>

      <div className="mb-6">
        <label className="text-[12px] font-medium text-t2 block mb-1.5">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          className="w-full bg-elevated border border-border2 rounded-[10px] px-[14px] py-[11px]
                     text-[13px] text-t1 outline-none focus:border-primary transition-colors
                     placeholder:text-t3"
        />
        <PasswordStrength password={password} />
      </div>

      <div className="mb-6">
        <label className="text-[12px] font-medium text-t2 block mb-1.5">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat your password"
          className="w-full bg-elevated border border-border2 rounded-[10px] px-[14px] py-[11px]
                     text-[13px] text-t1 outline-none focus:border-primary transition-colors
                     placeholder:text-t3"
        />
        {confirmPassword.length > 0 && (
          <p className={cn("text-[12px] mt-[4px]", match ? "text-[#22c55e]" : "text-[#ef4444]")}>
            {match ? "Passwords match" : "Passwords do not match"}
          </p>
        )}
      </div>

      <button
        onClick={handleNext}
        className={cn(
          `w-full bg-[linear-gradient(135deg,var(--primary),#4f46e5)] text-white
                   rounded-[10px] py-[13px] text-[14px] font-semibold
                   shadow-[0_4px_20px_rgba(99,102,241,0.3)] transition-opacity
                   hover:opacity-90`
        )}
      >
        Continue → Step 2
      </button>

      <div className="text-center text-[12px] text-t3 mt-[24px]">
        Already have an account?{" "}
        <button
          disabled={!match}
          onClick={handleLogin}
          className="text-[12px] text-primg cursor-pointer"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
