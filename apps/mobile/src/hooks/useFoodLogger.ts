import { useState, useMemo } from 'react';
import { database } from '../database';
import Meal from '../database/models/Meal';
import { TacoService, TacoFood } from '../services/TacoService';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export function useFoodLogger() {
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

  // Cálculo Reativo dos Macros baseado na porção
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
    if (!selectedFood || parseFloat(portion) <= 0) return false;

    setIsSaving(true);
    try {
      await database.write(async () => {
        const mealsCollection = database.collections.get<Meal>('meals');
        
        await mealsCollection.create((meal: any) => {
          meal.name = selectedFood.name; 
          meal.calories = calculatedMacros.calories;
          meal.protein = calculatedMacros.protein;
          meal.carbs = calculatedMacros.carbs;
          meal.fat = calculatedMacros.fat;
          meal.portion = parseFloat(portion);
          meal.mealType = mealType;
        });
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