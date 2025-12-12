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
  layoutType: 'line' | 'cross' | 'horseshoe' | 'love_grid' | 'ex_cross' | 'block';
  positions: SpreadPosition[];
  aiInstruction: string; // Dica especial para a IA
}

export const SPREADS: Spread[] = [
  {
    id: 'free',
    title: 'Conselho Rápido',
    description: 'Uma leitura direta para dúvidas do cotidiano.',
    cardsCount: 3,
    layoutType: 'line',
    positions: [
      { index: 0, meaning: 'A Situação' },
      { index: 1, meaning: 'O Obstáculo/Caminho' },
      { index: 2, meaning: 'O Conselho' }
    ],
    aiInstruction: 'Faça uma leitura concisa conectando as 3 cartas.'
  },
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
      { index: 4, meaning: 'Área escolhida (Amor/Trabalho)' },
      { index: 5, meaning: 'Conselho do Tarô' }
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
      // A IA vai receber instruções para agrupar de 3 em 3
      { index: 0, meaning: 'Como te vê (Carta 1)' }, { index: 1, meaning: 'Como te vê (Carta 2)' }, { index: 2, meaning: 'Como te vê (Carta 3)' },
      { index: 3, meaning: 'O que sente (Carta 1)' }, { index: 4, meaning: 'O que sente (Carta 2)' }, { index: 5, meaning: 'O que sente (Carta 3)' },
      { index: 6, meaning: 'O que quer dizer (Carta 1)' }, { index: 7, meaning: 'O que quer dizer (Carta 2)' }, { index: 8, meaning: 'O que quer dizer (Carta 3)' },
      { index: 9, meaning: 'Como vai agir (Carta 1)' }, { index: 10, meaning: 'Como vai agir (Carta 2)' }, { index: 11, meaning: 'Como vai agir (Carta 3)' },
    ],
    aiInstruction: 'IMPORTANTE: Interprete em blocos de 3 cartas. Cartas 1,2,3 respondem "Como te vê". Cartas 4,5,6 respondem "O que sente". Cartas 7,8,9 respondem "O que gostaria de dizer". Cartas 10,11,12 respondem "Como pretende agir".'
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