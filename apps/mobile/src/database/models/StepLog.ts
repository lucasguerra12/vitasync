import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class StepLog extends Model {
  static table = 'step_logs';

  @field('user_id') userId!: string;
  @field('date') date!: string;
  @field('steps') steps!: number;

  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;
}