import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...(process.env.DATABASE_URL
    ? {
        url: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || '360urban',
        password: process.env.DB_PASSWORD || 'postgres123',
        database: process.env.DB_NAME || '360urban_db',
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }),
  synchronize: false, // Always use migrations
  logging: process.env.NODE_ENV === 'development',
  entities: ['src/entities/*.ts', 'dist/entities/*.js'],
  migrations: ['src/migrations/*.ts', 'dist/migrations/*.js'],
  subscribers: [],
});
