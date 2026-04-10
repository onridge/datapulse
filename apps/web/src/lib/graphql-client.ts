import { GraphQLClient } from "graphql-request";

import { useAuthStore } from "@/store/useAuthStore";

export const gqlClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql",
  {
    headers: () => {
      const token = useAuthStore.getState().token;
      return {
        "Content-Type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      };
    },
  }
);
