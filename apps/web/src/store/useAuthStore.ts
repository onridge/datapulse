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
  setAuth: (user: User, token: string, remember?: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  setAuth: (user, token, remember = true) => {
    if (remember) {
      localStorage.setItem("token", token);
    }
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
