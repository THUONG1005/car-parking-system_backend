import { MigrationInterface, QueryRunner } from 'typeorm';

export class seed1673102591534 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO 
                                "user" ("full_name", "birthday", "gender", "address", "phone_number", "email", "password", "role") 
                            VALUES 
                                ('Super admin', '2023-01-01', 'Khác', 'Hà Nội', '+840000000000', 'admin@gmail.com', '$2a$12$islzF07CmH/N49tYB7E/Au3wcmSTYXl1TvTZn68mz1u6JsyDgwO36', 'Admin'), 
                                ('Gate 1', '2023-01-01', 'Khác', 'Hà Nội', '+840000000001', 'gate1@gmail.com', '$2a$12$gYR65Z05BznHMEdiNZejqe1TY7DwKaXgE.Te7LYmvdFMSBa3/Q2G.', 'Admin'), 
                                ('Gate 2', '2023-01-01', 'Khác', 'Hà Nội', '+840000000002', 'gate2@gmail.com', '$2a$12$gYR65Z05BznHMEdiNZejqe1TY7DwKaXgE.Te7LYmvdFMSBa3/Q2G.', 'Admin'), 
                                ('Gate 3', '2023-01-01', 'Khác', 'Hà Nội', '+840000000003', 'gate3@gmail.com', '$2a$12$gYR65Z05BznHMEdiNZejqe1TY7DwKaXgE.Te7LYmvdFMSBa3/Q2G.', 'Admin'), 
                                ('Gate 4', '2023-01-01', 'Khác', 'Hà Nội', '+840000000004', 'gate4@gmail.com', '$2a$12$gYR65Z05BznHMEdiNZejqe1TY7DwKaXgE.Te7LYmvdFMSBa3/Q2G.', 'Admin'), 
                                ('Gate 5', '2023-01-01', 'Khác', 'Hà Nội', '+840000000005', 'gate5@gmail.com', '$2a$12$gYR65Z05BznHMEdiNZejqe1TY7DwKaXgE.Te7LYmvdFMSBa3/Q2G.', 'Admin'), 
                                ('Gate 6', '2023-01-01', 'Khác', 'Hà Nội', '+840000000006', 'gate6@gmail.com', '$2a$12$gYR65Z05BznHMEdiNZejqe1TY7DwKaXgE.Te7LYmvdFMSBa3/Q2G.', 'Admin'), 
                                ('Nguyễn Trung Đức', '2000-07-26', 'Nam', 'Hà Nội', '+840912861500', 'ducnguyen123@gmail.com', '$2a$12$gYR65Z05BznHMEdiNZejqe1TY7DwKaXgE.Te7LYmvdFMSBa3/Q2G.', 'User'), 
                                ('Trần Minh ', '2000-02-12', 'Nam', 'Hà Nội', '+840912861512', 'thuyettm2000@gmail.com', '$2a$12$gYR65Z05BznHMEdiNZejqe1TY7DwKaXgE.Te7LYmvdFMSBa3/Q2G.', 'User'), 
                                ('Trần Nhật Tân', '2000-10-26', 'Nam', 'Hà Nội', '+840918212574', 'botanvidai2000@gmail.com', '$2a$12$gYR65Z05BznHMEdiNZejqe1TY7DwKaXgE.Te7LYmvdFMSBa3/Q2G.', 'User'), 
                                ('Lê Quang ', '2000-07-23', 'Nam', 'Hà Nội', '+840337560589', 'huylq23072000@gmail.com', '$2a$12$gYR65Z05BznHMEdiNZejqe1TY7DwKaXgE.Te7LYmvdFMSBa3/Q2G.', 'User')`);
    await queryRunner.query(`INSERT INTO 
                                "price" ("value", "type") 
                            VALUES 
                                ('30000', 'Guest'), 
                                ('25000', 'Normal'), 
                                ('20000', 'Premium')`);
    await queryRunner.query(`INSERT INTO 
                                "slot" ("station", "position", "description", "is_full") 
                            VALUES 
                                ('A1', 1, 'Vị trí 1', false), ('A1', 2, 'Vị trí 2', false), ('A1', 3, 'Vị trí 3', false), ('A1', 4, 'Vị trí 4', false), ('A1', 5, 'Vị trí 5', false), ('A1', 6, 'Vị trí 6', false), 
                                ('A2', 1, 'Sửa chữa', true), ('A2', 2, 'Sửa chữa', true), ('A2', 3, 'Sửa chữa', true), ('A2', 4, 'Sửa chữa', true), ('A2', 5, 'Sửa chữa', true), ('A2', 6, 'Sửa chữa', true), 
                                ('A3', 1, 'Sửa chữa', true), ('A3', 2, 'Sửa chữa', true), ('A3', 3, 'Sửa chữa', true), ('A3', 4, 'Sửa chữa', true), ('A3', 5, 'Sửa chữa', true), ('A3', 6, 'Sửa chữa', true)`);
    await queryRunner.query(`INSERT INTO 
                                "card" ("code", "type", "amount", "user_email") 
                            VALUES 
                                ('BEAFBF1D', 'Guest', 0, null), 
                                ('40267614', 'Guest', 0, null), 
                                ('8755B089', 'Guest', 0, null), 
                                ('BE6E061D', 'Guest', 0, null), 
                                ('7335B206', 'Premium', 0, 'ducnguyen123@gmail.com'), 
                                ('53313195', 'Normal', 900000, 'thuyettm2000@gmail.com'), 
                                ('53C0E1AD', 'Normal', 1000000, 'huylq23072000@gmail.com'), 
                                ('73867AA7', 'Premium', 500000, 'botanvidai2000@gmail.com')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "user"`);
    await queryRunner.query(`DELETE FROM "price"`);
    await queryRunner.query(`DELETE FROM "slot"`);
    await queryRunner.query(`DELETE FROM "card"`);
  }
}
