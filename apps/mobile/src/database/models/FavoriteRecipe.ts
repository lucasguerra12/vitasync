import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class FavoriteRecipe extends Model {
  static table = 'favorite_recipes';

  @field('user_id') userId!: string;
  @field('title') title!: string;
  @field('recipe_data') recipeData!: string; // Armazena os detalhes da receita em formato JSON

  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;
}