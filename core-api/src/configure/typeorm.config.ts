/* eslint-disable no-console */
import path from 'path';

import { ConnectionOptions } from 'typeorm';

import config from '../config';

export const getTypeOrmConfig = async (): Promise<ConnectionOptions> => {
  const { DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT } = config;

  console.log('DB_NAME', DB_NAME);
  console.log('DB_USER', DB_USER);
  console.log(
    'DB_PASS',
    DB_PASS ? `${DB_PASS.substr(0, 3)}********` : 'undefined'
  );
  console.log('DB_HOST', DB_HOST);
  console.log('DB_PORT', DB_PORT);

  return {
    name: 'default',
    host: DB_HOST,
    database: DB_NAME,
    username: DB_USER,
    port: DB_PORT as any,
    password: DB_PASS,
    type: 'postgres',
    entities: [path.join(__dirname, '..', 'entities/**/*.js')],
    migrations: [path.join(__dirname, '..', 'database/migrations/*.js')],
    logging: false,
    uuidExtension: 'pgcrypto',
  };
};

export default getTypeOrmConfig;
