// services/userService.ts
import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  credits: number;
  subscription_status: string; // 'free', 'mensal', 'anual', 'admin'
  subscription_end_date: string | null;
}

// Busca os dados financeiros do usuário
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, credits, subscription_status, subscription_end_date')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Erro técnico ao buscar perfil:', error);
    return null;
  }
};

// Tenta consumir 1 crédito para realizar uma leitura
export const consumeCredit = async (userId: string): Promise<{ success: boolean; message?: string }> => {
  const profile = await getUserProfile(userId);
  
  if (!profile) {
    return { success: false, message: "Perfil não encontrado." };
  }

  // --- 0. VERIFICAÇÃO DE ADMIN (PASSE LIVRE) ---
  if (profile.subscription_status === 'admin') {
    console.log('Acesso Admin: Crédito ilimitado.');
    return { success: true };
  }

  // 1. Verifica se é Assinante (VIP)
  // Se tiver status diferente de 'free' e a data de fim for futura
  const isVip = profile.subscription_status !== 'free' && 
                profile.subscription_end_date && 
                new Date(profile.subscription_end_date) > new Date();

  if (isVip) {
    console.log('Usuário VIP: Crédito não descontado.');
    return { success: true }; // Passe livre!
  }

  // 2. Se não for VIP, verifica Créditos
  if (profile.credits > 0) {
    // Desconta 1 crédito
    const { error } = await supabase
      .from('users')
      .update({ credits: profile.credits - 1 })
      .eq('id', userId);

    if (error) {
      console.error('Erro ao debitar:', error);
      return { success: false, message: "Erro ao processar pagamento." };
    }

    console.log('Crédito debitado. Restantes:', profile.credits - 1);
    return { success: true };
  }

  // 3. Sem saldo e sem assinatura
  return { success: false, message: "no_credits" };
};
