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

// ATUALIZAÇÃO 1: Adicionamos 'spread_selection' e 'result' aos passos possíveis
export type TarotStep = "spread_selection" | "question" | "selection" | "reveal" | "result";

interface TarotStore {
  step: TarotStep;
  selectedSpreadId: string; // NOVO: Guarda o ID da tiragem (ex: 'mesa_real', 'love_ex')
  question: string;
  selectedCards: CardData[];
  revealedCount: number;
  reading: ReadingResult | null;
  isLoadingAI: boolean;

  setStep: (step: TarotStep) => void;
  setSpread: (spreadId: string) => void; // NOVO: Ação para escolher a tiragem
  setQuestion: (txt: string) => void;

  setSelectedCards: (cards: CardData[]) => void;
  setRevealedCount: (n: number) => void;

  setReading: (r: ReadingResult | null) => void;

  /** NOME CORRETO USADO NO Tarot.tsx */
  setLoadingAI: (v: boolean) => void;

  resetTarot: () => void;
}

export const useTarotStore = create<TarotStore>((set) => ({
  step: "spread_selection", // ATUALIZAÇÃO 2: O jogo agora começa na escolha da tiragem
  selectedSpreadId: "mesa_real", // Valor padrão inicial
  question: "",
  selectedCards: [],
  revealedCount: 0,
  reading: null,

  /** VALOR CORRETO INICIAL */
  isLoadingAI: false,

  setStep: (step) => set({ step }),
  setSpread: (spreadId) => set({ selectedSpreadId: spreadId }), // NOVO
  setQuestion: (question) => set({ question }),

  setSelectedCards: (selectedCards) => set({ selectedCards }),
  setRevealedCount: (revealedCount) => set({ revealedCount }),

  setReading: (reading) => set({ reading }),

  /** FUNÇÃO QUE O Tarot.tsx REALMENTE CHAMA */
  setLoadingAI: (isLoadingAI) => set({ isLoadingAI }),

  resetTarot: () =>
    set({
      step: "spread_selection", // Reseta para a tela de escolha
      selectedSpreadId: "mesa_real",
      question: "",
      selectedCards: [],
      revealedCount: 0,
      reading: null,
      isLoadingAI: false,
    }),
}));
