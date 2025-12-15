import { CARD_NAMES } from "../constants";

export interface ReadingResult {
  intro: string;
  timeline: { past: string; present: string; future: string; };
  individual_cards?: Array<{ position: string; card_name: string; interpretation: string; }>;
  summary: string;
  advice: string;
}

// Definições exatas das posições conforme suas imagens
const SPREAD_DEFINITIONS: Record<string, string[]> = {
  'tirada_ex': [
    "1. O que ele(a) sente por mim?",
    "2. Tem intenção de voltar?",
    "3. Ele(a) mudou as atitudes?",
    "4. Possível futuro entre nós",
    "5. Conselho do oráculo"
  ],
  'metodo_mensal': [
    "1. A energia principal do mês",
    "2. O aspecto positivo (o que ajuda)",
    "3. O aspecto negativo (o que atrapalha)",
    "4. Vida Financeira",
    "5. Área de escolha (Amor/Trabalho/Família)",
    "6. Conselho do Tarô"
  ],
  'vale_a_pena': [
    "1. Ele(a) (Quem é essa pessoa)",
    "2. Como ele(a) me vê",
    "3. O que ele(a) sente sobre nossa relação",
    "4. O que está oculto (não estou vendo)",
    "5. A base da nossa relação",
    "6. O futuro da nossa relação",
    "7. O que aprendo com essa relação"
  ],
  'ficar_ou_partir': [
    "1. Situação Atual",
    "2. Motivo para FICAR",
    "3. Motivo para PARTIR",
    "4. Como me sentirei se FICAR",
    "5. Como me sentirei se PARTIR",
    "6. Tendência do Futuro e Conselho Final"
  ],
  'metodo_ferradura': [
    "1. Passado (influências anteriores)",
    "2. Presente (situação atual)",
    "3. Futuro Imediato",
    "4. O caminho a seguir / Ação necessária",
    "5. Reação das pessoas próximas / Ambiente",
    "6. Obstáculos a serem superados",
    "7. Desfecho Provável"
  ],
  'fofoca_amor': [
    "1. Como te vê? (Detalhe 1)",
    "2. Como te vê? (Detalhe 2)",
    "3. Como te vê? (Síntese)",
    "4. O que sente? (Detalhe 1)",
    "5. O que sente? (Detalhe 2)",
    "6. O que sente? (Síntese)",
    "7. O que gostaria de dizer? (Detalhe 1)",
    "8. O que gostaria de dizer? (Detalhe 2)",
    "9. O que gostaria de dizer? (Síntese)",
    "10. Como pretende agir? (Detalhe 1)",
    "11. Como pretende agir? (Detalhe 2)",
    "12. Como pretende agir? (Síntese)"
  ],
  // Templo de Afrodite (9 Cartas) - Padrão Abrangente
  'padrao': [
    "1. (Mental) O que você pensa",
    "2. (Mental) O que ele(a) pensa / O outro lado",
    "3. (Mental) A síntese racional",
    "4. (Emocional) O que você sente",
    "5. (Emocional) O que ele(a) sente / O ambiente",
    "6. (Emocional) O vínculo emocional",
    "7. (Físico) Suas atitudes",
    "8. (Físico) Atitudes dele(a) / Fatos concretos",
    "9. (Físico) Resultado/Futuro"
  ]
};

const calculateAge = (dateString: string) => {
  if (!dateString) return 30;
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

async function callOracleBackend(prompt: string): Promise<string> {
  const response = await fetch('/.netlify/functions/oracle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.result;
}

export const getTarotReading = async (
  question: string,
  cardIds: number[],
  userName: string,
  userBirthDate: string = ""
): Promise<ReadingResult> => {
  
  const userAge = calculateAge(userBirthDate);

  // 1. Identifica o método através da tag na pergunta
  let spreadType = 'padrao';
  if (question.includes("TIRADA DO EX")) spreadType = 'tirada_ex';
  else if (question.includes("PREVISÃO MENSAL")) spreadType = 'metodo_mensal';
  else if (question.includes("ELE(A) VALE A PENA")) spreadType = 'vale_a_pena';
  else if (question.includes("FICAR OU PARTIR")) spreadType = 'ficar_ou_partir';
  else if (question.includes("FERRADURA")) spreadType = 'metodo_ferradura';
  else if (question.includes("FOFOCANDO")) spreadType = 'fofoca_amor';

  // 2. Seleciona as definições corretas
  const positions = SPREAD_DEFINITIONS[spreadType] || SPREAD_DEFINITIONS['padrao'];

  // 3. Monta a lista de cartas vinculando a carta sorteada com o significado da posição
  const cardNamesList = cardIds.map((id, index) => {
    const cardName = CARD_NAMES[id as keyof typeof CARD_NAMES] || `Carta ${id}`;
    const positionMeaning = positions[index] || `Posição ${index + 1}`;
    // Ex: "Carta 1 (O que ele sente): O Louco"
    return `Posição ${index + 1} ("${positionMeaning}"): ${cardName}`;
  }).join("\n");

  const promptText = `
    Atue como a Cigana Esmeralda, uma taróloga experiente e mística.
    Consulente: ${userName} (${userAge} anos).
    Pergunta Original: "${question.replace(/\[.*?\]/, '').trim()}"
    
    MÉTODO DE LEITURA: ${spreadType.toUpperCase().replace('_', ' ')}.
    
    AS CARTAS SORTEADAS E SUAS POSIÇÕES:
    ${cardNamesList}
    
    INSTRUÇÕES DE INTERPRETAÇÃO:
    - Interprete cada carta especificamente para a função da sua posição (ex: se a posição é "Futuro", fale do futuro).
    - Conecte as cartas para criar uma narrativa coesa.
    - Se for o método 'fofoca_amor', agrupe as ideias (como te vê, o que sente, etc).
    - Mantenha o tom acolhedor e direto.

    IMPORTANTE: Responda APENAS o JSON abaixo, estritamente neste formato:
    {
      "intro": "Uma introdução mística sobre a energia geral da leitura.",
      "timeline": { 
          "past": "Resumo das influências passadas ou da base da situação.", 
          "present": "Análise do momento atual e sentimentos vigentes.", 
          "future": "Tendências futuras e desfecho provável." 
      },
      "individual_cards": [
          { 
            "position": "Número da posição (ex: 1)", 
            "card_name": "Nome da Carta", 
            "interpretation": "Interpretação direta desta carta para esta posição específica." 
          }
      ],
      "summary": "Resumo final respondendo diretamente à pergunta do usuário.",
      "advice": "Um conselho prático e espiritual."
    }
  `;

  try {
    const rawResult = await callOracleBackend(promptText);
    
    // --- LIMPEZA DE SEGURANÇA ---
    const jsonStartIndex = rawResult.indexOf('{');
    const jsonEndIndex = rawResult.lastIndexOf('}');
    
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error("JSON não encontrado na resposta");
    }
    
    const cleanJson = rawResult.substring(jsonStartIndex, jsonEndIndex + 1);
    return JSON.parse(cleanJson) as ReadingResult;

  } catch (error: any) {
    console.error("Erro Tarot:", error);
    return {
      intro: "Houve uma interferência espiritual na conexão...",
      timeline: { past: "...", present: "...", future: "..." },
      summary: "Houve uma pequena falha na conexão. Tente novamente.",
      advice: "Respire fundo e clique em 'Tentar Novamente' para reconectar."
    };
  }
};

export const interpretDream = async (dreamText: string): Promise<string> => {
  try {
    return await callOracleBackend(`Interprete este sonho: "${dreamText}"`);
  } catch (error: any) {
    return "Erro ao interpretar sonho. Tente novamente.";
  }
};
