import { CARD_NAMES } from "../constants";

export interface ReadingResult {
  intro: string;
  timeline: { past: string; present: string; future: string; };
  individual_cards?: Array<{ position: string; card_name: string; interpretation: string; }>;
  summary: string;
  advice: string;
}

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

// --- TAROT COM LEITURA DE COMBINAÇÕES ---
export const getTarotReading = async (
  question: string,
  cardIds: number[],
  userName: string,
  userBirthDate: string = ""
): Promise<ReadingResult> => {
  
  const userAge = calculateAge(userBirthDate);
  const cardNamesList = cardIds.map((id) => {
    const name = CARD_NAMES[id as keyof typeof CARD_NAMES] || `Carta ${id}`;
    return `Posição ${id}: ${name}`;
  }).join("\n");

  const promptText = `
    Atue como a Cigana Esmeralda, uma oráculo sábia, mística e acolhedora.
    
    DADOS DO CONSULENTE:
    - Nome: ${userName} (${userAge} anos).
    - Pergunta/Tema: "${question}"
    
    TIRAGEM (Mesa Real Simplificada - Passado, Presente, Futuro):
    ${cardNamesList}
    
    INSTRUÇÕES DE LEITURA:
    1. Não leia as cartas isoladamente. Analise a *combinação* entre elas (ex: uma carta negativa perto de uma positiva suaviza o efeito).
    2. Seja específica em relação à pergunta do usuário. Evite respostas vagas.
    3. Use uma linguagem envolvente, mística, mas clara.
    
    IMPORTANTE: Responda APENAS o JSON abaixo, sem explicações extras:
    {
      "intro": "Uma saudação mística personalizada citando o nome do consulente e sentindo a energia da pergunta.",
      "timeline": { 
        "past": "Análise das 3 primeiras cartas (raízes da situação).", 
        "present": "Análise das 3 cartas do meio (momento atual e desafios).", 
        "future": "Análise das 3 últimas cartas (tendência e desfecho provável)." 
      },
      "individual_cards": [
        { "position": "1", "card_name": "Nome da Carta", "interpretation": "Palavra-chave ou frase curta sobre esta carta neste contexto específico." }
        // ... repetir para todas as cartas
      ],
      "summary": "Um resumo direto respondendo à pergunta: Sim, Não ou Talvez, e o porquê.",
      "advice": "Um conselho final espiritual e prático ou um mantra."
    }
  `;

  try {
    const rawResult = await callOracleBackend(promptText);
    
    // Limpeza de segurança para extrair apenas o JSON
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
      intro: "As cartas estão nubladas neste momento...",
      timeline: { past: "...", present: "...", future: "..." },
      individual_cards: [],
      summary: "Houve uma interferência na conexão espiritual. Por favor, tente novamente.",
      advice: "Respire fundo e refaça a pergunta."
    };
  }
};

// --- SONHOS COM PSICOLOGIA E SIMBOLISMO ---
export const interpretDream = async (dreamText: string): Promise<string> => {
  try {
    const prompt = `
      Atue como um Guardião dos Sonhos, especialista em simbologia mística e arquétipos de Jung.
      
      SONHO DO USUÁRIO: "${dreamText}"
      
      TAREFA:
      Faça uma interpretação profunda. Não apenas diga o que significa, mas conecte com o momento de vida.
      
      ESTRUTURA DA RESPOSTA (Use formatação Markdown):
      1. **Visão Geral:** O sentimento principal do sonho.
      2. **Símbolos Chave:** Destaque 2 ou 3 elementos (ex: **Água**, **Voar**) e seus significados ocultos.
      3. **Mensagem do Inconsciente:** O que a alma da pessoa está tentando dizer.
      4. **Conselho:** Uma ação prática ou reflexão.
    `;
    return await callOracleBackend(prompt);
  } catch (error: any) {
    return "O mundo dos sonhos está nebuloso agora. Tente enviar novamente.";
  }
};

// --- CARTA DO DIA (ENERGIA RÁPIDA) ---
export const getDailyCardReading = async (cardId: number, userName: string): Promise<string> => {
  const cardName = CARD_NAMES[cardId as keyof typeof CARD_NAMES] || `Carta ${cardId}`;
  
  const prompt = `
    Você é um oráculo amigo e sábio.
    A usuária ${userName} tirou a carta "${cardName}" para reger o dia de hoje.
    
    Forneça um conselho "Biscoito da Sorte Místico":
    - Curto, direto e inspirador.
    - Fale sobre a energia do dia (alerta ou bênção).
    - Máximo 3 frases.
  `;

  try {
    return await callOracleBackend(prompt);
  } catch (error) {
    return "As energias estão se alinhando. Confie na sua intuição hoje.";
  }
};
