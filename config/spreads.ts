// src/config/spreads.ts

export interface SpreadPosition {
  index: number;
  meaning: string;
}

export interface Spread {
  id: string;
  title: string;
  description: string;
  cardsCount: number;
  layoutType: 'line' | 'cross' | 'horseshoe' | 'love_grid' | 'ex_cross' | 'block' | 'split';
  positions: SpreadPosition[];
  aiInstruction: string;
}

export const SPREADS: Spread[] = [
  // 1. Templo de Afrodite (9 Cartas) - O seu método padrão
  {
    id: 'templo_afrodite',
    title: 'Templo de Afrodite',
    description: 'Análise completa de sentimentos, pensamentos e futuro (9 Cartas).',
    cardsCount: 9,
    layoutType: 'love_grid',
    positions: [
      { index: 0, meaning: 'O que ele pensa (1)' }, { index: 1, meaning: 'O que ele pensa (2)' }, { index: 2, meaning: 'O que ele pensa (3)' },
      { index: 3, meaning: 'O que ele sente (1)' }, { index: 4, meaning: 'O que ele sente (2)' }, { index: 5, meaning: 'O que ele sente (3)' },
      { index: 6, meaning: 'Intenção/Futuro (1)' }, { index: 7, meaning: 'Intenção/Futuro (2)' }, { index: 8, meaning: 'Intenção/Futuro (3)' }
    ],
    aiInstruction: 'Analise em blocos: Cartas 1-3 (Mental/Racional), 4-6 (Emocional/Coração), 7-9 (Físico/Ação Futura).'
  },

  // 2. Tirada do Ex (5 Cartas)
  {
    id: 'ex',
    title: 'Tirada do Ex',
    description: 'Ele volta? O que sente? Vale a pena insistir?',
    cardsCount: 5,
    layoutType: 'ex_cross',
    positions: [
      { index: 0, meaning: 'O que sente por mim?' },
      { index: 1, meaning: 'Tem intenção de voltar?' },
      { index: 2, meaning: 'Mudou as atitudes?' },
      { index: 3, meaning: 'Possível futuro' },
      { index: 4, meaning: 'Conselho' }
    ],
    aiInstruction: 'Foque na dinâmica de ex-relacionamento e reconciliação.'
  },

  // 3. Ele vale a pena? (7 Cartas)
  {
    id: 'vale_pena',
    title: 'Ele(a) Vale a Pena?',
    description: 'Uma análise profunda sobre a viabilidade da relação.',
    cardsCount: 7,
    layoutType: 'block',
    positions: [
      { index: 0, meaning: 'Ele(a)' },
      { index: 1, meaning: 'Como ele(a) me vê' },
      { index: 2, meaning: 'O que sente sobre a relação' },
      { index: 3, meaning: 'Oculto (O que não estou vendo)' },
      { index: 4, meaning: 'Base da relação' },
      { index: 5, meaning: 'Futuro da relação' },
      { index: 6, meaning: 'Aprendizado/Conselho' }
    ],
    aiInstruction: 'Faça uma análise crítica sobre compatibilidade e futuro.'
  },

  // 4. Método Mensal (6 Cartas)
  {
    id: 'mensal',
    title: 'Método Mensal',
    description: 'Previsão completa para o seu próximo mês.',
    cardsCount: 6,
    layoutType: 'cross',
    positions: [
      { index: 0, meaning: 'A energia do mês' },
      { index: 1, meaning: 'Perspectiva positiva' },
      { index: 2, meaning: 'Perspectiva negativa' },
      { index: 3, meaning: 'Financeiro' },
      { index: 4, meaning: 'Área escolhida' },
      { index: 5, meaning: 'Conselho do Tarô' }
    ],
    aiInstruction: 'Foque em previsão temporal para os próximos 30 dias.'
  },

  // 5. Método Ferradura (7 Cartas)
  {
    id: 'ferradura',
    title: 'Método da Ferradura',
    description: 'Para analisar a evolução de qualquer situação.',
    cardsCount: 7,
    layoutType: 'horseshoe',
    positions: [
      { index: 0, meaning: 'Passado' },
      { index: 1, meaning: 'Presente' },
      { index: 2, meaning: 'Futuro Imediato' },
      { index: 3, meaning: 'O Caminho/Ação' },
      { index: 4, meaning: 'Influência Externa' },
      { index: 5, meaning: 'Obstáculos' },
      { index: 6, meaning: 'Desfecho Final' }
    ],
    aiInstruction: 'Analise a linha do tempo e a evolução dos fatos.'
  },

  // 6. Fofocando sobre seu amor (12 Cartas)
  {
    id: 'amor_fofoca',
    title: 'Fofocando sobre o Amor',
    description: 'Descubra tudo o que ele(a) pensa, sente e esconde.',
    cardsCount: 12,
    layoutType: 'love_grid',
    positions: [
      { index: 0, meaning: 'Como te vê (1)' }, { index: 1, meaning: 'Como te vê (2)' }, { index: 2, meaning: 'Como te vê (3)' },
      { index: 3, meaning: 'O que sente (1)' }, { index: 4, meaning: 'O que sente (2)' }, { index: 5, meaning: 'O que sente (3)' },
      { index: 6, meaning: 'O que quer dizer (1)' }, { index: 7, meaning: 'O que quer dizer (2)' }, { index: 8, meaning: 'O que quer dizer (3)' },
      { index: 9, meaning: 'Como vai agir (1)' }, { index: 10, meaning: 'Como vai agir (2)' }, { index: 11, meaning: 'Como vai agir (3)' },
    ],
    aiInstruction: 'Interprete em blocos de 3 cartas.'
  },

  // 7. Ficar ou Partir (6 Cartas)
  {
    id: 'ficar_partir',
    title: 'Ficar ou Partir?',
    description: 'Está em dúvida? Compare os dois caminhos.',
    cardsCount: 6,
    layoutType: 'split',
    positions: [
      { index: 0, meaning: 'Situação Atual' },
      { index: 1, meaning: 'Por que ficar?' },
      { index: 2, meaning: 'Por que partir?' },
      { index: 3, meaning: 'Como me sentirei se ficar?' },
      { index: 4, meaning: 'Como me sentirei se partir?' },
      { index: 5, meaning: 'Conselho Final' }
    ],
    aiInstruction: 'Compare as duas opções.'
  }
];
