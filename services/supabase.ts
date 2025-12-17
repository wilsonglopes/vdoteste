import { createClient } from '@supabase/supabase-js';

// Carrega as chaves do .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação de segurança para não subir sem chaves
if (!supabaseUrl) console.error("ERRO CRÍTICO: VITE_SUPABASE_URL NÃO ENCONTRADA");
if (!supabaseAnonKey) console.error("ERRO CRÍTICO: VITE_SUPABASE_ANON_KEY NÃO ENCONTRADA");

// --- LÓGICA DE DETECÇÃO DE AMBIENTE ---
const hostname = window.location.hostname;

// Só ativa o compartilhamento de cookies se estivermos EXATAMENTE no domínio oficial
// Isso permite que o login funcione no 'vdoteste.netlify.app' e 'localhost' sem travar
const isProduction = hostname.includes('vozesdooraculo.com.br');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'sb-auth-token',
    storage: window.localStorage,
    detectSessionInUrl: true,
    flowType: 'pkce',
    // Configuração Dinâmica:
    // Se for produção, compartilha cookie entre 'app.' e 'www.'
    // Se for teste ou local, deixa o navegador decidir (undefined)
    cookieOptions: isProduction 
      ? { 
          domain: '.vozesdooraculo.com.br', 
          path: '/', 
          sameSite: 'lax', 
          secure: true 
        }
      : undefined
  }
});

// --- HELPER FUNCTIONS (Mantidas iguais) ---

export const signIn = async ({ email, password }: any) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
};

export const signUp = async (credentials: any) => {
  const { data, error } = await supabase.auth.signUp(credentials);
  if (error) throw error;
  return data.user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  // Opcional: Limpar localstorage extra se necessário
  window.localStorage.removeItem('sb-auth-token');
};
