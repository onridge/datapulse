import { create } from "zustand";

interface RegisterData {
  // step 1
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // step 2
  jobTitle: string;
  company: string;
  teamSize: string;
  useCases: string[];
}

interface RegisterStore {
  step: 1 | 2 | 3;
  data: Partial<RegisterData>;
  nextStep: () => void;
  prevStep: () => void;
  setData: (data: Partial<RegisterData>) => void;
  reset: () => void;
}

export const useRegisterStore = create<RegisterStore>((set) => ({
  step: 1,
  data: {},
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 3) as 1 | 2 | 3 })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) as 1 | 2 | 3 })),
  setData: (data) => set((s) => ({ data: { ...s.data, ...data } })),
  reset: () => set({ step: 1, data: {} }),
}));
