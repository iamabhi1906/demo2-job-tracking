import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateApplicationsTable1790589501387 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "applications",
				columns: [
					{ name: "id", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid" },
					{ name: "applicant_id", type: "uuid" },
					{ name: "job_id", type: "uuid" },
					{
						name: "status",
						type: "enum",
						enum: ["applied", "shortlisted", "rejected", "interview", "offered", "hired", "withdrawn"],
						default: "'applied'",
					},
					{ name: "applied_at", type: "timestamptz", default: "now()" },
					{ name: "updated_at", type: "timestamptz", default: "now()" },
				],
				foreignKeys: [
					{
						name: "FK_applications_applicant",
						columnNames: ["applicant_id"],
						referencedTableName: "applicant_profiles",
						referencedColumnNames: ["id"],
						onDelete: "CASCADE",
					},
					{
						name: "FK_applications_job",
						columnNames: ["job_id"],
						referencedTableName: "jobs",
						referencedColumnNames: ["id"],
						onDelete: "CASCADE",
					},
				],
				uniques: [
					{
						name: "UQ_applications_applicant_job",
						columnNames: ["applicant_id", "job_id"],
					},
				],
			}),
			true,
		);

		await queryRunner.createIndex(
			"applications",
			new TableIndex({ name: "IDX_applications_applicant", columnNames: ["applicant_id"] }),
		);
		await queryRunner.createIndex(
			"applications",
			new TableIndex({ name: "IDX_applications_job", columnNames: ["job_id"] }),
		);
		await queryRunner.createIndex(
			"applications",
			new TableIndex({ name: "IDX_applications_status", columnNames: ["status"] }),
		);
		await queryRunner.createIndex(
			"applications",
			new TableIndex({ name: "IDX_applications_applied_at", columnNames: ["applied_at"] }),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("applications");
		await queryRunner.query('DROP TYPE IF EXISTS "applications_status_enum"');
	}
}
