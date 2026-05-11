export interface UserProfile {
  id: string;
  name: string;
  birth_date: string; 
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

export interface Recipe {
  id: string;
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
  prep_time_minutes: number;
  is_featured: boolean;
  description?: string;
  image_url?: string;
  main_ingredients?: string[];
  created_at?: string;
}