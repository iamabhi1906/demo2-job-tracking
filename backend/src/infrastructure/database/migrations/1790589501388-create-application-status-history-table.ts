import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateApplicationStatusHistoryTable1790589501388 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "application_status_history",
				columns: [
					{ name: "id", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid" },
					{ name: "application_id", type: "uuid" },
					{
						name: "previous_status",
						type: "enum",
						enum: ["applied", "shortlisted", "rejected", "interview", "offered", "hired", "withdrawn"],
						isNullable: true,
					},
					{
						name: "new_status",
						type: "enum",
						enum: ["applied", "shortlisted", "rejected", "interview", "offered", "hired", "withdrawn"],
					},
					{ name: "actor_user_id", type: "uuid", isNullable: true },
					{ name: "actor_role", type: "enum", enum: ["admin", "applicant", "system"] },
					{ name: "note", type: "text", isNullable: true },
					{ name: "created_at", type: "timestamptz", default: "now()" },
				],
				foreignKeys: [
					{
						name: "FK_application_status_history_application",
						columnNames: ["application_id"],
						referencedTableName: "applications",
						referencedColumnNames: ["id"],
						onDelete: "CASCADE",
					},
					{
						name: "FK_application_status_history_actor",
						columnNames: ["actor_user_id"],
						referencedTableName: "users",
						referencedColumnNames: ["id"],
						onDelete: "SET NULL",
					},
				],
			}),
			true,
		);

		await queryRunner.createIndex(
			"application_status_history",
			new TableIndex({ name: "IDX_application_status_history_application", columnNames: ["application_id"] }),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("application_status_history");
		await queryRunner.query('DROP TYPE IF EXISTS "application_status_history_previous_status_enum"');
		await queryRunner.query('DROP TYPE IF EXISTS "application_status_history_new_status_enum"');
		await queryRunner.query('DROP TYPE IF EXISTS "application_status_history_actor_role_enum"');
	}
}
