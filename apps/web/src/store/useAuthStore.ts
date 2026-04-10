import { create } from "zustand";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
    set({ user: null, token: null });
  },
}));
