import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { database } from '../../../database';
import Meal from '../../../database/models/Meal';

export function useDailyNutrition() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [groupedMeals, setGroupedMeals] = useState<any[]>([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchTodayMeals = async () => {
        try {
          const mealsCollection = database.collections.get<Meal>('meals');
          const allMeals = await mealsCollection.query().fetch();

          if (isActive) {
            let kcal = 0, p = 0, c = 0, f = 0;
            
            // Dicionário para agrupar as refeições
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

              // Adiciona o alimento no grupo correto (ex: "150g Arroz")
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
            
            // A lista solta para os "Recent Scans"
            setMeals(allMeals.reverse()); 
            
            // A lista agrupada para os blocos de refeição ("Today's Meals")
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

  return { meals, groupedMeals, totals };
}