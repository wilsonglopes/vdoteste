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

export const getTarotReading = async (
  question: string,
  cardIds: number[],
  userName: string,
  userBirthDate: string = ""
): Promise<ReadingResult> => {
  
  const userAge = calculateAge(userBirthDate);
  const cardNamesList = cardIds.map((id) => {
    const name = CARD_NAMES[id as keyof typeof CARD_NAMES] || `Carta ${id}`;
    return `Carta ${id}: ${name}`;
  }).join("\n");

  const promptText = `
    Atue como a Cigana Esmeralda.
    Consulente: ${userName} (${userAge} anos).
    Pergunta: "${question}"
    Cartas:
    ${cardNamesList}
    
    Analise Passado, Presente e Futuro.
    
    IMPORTANTE: Responda APENAS o JSON abaixo, sem explicações extras antes ou depois:
    {
      "intro": "texto",
      "timeline": { "past": "texto", "present": "texto", "future": "texto" },
      "individual_cards": [{ "position": "texto", "card_name": "texto", "interpretation": "texto" }],
      "summary": "texto",
      "advice": "texto"
    }
  `;

  try {
    const rawResult = await callOracleBackend(promptText);
    
    // --- LIMPEZA DE SEGURANÇA (Para o gemini-pro) ---
    // Encontra onde começa o '{' e onde termina o '}'
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
      intro: "As cartas estão se revelando...",
      timeline: { past: "...", present: "...", future: "..." },
      summary: "Houve uma pequena falha na conexão. Tente novamente.",
      advice: "Respire fundo e clique novamente."
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
