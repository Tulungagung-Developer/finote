import { MigrationInterface, QueryRunner } from 'typeorm';

export class Note1730203011356 implements MigrationInterface {
  name = 'Note1730203011356';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "note" ("id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying(100), CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_9dc72e6309c51e638b7918451c" ON "note" ("name") `);
    await queryRunner.query(
      `CREATE TABLE "note_member" ("id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "note_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_ca3bbea040cc161ad5cdc068c00" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "note_transaction" ("id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "note_id" uuid NOT NULL, "description" character varying(100) NOT NULL, "total" numeric(10,2) NOT NULL, "pre_balance" numeric(10,2) NOT NULL, "post_balance" numeric(10,2) NOT NULL, CONSTRAINT "PK_eec4c67afbeb13bf936255fb3da" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "note_item" ("id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "transaction_id" uuid NOT NULL, "account_id" uuid NOT NULL, "user_id" uuid NOT NULL, "name" character varying(100) NOT NULL, "amount" numeric(10,2) NOT NULL, "is_over_budget" smallint NOT NULL DEFAULT '0', CONSTRAINT "PK_eeb5901759f08fdf8e4447fa86c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "note_account" ("id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "note_id" uuid NOT NULL, "account_id" uuid NOT NULL, CONSTRAINT "PK_947f7c631ddce8eb49cd69787b8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "CHK_812bd5b0ac292270acdabc5bfc" CHECK ("balance" >= "minimum_balance")`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_member" ADD CONSTRAINT "FK_1aac3cf8cfa6bee1c59d8a77747" FOREIGN KEY ("note_id") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_member" ADD CONSTRAINT "FK_56f02fe522d7bf8ca006d56706c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_transaction" ADD CONSTRAINT "FK_5e86c9a26f005338dc82a7a0148" FOREIGN KEY ("note_id") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_item" ADD CONSTRAINT "FK_b3dc75b2d17464cfd63636d3082" FOREIGN KEY ("transaction_id") REFERENCES "note_transaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_item" ADD CONSTRAINT "FK_702f5c5af1dc2319762b0383496" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_item" ADD CONSTRAINT "FK_b51d4db743106ac7e974b4043c3" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_account" ADD CONSTRAINT "FK_0ac5b0e3c4e19b2049fb6009096" FOREIGN KEY ("note_id") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "note_account" ADD CONSTRAINT "FK_af7cccffed37d76fd799ccfbcc9" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "note_account" DROP CONSTRAINT "FK_af7cccffed37d76fd799ccfbcc9"`);
    await queryRunner.query(`ALTER TABLE "note_account" DROP CONSTRAINT "FK_0ac5b0e3c4e19b2049fb6009096"`);
    await queryRunner.query(`ALTER TABLE "note_item" DROP CONSTRAINT "FK_b51d4db743106ac7e974b4043c3"`);
    await queryRunner.query(`ALTER TABLE "note_item" DROP CONSTRAINT "FK_702f5c5af1dc2319762b0383496"`);
    await queryRunner.query(`ALTER TABLE "note_item" DROP CONSTRAINT "FK_b3dc75b2d17464cfd63636d3082"`);
    await queryRunner.query(`ALTER TABLE "note_transaction" DROP CONSTRAINT "FK_5e86c9a26f005338dc82a7a0148"`);
    await queryRunner.query(`ALTER TABLE "note_member" DROP CONSTRAINT "FK_56f02fe522d7bf8ca006d56706c"`);
    await queryRunner.query(`ALTER TABLE "note_member" DROP CONSTRAINT "FK_1aac3cf8cfa6bee1c59d8a77747"`);
    await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "CHK_812bd5b0ac292270acdabc5bfc"`);
    await queryRunner.query(`DROP TABLE "note_account"`);
    await queryRunner.query(`DROP TABLE "note_item"`);
    await queryRunner.query(`DROP TABLE "note_transaction"`);
    await queryRunner.query(`DROP TABLE "note_member"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9dc72e6309c51e638b7918451c"`);
    await queryRunner.query(`DROP TABLE "note"`);
  }
}
