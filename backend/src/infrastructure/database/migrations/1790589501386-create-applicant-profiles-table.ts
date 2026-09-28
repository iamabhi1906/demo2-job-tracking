import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateApplicantProfilesTable1790589501386 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "applicant_profiles",
				columns: [
					{ name: "id", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid" },
					{ name: "user_id", type: "uuid", isUnique: true },
					{ name: "years_of_experience", type: "numeric", precision: 4, scale: 1, isNullable: true },
					{ name: "resume_url", type: "varchar", isNullable: true },
					{ name: "about_me", type: "text", isNullable: true },
					{ name: "created_at", type: "timestamptz", default: "now()" },
					{ name: "updated_at", type: "timestamptz", default: "now()" },
				],
				foreignKeys: [
					{
						name: "FK_applicant_profiles_user",
						columnNames: ["user_id"],
						referencedTableName: "users",
						referencedColumnNames: ["id"],
						onDelete: "CASCADE",
					},
				],
			}),
			true,
		);

		await queryRunner.createTable(
			new Table({
				name: "applicant_tags",
				columns: [
					{ name: "applicant_id", type: "uuid", isPrimary: true },
					{ name: "tag_id", type: "uuid", isPrimary: true },
				],
				foreignKeys: [
					{
						name: "FK_applicant_tags_applicant",
						columnNames: ["applicant_id"],
						referencedTableName: "applicant_profiles",
						referencedColumnNames: ["id"],
						onDelete: "CASCADE",
					},
					{
						name: "FK_applicant_tags_tag",
						columnNames: ["tag_id"],
						referencedTableName: "tags",
						referencedColumnNames: ["id"],
						onDelete: "CASCADE",
					},
				],
			}),
			true,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("applicant_tags");
		await queryRunner.dropTable("applicant_profiles");
	}
}
