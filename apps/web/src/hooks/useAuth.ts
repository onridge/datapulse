"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { gqlClient } from "@/lib/graphql-client";
import { LOGIN_MUTATION, GET_ME_QUERY, REGISTER_MUTATION } from "@/queries/auth";
import { useAuthStore } from "@/store/useAuthStore";

export const useLogin = () => {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      gqlClient.request(LOGIN_MUTATION, { email, password }),
    onSuccess: (data: any) => {
      setAuth(data.login.user, data.login.token);
    },
  });
};

export const useInitAuth = () => {
  const { setAuth, logout, token } = useAuthStore();

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const data: any = await gqlClient.request(GET_ME_QUERY);
      if (data?.me) {
        setAuth(data.me, token!);
      } else {
        logout();
      }
      return data?.me;
    },
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRegister = () => {
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
};
