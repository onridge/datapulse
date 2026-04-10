"use client";

import { useInitAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";

export function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  const { isLoading } = useInitAuth();

  if (token && isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
