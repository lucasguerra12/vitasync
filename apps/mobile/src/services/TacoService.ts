import tacoDataRaw from '../utils/taco.json';

export interface TacoFood {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const parseMacro = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(',', '.'));
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

class TacoServiceImpl {
  private foods: TacoFood[] | null = null; 

  constructor() {
  }

  private loadFoodsIntoMemory() {
    if (this.foods) return; 
    
    console.log("⏳ [Lazy Load] Carregando Tabela TACO para a memória...");
    
    this.foods = (tacoDataRaw as any[]).map(food => ({
      id: String(food.id),
      name: food.description || 'Alimento Desconhecido',
      calories: Math.round(parseMacro(food.energy_kcal)),
      protein: Math.round(parseMacro(food.protein_g) * 10) / 10,
      carbs: Math.round(parseMacro(food.carbohydrate_g) * 10) / 10,
      fat: Math.round(parseMacro(food.lipid_g) * 10) / 10,
    }));
    
    console.log(`✅ [Lazy Load] ${this.foods.length} alimentos processados!`);
  }

  search(query: string): TacoFood[] {
    if (!query || query.length < 2) return [];
    
    // Garante que a lista tá na memória antes de buscar
    this.loadFoodsIntoMemory();
    
    const normalize = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const lowerQuery = normalize(query);
    
    // O TypeScript sabe que this.foods não é mais nulo aqui
    return this.foods!
      .filter(food => normalize(food.name).includes(lowerQuery))
      .slice(0, 50); 
  }
}

export const TacoService = new TacoServiceImpl();