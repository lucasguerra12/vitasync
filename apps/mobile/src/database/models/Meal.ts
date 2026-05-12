import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, children } from '@nozbe/watermelondb/decorators';

export default class Meal extends Model {
  static table = 'meals';
  
  // A MÁGICA QUE FALTAVA: Declarar a associação formalmente
  static associations = {
    meal_items: { type: 'has_many', foreignKey: 'meal_id' },
  } as const;

  // Agora o WatermelonDB entende este decorador!
  @children('meal_items') items!: any;

  @field('user_id') userId!: string;
  @field('name') name!: string;
  @field('meal_type') mealType!: string;
  
  @field('total_calories') totalCalories!: number;
  @field('total_protein') totalProtein!: number;
  @field('total_carbs') totalCarbs!: number;
  @field('total_fat') totalFat!: number;
  
  @field('photo_uri') photoUri?: string;
  @date('logged_at') loggedAt!: number;

  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;
}