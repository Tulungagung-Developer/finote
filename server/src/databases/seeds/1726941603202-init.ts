import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1726941603202 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO public."user" (id,created_at,updated_at,email,username,"password",otp_type,otp,otp_expires_at) VALUES ('30bdd664-3bd7-47e0-95cf-f77aca73246e','2024-09-21 17:35:52.991','2024-09-21 17:35:52.991','default@email.com','default','$2b$10$9GzquAPmJQ.f.Gqtv4UkFOEbjH0HZb/K5smtK10Sanh2dlg.vX5o.',NULL,NULL,NULL);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM public."user" WHERE id = '30bdd664-3bd7-47e0-95cf-f77aca73246e';`);
  }
}
