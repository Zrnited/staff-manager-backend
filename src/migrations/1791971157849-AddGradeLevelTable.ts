import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGradeLevelTable1791971157849 implements MigrationInterface {
    name = 'AddGradeLevelTable1791971157849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "grade_level" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_671ed744b09956194024b8b7645" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "grade_level"`);
    }

}
