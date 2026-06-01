import { useState, useEffect } from 'react';
import { supabase } from '../../../services/supabase';
import { startOfDay, endOfDay } from 'date-fns';

export function useNutritionHistory(userId: string | undefined, selectedDate: Date) {
  const [groupedMeals, setGroupedMeals] = useState<any[]>([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
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
        .lte('logged_at', end)
        .order('logged_at', { ascending: false });

      if (!error) {
        let kcal = 0, p = 0, c = 0, f = 0;
        const groups: any = {
          breakfast: { id: 'breakfast', name: 'Café da manhã', icon: 'wb-sunny', items: [], kcal: 0 },
          lunch: { id: 'lunch', name: 'Almoço', icon: 'lunch-dining', items: [], kcal: 0 },
          dinner: { id: 'dinner', name: 'Jantar', icon: 'dinner-dining', items: [], kcal: 0 },
          snack: { id: 'snack', name: 'Lanches', icon: 'cookie', items: [], kcal: 0 }
        };

        data?.forEach((m: any) => {
          kcal += m.total_calories || 0;
          p += m.total_protein || 0;
          c += m.total_carbs || 0;
          f += m.total_fat || 0;

          if (groups[m.meal_type]) {
            groups[m.meal_type].kcal += m.total_calories;
            const itemNames = m.meal_items?.map((i: any) => `${i.quantity_g}g ${i.food_name}`).join(' • ');
            if (itemNames) groups[m.meal_type].items.push(itemNames);
          }
        });

        // Atualiza os estados que o Diário precisa para montar os gráficos
        setTotals({ calories: Math.round(kcal), protein: Math.round(p), carbs: Math.round(c), fat: Math.round(f) });
        setGroupedMeals(
          Object.values(groups)
            .filter((g: any) => g.kcal > 0)
            .map((g: any) => ({ ...g, description: g.items.join(' • ') }))
        );
      }
      setIsLoading(false);
    };

    fetchHistory();
  }, [userId, selectedDate]);

  return { groupedMeals, totals, isLoading };
}