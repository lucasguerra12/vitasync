import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class Meal extends Model {
  static table = 'meals';

  @field('name') name!: string;
  @field('meal_type') mealType!: string;
  @field('calories') calories!: number;
  @field('protein') protein!: number;
  @field('carbs') carbs!: number;
  @field('fat') fat!: number;
  @field('photo_uri') photoUri?: string;
  
  @date('logged_at') loggedAt!: number;
}