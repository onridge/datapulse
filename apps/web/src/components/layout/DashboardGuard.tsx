"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useInitAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";

export const DashboardGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { token } = useAuthStore();
  const { isLoading, isError } = useInitAuth();

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  useEffect(() => {
    if (isError) router.push("/login");
  }, [isError, router]);

  if (!token || isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};
