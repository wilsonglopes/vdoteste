export interface SpreadPosition {
  index: number;
  meaning: string;
}

export interface Spread {
  id: string;
  title: string;
  description: string;
  cardsCount: number;
  layoutType: 'line' | 'cross' | 'horseshoe' | 'love_grid' | 'ex_cross' | 'block' | 'temple_9';
  positions: SpreadPosition[];
  aiInstruction: string;
}

export const SPREADS: Spread[] = [
  {
    id: 'templo_afrodite', // O antigo "9 Cartas"
    title: 'Templo de Afrodite',
    description: 'Análise completa de sentimentos e pensamentos (9 Cartas).',
    cardsCount: 9,
    layoutType: 'love_grid', // Reusamos o grid 3x3
    positions: [
      { index: 0, meaning: 'O que ele pensa (1)' }, { index: 1, meaning: 'O que ele pensa (2)' }, { index: 2, meaning: 'O que ele pensa (3)' },
      { index: 3, meaning: 'O que ele sente (1)' }, { index: 4, meaning: 'O que ele sente (2)' }, { index: 5, meaning: 'O que ele sente (3)' },
      { index: 6, meaning: 'Futuro/Intenção (1)' }, { index: 7, meaning: 'Futuro/Intenção (2)' }, { index: 8, meaning: 'Futuro/Intenção (3)' }
    ],
    aiInstruction: 'Analise em blocos de 3: Cartas 1-3 (Mental), 4-6 (Emocional), 7-9 (Físico/Futuro).'
  },
  {
    id: 'mensal',
    title: 'Método Mensal',
    description: 'Previsão completa para o seu próximo mês.',
    cardsCount: 6,
    layoutType: 'cross',
    positions: [
      { index: 0, meaning: 'Energia Central' },
      { index: 1, meaning: 'O que vem a favor' },
      { index: 2, meaning: 'O que vem contra' },
      { index: 3, meaning: 'Vida Financeira' },
      { index: 4, meaning: 'Vida Amorosa' },
      { index: 5, meaning: 'Conselho Final' }
    ],
    aiInstruction: 'Foque em previsão temporal para os próximos 30 dias.'
  },
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
    aiInstruction: 'Interprete em 4 linhas de 3 cartas: Visão, Sentimento, Fala Oculta e Ação Futura.'
  },
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
  }
];
