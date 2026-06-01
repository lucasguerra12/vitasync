import { supabase } from './supabase';
import { Recipe } from '../types';

export const RecipeService = {
  /**
   * Busca receitas com paginação e filtro de categoria.
   * Otimizado para performance de rede.
   */
  getAll: async (page: number = 0, limit: number = 10, category: string = 'Tudo'): Promise<Recipe[]> => {
    const from = page * limit;
    const to = from + limit - 1;

    // Seleção explícita de colunas para reduzir o payload (Velocidade)
    let query = supabase
      .from('recipes')
      .select('id, title, calories, protein, carbs, fat, tags, prep_time_minutes, is_featured')
      .range(from, to)
      .order('created_at', { ascending: false })
      .order('id', { ascending: true });

    if (category !== 'Tudo') {
      query = query.contains('tags', [category]);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro RecipeService.getAll:', error.message);
      throw error;
    }

    // Cast seguro para Recipe[]
    return (data as Recipe[]) || [];
  },

  /**
   * Busca os detalhes completos de uma única receita
   */
  getById: async (id: string): Promise<Recipe> => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Recipe;
  },

  getFeatured: async (): Promise<Recipe | null> => {
    const { data, error } = await supabase
      .from('recipes')
      .select('id, title, calories, protein, carbs, fat, tags, prep_time_minutes, is_featured')
      .eq('is_featured', true)
      .limit(1)
      .single();

    if (error) return null;
    return data as Recipe;
  }
};