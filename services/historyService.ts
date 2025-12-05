import { supabase } from './supabase';

// Função para salvar qualquer leitura (Tarot ou Sonho)
export const saveReading = async (
  userId: string,
  type: 'tarot' | 'dream',
  inputData: any, // Pergunta, cartas ou texto do sonho
  aiResponse: any // O que a IA respondeu
) => {
  // Se não tiver usuário, não salva (proteção)
  if (!userId) return false;

  const { error } = await supabase
    .from('readings')
    .insert({
      user_id: userId,
      type: type,
      input_data: inputData,
      ai_response: aiResponse,
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error('Erro ao salvar no histórico:', error);
    return false;
  }
  
  console.log('Leitura salva com sucesso!');
  return true;
};
