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
  description: string;
  prep_time_minutes: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image_url: string;
  tags: string[];
  main_ingredients: string[];
  is_featured: boolean;
}