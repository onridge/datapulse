import { GraphQLClient } from "graphql-request";

export const gqlClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql",
  {
    headers: () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      return {
        "Content-Type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      };
    },
  }
);
