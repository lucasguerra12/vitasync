import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Meal extends Model {
  static table = 'meals';

  @field('name') name!: string;
  @field('meal_type') mealType!: string;
  @field('calories') calories!: number;
  @field('protein') protein!: number;
  @field('carbs') carbs!: number;
  @field('fat') fat!: number;
  
  // AQUI ESTÁ A CORREÇÃO: Avisando o TypeScript que a porção existe!
  @field('portion') portion!: number; 
  
  @field('photo_uri') photoUri?: string;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
  @date('logged_at') loggedAt!: Date;
}