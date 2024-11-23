import { MigrationInterface, QueryRunner } from "typeorm";

export class InitializeTable1732338593835 implements MigrationInterface {
    name = 'InitializeTable1732338593835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "students" ("id" character varying NOT NULL, "math" double precision, "literature" double precision, "foreign_language" double precision, "physics" double precision, "chemistry" double precision, "biology" double precision, "history" double precision, "geography" double precision, "civic_education" double precision, "foreign_language_code" character varying(2), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "students"`);
    }

}
