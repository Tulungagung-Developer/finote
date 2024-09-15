import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1726393522162 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO public."user" (id,created_at,updated_at,username,"password",otp,otp_expires_at) VALUES ('e0848fd0-b9ed-4dfe-842c-6dbcb35f460c','2024-09-15 09:30:11.685149','2024-09-15 09:30:11.685149','default','$2b$10$hmmSYOiKs1XLvAkuEC.HD.O.OB8.cnuPWG0HjdI2YPBSPaoCcD3/C',NULL,NULL)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM public."user" WHERE id = 'e0848fd0-b9ed-4dfe-842c-6dbcb35f460c'`);
  }
}
