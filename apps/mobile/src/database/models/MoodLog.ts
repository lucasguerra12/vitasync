import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class MoodLog extends Model {
  static table = 'mood_logs';

  @field('user_id') userId!: string;
  @field('level') level!: number;
  @field('notes') notes?: string;
  @field('date') date!: string;

  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;
}