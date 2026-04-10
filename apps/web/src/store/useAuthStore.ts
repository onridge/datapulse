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
  token:
    typeof window !== "undefined"
      ? localStorage.getItem("token") || sessionStorage.getItem("token")
      : null,
  setAuth: (user, token, remember = true) => {
    if (remember) {
      localStorage.setItem("token", token); // ← 14 дней
    } else {
      sessionStorage.setItem("token", token); // ← до закрытия браузера
    }
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
    set({ user: null, token: null });
  },
}));
