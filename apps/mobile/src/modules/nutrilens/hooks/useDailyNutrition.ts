import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../../services/supabase';
import { startOfDay, endOfDay } from 'date-fns';

export function useDailyNutrition(userId: string | undefined) {
  const [meals, setMeals] = useState<any[]>([]);
  const [groupedMeals, setGroupedMeals] = useState<any[]>([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [lastMeal, setLastMeal] = useState({ name: 'Sem refeições', kcal: 0 });
  const [topNutrient, setTopNutrient] = useState({ name: 'Carbs', icon: '🌾' });

  const fetchTodayData = useCallback(async () => {
    if (!userId) return;

    try {
      const todayStart = startOfDay(new Date()).getTime();
      const todayEnd = endOfDay(new Date()).getTime();

      const { data, error } = await supabase
        .from('meals')
        .select('*, meal_items(*)')
        .eq('user_id', userId)
        .gte('logged_at', todayStart)
        .lte('logged_at', todayEnd)
        .order('logged_at', { ascending: false }); 

      if (error) throw error;

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

      setTotals({ calories: Math.round(kcal), protein: Math.round(p), carbs: Math.round(c), fat: Math.round(f) });
      setMeals(data || []);

      // CORREÇÃO: Define a última refeição para o Dashboard
      if (data && data.length > 0) {
        setLastMeal({ name: data[0].name, kcal: data[0].total_calories });
      } else {
        setLastMeal({ name: 'Sem refeições', kcal: 0 });
      }

      let maxMacro = Math.max(p, c, f);
      if (maxMacro === p && p > 0) setTopNutrient({ name: 'Proteína', icon: '🥩' });
      else if (maxMacro === f && f > 0) setTopNutrient({ name: 'Gordura', icon: '🥑' });
      else setTopNutrient({ name: 'Carbs', icon: '🌾' });

      setGroupedMeals(
        Object.values(groups)
          .filter((g: any) => g.kcal > 0)
          .map((g: any) => ({ ...g, description: g.items.join(' • ') }))
      );

    } catch (err) {
      console.error("Erro ao carregar nutrição:", err);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchTodayData();
    }, [fetchTodayData])
  );

  return { meals, groupedMeals, totals, lastMeal, topNutrient, refresh: fetchTodayData };
}