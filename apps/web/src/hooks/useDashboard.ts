import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { gqlClient } from "@/lib/graphql-client";
import {
  GET_DASHBOARD_STATS,
  GET_REVENUE_CHART,
  GET_TRANSACTIONS,
  GET_TRANSACTION_STATS,
  GET_ACTIVITY,
  GET_CATEGORY_STATS,
  GET_CUSTOMERS,
  GET_CUSTOMER_STATS,
  CREATE_CUSTOMER,
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

export function useCustomers(page = 1, limit = 15, plan?: string, search?: string) {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["customers", page, limit, plan, search, token],
    queryFn: () => gqlClient.request(GET_CUSTOMERS, { page, limit, plan, search }),
  });
}

export function useCustomerStats() {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["customerStats", token],
    queryFn: () => gqlClient.request(GET_CUSTOMER_STATS),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { name: string; email: string; plan: string }) =>
      gqlClient.request(CREATE_CUSTOMER, vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customerStats"] });
    },
  });
}
