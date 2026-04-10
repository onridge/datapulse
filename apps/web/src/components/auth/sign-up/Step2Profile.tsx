"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

import { AvatarUpload } from "@/components/auth/sign-up/UploadAvatar";
import { useRegister } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useRegisterStore } from "@/store/useRegisterStore";

import { StepIndicator } from "./StepIndicator";

const TEAM_SIZES = ["1", "2–10", "11–50", "50+"];
const PAGES = ["Analytics", "Payments", "CRM", "Reports"];

export const Step2Profile = () => {
  const { nextStep, prevStep, setData, step, data } = useRegisterStore();
  const { mutate: register, isPending } = useRegister();
  const { setAuth } = useAuthStore();

  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 32, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
      );
      gsap.fromTo(
        ".step2-field",
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.07, delay: 0.2, ease: "power2.out" }
      );
    }, formRef);
    return () => ctx.revert();
  }, []);

  const handleNext = () => {
    setErrorMsg("");
    setData({ jobTitle, company, teamSize });

    register(
      {
        email: data.email!,
        password: data.password!,
        firstName: data.firstName!,
        lastName: data.lastName!,
        jobTitle,
        company,
        teamSize,
      },
      {
        onSuccess: (res: any) => {
          setAuth(res.register.user, res.register.token, true);
          nextStep();
        },
        onError: (err: any) => {
          const msg = err?.response?.errors?.[0]?.message || err?.message || "Something went wrong";
          setErrorMsg(msg);
        },
      }
    );
  };

  return (
    <div
      ref={formRef}
      className="w-[460px] bg-surface border border-border rounded-[20px] p-[40px]"
    >
      <StepIndicator current={step} />

      <h1 className="step2-field text-[22px] font-bold tracking-[-0.4px] mb-1">
        Set up your profile
      </h1>
      <p className="step2-field text-t3 text-[13px] mb-6">
        Tell us a bit about yourself and your workspace.
      </p>

      {errorMsg && (
        <div className="step2-field bg-red/10 border border-red/20 text-red text-[12px] rounded-lg px-4 py-2 mb-4">
          {errorMsg}
        </div>
      )}

      <div className="step2-field">
        <AvatarUpload name={data.firstName ?? ""} />
      </div>

      <div className="step2-field mb-4">
        <label className="text-[12px] font-medium text-t2 block mb-1.5">Job title</label>
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Job title"
          className="w-full bg-elevated border border-border2 rounded-[10px] px-[14px] py-[11px]
                     text-[13px] text-t1 outline-none focus:border-primary transition-colors placeholder:text-t3"
        />
      </div>

      <div className="step2-field mb-4">
        <label className="text-[12px] font-medium text-t2 block mb-1.5">
          Company <span className="text-t3 font-normal">(optional)</span>
        </label>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Your company name"
          className="w-full bg-elevated border border-border2 rounded-[10px] px-[14px] py-[11px]
                     text-[13px] text-t1 outline-none focus:border-primary transition-colors placeholder:text-t3"
        />
      </div>

      <div className="step2-field mb-6">
        <label className="text-[12px] font-medium text-t2 block mb-1.5">Team size</label>
        <div className="grid grid-cols-4 gap-2">
          {TEAM_SIZES.map((size) => (
            <div
              key={size}
              onClick={() => setTeamSize(size)}
              className={cn(
                "py-2 rounded-lg border text-center text-[12px] cursor-pointer transition-colors",
                teamSize === size
                  ? "bg-primary/10 border-primary text-primg font-medium"
                  : "bg-elevated border-border2 text-t3 hover:border-border"
              )}
            >
              {size}
            </div>
          ))}
        </div>
      </div>

      <div className="step2-field mb-6">
        <label className="text-[12px] font-medium text-t2 block mb-1.5">
          What will you use DataPulse for?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PAGES.map((page) => (
            <div
              key={page}
              onClick={() => setCurrentPage(page)}
              className={cn(
                "py-2 rounded-lg border text-center text-[12px] cursor-pointer transition-colors",
                currentPage === page
                  ? "bg-primary/10 border-primary text-primg font-medium"
                  : "bg-elevated border-border2 text-t3 hover:border-border"
              )}
            >
              {page}
            </div>
          ))}
        </div>
      </div>

      <div className="step2-field flex gap-2">
        <button
          onClick={prevStep}
          disabled={isPending}
          className="flex-1 bg-elevated border border-border2 text-t2 rounded-[10px]
                     py-[12px] text-[13px] font-semibold hover:border-border transition-colors
                     disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={isPending}
          className="flex-[2] bg-[linear-gradient(135deg,var(--primary),#4f46e5)] text-white
                     rounded-[10px] py-[12px] text-[13px] font-semibold
                     shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:opacity-90 transition-opacity
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Creating account..." : "Continue → Step 3"}
        </button>
      </div>
    </div>
  );
};
