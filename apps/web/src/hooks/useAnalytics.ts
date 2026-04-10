import { useQuery } from "@tanstack/react-query";

import { gqlClient } from "@/lib/graphql-client";
import { GET_ANALYTICS } from "@/queries/analytics";
import { useAuthStore } from "@/store/useAuthStore";

export function useAnalytics() {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["analytics", token],
    queryFn: () => gqlClient.request(GET_ANALYTICS),
    staleTime: 5 * 60 * 1000,
  });
}
