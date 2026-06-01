import { useState, useMemo } from 'react';
import { TacoService, TacoFood } from '../services/TacoService';
import { supabase } from '../services/supabase'; // NOVO: Importamos direto do Supabase

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

// Uma função simples para gerar IDs únicos já que não temos mais o WatermelonDB
const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

export function useFoodLogger(userId: string | undefined) {
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
    if (!selectedFood || parseFloat(portion) <= 0 || !userId) {
      console.warn("Faltam dados para salvar a refeição.");
      return false;
    }

    setIsSaving(true);
    try {
      const now = Date.now();
      
      // 1. Descobrir os limites do dia de hoje para não misturar com o almoço de ontem
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
      const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;

      // 2. Procurar se JÁ EXISTE uma refeição deste tipo hoje no Supabase
      const { data: existingMeals, error: fetchError } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', userId)
        .eq('meal_type', mealType)
        .gte('logged_at', startOfDay)
        .lte('logged_at', endOfDay);

      if (fetchError) throw fetchError;

      let mealId = '';

      // 3A. Se JÁ EXISTE o cabeçalho, apenas atualizamos os macros somando
      if (existingMeals && existingMeals.length > 0) {
        const header = existingMeals[0];
        mealId = header.id;

        const { error: updateError } = await supabase.from('meals').update({
          total_calories: header.total_calories + calculatedMacros.calories,
          total_protein: header.total_protein + calculatedMacros.protein,
          total_carbs: header.total_carbs + calculatedMacros.carbs,
          total_fat: header.total_fat + calculatedMacros.fat,
          updated_at: now
        }).eq('id', mealId);

        if (updateError) throw updateError;
      } 
      // 3B. Se NÃO EXISTE, criamos um cabeçalho novo para hoje
      else {
        mealId = generateId(); // Criamos um ID manual
        
        const { error: insertError } = await supabase.from('meals').insert([{
          id: mealId,
          user_id: userId,
          name: `Refeição: ${mealType}`,
          meal_type: mealType,
          total_calories: calculatedMacros.calories,
          total_protein: calculatedMacros.protein,
          total_carbs: calculatedMacros.carbs,
          total_fat: calculatedMacros.fat,
          logged_at: now,
          created_at: now,
          updated_at: now
        }]);

        if (insertError) throw insertError;
      }

      // 4. Inserimos o item da comida (MealItem) ligado ao cabeçalho (Meal)
      const { error: itemError } = await supabase.from('meal_items').insert([{
        id: generateId(),
        user_id: userId,
        meal_id: mealId, // Ligamos a comida ao almoço/jantar que criámos/atualizámos
        food_name: selectedFood.name,
        quantity_g: parseFloat(portion),
        calories: calculatedMacros.calories,
        protein: calculatedMacros.protein,
        carbs: calculatedMacros.carbs,
        fat: calculatedMacros.fat,
        created_at: now,
        updated_at: now
      }]);

      if (itemError) throw itemError;
      
      setIsSaving(false);
      return true;

    } catch (error) {
      console.error('Erro ao salvar refeição no Supabase:', error);
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