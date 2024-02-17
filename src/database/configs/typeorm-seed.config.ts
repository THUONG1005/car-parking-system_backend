import { dbConfig } from './typeorm.config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceSeed = new DataSource({
  ...dbConfig,
  name: 'seed',
  migrationsTableName: 'seed',
  migrations: ['src/database/seeds/**/*.ts'],
  // subscribers: ['src/database/subscribers/**/*.ts'],
} as DataSourceOptions);

