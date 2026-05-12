import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class WaterLog extends Model {
  static table = 'water_logs';

  @field('user_id') userId!: string;
  @field('amount_ml') amountMl!: number;
  @field('date') date!: string; // Formato YYYY-MM-DD
  @date('logged_at') loggedAt!: number;

  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;
}