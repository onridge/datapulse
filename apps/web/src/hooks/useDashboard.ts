import { useQuery } from "@tanstack/react-query";

import { gqlClient } from "@/lib/graphql-client";
import {
  GET_DASHBOARD_STATS,
  GET_REVENUE_CHART,
  GET_TRANSACTIONS,
  GET_TRANSACTION_STATS,
  GET_ACTIVITY,
  GET_CATEGORY_STATS,
} from "@/queries/dashboard";
import { useAuthStore } from "@/store/useAuthStore";

export function useDashboardStats() {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["dashboardStats", token],
    queryFn: () => gqlClient.request(GET_DASHBOARD_STATS),
  });
}

export function useRevenueChart(days = 30) {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["revenueChart", days, token],
    queryFn: () => gqlClient.request(GET_REVENUE_CHART, { days }),
  });
}

export function useTransactions(page = 1, limit = 10, status?: string) {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["transactions", page, limit, status, token],
    queryFn: () => gqlClient.request(GET_TRANSACTIONS, { page, limit, status }),
  });
}

export function useTransactionStats() {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["transactionStats", token],
    queryFn: () => gqlClient.request(GET_TRANSACTION_STATS),
  });
}

export function useActivity() {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["activity", token],
    queryFn: () => gqlClient.request(GET_ACTIVITY),
  });
}

export function useCategoryStats() {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["categoryStats", token],
    queryFn: () => gqlClient.request(GET_CATEGORY_STATS),
  });
}
