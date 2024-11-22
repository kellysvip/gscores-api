import * as path from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenv.config();

export const ormConfig = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5434', 10),
  database: process.env.POSTGRES_DBNAME || 'product-api',
  username: process.env.POSTGRES_USERNAME || 'root',
  password: process.env.POSTGRES_PASSWORD || 'root',
  entities: [path.join(__dirname, '../../src/**/*/*.entity.ts')],
  migrations: [path.join(__dirname, '../../database/migrations/*.ts')],
  migrationsTransactionMode: 'each',
};

export default new DataSource({
  ...ormConfig,
} as PostgresConnectionOptions);
