import { useState, useEffect } from 'react';
import { RecipeService } from '../../../services/RecipeService';
import { useDailyNutrition } from './useDailyNutrition';
import { Recipe } from '../../../types';

export function useRecipeSuggestions() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [featured, setFeatured] = useState<Recipe | null>(null);
  const [recommendations, setRecommendations] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const { totals, meals } = useDailyNutrition();

  useEffect(() => {
    async function loadData() {
      try {
        const [all, featuredItem] = await Promise.all([
          RecipeService.getAll(),
          RecipeService.getFeatured()
        ]);

        setRecipes(all);
        setFeatured(featuredItem);

        // LÓGICA DE RECOMENDAÇÃO (Regra de Negócio)
        if (meals.length === 0) {
          // Se não comeu nada, sugere aleatórias
          setRecommendations(all.sort(() => 0.5 - Math.random()).slice(0, 4));
        } else {
          // Se o Carboidrato de hoje já passou de 150g, sugere Low Carb
          if (totals.carbs > 150) {
            setRecommendations(all.filter(r => r.tags.includes('Low Carb')).slice(0, 4));
          } 
          // Se a Proteína está baixa (< 50g), sugere Proteico
          else if (totals.protein < 50) {
            setRecommendations(all.filter(r => r.tags.includes('Proteico')).slice(0, 4));
          }
          else {
            setRecommendations(all.slice(0, 4));
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [totals, meals]);

  return { recipes, featured, recommendations, loading };
}