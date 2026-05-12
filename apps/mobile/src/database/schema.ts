import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 9, 
  tables: [
    tableSchema({
      name: 'profiles',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'age', type: 'number' },
        { name: 'weight', type: 'number' },
        { name: 'height', type: 'number' },
        { name: 'gender', type: 'string' },
        { name: 'activity_level', type: 'string' },
        { name: 'goal', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'water_logs',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'amount_ml', type: 'number' },
        { name: 'date', type: 'string', isIndexed: true },
        { name: 'logged_at', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'meals',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'meal_type', type: 'string', isIndexed: true },
        { name: 'total_calories', type: 'number' },
        { name: 'total_protein', type: 'number' },
        { name: 'total_carbs', type: 'number' },
        { name: 'total_fat', type: 'number' },
        { name: 'photo_uri', type: 'string', isOptional: true },
        { name: 'logged_at', type: 'number', isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'meal_items',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'meal_id', type: 'string', isIndexed: true },
        { name: 'food_name', type: 'string' }, 
        { name: 'quantity_g', type: 'number' }, 
        { name: 'calories', type: 'number' },
        { name: 'protein', type: 'number' }, 
        { name: 'carbs', type: 'number' },   
        { name: 'fat', type: 'number' },      
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'favorite_recipes',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'recipe_data', type: 'string' }, 
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({ 
      name: 'step_logs',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'date', type: 'string', isIndexed: true },
        { name: 'steps', type: 'number' }, 
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ] 
    }),
    tableSchema({ 
      name: 'sleep_logs', 
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'duration_hours', type: 'number' }, 
        { name: 'quality', type: 'number' }, 
        { name: 'date', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ] 
    }),
    tableSchema({ 
      name: 'mood_logs', 
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'level', type: 'number' }, 
        { name: 'notes', type: 'string', isOptional: true }, 
        { name: 'date', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ] 
    }),
  ],
});