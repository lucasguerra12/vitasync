import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { database } from '../../../database';
import Meal from '../../../database/models/Meal';

export function useDailyNutrition() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [groupedMeals, setGroupedMeals] = useState<any[]>([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  
  // Novos estados para o Dashboard
  const [lastMeal, setLastMeal] = useState({ name: 'No meals', kcal: 0 });
  const [topNutrient, setTopNutrient] = useState({ name: 'Carbs', icon: '🌾' });

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchTodayMeals = async () => {
        try {
          const mealsCollection = database.collections.get<Meal>('meals');
          const allMeals = await mealsCollection.query().fetch();

          if (isActive) {
            let kcal = 0, p = 0, c = 0, f = 0;
            const groups: any = {
              breakfast: { id: 'breakfast', name: 'Breakfast', icon: 'wb-sunny', items: [], kcal: 0 },
              lunch: { id: 'lunch', name: 'Lunch', icon: 'lunch-dining', items: [], kcal: 0 },
              dinner: { id: 'dinner', name: 'Dinner', icon: 'dinner-dining', items: [], kcal: 0 },
              snack: { id: 'snack', name: 'Snacks', icon: 'cookie', items: [], kcal: 0 }
            };

            allMeals.forEach(m => {
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

            // Ordenar para ter o mais recente primeiro
            const sortedMeals = allMeals.reverse();
            setMeals(sortedMeals);

            // Determinar Última Refeição
            if (sortedMeals.length > 0) {
              setLastMeal({ name: sortedMeals[0].name, kcal: sortedMeals[0].calories });
            }

            // Determinar Macro Dominante
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
        } catch (error) {
          console.error(error);
        }
      };

      fetchTodayMeals();
      return () => { isActive = false; };
    }, [])
  );

  return { meals, groupedMeals, totals, lastMeal, topNutrient };
}