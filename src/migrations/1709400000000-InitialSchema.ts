import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1709400000000 implements MigrationInterface {
  name = 'InitialSchema1709400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create Enums
    await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'agent')`);
    await queryRunner.query(
      `CREATE TYPE "public"."properties_category_enum" AS ENUM('Rent', 'Sale', 'Land')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."properties_propertytype_enum" AS ENUM('Flat', 'Duplex', 'House', 'Land', 'Self-Contain')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."properties_status_enum" AS ENUM('Available', 'Rented', 'Sold')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contact_inquiries_status_enum" AS ENUM('Pending', 'Contacted', 'Closed')`
    );

    // Create Areas Table
    await queryRunner.query(
      `CREATE TABLE "areas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text NOT NULL, "image" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_area_name" UNIQUE ("name"), CONSTRAINT "UQ_area_slug" UNIQUE ("slug"), CONSTRAINT "PK_areas_id" PRIMARY KEY ("id"))`
    );

    // Create Users Table
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "phone" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'agent', "isVerified" boolean NOT NULL DEFAULT false, "refreshToken" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_users_email" UNIQUE ("email"), CONSTRAINT "PK_users_id" PRIMARY KEY ("id"))`
    );

    // Create Properties Table
    await queryRunner.query(
      `CREATE TABLE "properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "description" text NOT NULL, "category" "public"."properties_category_enum" NOT NULL, "propertyType" "public"."properties_propertytype_enum" NOT NULL, "price" numeric(15,2) NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "latitude" numeric(10,8), "longitude" numeric(10,8), "rooms" integer NOT NULL DEFAULT '0', "bathrooms" integer NOT NULL DEFAULT '0', "parking" integer NOT NULL DEFAULT '0', "water" boolean NOT NULL DEFAULT false, "electricity" character varying NOT NULL DEFAULT 'None', "status" "public"."properties_status_enum" NOT NULL DEFAULT 'Available', "featured" boolean NOT NULL DEFAULT false, "agentFee" numeric(15,2) NOT NULL DEFAULT '0', "inspectionFee" numeric(15,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid NOT NULL, "areaId" uuid NOT NULL, CONSTRAINT "UQ_properties_slug" UNIQUE ("slug"), CONSTRAINT "PK_properties_id" PRIMARY KEY ("id"))`
    );

    // Create Property Images Table
    await queryRunner.query(
      `CREATE TABLE "property_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" text NOT NULL, "order" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "propertyId" uuid NOT NULL, CONSTRAINT "PK_property_images_id" PRIMARY KEY ("id"))`
    );

    // Create Contact Inquiries Table
    await queryRunner.query(
      `CREATE TABLE "contact_inquiries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "phone" character varying NOT NULL, "message" text NOT NULL, "status" "public"."contact_inquiries_status_enum" NOT NULL DEFAULT 'Pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "propertyId" uuid NOT NULL, "userId" uuid, CONSTRAINT "PK_contact_inquiries_id" PRIMARY KEY ("id"))`
    );

    // Create Favorites Table
    await queryRunner.query(
      `CREATE TABLE "favorites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "propertyId" uuid NOT NULL, CONSTRAINT "UQ_favorites_user_property" UNIQUE ("userId", "propertyId"), CONSTRAINT "PK_favorites_id" PRIMARY KEY ("id"))`
    );

    // Add Foreign Keys
    await queryRunner.query(
      `ALTER TABLE "properties" ADD CONSTRAINT "FK_properties_ownerId" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "properties" ADD CONSTRAINT "FK_properties_areaId" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "property_images" ADD CONSTRAINT "FK_property_images_propertyId" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "contact_inquiries" ADD CONSTRAINT "FK_contact_inquiries_propertyId" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "contact_inquiries" ADD CONSTRAINT "FK_contact_inquiries_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_favorites_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_favorites_propertyId" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_favorites_propertyId"`);
    await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_favorites_userId"`);
    await queryRunner.query(
      `ALTER TABLE "contact_inquiries" DROP CONSTRAINT "FK_contact_inquiries_userId"`
    );
    await queryRunner.query(
      `ALTER TABLE "contact_inquiries" DROP CONSTRAINT "FK_contact_inquiries_propertyId"`
    );
    await queryRunner.query(
      `ALTER TABLE "property_images" DROP CONSTRAINT "FK_property_images_propertyId"`
    );
    await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_properties_areaId"`);
    await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_properties_ownerId"`);
    await queryRunner.query(`DROP TABLE "favorites"`);
    await queryRunner.query(`DROP TABLE "contact_inquiries"`);
    await queryRunner.query(`DROP TABLE "property_images"`);
    await queryRunner.query(`DROP TABLE "properties"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "areas"`);
    await queryRunner.query(`DROP TYPE "public"."contact_inquiries_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."properties_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."properties_propertytype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."properties_category_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
  }
}
