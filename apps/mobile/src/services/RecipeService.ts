import { supabase } from './supabase';
import { Recipe } from '../types';

export const RecipeService = {
  getAll: async (): Promise<Recipe[]> => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Busca apenas a receita em destaque
  getFeatured: async (): Promise<Recipe | null> => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('is_featured', true)
      .limit(1)
      .single();

    if (error) return null;
    return data;
  }
};