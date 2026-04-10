import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './schema';
import Profile from './models/Profile';

const adapter = new SQLiteAdapter({
  schema,
  jsi: false,
  onSetUpError: error => {
    console.error('Erro ao iniciar o WatermelonDB:', error);
  }
});

export const database = new Database({
  adapter,
  modelClasses: [
    Profile,
  ],
});