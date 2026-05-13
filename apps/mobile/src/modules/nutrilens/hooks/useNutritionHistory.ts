import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabase';
import { startOfDay, endOfDay, format } from 'date-fns';

export function useNutritionHistory(userId: string | undefined, selectedDate: Date) {
  const [historyData, setHistoryData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return;
      setIsLoading(true);
      
      const start = startOfDay(selectedDate).getTime();
      const end = endOfDay(selectedDate).getTime();

      const { data, error } = await supabase
        .from('meals')
        .select('*, meal_items(*)')
        .eq('user_id', userId)
        .gte('logged_at', start)
        .lte('logged_at', end);

      if (!error) {
        // Cálculo rápido de totais para o dia selecionado
        const dayTotals = data.reduce((acc, curr) => ({
          calories: acc.calories + curr.total_calories,
          protein: acc.protein + curr.total_protein,
          carbs: acc.carbs + curr.total_carbs,
          fat: acc.fat + curr.total_fat,
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

        setHistoryData({ meals: data, totals: dayTotals });
      }
      setIsLoading(false);
    };

    fetchHistory();
  }, [userId, selectedDate]);

  return { historyData, isLoading };
}