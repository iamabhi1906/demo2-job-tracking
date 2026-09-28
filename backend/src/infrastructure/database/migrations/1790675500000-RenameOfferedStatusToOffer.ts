import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameOfferedStatusToOffer1790675500000 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TYPE "applications_status_enum" RENAME VALUE 'offered' TO 'offer'`);
		await queryRunner.query(
			`ALTER TYPE "application_status_history_previous_status_enum" RENAME VALUE 'offered' TO 'offer'`,
		);
		await queryRunner.query(
			`ALTER TYPE "application_status_history_new_status_enum" RENAME VALUE 'offered' TO 'offer'`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TYPE "application_status_enum" RENAME VALUE 'offer' TO 'offered'`);
		await queryRunner.query(
			`ALTER TYPE "application_status_history_previous_status_enum" RENAME VALUE 'offer' TO 'offered'`,
		);
		await queryRunner.query(
			`ALTER TYPE "application_status_history_new_status_enum" RENAME VALUE 'offer' TO 'offered'`,
		);
	}
}
