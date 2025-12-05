import { create } from "zustand";

interface DreamState {
  dreamText: string;
  interpretation: string | null;
  loading: boolean;

  setDreamText: (t: string) => void;
  setInterpretation: (t: string | null) => void;
  setLoading: (v: boolean) => void;
}

export const useDreamStore = create<DreamState>((set) => ({
  dreamText: "",
  interpretation: null,
  loading: false,

  setDreamText: (t) => set({ dreamText: t }),
  setInterpretation: (t) => set({ interpretation: t }),
  setLoading: (v) => set({ loading: v }),
}));
