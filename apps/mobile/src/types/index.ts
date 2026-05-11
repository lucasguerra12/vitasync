// Tipagem exata do que criamos no PostgreSQL (Supabase)
export interface UserProfile {
  id: string;
  name: string;
  birth_date: string; // Formato YYYY-MM-DD
  sex: string;
  weight_kg: number;
  height_cm: number;
  activity_level: string;
  main_goal: string;
  daily_calorie_goal: number;
  daily_water_goal_ml?: number;
  daily_step_goal?: number;
}

// Tipagem para a resposta de Autenticação do Redux
export interface AuthPayload {
  userId: string;
  email: string;
}