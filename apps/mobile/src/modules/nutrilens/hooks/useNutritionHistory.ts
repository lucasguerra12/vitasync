import { useState, useEffect } from 'react';
import { Q } from '@nozbe/watermelondb';
import { startOfDay, endOfDay } from 'date-fns';
import { database } from '../../../database';
import Meal from '../../../database/models/Meal';

export function useNutritionHistory(selectedDate: Date) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [groupedMeals, setGroupedMeals] = useState<any[]>([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);

    const fetchHistoryForDate = async () => {
      try {
        const mealsCollection = database.collections.get<Meal>('meals');
        
        // Pega o início e o fim EXATOS do dia selecionado
        const dayStart = startOfDay(selectedDate).getTime();
        const dayEnd = endOfDay(selectedDate).getTime();

        const dailyMeals = await mealsCollection.query(
          Q.where('created_at', Q.between(dayStart, dayEnd))
        ).fetch();

        if (isActive) {
          let kcal = 0, p = 0, c = 0, f = 0;
          
          const groups: Record<string, any> = {
            breakfast: { id: 'breakfast', name: 'Breakfast', icon: 'wb-sunny', items: [], kcal: 0 },
            lunch: { id: 'lunch', name: 'Lunch', icon: 'lunch-dining', items: [], kcal: 0 },
            dinner: { id: 'dinner', name: 'Dinner', icon: 'dinner-dining', items: [], kcal: 0 },
            snack: { id: 'snack', name: 'Snacks', icon: 'cookie', items: [], kcal: 0 }
          };

          dailyMeals.forEach(m => {
            kcal += m.calories || 0;
            p += m.protein || 0;
            c += m.carbs || 0;
            f += m.fat || 0;

            if (groups[m.mealType]) {
              groups[m.mealType].kcal += m.calories || 0;
              groups[m.mealType].items.push(`${m.portion}g ${m.name}`);
            }
          });

          setTotals({
            calories: Math.round(kcal),
            protein: Math.round(p),
            carbs: Math.round(c),
            fat: Math.round(f)
          });

          setMeals(dailyMeals.reverse());
          
          setGroupedMeals(
            Object.values(groups)
              .filter((g: any) => g.items.length > 0)
              .map((g: any) => ({ ...g, description: g.items.join(' • ') }))
          );
        }
      } catch (error) {
        console.error("Erro ao buscar histórico nutricional:", error);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchHistoryForDate();
    return () => { isActive = false; };
  }, [selectedDate]);

  return { meals, groupedMeals, totals, isLoading };
}