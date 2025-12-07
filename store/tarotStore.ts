import { create } from "zustand";

interface CardData {
  id: number;
  name: string;
  imageUrl: string;
}

interface ReadingResult {
  intro: string;
  timeline: {
    past: string;
    present: string;
    future: string;
  };
  individual_cards?: Array<{
    position: string;
    card_name: string;
    interpretation: string;
  }>;
  summary: string;
  advice: string;
}

export type TarotStep = "question" | "selection" | "reveal";

interface TarotStore {
  step: TarotStep;
  question: string;
  selectedCards: CardData[];
  revealedCount: number;
  reading: ReadingResult | null;
  isLoadingAI: boolean;

  setStep: (step: TarotStep) => void;
  setQuestion: (txt: string) => void;

  setSelectedCards: (cards: CardData[]) => void;
  setRevealedCount: (n: number) => void;

  setReading: (r: ReadingResult | null) => void;

  /** NOME CORRETO USADO NO Tarot.tsx */
  setLoadingAI: (v: boolean) => void;

  resetTarot: () => void;
}

export const useTarotStore = create<TarotStore>((set) => ({
  step: "question",
  question: "",
  selectedCards: [],
  revealedCount: 0,
  reading: null,

  /** VALOR CORRETO INICIAL */
  isLoadingAI: false,

  setStep: (step) => set({ step }),
  setQuestion: (question) => set({ question }),

  setSelectedCards: (selectedCards) => set({ selectedCards }),
  setRevealedCount: (revealedCount) => set({ revealedCount }),

  setReading: (reading) => set({ reading }),

  /** FUNÇÃO QUE O Tarot.tsx REALMENTE CHAMA */
  setLoadingAI: (isLoadingAI) => set({ isLoadingAI }),

  resetTarot: () =>
    set({
      step: "question",
      question: "",
      selectedCards: [],
      revealedCount: 0,
      reading: null,
      isLoadingAI: false,
    }),
}));
