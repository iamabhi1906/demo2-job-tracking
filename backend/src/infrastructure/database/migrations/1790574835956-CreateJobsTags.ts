import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateJobsTags1790574835956 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "jobs_tags",
				columns: [
					{ name: "job_id", type: "uuid", isPrimary: true },
					{ name: "tag_id", type: "uuid", isPrimary: true },
				],
				foreignKeys: [
					{
						name: "FK_jobs_tags_job",
						columnNames: ["job_id"],
						referencedTableName: "jobs",
						referencedColumnNames: ["id"],
						onDelete: "CASCADE",
					},
					{
						name: "FK_jobs_tags_tag",
						columnNames: ["tag_id"],
						referencedTableName: "tags",
						referencedColumnNames: ["id"],
						onDelete: "CASCADE",
					},
				],
			}),
			true,
		);

		await queryRunner.createIndex("jobs_tags", new TableIndex({ name: "IDX_jobs_tags_job", columnNames: ["job_id"] }));
		await queryRunner.createIndex("jobs_tags", new TableIndex({ name: "IDX_jobs_tags_tag", columnNames: ["tag_id"] }));
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("jobs_tags");
	}
}
