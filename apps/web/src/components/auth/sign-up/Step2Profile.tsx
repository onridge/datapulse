"use client";

import { useState } from "react";

import { AvatarUpload } from "@/components/auth/sign-up/UploadAvatar";
import { cn } from "@/lib/utils";
import { useRegisterStore } from "@/store/useRegisterStore";

import { StepIndicator } from "./StepIndicator";

const TEAM_SIZES = ["1", "2–10", "11–50", "50+"];

const PAGES = ["Analytics", "Payments", "CRM", "Reports"];

export function Step2Profile() {
  const { nextStep, prevStep, setData, step, data } = useRegisterStore();

  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [currentPage, setCurrentPage] = useState("");

  const handleNext = () => {
    setData({ jobTitle, company, teamSize });
    nextStep();
  };

  return (
    <div className="w-[460px] bg-surface border border-border rounded-[20px] p-[40px]">
      <StepIndicator current={step} />

      <h1 className="text-[22px] font-bold tracking-[-0.4px] mb-1">Set up your profile</h1>
      <p className="text-t3 text-[13px] mb-6">Tell us a bit about yourself and your workspace.</p>

      <AvatarUpload name={data.firstName ?? ""} />

      <div className="mb-4">
        <label className="text-[12px] font-medium text-t2 block mb-1.5">Job title</label>
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Job title"
          className="w-full bg-elevated border border-border2 rounded-[10px] px-[14px] py-[11px]
                     text-[13px] text-t1 outline-none focus:border-primary transition-colors
                     placeholder:text-t3"
        />
      </div>

      <div className="mb-4">
        <label className="text-[12px] font-medium text-t2 block mb-1.5">
          Company <span className="text-t3 font-normal">(optional)</span>
        </label>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Your company name"
          className="w-full bg-elevated border border-border2 rounded-[10px] px-[14px] py-[11px]
                     text-[13px] text-t1 outline-none focus:border-primary transition-colors
                     placeholder:text-t3"
        />
      </div>

      <div className="mb-6">
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

      <div className="mb-6">
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

      <div className="flex gap-2">
        <button
          onClick={prevStep}
          className="flex-1 bg-elevated border border-border2 text-t2 rounded-[10px]
                     py-[12px] text-[13px] font-semibold hover:border-border transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          className="flex-[2] bg-[linear-gradient(135deg,var(--primary),#4f46e5)] text-white
                     rounded-[10px] py-[12px] text-[13px] font-semibold
                     shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:opacity-90 transition-opacity"
        >
          Continue → Step 3
        </button>
      </div>
    </div>
  );
}
