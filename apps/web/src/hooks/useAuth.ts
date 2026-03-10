"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { gqlClient } from "@/lib/graphql-client";
import { LOGIN_MUTATION, GET_ME_QUERY, REGISTER_MUTATION } from "@/queries/auth";
import { useAuthStore } from "@/store/useAuthStore";

export function useLogin() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      gqlClient.request(LOGIN_MUTATION, { email, password }),
    onSuccess: (data: any) => {
      setAuth(data.login.user, data.login.token);
    },
  });
}

export function useMe() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ["me"],
    queryFn: () => gqlClient.request(GET_ME_QUERY),
    enabled: !!token,
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      firstName,
      lastName,
      jobTitle,
      company,
      teamSize,
      usePage,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      jobTitle?: string;
      company?: string;
      teamSize?: string;
      usePage?: string;
    }) => {
      gqlClient.request(REGISTER_MUTATION, {
        email,
        password,
        firstName,
        lastName,
        jobTitle,
        company,
        teamSize,
        usePage,
      });
    },

    onSuccess: (data: any) => {
      setAuth(data.register.user, data.register.token);
    },
  });
}
