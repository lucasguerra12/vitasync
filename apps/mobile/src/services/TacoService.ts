import tacoData from '../utils/taco.json';

export interface TacoFood {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const TacoService = {
  /**
   * Remove acentos e joga tudo para minúsculo.
   * Ex: "Feijão" vira "feijao"
   */
  normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  },

  search(query: string): TacoFood[] {
    if (!query || query.trim() === '') {
      return [];
    }

    const normalizedQuery = this.normalizeText(query);

    const results = tacoData.filter((food: any) => {
      const normalizedFoodName = this.normalizeText(food.name);
      return normalizedFoodName.includes(normalizedQuery);
    });

    return results.slice(0, 20);
  },

  /**
   * Calcula as calorias e macros com base na quantidade em gramas informada.
   * A tabela TACO sempre é baseada em 100g.
   */
  calculateMacrosByWeight(food: TacoFood, weightInGrams: number) {
    const factor = weightInGrams / 100;
    
    return {
      calories: Math.round(food.calories * factor),
      protein: Number((food.protein * factor).toFixed(1)),
      carbs: Number((food.carbs * factor).toFixed(1)),
      fat: Number((food.fat * factor).toFixed(1)),
    };
  }
};