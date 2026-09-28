import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class AddApplicationStatusHistoryIndexes1790675501000 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createIndex(
			"application_status_history",
			new TableIndex({
				name: "IDX_application_status_history_application_created",
				columnNames: ["application_id", "created_at"],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropIndex("application_status_history", "IDX_application_status_history_application_created");
	}
}
