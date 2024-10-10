import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1728101671250 implements MigrationInterface {
  name = 'Init1728101671250';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "username" character varying(16) NOT NULL, "password" character varying NOT NULL, "otp_type" character varying, "otp" character varying(6), "otp_expires_at" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
    await queryRunner.query(`CREATE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `);
    await queryRunner.query(
      `CREATE TABLE "user_session" ("id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "refresh_token" character varying, "refresh_token_expires_at" TIMESTAMP, "user_agent" character varying NOT NULL, "ip_address" character varying NOT NULL, "is_blocked" smallint NOT NULL DEFAULT '0', "attempt" integer NOT NULL DEFAULT '0', "access_token" character varying, "access_token_expires_at" TIMESTAMP, "is_verified" smallint NOT NULL DEFAULT '0', "last_login" TIMESTAMP, CONSTRAINT "PK_adf3b49590842ac3cf54cac451a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_0ac42018737161d3f60307170e" ON "user_session" ("refresh_token") `);
    await queryRunner.query(`CREATE INDEX "IDX_2eb74e2fc4d76516761bf63b83" ON "user_session" ("access_token") `);
    await queryRunner.query(
      `ALTER TABLE "user_session" ADD CONSTRAINT "FK_13275383dcdf095ee29f2b3455a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_session" DROP CONSTRAINT "FK_13275383dcdf095ee29f2b3455a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2eb74e2fc4d76516761bf63b83"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0ac42018737161d3f60307170e"`);
    await queryRunner.query(`DROP TABLE "user_session"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_78a916df40e02a9deb1c4b75ed"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
