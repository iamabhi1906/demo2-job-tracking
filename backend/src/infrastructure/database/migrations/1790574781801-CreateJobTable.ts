import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateJobTable1790574781801 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "jobs",
				columns: [
					{ name: "id", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid" },
					{ name: "title", type: "varchar" },
					{ name: "department", type: "varchar", isNullable: true },
					{ name: "location", type: "varchar", isNullable: true },
					{ name: "employment_type", type: "enum", enum: ["full_time", "part_time", "contract", "internship"] },
					{ name: "minimum_experience", type: "numeric" },
					{ name: "application_deadline", type: "timestamptz" },
					{ name: "status", type: "enum", enum: ["open", "closed"] },
					{ name: "createdAt", type: "timestamptz", default: "now()" },
					{ name: "updatedAt", type: "timestamptz", default: "now()" },
					{ name: "created_by", type: "uuid", isNullable: true },
				],
				foreignKeys: [
					{
						name: "FK_jobs_created_by",
						columnNames: ["created_by"],
						referencedTableName: "users",
						referencedColumnNames: ["id"],
						onDelete: "SET NULL",
					},
				],
			}),
			true,
		);

		await queryRunner.createIndex("jobs", new TableIndex({ name: "IDX_jobs_created_by", columnNames: ["created_by"] }));
		await queryRunner.createIndex("jobs", new TableIndex({ name: "IDX_jobs_status", columnNames: ["status"] }));
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("jobs");
		await queryRunner.query('DROP TYPE IF EXISTS "jobs_employment_type_enum"');
		await queryRunner.query('DROP TYPE IF EXISTS "jobs_status_enum"');
	}
}
