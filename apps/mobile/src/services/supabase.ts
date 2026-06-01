import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("🚨 [ERRO FATAL] Chaves do Supabase em falta no .env!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
  // 🚨 A SOLUÇÃO DO GARGALO ESTÁ AQUI:
  // Forçamos o Supabase a usar a rede nativa do celular.
  global: {
    fetch: fetch,
  },
});

console.log("✅ [SUPABASE] Conexão configurada em modo estável.");