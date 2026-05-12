import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class SleepLog extends Model {
  static table = 'sleep_logs';

  @field('user_id') userId!: string;
  @field('duration_hours') durationHours!: number;
  @field('quality') quality!: number;
  @field('date') date!: string;

  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;
}