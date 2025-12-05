export const DECK_SIZE = 36;
export const CARDS_TO_SELECT = 9; // Mantido para compatibilidade inicial
export const CARD_BACK_URL = "https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/cartas/verso.jpg";
export const CARD_IMG_BASE_URL = "https://lrbykdpwzixmgganirvo.supabase.co/storage/v1/object/public/cartas/";

export const CARD_NAMES = {
  1: "O Cavaleiro",
  2: "O Trevo",
  3: "O Navio",
  4: "A Casa",
  5: "A Árvore",
  6: "As Nuvens",
  7: "A Cobra",
  8: "O Caixão",
  9: "O Buquê",
  10: "A Foice",
  11: "O Chicote",
  12: "Os Pássaros",
  13: "A Criança",
  14: "A Raposa",
  15: "O Urso",
  16: "A Estrela",
  17: "A Cegonha",
  18: "O Cachorro",
  19: "A Torre",
  20: "O Jardim",
  21: "A Montanha",
  22: "O Caminho",
  23: "O Rato",
  24: "O Coração",
  25: "O Anel",
  26: "O Livro",
  27: "A Carta",
  28: "O Cigano",
  29: "A Cigana",
  30: "Os Lírios",
  31: "O Sol",
  32: "A Lua",
  33: "A Chave",
  34: "O Peixe",
  35: "A Âncora",
  36: "A Cruz"
};

// --- NOVAS MODALIDADES DE TIRAGEM (Adicionado Agora) ---
export const SPREADS = {
  mesa_real: {
    id: 'mesa_real',
    title: 'Mesa Real',
    subtitle: 'Passado, Presente e Futuro',
    description: 'Uma visão completa da sua vida. Ideal para perguntas gerais ou quando você não sabe exatamente o que perguntar.',
    cardsCount: 9,
    positions: {
      1: 'Passado (Raiz)', 2: 'Passado (Influência)', 3: 'Passado (Conclusão)',
      4: 'Presente (Foco)', 5: 'Presente (Desafio)', 6: 'Presente (Ação)',
      7: 'Futuro (Tendência)', 8: 'Futuro (Caminho)', 9: 'Futuro (Resultado)'
    }
  },
  love_ex: {
    id: 'love_ex',
    title: 'Tirada do Ex',
    subtitle: 'Ele(a) volta? O que sente?',
    description: 'Específico para relacionamentos passados. Descubra sentimentos ocultos, intenções e se há chance de volta.',
    cardsCount: 5,
    positions: {
      1: 'O que ele(a) sente por mim hoje?',
      2: 'Qual a intenção dele(a) em relação a nós?',
      3: 'Ele(a) mudou ou continua igual?',
      4: 'O que o futuro reserva para nós?',
      5: 'Conselho do Oráculo'
    }
  },
  relationship_check: {
    id: 'relationship_check',
    title: 'Ele(a) Vale a Pena?',
    subtitle: 'Ficar ou Partir?',
    description: 'Uma análise profunda sobre a saúde da relação e se vale a pena investir sua energia nela.',
    cardsCount: 7,
    positions: {
      1: 'Quem é essa pessoa de verdade?',
      2: 'Como essa pessoa me vê?',
      3: 'O que essa pessoa sente?',
      4: 'O que está oculto (eu não vejo)?',
      5: 'A base da nossa conexão',
      6: 'Futuro provável da relação',
      7: 'Lição espiritual / Conselho'
    }
  },
  monthly: {
    id: 'monthly',
    title: 'Previsão Mensal',
    subtitle: 'Tendências para o mês',
    description: 'Prepare-se para o que está por vir. Analisa finanças, amor e o clima geral do seu próximo mês.',
    cardsCount: 6,
    positions: {
      1: 'Energia Principal do Mês',
      2: 'O que vem de bom (Positivo)',
      3: 'O que requer atenção (Desafio)',
      4: 'Vida Financeira / Trabalho',
      5: 'Vida Amorosa / Familiar',
      6: 'Conselho Final'
    }
  },
  horseshoe_general: {
    id: 'horseshoe_general',
    title: 'A Ferradura',
    subtitle: 'Para decisões difíceis',
    description: 'O melhor método para quando você precisa tomar uma decisão e entender os prós, contras e o caminho.',
    cardsCount: 7,
    positions: {
      1: 'Passado / O que trouxe até aqui',
      2: 'Momento Atual',
      3: 'Futuro Imediato',
      4: 'O que está ajudando',
      5: 'O que está atrapalhando',
      6: 'Ação recomendada',
      7: 'Resultado Final'
    }
  }
};
