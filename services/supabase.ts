import { createClient } from '@supabase/supabase-js';

// Carrega corretamente do .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação opcional (evita deploy quebrado)
if (!supabaseUrl) console.error("ERRO: VITE_SUPABASE_URL NÃO ENCONTRADA");
if (!supabaseAnonKey) console.error("ERRO: VITE_SUPABASE_ANON_KEY NÃO ENCONTRADA");

// Cria cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth
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
};
