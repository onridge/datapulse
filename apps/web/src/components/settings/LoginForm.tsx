"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

import { useLogin } from "../../hooks/useAuth";
import Image from "next/image";

export const LoginForm = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleCheck = () => {
    setIsChecked((prevState) => !prevState);
  };

  const router = useRouter();
  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = () => {
    login({ email, password }, { onSuccess: () => router.push("/dashboard") });
  };

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className="relative w-[400px] bg-surface border border-border rounded-[20px] p-[40px]">
      <p className="flex items-center mb-[32px]">
        <Image className="mr-[8px]" src="/logo.svg" width={32} height={32} alt="DataPulse" />
        <span className="text-[18px] font-bold tracking-[-0.3px]">Data</span>
        <span className="text-[18px] font-bold tracking-[-0.3px] text-primg">Pulse</span>
      </p>
      <p className="text-[22px] font-bold tracking-[-0.4px] mb-[6px]">Welcome back</p>
      <p className="text-[13px] text-t3 mb-[28px]">Sign in to your dashboard</p>

      <div className="flex flex-col mb-[16px]">
        <label className="text-[12px] text-t2 mb-[6px] font-medium">Email adress</label>
        <input
          className="w-[100%] h-[41px] bg-elevated border border-border2 rounded-[10px] px-[14px] py-[11px] text-[13px] text-t1 outline-none transition-colors duration-[150ms]"
          type="email"
          placeholder="you@company.com"
          onChange={handleEmail}
        />
      </div>
      <div className="flex flex-col mb-[16px]">
        <label className="text-[12px] text-t2 mb-[6px] font-medium">Password</label>
        <input
          className="w-[100%] h-[41px] bg-elevated border border-border2 rounded-[10px] px-[14px] py-[11px] text-[13px] text-t1 outline-none transition-colors duration-[150ms]"
          type="password"
          onChange={handlePassword}
        />
      </div>

      <div className="flex align-center justify-between mb-[24px]">
        <div className="flex align-center gap-4 text-[12px] text-t3">
          <div
            onClick={handleCheck}
            className={cn(
              "w-4 h-4 rounded-[4px] border flex items-center justify-center",
              "cursor-pointer transition-colors duration-150",
              isChecked
                ? "bg-primary border-primary"
                : "bg-elevated border-border2 hover:border-primary"
            )}
          >
            {isChecked && <span className="text-white text-[10px]">✓</span>}
          </div>
          <span>Remember me</span>
        </div>
        <div>
          <a className="text-[12px] text-primg cursor-pointer">Forgot password?</a>
        </div>
      </div>

      <button
        className="w-[100%] bg-[linear-gradient(135deg,var(--primary),#4f46e5)] text-[#fff] border-none rounded-[10px] p-[13px] text-[14px] text-semibold cursor-pointer shadow-[0_4px_20px_rgba(99,102,241,0.3)] mb-[20px]"
        onClick={handleSubmit}
      >
        Sign in →
      </button>

      <div className="text-center text-[12px] text-t3 mt-[24px]">
        Don't have an account?{""}
        <span className="text-[12px] text-primg cursor-pointer">Sign up for free</span>
      </div>
    </div>
  );
};
