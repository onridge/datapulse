import { useQuery } from "@tanstack/react-query";

import { gqlClient } from "@/lib/graphql-client";

import {
  GET_DASHBOARD_STATS,
  GET_REVENUE_CHART,
  GET_TRANSACTIONS,
  GET_ACTIVITY,
} from "@/queries/dashboard";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => gqlClient.request(GET_DASHBOARD_STATS),
  });
}

export function useRevenueChart(days = 30) {
  return useQuery({
    queryKey: ["revenueChart", days],
    queryFn: () => gqlClient.request(GET_REVENUE_CHART, { days }),
  });
}

export function useTransactions(page = 1, limit = 10, status?: string) {
  return useQuery({
    queryKey: ["transactions", page, limit, status],
    queryFn: () => gqlClient.request(GET_TRANSACTIONS, { page, limit, status }),
  });
}

export function useActivity() {
  return useQuery({
    queryKey: ["activity"],
    queryFn: () => gqlClient.request(GET_ACTIVITY),
  });
}
