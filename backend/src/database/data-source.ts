import 'dotenv/config';
import 'reflect-metadata';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { DataSource } from 'typeorm';

import { env } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.dbHost,
  port: env.dbPort,
  username: env.dbUsername,
  password: env.dbPassword,
  database: env.dbName,
  ssl: env.dbSsl ? { rejectUnauthorized: false } : false,
  entities: [path.join(__dirname, '../modules/**/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, './migrations/*.{ts,js}')],
  synchronize: false,
});
