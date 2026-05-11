import { useState, useEffect, useCallback } from 'react';
import { RecipeService } from '../../../services/RecipeService';
import { Recipe } from '../../../types';

export function useRecipeSuggestions(activeCategory: string) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [featured, setFeatured] = useState<Recipe | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadRecipes = useCallback(async (isRefresh = false) => {
    // Evita chamadas duplicadas ou desnecessárias
    if (loading || loadingMore || (!hasMore && !isRefresh)) return;

    if (isRefresh) {
      setLoading(true);
      setPage(0);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const currentPage = isRefresh ? 0 : page;
      const data = await RecipeService.getAll(currentPage, 10, activeCategory);

      // Se vier menos que o limite, significa que a base acabou
      if (data.length < 10) {
        setHasMore(false);
      }

      setRecipes(prev => isRefresh ? data : [...prev, ...data]);
      setPage(prev => isRefresh ? 1 : prev + 1);

      if (isRefresh && activeCategory === 'Tudo') {
        const feat = await RecipeService.getFeatured();
        setFeatured(feat);
      }
    } catch (error) {
      console.error('Erro no Hook useRecipeSuggestions:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [page, loading, loadingMore, hasMore, activeCategory]);

  useEffect(() => {
    loadRecipes(true);
  }, [activeCategory]);

  return {
    recipes,
    featured,
    loading,
    loadingMore,
    loadMore: () => loadRecipes(false),
    refresh: () => loadRecipes(true),
    hasMore
  };
}