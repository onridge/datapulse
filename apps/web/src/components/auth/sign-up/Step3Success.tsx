"use client";

import gsap from "gsap";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useRegisterStore } from "@/store/useRegisterStore";

import { StepIndicator } from "./StepIndicator";

export const Step3Success = () => {
  const router = useRouter();
  const { data, reset, step } = useRegisterStore();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
      );
      gsap.fromTo(
        ".success-item",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.2, ease: "power2.out" }
      );
      gsap.fromTo(
        ".success-emoji",
        { scale: 0, rotation: -20 },
        { scale: 1, rotation: 0, duration: 0.6, delay: 0.1, ease: "back.out(1.7)" }
      );
    }, formRef);
    return () => ctx.revert();
  }, []);

  const handleGo = () => {
    reset();
    router.push("/dashboard");
  };

  return (
    <div
      ref={formRef}
      className="w-[460px] bg-surface border border-border rounded-[20px] p-[40px] text-center"
    >
      <StepIndicator current={step} />

      <div
        className="success-emoji w-[72px] h-[72px] rounded-full bg-green/10 border border-green/30
                      flex items-center justify-center text-[32px] mx-auto mb-5"
      >
        🎉
      </div>

      <h1 className="success-item text-[22px] font-bold tracking-[-0.4px] mb-2">
        You're all set, {data.firstName}!
      </h1>
      <p className="success-item text-t3 text-[13px] mb-6 leading-relaxed">
        Your account has been created.
        <br />
        Your 14-day free trial starts today.
      </p>

      <button
        onClick={handleGo}
        className="success-item w-full bg-[linear-gradient(135deg,var(--primary),#4f46e5)] text-white
                   rounded-[10px] py-[13px] text-[14px] font-semibold
                   shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:opacity-90 transition-opacity"
      >
        Go to Dashboard →
      </button>

      <p className="success-item text-t3 text-[12px] mt-4">
        We sent a confirmation email to <span className="text-primg">{data.email}</span>
      </p>
    </div>
  );
};
