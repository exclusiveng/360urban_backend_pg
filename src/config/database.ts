import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/User.js';
import { Property } from '../entities/Property.js';
import { PropertyImage } from '../entities/PropertyImage.js';
import { Area } from '../entities/Area.js';
import { ContactInquiry } from '../entities/ContactInquiry.js';
import { Favorite } from '../entities/Favorite.js';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...(process.env.DATABASE_URL
    ? { url: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || '360urban',
        password: process.env.DB_PASSWORD || 'postgres123',
        database: process.env.DB_NAME || '360urban_db',
      }),
  synchronize: false, // Always use migrations
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Property, PropertyImage, Area, ContactInquiry, Favorite],
  migrations: ['src/migrations/*.ts', 'dist/migrations/*.js'],
  subscribers: [],
});
