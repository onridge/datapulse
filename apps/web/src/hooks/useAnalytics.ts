import { useQuery } from "@tanstack/react-query";

import { gqlClient } from "@/lib/graphql-client";
import { GET_ANALYTICS } from "@/queries/analytics";

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: () => gqlClient.request(GET_ANALYTICS),
    staleTime: 5 * 60 * 1000,
  });
}
