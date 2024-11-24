import { isEnvCorrect } from '../helpers';
import { ENV, initializeValue } from './ormconfig';

if (!isEnvCorrect(ENV)) {
  throw new Error(`Invalid environment: ${ENV}`);
}

export const config = {
  PROJECT_NAME: process.env.PROJECT_NAME || 'gscores-api',
  LOG_LEVEL: initializeValue(process.env.LOG_LEVEL, 'fatal'),
  PORT: parseInt(initializeValue(process.env.PORT, '3032') as string, 10),
  ENV,
  CORS: process.env.CORS || 'http://localhost:3001',
};
