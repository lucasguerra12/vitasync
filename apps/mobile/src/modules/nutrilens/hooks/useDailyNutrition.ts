import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Q } from '@nozbe/watermelondb';
import { startOfDay, endOfDay } from 'date-fns';
import { database } from '../../../database';
import Meal from '../../../database/models/Meal';

export function useDailyNutrition(userId?: string) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [groupedMeals, setGroupedMeals] = useState<any[]>([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [lastMeal, setLastMeal] = useState({ name: 'No meals', kcal: 0 });
  const [topNutrient, setTopNutrient] = useState({ name: 'Carbs', icon: '🌾' });

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchTodayMeals = async () => {
        if (!userId) return; // Se não houver utilizador, não fazemos a query

        try {
          const mealsCollection = database.collections.get<Meal>('meals');
          const todayStart = startOfDay(new Date()).getTime();
          const todayEnd = endOfDay(new Date()).getTime();

          // Traz apenas as refeições do utilizador logado HOJE
          const allMeals = await mealsCollection.query(
            Q.where('user_id', userId),
            Q.where('logged_at', Q.between(todayStart, todayEnd))
          ).fetch();

          if (isActive) {
            let kcal = 0, p = 0, c = 0, f = 0;
            const groups: any = {
              breakfast: { id: 'breakfast', name: 'Breakfast', icon: 'wb-sunny', items: [], kcal: 0 },
              lunch: { id: 'lunch', name: 'Lunch', icon: 'lunch-dining', items: [], kcal: 0 },
              dinner: { id: 'dinner', name: 'Dinner', icon: 'dinner-dining', items: [], kcal: 0 },
              snack: { id: 'snack', name: 'Snacks', icon: 'cookie', items: [], kcal: 0 }
            };

            // Usamos Promise.all porque vamos buscar os meal_items de cada refeição (operação assíncrona)
            await Promise.all(allMeals.map(async (m) => {
              kcal += m.totalCalories || 0;
              p += m.totalProtein || 0;
              c += m.totalCarbs || 0;
              f += m.totalFat || 0;

              if (groups[m.mealType]) {
                groups[m.mealType].kcal += m.totalCalories || 0;
                
                // Vamos buscar os itens filhos vinculados a esta refeição!
                const items = await m.items.fetch(); 
                items.forEach((item: any) => {
                   groups[m.mealType].items.push(`${item.quantityG}g ${item.foodName}`);
                });
              }
            }));

            if (!isActive) return;

            setTotals({
              calories: Math.round(kcal),
              protein: Math.round(p),
              carbs: Math.round(c),
              fat: Math.round(f)
            });

            // Ordena pela refeição mais recente
            const sortedMeals = allMeals.sort((a, b) => b.loggedAt - a.loggedAt);
            setMeals(sortedMeals);

            if (sortedMeals.length > 0) {
               setLastMeal({ name: sortedMeals[0].name, kcal: sortedMeals[0].totalCalories });
            }

            let maxMacro = Math.max(p, c, f);
            if (maxMacro === p && p > 0) setTopNutrient({ name: 'Protein', icon: '🥩' });
            else if (maxMacro === f && f > 0) setTopNutrient({ name: 'Fat', icon: '🥑' });
            else setTopNutrient({ name: 'Carbs', icon: '🌾' });
            
            setGroupedMeals(
              Object.values(groups)
                .filter((g: any) => g.items.length > 0)
                .map((g: any) => ({ ...g, description: g.items.join(' • ') }))
            );
          }
        } catch (error) { console.error(error); }
      };

      fetchTodayMeals();
      return () => { isActive = false; };
    }, [userId]) // Recalcula se o utilizador mudar
  );

  return { meals, groupedMeals, totals, lastMeal, topNutrient };
}