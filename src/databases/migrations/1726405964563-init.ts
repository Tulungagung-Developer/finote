import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1726405964563 implements MigrationInterface {
  name = 'Init1726405964563';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying(16) NOT NULL, "password" character varying NOT NULL, "otp" character varying(6), "otp_expires_at" TIMESTAMP, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `);
    await queryRunner.query(
      `CREATE TABLE "user_session" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "token" character varying, "expires_at" TIMESTAMP, "user_agent" character varying NOT NULL, "ip_address" character varying NOT NULL, "last_login" TIMESTAMP, "login_attempts" integer NOT NULL DEFAULT '0', "is_blocked" boolean NOT NULL DEFAULT '0', "is_verified" boolean NOT NULL DEFAULT '0', "user_id" character varying NOT NULL, CONSTRAINT "PK_adf3b49590842ac3cf54cac451a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_session" ADD CONSTRAINT "FK_13275383dcdf095ee29f2b3455a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_session" DROP CONSTRAINT "FK_13275383dcdf095ee29f2b3455a"`);
    await queryRunner.query(`DROP TABLE "user_session"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_78a916df40e02a9deb1c4b75ed"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
