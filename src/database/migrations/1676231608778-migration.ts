import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1676231608778 implements MigrationInterface {
  name = 'migration1676231608778';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('Nam', 'Nữ', 'Khác')`);
    await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('Admin', 'User')`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_id" integer, "updated_id" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "full_name" character varying NOT NULL, "birthday" date NOT NULL, "gender" "public"."user_gender_enum" NOT NULL, "address" character varying NOT NULL, "phone_number" character varying NOT NULL, "avatar" text NOT NULL DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png', "email" character varying NOT NULL, "password" character varying NOT NULL, "is_valid" boolean NOT NULL DEFAULT true, "is_confirmed_phone_number" boolean NOT NULL DEFAULT false, "is_confirmed_email" boolean NOT NULL DEFAULT false, "role" "public"."user_role_enum" NOT NULL DEFAULT 'User', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."token_type_enum" AS ENUM('Access', 'Refresh', 'Reset password', 'Confirm email')`,
    );
    await queryRunner.query(
      `CREATE TABLE "token" ("id" SERIAL NOT NULL, "created_id" integer, "updated_id" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "value" character varying NOT NULL, "type" "public"."token_type_enum" NOT NULL, "user_id" integer NOT NULL, "expired_in" bigint NOT NULL, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."card_type_enum" AS ENUM('Guest', 'Normal', 'Premium')`,
    );
    await queryRunner.query(
      `CREATE TABLE "card" ("id" SERIAL NOT NULL, "created_id" integer, "updated_id" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "code" character varying NOT NULL, "type" "public"."card_type_enum" NOT NULL, "amount" bigint NOT NULL, "user_email" character varying, CONSTRAINT "UQ_15738a63c09ba64fdcae4b67f27" UNIQUE ("code"), CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "slot" ("id" SERIAL NOT NULL, "created_id" integer, "updated_id" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "station" character varying NOT NULL, "position" integer NOT NULL, "is_full" boolean NOT NULL, "description" character varying, CONSTRAINT "PK_5b1f733c4ba831a51f3c114607b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "parking" ("id" SERIAL NOT NULL, "created_id" integer, "updated_id" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "slot_id" integer NOT NULL, "card_code" character varying NOT NULL, "is_checkout" boolean NOT NULL, CONSTRAINT "PK_d611d86b1d39963d048b05976aa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment" ("id" SERIAL NOT NULL, "created_id" integer, "updated_id" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "parking_id" integer NOT NULL, "card_code" character varying NOT NULL, "cost" bigint NOT NULL, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type_enum" AS ENUM('Charge', 'Recharge')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "created_id" integer, "updated_id" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "amount" bigint NOT NULL, "type" "public"."transaction_type_enum" NOT NULL, "card_code" character varying NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."price_type_enum" AS ENUM('Guest', 'Normal', 'Premium')`,
    );
    await queryRunner.query(
      `CREATE TABLE "price" ("id" SERIAL NOT NULL, "created_id" integer, "updated_id" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "value" bigint NOT NULL, "type" "public"."price_type_enum" NOT NULL, CONSTRAINT "PK_d163e55e8cce6908b2e0f27cea4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."otp_type_enum" AS ENUM('Reset password', 'Confirm phone number')`,
    );
    await queryRunner.query(
      `CREATE TABLE "otp" ("id" SERIAL NOT NULL, "created_id" integer, "updated_id" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "value" character varying NOT NULL, "type" "public"."otp_type_enum" NOT NULL, "user_id" integer NOT NULL, "expired_in" bigint NOT NULL, CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "otp"`);
    await queryRunner.query(`DROP TYPE "public"."otp_type_enum"`);
    await queryRunner.query(`DROP TABLE "price"`);
    await queryRunner.query(`DROP TYPE "public"."price_type_enum"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TABLE "parking"`);
    await queryRunner.query(`DROP TABLE "slot"`);
    await queryRunner.query(`DROP TABLE "card"`);
    await queryRunner.query(`DROP TYPE "public"."card_type_enum"`);
    await queryRunner.query(`DROP TABLE "token"`);
    await queryRunner.query(`DROP TYPE "public"."token_type_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
  }
}

