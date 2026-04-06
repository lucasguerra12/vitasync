import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({ name: 'step_logs', columns: [{ name: 'date', type: 'string', isIndexed: true }, { name: 'steps', type: 'number' }, { name: 'created_at', type: 'number' }] }),
    tableSchema({ name: 'meals', columns: [{ name: 'name', type: 'string' }, { name: 'calories', type: 'number' }, { name: 'logged_at', type: 'number', isIndexed: true }] }),
    tableSchema({ name: 'weight_logs', columns: [{ name: 'weight', type: 'number' }, { name: 'logged_at', type: 'number', isIndexed: true }] }),
    tableSchema({ name: 'symptoms', columns: [{ name: 'area', type: 'string' }, { name: 'intensity', type: 'number' }, { name: 'logged_at', type: 'number' }] }),
    tableSchema({ name: 'sleep_logs', columns: [{ name: 'duration_hours', type: 'number' }, { name: 'quality', type: 'number' }, { name: 'date', type: 'string' }] }),
    tableSchema({ name: 'mood_logs', columns: [{ name: 'level', type: 'number' }, { name: 'notes', type: 'string', isOptional: true }, { name: 'date', type: 'string' }] }),
  ],
});