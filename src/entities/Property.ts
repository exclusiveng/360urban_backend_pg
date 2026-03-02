import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { PropertyCategory, PropertyStatus, PropertyType } from './constants.js';
import type { User } from './User.js';
import type { Area } from './Area.js';
import type { PropertyImage } from './PropertyImage.js';
import type { Favorite } from './Favorite.js';
import type { ContactInquiry } from './ContactInquiry.js';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: PropertyCategory,
  })
  category: PropertyCategory;

  @Column({
    type: 'enum',
    enum: PropertyType,
  })
  propertyType: PropertyType;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  price: number;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar' })
  state: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'integer', default: 0 })
  rooms: number;

  @Column({ type: 'integer', default: 0 })
  bathrooms: number;

  @Column({ type: 'integer', default: 0 })
  parking: number;

  @Column({ type: 'boolean', default: false })
  water: boolean;

  @Column({ type: 'varchar', default: 'None' })
  electricity: string;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.AVAILABLE,
  })
  status: PropertyStatus;

  @Column({ type: 'boolean', default: false })
  featured: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  agentFee: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  inspectionFee: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne('User', 'properties')
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column('uuid')
  ownerId: string;

  @ManyToOne('Area', 'properties')
  @JoinColumn({ name: 'areaId' })
  area: Area;

  @Column('uuid')
  areaId: string;

  @OneToMany('PropertyImage', 'property')
  images: PropertyImage[];

  @OneToMany('Favorite', 'property')
  favorites: Favorite[];

  @OneToMany('ContactInquiry', 'property')
  inquiries: ContactInquiry[];
}
