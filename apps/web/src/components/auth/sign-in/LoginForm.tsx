"use client";

import gsap from "gsap";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Logo } from "@/components/UI/Logo";
import { useLogin } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

import type { User } from "@/types/auth";

interface LoginResponse {
  login: {
    user: User;
    token: string;
  };
}

interface GraphQLError {
  message: string;
}

interface RequestError {
  response?: {
    errors?: GraphQLError[];
  };
  message?: string;
}

export const LoginForm = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const { setAuth } = useAuthStore();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".login-form",
        { opacity: 0, y: 32, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
      );
      gsap.fromTo(
        ".login-field",
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.08, delay: 0.2, ease: "power2.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleCheck = () => setIsChecked((prev) => !prev);

  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = () => {
    if (!email || !password) {
      setErrorMsg("Please fill in all fields");
      return;
    }
    setErrorMsg("");
    login(
      { email, password },
      {
        onSuccess: (data: unknown) => {
          const res = data as LoginResponse;
          setAuth(res.login.user, res.login.token, isChecked);
          router.push("/dashboard");
        },
        onError: (err: unknown) => {
          const e = err as RequestError;
          const msg = e?.response?.errors?.[0]?.message || e?.message || "Something went wrong";
          setErrorMsg(msg);
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleSignUp = () => router.push("/sign-up");

  return (
    <div className="login-form relative w-[400px] bg-surface border border-border rounded-[20px] p-[40px]">
      <Logo />
      <p className="text-[22px] font-bold tracking-[-0.4px] mb-[6px]">Welcome back</p>
      <p className="text-[13px] text-t3 mb-[28px]">Sign in to your dashboard</p>

      {errorMsg && (
        <div className="login-field bg-red/10 border border-red/20 text-red text-[12px] rounded-lg px-4 py-2 mb-4">
          {errorMsg}
        </div>
      )}

      <div className="login-field flex flex-col mb-[16px]">
        <label className="text-[12px] text-t2 mb-[6px] font-medium">Email address</label>
        <input
          className="w-full h-[41px] bg-elevated border border-border2 rounded-[10px] px-[14px] py-[11px]
                     text-[13px] text-t1 outline-none transition-colors duration-[150ms]
                     focus:border-primary placeholder:text-t3"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="login-field flex flex-col mb-[16px]">
        <label className="text-[12px] text-t2 mb-[6px] font-medium">Password</label>
        <input
          className="w-full h-[41px] bg-elevated border border-border2 rounded-[10px] px-[14px] py-[11px]
                     text-[13px] text-t1 outline-none transition-colors duration-[150ms]
                     focus:border-primary"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="login-field flex items-center justify-between mb-[24px]">
        <div className="flex items-center gap-4 text-[12px] text-t3">
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
        <a className="text-[12px] text-primg cursor-pointer">Forgot password?</a>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="login-field w-full bg-[linear-gradient(135deg,var(--primary),#4f46e5)] text-white
                   rounded-[10px] p-[13px] text-[14px] font-semibold cursor-pointer
                   shadow-[0_4px_20px_rgba(99,102,241,0.3)] mb-[20px]
                   transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Signing in..." : "Sign in →"}
      </button>

      <div className="text-center text-[12px] text-t3 mt-[24px]">
        Don't have an account?{" "}
        <span onClick={handleSignUp} className="text-[12px] text-primg cursor-pointer">
          Sign up for free
        </span>
      </div>
    </div>
  );
};
