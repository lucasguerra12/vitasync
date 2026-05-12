import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';

export default class MealItem extends Model {
  static table = 'meal_items';

  // A MÁGICA QUE FALTAVA: Declarar a associação formalmente
  static associations = {
    meals: { type: 'belongs_to', key: 'meal_id' },
  } as const;

  @field('user_id') userId!: string;
  @field('food_name') foodName!: string;
  @field('quantity_g') quantityG!: number;
  
  @field('calories') calories!: number;
  @field('protein') protein!: number;
  @field('carbs') carbs!: number;
  @field('fat') fat!: number;

  // Agora o WatermelonDB sabe com quem conectar este meal_id
  @relation('meals', 'meal_id') meal!: any;

  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;
}