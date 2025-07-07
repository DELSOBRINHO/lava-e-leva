/// <reference types="vite/client" />

// supabase.Client.ts
import { createClient } from '@supabase/supabase-js';

console.log('VITE:', import.meta.env);

// Verifique se as variáveis de ambiente estão definidas
// O 'as string' garante que o TypeScript não reclame de valores potencialmente indefinidos
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Validação simples para garantir que as variáveis de ambiente não estão vazias
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL não está definida nas suas variáveis de ambiente.');
}
if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY não está definida nas suas variáveis de ambiente.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);