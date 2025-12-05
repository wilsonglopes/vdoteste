import { GoogleGenerativeAI } from "@google/generative-ai";

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!API_KEY) throw new Error("Chave API ausente");

    const body = JSON.parse(event.body || "{}");
    const prompt = body.prompt;

    if (!prompt) throw new Error("Prompt vazio");

    // Inicializa a biblioteca ESTÁVEL
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // --- AQUI ESTÁ A CHAVE ---
    // Usando o nome EXATO que aparece no seu painel.
    // Como sua conta é paga/liberada, esse modelo vai responder.
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      // Removi configurações complexas de JSON para evitar conflitos de versão.
      // O prompt no frontend já garante o formato JSON.
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ result: text }),
    };

  } catch (error) {
    console.error("Erro Oracle:", error);
    return {
      statusCode: 500,
      headers,
      // Retorna o erro detalhado para sabermos se o Google aceitou o nome
      body: JSON.stringify({ error: error.message || "Erro interno" }),
    };
  }
};
