import * as path from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { Env } from '../constants/enums/env.enum';
import { assertToBeDefined, isDevOrTestEnv } from '../helpers';

if (process.env.NODE_ENV !== Env.DEVELOPMENT) {
  dotenv.config();
}

export const ENV: Env = process.env.JEST_WORKER_ID
  ? Env.TEST
  : (assertToBeDefined(process.env.NODE_ENV) as Env);

export function initializeValue(
  value: string | undefined,
  defaultValue: string,
): string {
  if (isDevOrTestEnv(ENV) && !value) {
    return defaultValue;
  }
  return assertToBeDefined(value) as string;
}

export const ormConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: initializeValue(process.env.POSTGRES_HOST, 'localhost'),
  port: parseInt(initializeValue(process.env.POSTGRES_PORT, '5432'), 10),
  database: initializeValue(process.env.POSTGRES_DBNAME, 'product-api'),
  username: initializeValue(process.env.POSTGRES_USERNAME, 'root'),
  password: initializeValue(process.env.POSTGRES_PASSWORD, 'root'),
  entities: [path.join(__dirname, '../../src/**/*/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '../../database/migrations/*{.ts,.js}')],
  migrationsTransactionMode: 'each',
};

export default new DataSource(ormConfig);
