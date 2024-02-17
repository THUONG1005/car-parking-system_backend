import { dbConfig } from './typeorm.config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceMigration = new DataSource({
  ...dbConfig,
  name: 'migration',
  migrationsTableName: 'migration',
  migrations: ['src/database/migrations/**/*.ts'],
  // subscribers: ['src/database/subscribers/**/*.ts'],
} as DataSourceOptions);

