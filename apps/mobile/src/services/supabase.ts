import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Limpeza rigorosa das chaves para evitar espaços invisíveis
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("🚨 [ERRO FATAL] Chaves do Supabase em falta no .env!");
}

// 2. Cliente puro, forçando o fluxo "implicit" (Desliga a exigência de criptografia que estava a causar o Loading Infinito)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    flowType: 'implicit', // A trava mágica contra o ecrã de carregamento infinito!
  },
});

console.log("✅ [PASSO 1] Supabase ligado com sucesso!");