"use client";

import { Step1Account } from "@/components/auth/sign-up/Step1Account";
import { Step2Profile } from "@/components/auth/sign-up/Step2Profile";
import { Step3Success } from "@/components/auth/sign-up/Step3Success";
import { useRegisterStore } from "@/store/useRegisterStore";

export default function SignUpPage() {
  const { step } = useRegisterStore();

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      {step === 1 && <Step1Account />}
      {step === 2 && <Step2Profile />}
      {step === 3 && <Step3Success />}
    </div>
  );
}
