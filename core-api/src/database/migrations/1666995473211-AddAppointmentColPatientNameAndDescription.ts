import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAppointmentColPatientNameAndDescription1666995473211 implements MigrationInterface {
    name = 'AddAppointmentColPatientNameAndDescription1666995473211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" ADD "patientName" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "description" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "patientName"`);
    }

}
