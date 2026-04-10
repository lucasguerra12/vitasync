import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Profile extends Model {
  // Esse nome DEVE ser exatamente o nome da tabela que está no seu schema.ts
  static table = 'profiles';

  @field('name') name!: string;
  @field('age') age!: number;
  @field('weight') weight!: number;
  @field('height') height!: number;
  @field('gender') gender!: string;
  @field('activity_level') activityLevel!: string;
  @field('goal') goal!: string;
  
  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;
}