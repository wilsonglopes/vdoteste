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
  // Adicionei 'split' para o layout "Ficar ou Partir"
  layoutType: 'line' | 'cross' | 'horseshoe' | 'love_grid' | 'ex_cross' | 'block' | 'split';
  positions: SpreadPosition[];
  aiInstruction: string;
}

export const SPREADS: Spread[] = [
  // 1. O que já está implementado (9 Cartas - Templo de Afrodite/Geral)
  {
    id: 'templo_afrodite',
    title: 'Templo de Afrodite',
    description: 'Análise completa de sentimentos, pensamentos e futuro (9 Cartas).',
    cardsCount: 9,
    layoutType: 'love_grid', // Grid 3x3
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
    layoutType: 'ex_cross', // Layout em H/Boneco
    positions: [
      { index: 0, meaning: 'O que sente por mim?' },
      { index: 1, meaning: 'Tem intenção de voltar?' },
      { index: 2, meaning: 'Mudou as atitudes?' },
      { index: 3, meaning: 'Possível futuro' },
      { index: 4, meaning: 'Conselho' }
    ],
    aiInstruction: 'Foque na dinâmica de ex-relacionamento, sentimentos remanescentes e possibilidade de reconciliação.'
  },

  // 3. Ele vale a pena? (7 Cartas)
  {
    id: 'vale_pena',
    title: 'Ele(a) Vale a Pena?',
    description: 'Uma análise profunda sobre a viabilidade da relação.',
    cardsCount: 7,
    layoutType: 'block', // Bloco 3 + 3 + 1
    positions: [
      { index: 0, meaning: 'Ele(a)' },
      { index: 1, meaning: 'Como ele(a) me vê' },
      { index: 2, meaning: 'O que sente sobre a relação' },
      { index: 3, meaning: 'Oculto (O que não estou vendo)' },
      { index: 4, meaning: 'Base da relação' },
      { index: 5, meaning: 'Futuro da relação' },
      { index: 6, meaning: 'Aprendizado/Conselho' }
    ],
    aiInstruction: 'Faça uma análise crítica sobre compatibilidade, alertas ocultos e se o investimento emocional vale o retorno.'
  },

  // 4. Método Mensal (6 Cartas)
  {
    id: 'mensal',
    title: 'Método Mensal',
    description: 'Previsão completa para o seu próximo mês.',
    cardsCount: 6,
    layoutType: 'cross', // Layout em Cruz
    positions: [
      { index: 0, meaning: 'A energia do mês' },
      { index: 1, meaning: 'Perspectiva positiva' },
      { index: 2, meaning: 'Perspectiva negativa' },
      { index: 3, meaning: 'Financeiro' },
      { index: 4, meaning: 'Área escolhida (Amor/Trabalho)' },
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
    layoutType: 'horseshoe', // Layout em U ou V
    positions: [
      { index: 0, meaning: 'Passado' },
      { index: 1, meaning: 'Presente' },
      { index: 2, meaning: 'Futuro Imediato' },
      { index: 3, meaning: 'O Caminho/Ação' },
      { index: 4, meaning: 'Influência Externa' },
      { index: 5, meaning: 'Obstáculos' },
      { index: 6, meaning: 'Desfecho Final' }
    ],
    aiInstruction: 'Analise a linha do tempo, a evolução dos fatos e o resultado provável.'
  },

  // 6. Fofocando sobre seu amor (12 Cartas)
  {
    id: 'amor_fofoca',
    title: 'Fofocando sobre o Amor',
    description: 'Descubra tudo o que ele(a) pensa, sente e esconde.',
    cardsCount: 12,
    layoutType: 'love_grid', // Grid 4 linhas x 3 colunas
    positions: [
      { index: 0, meaning: 'Como te vê (1)' }, { index: 1, meaning: 'Como te vê (2)' }, { index: 2, meaning: 'Como te vê (3)' },
      { index: 3, meaning: 'O que sente (1)' }, { index: 4, meaning: 'O que sente (2)' }, { index: 5, meaning: 'O que sente (3)' },
      { index: 6, meaning: 'O que quer dizer (1)' }, { index: 7, meaning: 'O que quer dizer (2)' }, { index: 8, meaning: 'O que quer dizer (3)' },
      { index: 9, meaning: 'Como vai agir (1)' }, { index: 10, meaning: 'Como vai agir (2)' }, { index: 11, meaning: 'Como vai agir (3)' },
    ],
    aiInstruction: 'IMPORTANTE: Interprete em blocos de 3 cartas. Cartas 1-3: "Como te vê". Cartas 4-6: "O que sente". Cartas 7-9: "O que gostaria de dizer/Oculto". Cartas 10-12: "Como pretende agir".'
  },

  // 7. Método Ficar ou Partir (6 Cartas)
  {
    id: 'ficar_partir',
    title: 'Ficar ou Partir?',
    description: 'Está em dúvida? Compare os dois caminhos.',
    cardsCount: 6,
    layoutType: 'split', // Layout dividido (Coração partido)
    positions: [
      { index: 0, meaning: 'Situação Atual' },
      { index: 1, meaning: 'Por que ficar?' },
      { index: 2, meaning: 'Por que partir?' },
      { index: 3, meaning: 'Como me sentirei se ficar?' },
      { index: 4, meaning: 'Como me sentirei se partir?' },
      { index: 5, meaning: 'Tendência do Futuro/Conselho' }
    ],
    aiInstruction: 'Compare as duas opções (ficar vs partir) analisando os prós, contras e sentimentos de cada caminho. Dê um veredito claro.'
  }
];
