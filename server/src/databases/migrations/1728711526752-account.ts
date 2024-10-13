import { MigrationInterface, QueryRunner } from 'typeorm';

export class Account1728711526752 implements MigrationInterface {
  name = 'Account1728711526752';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "account" ("id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "type" character varying NOT NULL, "currency" character varying NOT NULL, "name" character varying NOT NULL, "reference" character varying, "balance" numeric(10,2) NOT NULL, "minimum_balance" numeric(10,2) NOT NULL, "version" integer NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_414d4052f22837655ff312168c" ON "account" ("name") `);
    await queryRunner.query(
      `CREATE TABLE "account_history" ("id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "account_id" uuid NOT NULL, "action" character varying NOT NULL, "pre_balance" numeric(10,2) NOT NULL, "post_balance" numeric(10,2) NOT NULL, CONSTRAINT "PK_de0652296aa9d641c6269104b98" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_efef1e5fdbe318a379c06678c51" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_history" ADD CONSTRAINT "FK_29849be4dc550bbc52d80e7336f" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "account_history" DROP CONSTRAINT "FK_29849be4dc550bbc52d80e7336f"`);
    await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_efef1e5fdbe318a379c06678c51"`);
    await queryRunner.query(`DROP TABLE "account_history"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_414d4052f22837655ff312168c"`);
    await queryRunner.query(`DROP TABLE "account"`);
  }
}
