import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1707109523378 implements MigrationInterface {
    name = 'Migration1707109523378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_valid"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_confirmed_phone_number"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_confirmed_email"`);
        await queryRunner.query(`ALTER TABLE "token" ADD "is_expired" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."id" IS 'id'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."created_id" IS 'id người tạo'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."updated_id" IS 'id người cập nhật'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."created_at" IS 'Thời gian tại thời điểm tạo'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."updated_at" IS 'Thời gian tại thời điểm cập nhật'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."deleted_at" IS 'Thời gian tại thời điểm xóa'`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."id" IS 'id'`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."created_id" IS 'id người tạo'`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."updated_id" IS 'id người cập nhật'`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."created_at" IS 'Thời gian tại thời điểm tạo'`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."updated_at" IS 'Thời gian tại thời điểm cập nhật'`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."deleted_at" IS 'Thời gian tại thời điểm xóa'`);
        await queryRunner.query(`COMMENT ON COLUMN "card"."id" IS 'id'`);
        await queryRunner.query(`COMMENT ON COLUMN "card"."created_id" IS 'id người tạo'`);
        await queryRunner.query(`COMMENT ON COLUMN "card"."updated_id" IS 'id người cập nhật'`);
        await queryRunner.query(`COMMENT ON COLUMN "card"."created_at" IS 'Thời gian tại thời điểm tạo'`);
        await queryRunner.query(`COMMENT ON COLUMN "card"."updated_at" IS 'Thời gian tại thời điểm cập nhật'`);
        await queryRunner.query(`COMMENT ON COLUMN "card"."deleted_at" IS 'Thời gian tại thời điểm xóa'`);
        await queryRunner.query(`COMMENT ON COLUMN "slot"."id" IS 'id'`);
        await queryRunner.query(`COMMENT ON COLUMN "slot"."created_id" IS 'id người tạo'`);
        await queryRunner.query(`COMMENT ON COLUMN "slot"."updated_id" IS 'id người cập nhật'`);
        await queryRunner.query(`COMMENT ON COLUMN "slot"."created_at" IS 'Thời gian tại thời điểm tạo'`);
        await queryRunner.query(`COMMENT ON COLUMN "slot"."updated_at" IS 'Thời gian tại thời điểm cập nhật'`);
        await queryRunner.query(`COMMENT ON COLUMN "slot"."deleted_at" IS 'Thời gian tại thời điểm xóa'`);
        await queryRunner.query(`COMMENT ON COLUMN "parking"."id" IS 'id'`);
        await queryRunner.query(`COMMENT ON COLUMN "parking"."created_id" IS 'id người tạo'`);
        await queryRunner.query(`COMMENT ON COLUMN "parking"."updated_id" IS 'id người cập nhật'`);
        await queryRunner.query(`COMMENT ON COLUMN "parking"."created_at" IS 'Thời gian tại thời điểm tạo'`);
        await queryRunner.query(`COMMENT ON COLUMN "parking"."updated_at" IS 'Thời gian tại thời điểm cập nhật'`);
        await queryRunner.query(`COMMENT ON COLUMN "parking"."deleted_at" IS 'Thời gian tại thời điểm xóa'`);
        await queryRunner.query(`COMMENT ON COLUMN "payment"."id" IS 'id'`);
        await queryRunner.query(`COMMENT ON COLUMN "payment"."created_id" IS 'id người tạo'`);
        await queryRunner.query(`COMMENT ON COLUMN "payment"."updated_id" IS 'id người cập nhật'`);
        await queryRunner.query(`COMMENT ON COLUMN "payment"."created_at" IS 'Thời gian tại thời điểm tạo'`);
        await queryRunner.query(`COMMENT ON COLUMN "payment"."updated_at" IS 'Thời gian tại thời điểm cập nhật'`);
        await queryRunner.query(`COMMENT ON COLUMN "payment"."deleted_at" IS 'Thời gian tại thời điểm xóa'`);
        await queryRunner.query(`COMMENT ON COLUMN "transaction"."id" IS 'id'`);
        await queryRunner.query(`COMMENT ON COLUMN "transaction"."created_id" IS 'id người tạo'`);
        await queryRunner.query(`COMMENT ON COLUMN "transaction"."updated_id" IS 'id người cập nhật'`);
        await queryRunner.query(`COMMENT ON COLUMN "transaction"."created_at" IS 'Thời gian tại thời điểm tạo'`);
        await queryRunner.query(`COMMENT ON COLUMN "transaction"."updated_at" IS 'Thời gian tại thời điểm cập nhật'`);
        await queryRunner.query(`COMMENT ON COLUMN "transaction"."deleted_at" IS 'Thời gian tại thời điểm xóa'`);
        await queryRunner.query(`COMMENT ON COLUMN "price"."id" IS 'id'`);
        await queryRunner.query(`COMMENT ON COLUMN "price"."created_id" IS 'id người tạo'`);
        await queryRunner.query(`COMMENT ON COLUMN "price"."updated_id" IS 'id người cập nhật'`);
        await queryRunner.query(`COMMENT ON COLUMN "price"."created_at" IS 'Thời gian tại thời điểm tạo'`);
        await queryRunner.query(`COMMENT ON COLUMN "price"."updated_at" IS 'Thời gian tại thời điểm cập nhật'`);
        await queryRunner.query(`COMMENT ON COLUMN "price"."deleted_at" IS 'Thời gian tại thời điểm xóa'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "price"."deleted_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "price"."updated_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "price"."created_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "price"."updated_id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "price"."created_id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "price"."id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "transaction"."deleted_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "transaction"."updated_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "transaction"."created_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "transaction"."updated_id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "transaction"."created_id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "transaction"."id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "payment"."deleted_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "payment"."updated_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "payment"."created_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "payment"."updated_id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "payment"."created_id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "payment"."id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "parking"."deleted_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "parking"."updated_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "parking"."created_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "parking"."updated_id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "parking"."created_id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "parking"."id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "slot"."deleted_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "slot"."updated_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "slot"."created_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "slot"."updated_id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "slot"."created_id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "slot"."id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "card"."deleted_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "card"."updated_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "card"."created_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "card"."updated_id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "card"."created_id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "card"."id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."deleted_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."updated_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."created_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."updated_id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."created_id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."deleted_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."updated_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."created_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."updated_id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."created_id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "is_expired"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "is_confirmed_email" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "is_confirmed_phone_number" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "is_valid" boolean NOT NULL DEFAULT true`);
    }

    
}
