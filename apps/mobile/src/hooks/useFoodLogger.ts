import { useState, useMemo } from 'react';
import { Q } from '@nozbe/watermelondb';
import { database } from '../database';
import Meal from '../database/models/Meal';
import MealItem from '../database/models/MealItem';
import { TacoService, TacoFood } from '../services/TacoService';

// IMPORTANTE: Aqui puxarias o userId do teu Redux. 
// Exemplo: const userId = useAppSelector(state => state.auth.user?.id);
// Por enquanto, podes passar como parâmetro ou simular se o auth ainda não estiver 100%.

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export function useFoodLogger(userId: string) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<TacoFood[]>([]);
  const [selectedFood, setSelectedFood] = useState<TacoFood | null>(null);
  const [portion, setPortion] = useState<string>('100'); // Gramas
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [isSaving, setIsSaving] = useState(false);

  const handleSearch = async (text: string) => {
    setSearchTerm(text);
    if (text.length > 2) {
      const results = TacoService.search(text);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const calculatedMacros = useMemo(() => {
    if (!selectedFood) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    const multiplier = (parseFloat(portion) || 0) / 100;
    
    return {
      calories: Math.round((selectedFood.calories || 0) * multiplier),
      protein: Math.round((selectedFood.protein || 0) * multiplier * 10) / 10,
      carbs: Math.round((selectedFood.carbs || 0) * multiplier * 10) / 10,
      fat: Math.round((selectedFood.fat || 0) * multiplier * 10) / 10,
    };
  }, [selectedFood, portion]);

  const saveMeal = async (): Promise<boolean> => {
    if (!selectedFood || parseFloat(portion) <= 0 || !userId) return false;

    setIsSaving(true);
    try {
      await database.write(async () => {
        const mealsCollection = database.collections.get<Meal>('meals');
        const itemsCollection = database.collections.get<MealItem>('meal_items');
        
        // 1. Descobrir os limites do dia de hoje (00:00 às 23:59)
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;

        // 2. Procurar se JÁ EXISTE uma refeição deste tipo hoje
        const existingMeals = await mealsCollection.query(
          Q.where('user_id', userId),
          Q.where('meal_type', mealType),
          Q.where('logged_at', Q.between(startOfDay, endOfDay))
        ).fetch();

        let mealHeader = existingMeals.length > 0 ? existingMeals[0] : null;
        
        // Array para guardar todas as operações que vão ser executadas em lote (Batch)
        const batchOperations: any[] = [];

        // 3A. Se não existir, preparamos a CRIAÇÃO do cabeçalho
        if (!mealHeader) {
          mealHeader = mealsCollection.prepareCreate((meal: any) => {
            meal.userId = userId;
            meal.name = `Refeição: ${mealType}`; // Nome genérico para o cabeçalho
            meal.mealType = mealType;
            meal.loggedAt = now.getTime();
            meal.totalCalories = calculatedMacros.calories;
            meal.totalProtein = calculatedMacros.protein;
            meal.totalCarbs = calculatedMacros.carbs;
            meal.totalFat = calculatedMacros.fat;
          }) as Meal;
          
          batchOperations.push(mealHeader);
        } 
        // 3B. Se existir, preparamos a ATUALIZAÇÃO somando os macros
        else {
          batchOperations.push(
            mealHeader.prepareUpdate((meal: any) => {
              meal.totalCalories += calculatedMacros.calories;
              meal.totalProtein += calculatedMacros.protein;
              meal.totalCarbs += calculatedMacros.carbs;
              meal.totalFat += calculatedMacros.fat;
            })
          );
        }

        // 4. Preparamos a CRIAÇÃO do item da comida ligado ao cabeçalho
        const newItem = itemsCollection.prepareCreate((item: any) => {
          item.userId = userId;
          item.meal.set(mealHeader); // É assim que o Watermelon faz a ligação "Foreign Key"
          item.foodName = selectedFood.name;
          item.quantityG = parseFloat(portion);
          item.calories = calculatedMacros.calories;
          item.protein = calculatedMacros.protein;
          item.carbs = calculatedMacros.carbs;
          item.fat = calculatedMacros.fat;
        });
        batchOperations.push(newItem);

        // 5. Executar tudo de uma vez! (Seguro e Performativo)
        await database.batch(...batchOperations);
      });
      
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error('Erro ao salvar refeição:', error);
      setIsSaving(false);
      return false;
    }
  };

  return {
    searchTerm,
    searchResults,
    selectedFood,
    portion,
    mealType,
    calculatedMacros,
    isSaving,
    handleSearch,
    setSelectedFood,
    setPortion,
    setMealType,
    saveMeal
  };
}