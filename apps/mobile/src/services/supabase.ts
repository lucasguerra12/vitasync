import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// O Expo lê automaticamente o que está no .env se tiver o prefixo EXPO_PUBLIC_
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configurações para garantir que o login persista no telemóvel
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});